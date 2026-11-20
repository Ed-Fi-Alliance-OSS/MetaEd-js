# metaed-plugin-edfi-xsd

MetaEd plugin that generates XSD (XML Schema Definition) files for the Ed-Fi data model.

## Input Configuration

No plugin-specific configuration. Operates on the enriched MetaEd model with unified
transformations applied.

## Output

Generates XSD artifacts in two directories under each `{namespace}/` folder
(e.g. `EdFi/XSD/Ed-Fi-Core.xsd`):

`{namespace}/XSD/`:
- `Ed-Fi-Core.xsd` (for core namespace)
- `{Extension}-Ed-Fi-Extended-Core.xsd` (for extension namespaces)
- `SchemaAnnotation.xsd` — Schema annotation definitions (core `EdFi` namespace only)

`{namespace}/Interchange/`:
- `Interchange-{Name}.xsd` — Interchange schemas (for core)
- `{Extension}-Interchange-{Name}-Extension.xsd` — Interchange extension schemas

## Business Logic

Enhances the MetaEd model into XSD schema objects through a series of enhancers, then
generates core schema files, schema annotations, and interchange schemas.

For each model type it checks, the duplicate-name validator looks up the entity name under
the same type in each dependency namespace. A match triggers a warning and suppresses
the affected namespace's core/extension XSD and interchange schemas. A domain entity and its same-named
domain entity extension pass this check. The generator still writes the core `SchemaAnnotation.xsd`.
