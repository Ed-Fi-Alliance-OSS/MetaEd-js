# metaed-plugin-edfi-data-catalog

Ed-Fi Data Catalog plugin for MetaEd.

- Purpose: Generate a Data Catalog / handbook-style Excel from a MetaEd model during the build pipeline.
- Entry: `dist/index.js` (source `src/index.ts`).

Quick usage

- From the monorepo root, build this package as part of the normal MetaEd build pipeline.
- This package depends on `@edfi/metaed-core` and uses `write-excel-file` to produce Excel outputs.

Build

- Run the package build steps (from package root):

```powershell
npm run build
```

Notes

- License: Apache-2.0
- Published package name: `@edfi/metaed-plugin-edfi-data-catalog`
- See `package.json` for versions and dependencies.
- [Original requirements](../../docs/requirements/simple-handbook.md) (may differ slightly from the final product)