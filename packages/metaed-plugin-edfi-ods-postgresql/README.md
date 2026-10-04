# metaed-plugin-edfi-ods-postgresql

MetaEd plugin that generates PostgreSQL DDL scripts for the Ed-Fi ODS.

## Input Configuration

No plugin-specific configuration. Uses the MetaEd model and `targetTechnologyVersion`
from the plugin environment to control SQL dialect details (e.g., timestamp defaults).

## Output

Generates PostgreSQL ODS scripts under `{namespace}/Database/PostgreSQL/ODS/`. Core file names
are `{prefix}-{suffix}.sql` (e.g. `0010-Schemas.sql`); extension file names add the namespace
as `{prefix}-{projectExtension}-{namespaceName}-{suffix}.sql`, or
`{prefix}-{namespaceName}-{suffix}.sql` when `projectExtension` is empty.

- `Structure/0010-Schemas.sql` — Schema creation
- `Structure/0020-Tables.sql` — Table DDL
- `Structure/0030-ForeignKeys.sql` — Foreign key constraints
- `Structure/0040-IdColumnUniqueIndexes.sql` — ID column unique indexes, when tables need them
- `Structure/0050-ExtendedProperties.sql` — Extended properties/comments
- `Structure/1410-CreateIndex-EdOrgIdsRelationship-AuthPerformance.sql` — Education organization
  authorization indexes, technology version `>=7.1.0`, when table data exists
- `Structure/1460-AggregateIdColumns.sql` — Aggregate ID columns, `>=7.3.0`, when table data exists
- `Structure/1465-UpdateIndex-EdOrgIdsRelationship-AuthPerformance.sql` — Education organization
  authorization index updates, `>=7.3.0`, when table data exists
- `Data/0010-Enumerations.sql` — Seed rows for enumerations and descriptor map types (not all
  descriptors); written only when such rows exist
- `Data/0020-SchoolYears.sql` — School year seed data; written only when school year rows exist

## Business Logic

Consumes the relational ODS model produced by `metaed-plugin-edfi-ods-relational` and
emits PostgreSQL-specific DDL for schemas, tables, foreign keys, constraints, seed data,
indexes, and education organization authorization index scripts.
