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
  not executed.
