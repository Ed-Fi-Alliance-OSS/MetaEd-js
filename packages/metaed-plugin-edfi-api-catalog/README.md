# MetaEd Plugin: Ed-Fi API Catalog

This plugin generates an Excel spreadsheet catalog of API resources and their properties from the MetaEd API schema.

## Overview

The API Catalog plugin reads the enhanced MetaEd model from the `metaed-plugin-edfi-api-schema` plugin and generates a comprehensive Excel spreadsheet listing all API resources, their properties, and associated metadata.

## Dependencies

This plugin depends on:
- `@edfi/metaed-core`
- `@edfi/metaed-plugin-edfi-api-schema`

The plugin must be loaded after the `metaed-plugin-edfi-api-schema` plugin to access the enhanced API schema data.

## Output

The plugin generates a single Excel file (`Ed-Fi-API-Catalog.xlsx`) with the following columns:

- **Project**: The API project endpoint name (e.g., "ed-fi", "tpdm")
- **Version**: The project version (e.g., "5.2.0")
- **Resource Name**: The API resource endpoint name
- **Is Descriptor**: Boolean indicating if the resource is a descriptor
- **Property Name**: The name of the property within the resource
- **Description**: The property description from the API schema
- **Data Type**: The property data type (uses `format` if available, otherwise `type`)
- **Min Length**: Minimum string length constraint (if applicable)
- **Max Length**: Maximum string length constraint (if applicable)
- **Validation RegEx**: Regular expression pattern for validation (if applicable)
- **Is Identity Key**: Boolean indicating if the property is part of the resource identity
- **Is Nullable**: Boolean indicating if the property can be null
- **Is Required**: Boolean indicating if the property is required

## Usage

This plugin is included in the default plugins list and will automatically generate the API catalog when MetaEd processes a data model.

The generated Excel file can be found in the output directory under:
```
Documentation/Ed-Fi-API-Catalog/Ed-Fi-API-Catalog.xlsx
```

## Implementation Details

- The plugin has no enhancers or validators
- It contains a single generator that reads from `namespace.data.edfiApiSchema`
- Reference properties are included with `dataType = 'reference'`
- The `id` property is automatically excluded from the catalog
- Properties are extracted from OpenAPI fragments (preferring 'resources', falling back to 'descriptors')
