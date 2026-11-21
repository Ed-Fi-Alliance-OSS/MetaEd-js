# metaed-odsapi-deploy

Library for deploying MetaEd-generated artifacts into the ODS/API repository layout.

## Input Configuration

Accepts `MetaEdConfiguration` plus deploy-specific options:

- `metaEdConfiguration.defaultPluginTechVersion` — Determines which deploy tasks run and
  which ODS/API path layout is used
- `dataStandardVersion` — Data Standard version used in the ≥ 7.0 versioned path; for
  `defaultPluginTechVersion` ≥ 7.1.0 it is formatted as `major.minor.0` when
  `metaEdConfiguration.suppressPrereleaseVersion` is `true`
- `deployCore` — Whether to deploy core (standard) artifacts
- `suppressDelete` — Skip removal of existing unversioned extension `Artifacts` directories
- `additionalMssqlScriptsDirectory` — Extra SQL Server scripts to copy
- `additionalPostgresScriptsDirectory` — Extra PostgreSQL scripts to copy

## Output

The ODS/API target determines which project paths deploy checks, which directories it removes, and where it copies each project's files. The PRD lists the gates and destination paths for each target, including versions that run cleanup only. [Deploy behavior by target version](../../docs/PRD-4.x.md#deploy-behavior-by-target-version)

Within a project's deployed `Artifacts/` directory, deploy maps the following folders.

| Source Directory | Deploy Destination |
|---|---|
| ApiMetadata | Metadata |
| Database/SQLServer/ODS/Data | MsSql/Data/Ods |
| Database/SQLServer/ODS/Structure | MsSql/Structure/Ods |
| Database/PostgreSQL/ODS/Data | PgSql/Data/Ods |
| Database/PostgreSQL/ODS/Structure | PgSql/Structure/Ods |
| Interchange | Schemas |
| XSD | Schemas |

## Business Logic

Deploy checks the extension paths, removes eligible unversioned artifacts, then runs the
core and extension copy tasks for the target version. A core-only deploy with no extension
artifact folders fails the path check unless `allianceMode` is true or the target version
skips that check. The copy tasks also handle any additional SQL Server and PostgreSQL
script directories. Deploy then refreshes existing extension `.csproj` files and checks
for legacy directories. The task runner stops at the first failed task. Within an extension
copy task, a failure for one project can still allow copies for later projects.

- **Extension selection.** The path check and cleanup select every immediate artifact-directory
  entry except `ApiSchema`, `Documentation`, and `EdFi`. Extension copy reads the artifact
  folder named by each non-core `projectName` in `projects`. A leftover entry can therefore
  delete an unconfigured extension's unversioned artifacts on an otherwise successful deploy.
- **Additional scripts.** When a core or extension copy task runs for a supported
  `defaultPluginTechVersion`, the additional MSSQL/PostgreSQL script directories are copied into
  the corresponding deployed ODS data folders.
- **Data Standard version formatting.** For `>=7.1.0`, prerelease suppression formats a valid
  semver Data Standard version as `major.minor.0`, removing the prerelease identifier and also
  zeroing the patch version.
- **Missing source folders.** A generated source folder that is absent is skipped rather than
  failing the entire deploy.
- **`.csproj` refresh.** After copy tasks run, updates the filesystem modification timestamp of
  existing `EdFi.Ods.Extensions.{name}.csproj` files, using the same entry names as the precheck.
- **Legacy directory warning.** For `>=3.3.0`, warns when `SupportingArtifacts` exists under
  `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Standard/` or an extension project path
  selected by the precheck.
- **Not deployed.** `ApiSchema/` and `Documentation/` outputs are left in the artifact directory;
  only API metadata, database, interchange, and XSD families are mapped.
- **Versioned targets (METAED-1678).** Cleanup removes only the unversioned `Artifacts/`.
  Copy overwrites matching files in the active versioned target and leaves older files
  that are absent from the new output. The console sets a non-zero exit code for a failed
  task without printing its returned `failureMessage`.
