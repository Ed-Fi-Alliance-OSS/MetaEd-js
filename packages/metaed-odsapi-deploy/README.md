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

Runs a sequence of filesystem tasks: remove old extension artifacts (unless suppressed),
deploy core artifacts (ODS/API ≥ 7.0 only), deploy extension artifacts, copy additional
DB scripts, and refresh csproj timestamps. Stops on the first failure.
