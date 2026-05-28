# metaed-plugin-edfi-ods-recordownership-sqlserver

MetaEd plugin that generates SQL Server DDL for ODS record-ownership columns.

## Input Configuration

No plugin-specific configuration. Depends on `metaed-plugin-edfi-ods-recordownership`
for table-level ownership metadata.

## Output

Generates SQL Server DDL under `Database/SQLServer/ODS/Structure/RecordOwnership/`:

- `0010-AddColumnOwnershipTokenForTable.sql` — Adds ownership-token columns to flagged
  tables

## Business Logic

Finds tables flagged for record-ownership support by the common record-ownership plugin
and generates SQL Server `ALTER TABLE` statements to add the ownership-token column.
