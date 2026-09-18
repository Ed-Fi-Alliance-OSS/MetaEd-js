# metaed-plugin-edfi-unified

MetaEd plugin that provides core model transformations shared across multiple
downstream plugins.

## Input Configuration

No plugin-specific configuration.

## Output

No file artifacts. This plugin validates the in-memory MetaEd model and enriches it with
unified transformations used by other plugins (XSD, XML dictionary, ODS, etc.).

## Business Logic

Validates a broad set of model rules (entity naming, property references, cardinality
constraints, extension correctness, etc.) and applies core model enhancements that shape
entities, properties, and relationships into forms required by downstream generators.
Provides the shared model foundation for interchange schemas, type hierarchies, and
cross-entity relationships that multiple output plugins depend on.
