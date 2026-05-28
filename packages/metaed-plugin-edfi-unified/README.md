# metaed-plugin-edfi-unified

MetaEd plugin that provides core model transformations shared across multiple
downstream plugins.

## Input Configuration

No plugin-specific configuration. This is a pure enhancer plugin.

## Output

No file artifacts. This plugin only enriches the in-memory MetaEd model with unified
transformations used by other plugins (XSD, XML dictionary, ODS, etc.).

## Business Logic

Applies core "unified" model enhancements that shape entities, properties, and
relationships into forms required by downstream generators. Provides the shared model
foundation for interchange schemas, type hierarchies, and cross-entity relationships
that multiple output plugins depend on.
