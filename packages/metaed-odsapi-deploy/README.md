# metaed-odsapi-deploy

Library for deploying MetaEd-generated artifacts into the ODS/API repository layout.

## Input Configuration

Accepts `MetaEdConfiguration` plus deploy-specific options:

- `dataStandardVersion` — Determines output path structure
- `deployCore` — Whether to deploy core (standard) artifacts
- `suppressDelete` — Skip removal of existing extension artifact directories
- `additionalMssqlScriptsDirectory` — Extra SQL Server scripts to copy
- `additionalPostgresScriptsDirectory` — Extra PostgreSQL scripts to copy

## Output

Copies generated artifacts into the ODS/API file system structure:

- Core artifacts → `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Standard/{version}/Artifacts/`
- Extension artifacts → `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{name}/Versions/{version}/Standard/{dsVersion}/Artifacts/`

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

 Runs a sequence of deployment tasks in order: first verifies that required extension
 projects exist, then removes old extension artifacts (unless suppressed), deploys core
 artifacts (ODS/API ≥ 7.0 only), and deploys extension artifacts. Additional MSSQL and
 PostgreSQL script directories are passed into the core/extension deploy steps rather than
 copied as a separate standalone task. After deployment it refreshes csproj timestamps,
 runs the legacy-directory check, and stops on the first failure.

