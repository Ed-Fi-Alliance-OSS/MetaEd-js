# metaed-plugin-edfi-xsd

MetaEd plugin that generates XSD (XML Schema Definition) files for the Ed-Fi data model.

## Input Configuration

No plugin-specific configuration. Operates on the enriched MetaEd model with unified
transformations applied.

## Output

Generates XSD artifacts under `XSD/`:

- `Ed-Fi-Core.xsd` (for core namespace)
- `{Extension}-Ed-Fi-Extended-Core.xsd` (for extension namespaces)
- `SchemaAnnotation.xsd` — Schema annotation definitions
- `Interchange-{Name}.xsd` — Interchange schemas (for core)
- `{Extension}-Interchange-{Name}-Extension.xsd` — Interchange extension schemas

## Business Logic

Enhances the MetaEd model into XSD schema objects through a series of enhancers, then
generates core schema files, schema annotations, and interchange schemas. Also validates
for duplicate names across dependency namespaces to prevent XSD conflicts.
