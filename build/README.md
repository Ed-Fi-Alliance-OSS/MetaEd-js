# Data Model Build Script

The wrapper runs `npm install` in the current directory, then starts the MetaEd build CLI. The wrapper's package declares `@edfi/metaed-console` with the `dev` tag.

## Usage

From the repository root, open the `build` directory and run the wrapper with a build configuration. Before using the sample, set its `projectPaths` and `artifactDirectory` to paths on your machine. [Sample configuration](sample-config.json)

```bash
cd build
node index.js -a -c sample-config.json
```

Use `-a` or `--accept-license` to accept the license. You can also set `"accept-license": true` at the top level of the JSON file. Run `node index.js --help` from `build` to see the installed version's options. [Build CLI options](../packages/metaed-console/README.md#input-configuration)
