# metaed-console

Command-line interface for running the MetaEd build pipeline.

## Input Configuration

CLI arguments via `yargs`:

- `--config / -c` — Path to a JSON configuration file (relative paths are resolved relative to the console module directory; use absolute paths to avoid ambiguity)
- `--defaultPluginTechVersion / -x` — Default plugin technology version
- `--accept-license / -a` — Required flag to accept the license agreement
- `--suppressPrereleaseVersion` — Suppress pre-release version in output paths (default: `true`)

The config file supplies a `metaEdConfiguration` object with project paths, artifact
directories, and plugin settings. See `metaed-edfi-5.2.json` for a fully-worked sample.

## Output

Executes the full MetaEd pipeline (load → parse → build → validate → enhance →
generate → write) and writes all generated artifacts to the configured artifact
directory. Exits with code 0 on success, 1 on failure.

## Business Logic

Assembles the default plugin set, resolves the data standard version from project
metadata, builds the pipeline state, and runs all registered validators, enhancers,
and generators in sequence. Logs timing information for each phase.

## Usage

1. Build the project from the repo root with `npm run build`.
2. To confirm it is functional, try `node packages/metaed-console/dist/index.js -h`.
3. The easiest way to run this is with a config file. See `metaed-edfi-5.2.json` for a fully-worked
   sample config file. Note that this shows Alliance Mode _on_, which is only appropriate in the Ed-Fi Alliance's build
   processes. External users should set this to `false`. To run with a config file:
    `node ./dist/index.js -a -c ./metaed-edfi-5.2.json`.
