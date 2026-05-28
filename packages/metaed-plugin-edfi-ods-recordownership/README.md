# metaed-plugin-edfi-ods-recordownership

MetaEd plugin that enriches ODS table metadata with record-ownership awareness.

## Input Configuration

No plugin-specific configuration. Uses `targetTechnologyVersion` from the plugin
environment (record ownership is enabled for versions ≥ 3.3.0).

## Output

No file artifacts. This is a metadata-only plugin that enriches the in-memory model
with `edfiOdsRecordOwnership` data on each table.

## Business Logic

Marks every ODS table with a record-ownership flag so that downstream platform-specific
generators (PostgreSQL, SQL Server) can add ownership-token columns when the feature is
enabled. Acts as the shared foundation for the record-ownership companion plugins.
