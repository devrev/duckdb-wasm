import DuckDBWasm from './duckdb-eh.js';
import { DuckDBBrowserBindings } from './bindings_browser_base';
import { DuckDBModule } from './duckdb_module';
import { DuckDBRuntime } from './runtime';
import { LogEvent, LogLevel, LogOrigin, LogTopic, Logger } from '../log';

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
    protected async instantiateImpl(moduleOverrides: Partial<DuckDBModule>): Promise<DuckDBModule> {
        try{
            const wasm = this.instantiateWasm.bind(this);
            const locateFile = this.locateFile.bind(this);

            return await DuckDBWasm({
                ...moduleOverrides,
                instantiateWasm: wasm,
                locateFile: locateFile,
            });
        } catch (error : any) {
            this.logger.log({
                timestamp: new Date(),
                level: LogLevel.ERROR,
                origin: LogOrigin.BINDINGS,
                topic: LogTopic.INSTANTIATE,
                event: LogEvent.ERROR,
                value: 'Failed to instantiate WASM: ' + error,
            });

            throw error;
        }
    }
}

export default DuckDB;
