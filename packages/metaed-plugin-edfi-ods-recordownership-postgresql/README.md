# metaed-plugin-edfi-ods-recordownership-postgresql

MetaEd plugin that generates PostgreSQL DDL for ODS record-ownership columns.

## Input Configuration

No plugin-specific configuration. Depends on `metaed-plugin-edfi-ods-recordownership`
for table-level ownership metadata and on `metaed-plugin-edfi-ods-postgresql` for PostgreSQL table names.

## Output

Generates PostgreSQL DDL under `{namespace}/Database/PostgreSQL/ODS/Structure/RecordOwnership/`,
one file per namespace that has flagged tables:

- `0010-AddColumnOwnershipTokenForTable.sql` — Adds the `CreatedByOwnershipTokenId SMALLINT NULL`
  column to each flagged table

## Business Logic

Generates output only when the target technology version is `>=3.3.0`. Finds tables
flagged for record-ownership support by the common record-ownership plugin and generates
PostgreSQL `ALTER TABLE` statements to add the ownership-token column.
