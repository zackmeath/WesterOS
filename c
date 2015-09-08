#!/bin/sh
/usr/local/lib/node_modules/typescript/bin/tsc --version
/usr/local/lib/node_modules/typescript/bin/tsc --rootDir source/ --outDir distrib/  source/*.ts source/host/*.ts source/os/*.ts
