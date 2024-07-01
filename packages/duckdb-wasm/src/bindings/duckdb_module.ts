export interface PThread {
    unusedWorkers: Worker[];
    runningWorkers: Worker[];
}

// @ts-ignore - We are trying to fix some thing using the below code
export interface DuckDBModule extends EmscriptenModule {
    stackSave: typeof stackSave;
    stackAlloc: typeof stackAlloc;
    stackRestore: typeof stackRestore;

    ccall: typeof ccall;
    PThread: PThread;
    instantiateWasm: (
        imports: Emscripten.WebAssemblyImports,
        successCallback: (module: WebAssembly.Module) => void,
    ) => Promise<Emscripten.WebAssemblyExports>;
}
