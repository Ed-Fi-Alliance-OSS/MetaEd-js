# metaed-default-plugins

Convenience package that assembles the standard MetaEd plugin stack in the correct
dependency order.

## Input Configuration

None. This package has no runtime configuration of its own.

## Output

Exports `defaultPlugins(): MetaEdPlugin[]` which returns the canonical ordered list of
all standard MetaEd plugins, cached after first initialization.

## Business Logic

Imports and initializes all standard Ed-Fi plugins (unified, ODS relational, SQL Server,
PostgreSQL, change query, record ownership, XSD, API schema, handbook, dictionaries,
etc.) and returns them in the dependency order required by the pipeline.
