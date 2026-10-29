# metaed-plugin-edfi-ods-recordownership-postgresql

MetaEd plugin that generates PostgreSQL DDL for ODS record-ownership columns.

## Input Configuration

No plugin-specific configuration. Depends on `metaed-plugin-edfi-ods-recordownership`
for table-level ownership metadata.

## Output

Generates PostgreSQL DDL under `Database/PostgreSQL/ODS/Structure/RecordOwnership/`:

- `0010-AddColumnOwnershipTokenForTable.sql` — Adds ownership-token columns to flagged
  tables

## Business Logic

Finds tables flagged for record-ownership support by the common record-ownership plugin
and generates PostgreSQL `ALTER TABLE` statements to add the ownership-token column.
