# metaed-odsapi-deploy-console

Command-line interface for deploying MetaEd artifacts into an ODS/API repository.

## Input Configuration

CLI arguments via `yargs`:

- `--config / -c` — Path to JSON configuration file
- `--source / -s` — Source project directories (array)
- `--target / -t` — Parent directory containing the `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` repositories
- `--projectNames / -p` — Project names applied to discovered projects in discovery order (array); required for source-scan mode
- `--defaultPluginTechVersion / -x` — Default plugin technology version
- `--core` — Deploy core artifacts
- `--suppressDelete` — Skip removal of existing unversioned extension `Artifacts` directories
- `--accept-license / -a` — Required license acceptance flag
- `--suppressPrereleaseVersion` — Suppress the prerelease identifier in the Data Standard version (formatted as `major.minor.0`) used in generated version data and ODS/API ≥ 7.1 deploy paths (default: `true`). Applied only in source-scan mode; config-based mode uses the config file's `suppressPrereleaseVersion`
- `--additionalMssqlScriptsDirectory` — Extra SQL Server scripts directory
- `--additionalPostgresScriptsDirectory` — Extra PostgreSQL scripts directory

## Output

Deploys MetaEd artifacts into the target ODS/API repository structure. In source-scan
mode, also runs the MetaEd build pipeline first. Exits with code 0 on success, 1 on
failure, and logs duration.

## Business Logic

Two operating modes:

- **Source-scan mode** (`--source`/`--target`/`--projectNames`): only `--source` and
  `--projectNames` are checked; if either is omitted the CLI returns without building or
  deploying and without reporting an error. `--target` is not enforced but is needed as the
  deploy destination. Scans source directories for MetaEd
  projects, builds `MetaEdConfiguration`, runs the full generation pipeline into
  `MetaEdOutput` under the last project path, then
  delegates to `metaed-odsapi-deploy` to copy artifacts into the destination repository
  structure. Deploy runs even if the build failed (the exit code is still 1), so any
  existing artifacts in the output directory may be copied.
- **Config-based mode** (`--config`): uses the supplied `metaEdConfiguration` with a
  pre-built `artifactDirectory` and runs only the deploy tasks — the build pipeline is
  not executed. The supplied configuration is copied without merging defaults from
  `newMetaEdConfiguration`, and the `--suppressPrereleaseVersion` CLI option is not applied
  to it. As a result, a missing `suppressPrereleaseVersion` means no prerelease suppression,
  and a missing `defaultPluginTechVersion` without `-x` causes version-gated deploy tasks
  (those requiring a minimum version) to be skipped.

Source-scan project discovery (implemented by `ProjectLoader` in `metaed-core`):

- Reads `package.json` files containing a `metaEdProject` object and includes the package
  `description` when present.
- Derives `namespaceName` by removing non-alphanumeric characters from `projectName`, only
  when the result starts with an uppercase letter; otherwise the namespace is empty.
- Scans subdirectories only while no projects have been discovered yet, so mixed source
  inputs can miss nested projects after an earlier project has already been found.
- De-duplicates discovered projects by project name, so two projects with the same project
  name cannot both be represented in one deploy build.
- Sorts discovered projects alphabetically by `projectName`. Known issue (METAED-1675): the
  sort is intended to place a project whose `projectName` is exactly `EdFi` first, but because
  of a `R.pathEq` argument-order bug under ramda 0.32
  (`packages/metaed-core/src/project/ProjectLoader.ts`), that rule never matches.
- `--projectNames` overrides update discovered project names and derived namespaces in
  discovery order. Override entries equal to the existing project name are skipped, and all
  overrides are ignored when more `projectNames` are supplied than projects discovered.

Other notes:

- The license acceptance option is required by yargs, but its value is not validated and
  acceptance is not persisted.
- When a deploy task fails, the console sets a non-zero exit code but does not print the
  returned `failureMessage` (METAED-1678).
