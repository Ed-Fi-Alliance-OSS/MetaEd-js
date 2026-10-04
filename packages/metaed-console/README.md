# metaed-console

Command-line interface for running the MetaEd build pipeline.

## Input Configuration

CLI arguments via `yargs`:

- `--config / -c` — Path to a JSON configuration file (relative paths are resolved relative to the console module directory; use absolute paths to avoid ambiguity)
- `--defaultPluginTechVersion / -x` — Default plugin technology version
- `--accept-license / -a` — Required flag to accept the license agreement
- `--suppressPrereleaseVersion` — Suppress the prerelease identifier in generated version data, formatting the Data Standard version as `major.minor.0` (default: `true`). Applied only when no config file is supplied; with `--config`, the config file's `suppressPrereleaseVersion` is used

The config file supplies a `metaEdConfiguration` object with project paths, artifact
directories, and plugin settings. See `metaed-edfi-5.2.json` for a fully-worked sample.
Relative `projectPaths` are resolved against the current working directory.

## Output

Executes the full MetaEd pipeline (load → parse → build → validate → enhance →
generate → write) and writes all generated artifacts to the configured artifact
directory. A relative `artifactDirectory` is resolved against the last project path;
when `artifactDirectory` is empty, output goes to `MetaEdOutput` under the last project
path. An existing output directory is deleted before writing (only if its path contains
`MetaEdOutput`). Exits with code 0 on success, 1 on failure.

## Business Logic

Assembles the default plugin set, resolves the data standard version from project
metadata, builds the pipeline state, and runs all registered validators, enhancers,
and generators in sequence. Logs the total elapsed time when the run completes.

## Usage

1. Build the project from the repo root with `npm run build`.
2. To confirm it is functional, try `node packages/metaed-console/dist/index.js -h`.
3. The easiest way to run this is with a config file. See `metaed-edfi-5.2.json` for a fully-worked
   sample config file. The sample has Alliance Mode _off_ (`allianceMode: false`); it should only be set to `true` in the Ed-Fi Alliance's build
   processes. Relative `--config` paths are resolved from the built console module directory, not the current directory, so
   pass an absolute path. The sample's relative `projectPaths` (`../../node_modules/...`) are resolved against the current
   directory, so run it from `packages/metaed-console`, for example:
    `cd packages/metaed-console && node dist/index.js -a -c "$PWD/metaed-edfi-5.2.json"`.
   With the sample's relative `artifactDirectory`, output is written to `MetaEdOutput` under the Data Standard model package
   directory.
