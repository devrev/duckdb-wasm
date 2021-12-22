import * as duckdb from '@duckdb/duckdb-wasm';
import * as arrow from 'apache-arrow';
import path from 'path';
import Worker from 'web-worker';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const DUCKDB_DIST = path.dirname(require.resolve('@duckdb/duckdb-wasm'));

(async () => {
    try {
        const DUCKDB_CONFIG = await duckdb.selectBundle({
            mvp: {
                mainModule: path.resolve(DUCKDB_DIST, './duckdb.wasm'),
                mainWorker: path.resolve(DUCKDB_DIST, './duckdb-node.worker.cjs'),
            },
            next: {
                mainModule: path.resolve(DUCKDB_DIST, './duckdb-next.wasm'),
                mainWorker: path.resolve(DUCKDB_DIST, './duckdb-node-next.worker.cjs'),
            },
        });

        const logger = new duckdb.ConsoleLogger();
        const worker = new Worker(DUCKDB_CONFIG.mainWorker!);
        const db = new duckdb.AsyncDuckDB(logger, worker);
        await db.instantiate(DUCKDB_CONFIG.mainModule, DUCKDB_CONFIG.pthreadWorker);

        const conn = await db.connect();
        await conn.query<{ v: arrow.Int }>(`SELECT count(*)::INTEGER as v FROM generate_series(0, 100) t(v)`);

        await conn.close();
        await db.terminate();
        await worker.terminate();
    } catch (e) {
        console.error(e);
    }
})();