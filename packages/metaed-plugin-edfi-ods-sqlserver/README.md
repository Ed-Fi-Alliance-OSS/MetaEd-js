# metaed-plugin-edfi-ods-sqlserver

MetaEd plugin that generates SQL Server DDL scripts for the Ed-Fi ODS.

## Input Configuration

No plugin-specific configuration. Uses the MetaEd model and `targetTechnologyVersion`
from the plugin environment to control SQL Server-specific behavior.

## Output

Generates SQL Server ODS scripts under `Database/SQLServer/ODS/`:

- `Structure/0010-*-Schemas.sql` — Schema creation
- `Structure/0020-*-Tables.sql` — Table DDL
- `Structure/0030-*-ForeignKeys.sql` — Foreign key constraints
- `Structure/0050-*-ExtendedProperties.sql` — Extended properties
- `Data/0010-*-Enumerations.sql` — Descriptor/enumeration seed data
- `Data/0020-*-SchoolYears.sql` — School year seed data

Additional scripts for indexes and authorization views are also generated.

## Business Logic

Consumes the relational ODS model produced by `metaed-plugin-edfi-ods-relational` and
emits SQL Server-specific DDL for schemas, tables, foreign keys, constraints, seed data,
indexes, and authorization scripts.
