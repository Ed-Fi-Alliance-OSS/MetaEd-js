# metaed-console

Command-line interface for running the MetaEd build pipeline.

## Input Configuration

CLI arguments via `yargs`:

- `--config / -c` — Path to a JSON configuration file, resolved from the current working directory
- `--defaultPluginTechVersion / -x` — Default plugin technology version
- `--accept-license / -a` — License acceptance, also accepted as top-level `"accept-license": true` in the JSON config
- `--suppressPrereleaseVersion` — Suppress the prerelease identifier in generated version data, formatting the Data Standard version as `major.minor.0` (default: `true`). Applied only when no config file is supplied; with `--config`, the config file's `suppressPrereleaseVersion` is used

The config file supplies a `metaEdConfiguration` object with project paths, artifact
directories, and plugin settings. See `metaed-edfi-5.2.json` for a fully-worked sample.
Relative `projectPaths` are resolved against the current working directory.

## Output

Executes the full MetaEd pipeline (load → parse → build → validate → enhance →
generate → write) and writes all generated artifacts to the configured artifact
directory. A relative `artifactDirectory` is resolved against the last project path;
when `artifactDirectory` is empty, output goes to `MetaEdOutput` under the last project
path. A separate config-based deploy resolves a relative artifact path from its working
directory. Use an absolute `artifactDirectory` when sharing a config between both commands.
Before replacing existing output, the writer checks the path and looks for MetaEd
source files. It can miss nested source files. Exits with code 0 on success, 1 on failure.

## Business Logic

Assembles the default plugin set, resolves the data standard version from project
metadata, builds the pipeline state, and runs all registered validators, enhancers,
and generators in sequence. Logs the total elapsed time when the run completes.

- The license acceptance option is required by yargs, but its value is not validated and
  acceptance is not persisted.
- Pipeline stage order, early-return behavior (METAED-1676), and output safety guards are
  documented in the `metaed-core` README.

## Usage

From `packages/metaed-console` in a checkout with dependencies installed, run:

```bash
npx ts-node --transpile-only src/index.ts -a -c metaed-edfi-5.2.json
```

With compiled packages, the equivalent command is `node dist/index.js -a -c metaed-edfi-5.2.json`.
The [sample config](metaed-edfi-5.2.json) uses project paths relative to that working
directory and writes `MetaEdOutput` under the Data Standard model package. It leaves
Alliance Mode off for community builds.
