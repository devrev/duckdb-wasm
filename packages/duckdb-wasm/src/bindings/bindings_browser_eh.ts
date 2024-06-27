import DuckDBWasm from './duckdb-eh.js';
import { DuckDBBrowserBindings } from './bindings_browser_base';
import { DuckDBModule } from './duckdb_module';
import { DuckDBRuntime } from './runtime';
import { Logger } from '../log';

/** DuckDB bindings for the browser */
export class DuckDB extends DuckDBBrowserBindings {
    /** Constructor */
    public constructor(
        logger: Logger,
        runtime: DuckDBRuntime,
        mainModuleURL: string,
        pthreadWorkerURL: string | null = null,
    ) {
        super(logger, runtime, mainModuleURL, pthreadWorkerURL);
    }

    /** Instantiate the bindings */
    protected instantiateImpl(moduleOverrides: Partial<DuckDBModule>): Promise<DuckDBModule> {
        try{
            const wasm = this.instantiateWasm.bind(this);
            const locateFile = this.locateFile.bind(this);

            return DuckDBWasm({
                ...moduleOverrides,
                instantiateWasm: wasm,
                locateFile: locateFile,
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }
}

export default DuckDB;
