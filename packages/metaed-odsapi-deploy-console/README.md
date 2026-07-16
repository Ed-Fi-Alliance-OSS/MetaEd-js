# metaed-odsapi-deploy-console

Command-line interface for deploying MetaEd artifacts into an ODS/API repository.

## Input Configuration

CLI arguments via `yargs`:

- `--config / -c` — Path to JSON configuration file
- `--source / -s` — Source project directories (array)
- `--target / -t` — Parent directory containing the `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` repositories
- `--projectNames / -p` — Project name overrides applied to discovered projects in discovery order (array)
- `--defaultPluginTechVersion / -x` — Default plugin technology version
- `--core` — Deploy core artifacts
- `--suppressDelete` — Skip removal of existing extension artifacts
- `--accept-license / -a` — Required license acceptance flag
- `--suppressPrereleaseVersion` — Suppress pre-release version in paths
- `--additionalMssqlScriptsDirectory` — Extra SQL Server scripts directory
- `--additionalPostgresScriptsDirectory` — Extra PostgreSQL scripts directory

## Output

Deploys MetaEd artifacts into the target ODS/API repository structure. In source-scan
mode, also runs the MetaEd build pipeline first. Exits with code 0 on success, 1 on
failure, and logs duration.

## Business Logic

Two operating modes:

- **Source-scan mode** (`--source`/`--target`): scans source directories for MetaEd
  projects, builds `MetaEdConfiguration`, runs the full generation pipeline, then
  delegates to `metaed-odsapi-deploy` to copy artifacts into the destination repository
  structure.
- **Config-based mode** (`--config`): uses the supplied `metaEdConfiguration` with a
  pre-built `artifactDirectory` and runs only the deploy tasks — the build pipeline is
  not executed.
