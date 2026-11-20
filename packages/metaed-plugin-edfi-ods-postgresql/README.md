# metaed-plugin-edfi-ods-postgresql

MetaEd plugin that generates PostgreSQL DDL scripts for the Ed-Fi ODS.

## Input Configuration

No plugin-specific configuration. Uses the MetaEd model and `targetTechnologyVersion`
from the plugin environment to control SQL dialect details (e.g., timestamp defaults).

## Output

Generates PostgreSQL ODS scripts under `{namespace}/Database/PostgreSQL/ODS/`. Core file names
are `{prefix}-{suffix}.sql` (e.g. `0010-Schemas.sql`); extension file names add the namespace
as `{prefix}-{projectExtension}-{namespaceName}-{suffix}.sql`, or
`{prefix}-{namespaceName}-{suffix}.sql` when `projectExtension` is empty. The list uses core file names.

- `Structure/0010-Schemas.sql` — Schema creation
- `Structure/0020-Tables.sql` — Table DDL when the namespace has tables
- `Structure/0030-ForeignKeys.sql` — Foreign key constraints when the namespace has foreign keys
- `Structure/0040-IdColumnUniqueIndexes.sql` — ID column unique indexes, when tables need them
- `Structure/0050-ExtendedProperties.sql` — Table and column comments when tables exist
- `Structure/1410-CreateIndex-EdOrgIdsRelationship-AuthPerformance.sql` — Education organization
  authorization indexes, `>=7.1.0`, for education organization ID columns
- `Structure/1460-AggregateIdColumns.sql` — Aggregate ID columns, `>=7.3.0`, for aggregate
  root tables in the namespace's own database schema
- `Structure/1465-UpdateIndex-EdOrgIdsRelationship-AuthPerformance.sql` — Authorization
  index updates, `>=7.3.0`, for education organization ID or USI columns
- `Data/0010-Enumerations.sql` — Seed rows for enumerations and descriptor map types (not all
  descriptors); written only when such rows exist
- `Data/0020-SchoolYears.sql` — School year seed data; written only when school year rows exist

## Business Logic

Consumes the relational ODS model produced by `metaed-plugin-edfi-ods-relational` and
emits PostgreSQL-specific DDL for schemas, tables, foreign keys, constraints, seed data,
indexes, and education organization authorization index scripts.

- The writer skips an output with empty SQL text and no stream. The schema script is
  generated for every namespace. Tables supply the table and extended-property scripts,
  foreign keys supply the constraint script, and seed scripts require corresponding rows.
  An extension containing only a shared type can have just the `0010` schema script in
  its ODS structure directory.
- At their respective target versions, `1410` and `1465` are rendered only when the namespace
  has relational tables. Both use aggregate-root columns derived from `EducationOrganizationId`,
  including renames, when none of their source properties has a role name. `1465` also indexes
  aggregate-root columns derived from USI properties. With Alliance Mode off, each file requires
  at least one qualifying column. With Alliance Mode on, its license header alone can produce
  the file. The separate `1460` generator requires an aggregate root in the namespace's own schema.
