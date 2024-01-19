#!/usr/bin/env bash

PROJECT_ROOT="$(cd $(dirname "$BASH_SOURCE[0]") && cd .. && pwd)" &> /dev/null

cd ${PROJECT_ROOT}/packages/duckdb-wasm
python3 -c "import os; import json; p = json.load(open('package.json')); p['name'] = '@devrev/duckdb-wasm'; json.dump(p, open('package.json', 'w'), indent=2, ensure_ascii=False);"
mkdir -p ./dist/img
cp ${PROJECT_ROOT}/misc/duckdb.svg ./dist/img/duckdb.svg
cp ${PROJECT_ROOT}/misc/duckdb_wasm.svg ./dist/img/duckdb_wasm.svg
${PROJECT_ROOT}/scripts/build_duckdb_badge.sh > ./dist/img/duckdb_version_badge.svg

npm publish --ignore-scripts --access public ${TAG}
