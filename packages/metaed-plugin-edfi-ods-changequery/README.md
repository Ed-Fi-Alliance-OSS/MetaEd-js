# metaed-plugin-edfi-ods-changequery

MetaEd plugin providing shared change-query support for the ODS. Generates
database-agnostic SQL DDL for change tracking infrastructure.

## Input Configuration

No plugin-specific configuration. Uses the MetaEd model and target technology version.

## Output

Generates SQL DDL scripts for change-query support (numbered for execution order):

- `0010-CreateChangesSchema.sql`
- `0020-CreateChangeVersionSequence.sql`
- `0030-AddColumnChangeVersionForTables.sql`
- `0045-CreateTrackedDeleteSchema.sql`
- `0050-CreateTrackedDeleteTables.sql`
- `0060-CreateDeletedForTrackingTriggers.sql`
- `0070-AddIndexChangeVersionForTables.sql`
- `0130-CreateTriggerUpdateChangeVersion*.sql`
- `0230-CreateIndirectUpdateCascadeTriggers.sql`

Script names vary by target technology version (style 6.0 uses alternate numbering).

## Business Logic

Validates namespaces for change-query compatibility, enriches entities with
change-tracking metadata, and generates the common SQL objects (schemas, sequences,
columns, triggers, indexes) needed for ODS change tracking. Platform-specific SQL
is delegated to the PostgreSQL and SQL Server companion plugins.
