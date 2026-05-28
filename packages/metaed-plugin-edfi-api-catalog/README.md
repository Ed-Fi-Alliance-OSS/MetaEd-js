# metaed-plugin-edfi-api-catalog

This plugin generates an Excel spreadsheet catalog of API resources and their properties from the MetaEd API schema.

The API Catalog plugin reads the enhanced MetaEd model from the `metaed-plugin-edfi-api-schema` plugin and generates a comprehensive Excel spreadsheet listing all API resources, their properties, and associated metadata.

## Input Configuration

No plugin-specific configuration. Depends on API schema metadata produced by
`metaed-plugin-edfi-api-schema`.

## Dependencies

This plugin depends on:

- `@edfi/metaed-core`
- `@edfi/metaed-plugin-edfi-api-schema`

The plugin must be loaded after the `metaed-plugin-edfi-api-schema` plugin to access the enhanced API schema data.

## Output

The plugin generates a single Excel file (`Documentation/Ed-Fi-API-Catalog/Ed-Fi-API-Catalog.xlsx`) with two worksheets:

### Resources Worksheet

Contains one row per resource with the following columns:

- **Project**: The API project endpoint name (e.g., "ed-fi", "tpdm")
- **Version**: The project version (e.g., "5.2.0")
- **Resource Name**: The API resource endpoint name
- **Resource Description**: The description of the resource from the API schema
- **Domains**: Comma-separated list of domains the resource belongs to

### Properties Worksheet

Contains one row per property within each resource with the following columns:

- **Project**: The API project endpoint name (e.g., "ed-fi", "tpdm")
- **Version**: The project version (e.g., "5.2.0")
- **Resource Name**: The API resource endpoint name
- **Property Name**: The name of the property within the resource
- **Property Description**: The property description from the API schema
- **Data Type**: The property data type (uses `format` if available, otherwise `type`)
- **Min Length**: Minimum string length constraint (if applicable)
- **Max Length**: Maximum string length constraint (if applicable)
- **Validation RegEx**: Regular expression pattern for validation (if applicable)
- **Is Identity Key**: Boolean indicating if the property is part of the resource identity
- **Is Nullable**: Boolean indicating if the property can be null
- **Is Required**: Boolean indicating if the property is required

## Business Logic

Walks the API schema resource definitions built by the upstream API schema plugin,
extracts resource and property metadata rows, and writes a multi-sheet XLSX workbook
suitable for documentation and review purposes. Both resources and descriptors are
included; reference properties use `dataType = 'reference'`.

## Implementation Details

- The plugin has no enhancers or validators
- It contains a single generator that reads from `namespace.data.edfiApiSchema`
- Both regular resources and descriptors are included in the catalog
- Reference properties are included with `dataType = 'reference'`
- The `id` property is automatically excluded from the Properties worksheet
- Properties are extracted from OpenAPI fragments (preferring 'resources', falling back to 'descriptors')
