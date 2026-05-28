# metaed-plugin-edfi-ods-changequery-sqlserver

MetaEd plugin that generates SQL Server-specific SQL for ODS change-query support.

## Input Configuration

No plugin-specific configuration. Depends on the shared `metaed-plugin-edfi-ods-changequery`
plugin for model enrichment.

## Output

Generates SQL Server-flavored change-query SQL scripts under
`Database/SQLServer/ODS/Structure/Changes/`, including:

- Tracked-delete table and schema creation
- Change-version sequence
- Change-tracking triggers
- Change-version indexes
- Indirect update cascade triggers

## Business Logic

Applies SQL Server-specific enhancers and generators to the change-query model built by
the common change-query plugin. Emits DDL using SQL Server syntax for sequences,
triggers, and indexes.
