# metaed-plugin-edfi-ods-changequery-sqlserver

MetaEd plugin that generates SQL Server-specific SQL for ODS change-query support.

## Input Configuration

No plugin-specific configuration. The shared `metaed-plugin-edfi-ods-changequery` plugin
registers no enhancers; this plugin registers its own enhancers to build the change-query
model, using model types and helper logic exported by the shared package.

## Output

Generates SQL Server-flavored change-query SQL scripts under
`{namespace}/Database/SQLServer/ODS/Structure/Changes/`:

- `0010-CreateChangesSchema.sql` and `0020-CreateChangeVersionSequence.sql` — for every
  namespace below technology version 7.3.0; for the core namespace only at `>=7.3.0`
- `0030-AddColumnChangeVersionForTables.sql` — change-version columns
- `0045-CreateTrackedDeleteSchema.sql` — tracked-delete schemas; skipped for
  `<3.4.0 || >5.4.0`
- `0050-CreateTrackedDeleteTables.sql` (`0200-CreateTrackedChangeTables.sql` at `>=6.0.0`)
- `0060-CreateDeletedForTrackingTriggers.sql` (`0220-CreateTriggersForDeleteTracking.sql` at `>=6.0.0`)
- `0040-CreateTriggerUpdateChangeVersionGenerator.sql`
  (`0210-CreateTriggersForChangeVersionAndKeyChanges.sql` at `>=6.0.0`)
- `0070-AddIndexChangeVersionForTables.sql` — change-version indexes
- `0230-CreateIndirectUpdateCascadeTriggers.sql` — indirect update cascade triggers, only at `>=7.3.0`

Table-level scripts are generated only when the namespace has the required model data.

## Business Logic

Runs its own SQL Server-specific enhancers to build the change-query model, then its
generators, several of which delegate to helpers in the common change-query package. Emits DDL using SQL Server syntax for sequences,
triggers, and indexes.

- Change schema and change version sequence scripts are generated without a model-data check:
  for every namespace below technology version `7.3.0`, and for the core namespace only (skipped
  for extension namespaces) at `>=7.3.0`. Table-level scripts and indirect update cascade
  triggers are generated only when the required model data exists. Tracked delete schema
  scripts are skipped for `<3.4.0 || >5.4.0`.
