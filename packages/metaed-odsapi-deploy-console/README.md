# metaed-odsapi-deploy-console

Command-line interface for deploying MetaEd artifacts into an ODS/API repository.

## Input Configuration

CLI arguments via `yargs`:

- `--config / -c` — Path to JSON configuration file
- `--source / -s` — Source project directories (array)
- `--target / -t` — Target ODS/API repository path
- `--projectNames / -p` — Project names to deploy (array)
- `--defaultPluginTechVersion / -x` — Default plugin technology version
- `--core` — Deploy core artifacts
- `--suppressDelete` — Skip removal of existing extension artifacts
- `--accept-license / -a` — Required license acceptance flag
- `--suppressPrereleaseVersion` — Suppress pre-release version in paths
- `--additionalMssqlScriptsDirectory` — Extra SQL Server scripts directory
- `--additionalPostgresScriptsDirectory` — Extra PostgreSQL scripts directory

## Output

Runs the MetaEd build pipeline for the specified projects, then deploys generated
artifacts into the target ODS/API repository. Exits with code 0 on success, 1 on
failure, and logs duration.

## Business Logic

Scans source directories for MetaEd projects, builds `MetaEdConfiguration`, runs the
generation pipeline, then delegates to `metaed-odsapi-deploy` to copy artifacts into
the destination repository structure.
