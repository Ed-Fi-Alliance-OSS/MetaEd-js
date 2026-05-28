# metaed-plugin-edfi-data-catalog

MetaEd plugin that generates an Excel data catalog of the Ed-Fi Data Standard.

## Input Configuration

No plugin-specific configuration. Relies on model data enriched by upstream enhancers.

## Output

Generates a single Excel workbook:

- `Data-Catalog/Data-Catalog.xlsx`

The workbook contains sheets for domains, entities, and elements.

## Business Logic

Aggregates domain, entity, and element metadata across namespaces from the enriched
MetaEd model. Sorts entries and writes a three-sheet Excel catalog suitable for
data standard documentation.
