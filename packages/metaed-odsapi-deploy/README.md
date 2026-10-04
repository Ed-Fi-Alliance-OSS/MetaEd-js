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

Copies generated artifacts into the ODS/API file system structure, based on
`defaultPluginTechVersion`. Core artifacts are copied from the `EdFi` artifact folder;
extension artifacts are copied from an artifact folder named by `projectName` (see
METAED-1678 for when this differs from the generated namespace folder). Nothing is copied
for versions below 5.4.

ODS/API ≥ 7.0:

- Core artifacts → `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Standard/{dsVersion}/Artifacts/`
- Extension artifacts → `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Versions/{projectVersion}/Standard/{dsVersion}/Artifacts/`

ODS/API ≥ 5.4 and < 7.0:

- Core artifacts → `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/`
- Extension artifacts → `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts/`

Sub-path mappings:

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

 Runs a sequence of deployment tasks in order: first verifies that an
 `EdFi.Ods.Extensions.{name}` C# project exists for each artifact directory entry other than
 `ApiSchema`, `Documentation`, and `EdFi` (≥ 3.0). A core-only deploy with no extension
 artifact folders fails this check unless `allianceMode` is `true`. It then removes the
 existing unversioned `EdFi.Ods.Extensions.{name}/Artifacts` directories for those same
 entries (≥ 3.3, unless suppressed; the ≥ 7.0 versioned layout is not removed, METAED-1678),
 deploys core artifacts (only when `deployCore` is set) and extension artifacts (versioned
 layout for ODS/API ≥ 7.0, unversioned V6 layout for ≥ 5.4 and < 7.0). Additional MSSQL and
 PostgreSQL script directories are passed into the core/extension deploy steps rather than
 copied as a separate standalone task. After deployment it refreshes csproj timestamps and
 runs the legacy-directory check. Execution stops at the first task that fails; within the
 extension copy task, a failure for one project does not stop copying for other projects.

