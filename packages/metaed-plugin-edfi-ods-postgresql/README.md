# metaed-plugin-edfi-ods-postgresql

MetaEd plugin that generates PostgreSQL DDL scripts for the Ed-Fi ODS.

## Input Configuration

No plugin-specific configuration. Uses the MetaEd model and `targetTechnologyVersion`
from the plugin environment to control SQL dialect details (e.g., timestamp defaults).

## Output

Generates PostgreSQL ODS scripts under `Database/PostgreSQL/ODS/`:

- `Structure/0010-*-Schemas.sql` — Schema creation
- `Structure/0020-*-Tables.sql` — Table DDL
- `Structure/0030-*-ForeignKeys.sql` — Foreign key constraints
- `Structure/0050-*-ExtendedProperties.sql` — Extended properties/comments
- `Data/0010-*-Enumerations.sql` — Descriptor/enumeration seed data
- `Data/0020-*-SchoolYears.sql` — School year seed data

Additional scripts for indexes and education organization authorization indexes are also generated.

## Business Logic

Consumes the relational ODS model produced by `metaed-plugin-edfi-ods-relational` and
emits PostgreSQL-specific DDL for schemas, tables, foreign keys, constraints, seed data,
indexes, and authorization scripts.
