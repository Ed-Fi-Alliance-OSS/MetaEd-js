# metaed-plugin-edfi-ods-changequery-postgresql

MetaEd plugin that generates PostgreSQL-specific SQL for ODS change-query support.

## Input Configuration

No plugin-specific configuration. Depends on the shared `metaed-plugin-edfi-ods-changequery`
plugin for model enrichment.

## Output

Generates PostgreSQL-flavored change-query SQL scripts under
`Database/PostgreSQL/ODS/Structure/Changes/`, including:

- Tracked-delete table and schema creation
- Change-version sequence
- Change-tracking triggers
- Change-version indexes
- Indirect update cascade triggers

## Business Logic

Applies PostgreSQL-specific enhancers and generators to the change-query model built by
the common change-query plugin. Emits DDL using PostgreSQL syntax for sequences,
triggers, and indexes.
