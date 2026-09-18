# metaed-plugin-edfi-ods-relational

MetaEd plugin that builds the shared relational ODS model used by database-specific
generators.

## Input Configuration

No plugin-specific configuration. Operates on the core MetaEd model produced by
upstream enhancers.

## Output

No file artifacts. This is a model-enrichment plugin that produces the in-memory
relational representation (tables, columns, foreign keys, rows, repositories, naming)
consumed by the PostgreSQL and SQL Server ODS generator plugins.

## Business Logic

Transforms the semantic MetaEd model into a relational database model through a large
series of enhancers. Constructs table definitions, column mappings, primary/foreign key
relationships, enumeration rows, and naming conventions. Also provides validators for
relational integrity. Serves as the shared foundation that both platform-specific ODS
plugins build upon.
