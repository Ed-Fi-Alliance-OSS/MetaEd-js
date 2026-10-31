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

- **Extension project precheck.** Unless `defaultPluginTechVersion` satisfies `<3.0.0`, checks
  that `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{name}/` exists for each
  immediate entry (directory or file, as returned by `readdirSync`) in the artifact directory
  except `ApiSchema`, `Documentation`, and `EdFi`; `{name}` is the entry name (normally the
  namespace folder name). The precheck runs before core copy.
- **Artifact removal.** Unless suppressed, for `defaultPluginTechVersion` `>=3.3.0` removes
  existing unversioned `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{name}/Artifacts`
  directories for the same entry names as the precheck.
- **Copy version gates.** Core copy runs only when `deployCore` is set. Core and extension copy
  run for `>=5.4.0`: the V6 tasks handle `>=5.4.0 <7.0.0` (unversioned layout) and the V7 tasks
  handle `>=7.0.0` (versioned layout). Both are no-ops below `5.4.0`. Core copies from artifact
  namespace folder `EdFi`; extension copy iterates each non-EdFi project and copies from the
  artifact folder named by `projectName`.
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
- **Legacy directory warning.** For `>=3.3.0`, warns when legacy `SupportingArtifacts`
  directories exist for the standard or extension projects.
- **Not deployed.** `ApiSchema/` and `Documentation/` outputs are left in the artifact directory;
  only API metadata, database, interchange, and XSD families are mapped.
- **Known issue (METAED-1678).** Extension copy uses source and target folders named by
  `projectName`, while generators write output folders using `namespaceName`, and the
  precheck, artifact removal, `.csproj` refresh, and legacy-directory tasks derive names from
  artifact directory entries (namespace folder names). Where `projectName` and `namespaceName`
  differ, deploy can skip generated extension folders or check, remove, and refresh different
  ODS/API extension projects than it copies into. Also under METAED-1678: artifact removal only
  targets the unversioned `Artifacts` folder, so for `>=7.0.0` previously deployed artifacts in
  `Versions/{projectVersion}/Standard/{dataStandardVersion}/Artifacts/` are not removed; and a
  copy failure for one extension project does not stop copying for others, with the deploy
  console setting a non-zero exit code without printing the returned `failureMessage`.

