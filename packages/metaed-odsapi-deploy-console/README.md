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
- `--accept-license / -a` — License acceptance, also accepted as top-level `"accept-license": true` in the JSON config
- `--suppressPrereleaseVersion` — In source-scan mode, defaults to `true`. At ODS/API targets `>=7.1.0`, formats a valid Data Standard version as `major.minor.0` in generated XSD namespaces, schema annotations, and the Data Standard segment of deploy paths. API Schema retains the supplied `projectVersion` and extension `compatibleDsRange`. Config-based deploy uses only the configuration setting and keeps the supplied version when the setting is omitted.
- `--additionalMssqlScriptsDirectory` — Extra SQL Server scripts directory
- `--additionalPostgresScriptsDirectory` — Extra PostgreSQL scripts directory

## Output

Deploys MetaEd artifacts into the target ODS/API repository structure. In source-scan
mode, also runs the MetaEd build pipeline first. Exits with code 0 on success, 1 on
failure, and logs duration.

At targets `>=3.3.0`, a leftover entry in `artifactDirectory` can select an unconfigured extension's unversioned `Artifacts/` for deletion. Copy starts at `5.4.0` and processes the non-core projects in `projects`, plus core when `--core` is supplied. [Deploy behavior by target version](../../docs/PRD-4.x.md#deploy-behavior-by-target-version)

## Business Logic

Two operating modes:

- **Source-scan mode** (`--source`/`--target`/`--projectNames`): only `--source` and
  `--projectNames` are checked; if either is omitted the CLI returns without building or
  deploying and without reporting an error. `--target` is not enforced but is needed as the
  deploy destination. With absolute source paths, the build writes `MetaEdOutput` under
  the last resolved project. A project supplied directly as a relative path can appear
  twice in the output path. A failed build sets exit code 1, but deploy still runs and
  can copy artifacts from an earlier build.
- **Config-based mode** (`--config`): uses the supplied `metaEdConfiguration` with a
  pre-built `artifactDirectory` and runs only the deploy tasks — the build pipeline is
  not executed. A relative artifact path starts at the process working directory. Build resolves
  it from the last input project, so a separate deploy can read a missing or older tree. Use an
  absolute `artifactDirectory` for a shared config. The supplied configuration is copied without merging defaults from
  `newMetaEdConfiguration`, and the `--suppressPrereleaseVersion` CLI option is not applied
  to it. As a result, a missing `suppressPrereleaseVersion` means no prerelease suppression,
  and a missing `defaultPluginTechVersion` without `-x` causes version-gated deploy tasks
  (those requiring a minimum version) to be skipped.

Source-scan project discovery (implemented by `ProjectLoader` in `metaed-core`):

- An empty scan fails when the CLI reads the last project's path. With at least one discovered
  project, the CLI checks for exactly one `EdFi` namespace before building.
- Reads `package.json` files containing a `metaEdProject` object and includes the package
  `description` when present.
- Derives `namespaceName` by removing non-alphanumeric characters from `projectName`, only
  when the result starts with an uppercase letter; otherwise the namespace is empty.
- Scans subdirectories only while no projects have been discovered yet, so mixed source
  inputs can miss nested projects after an earlier project has already been found.
- Applies `--projectNames` in discovery order, updating each affected project's name and
  derived namespace. An override equal to the existing name has no effect. If there are
  more overrides than discovered projects, the scanner ignores all overrides.
- Sorts discovered projects alphabetically by `projectName`. Known issue (METAED-1675): the
  sort is intended to place a project whose `projectName` is exactly `EdFi` first, but because
  of a `R.pathEq` argument-order bug under ramda 0.32
  (`packages/metaed-core/src/project/ProjectLoader.ts`), that rule never matches.
- After sorting, keeps one project per resulting `projectName`. For example, if two discovered
  extensions both declare the name `Twin`, distinct overrides preserve both in the scan.
  The build groups models by derived namespace and takes project metadata from the first
  matching project. Scanning `Twin-Name` and `TwinName` can therefore produce one
  `TwinName/` tree with both projects' resources. To build and deploy separate trees, choose
  extension names that yield distinct namespaces and match the spelling of those namespaces.

Other notes:

- The license acceptance option is required by yargs, but its value is not validated and
  acceptance is not persisted.
- When a deploy task fails, the console sets a non-zero exit code but does not print the
  returned `failureMessage` (METAED-1678).
