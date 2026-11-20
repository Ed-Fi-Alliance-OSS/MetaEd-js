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
- `@edfi/metaed-plugin-edfi-unified`

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
- **Property Name**: The property path within the resource; nested properties from common sub-schemas and resolved references use dot-separated paths (e.g., `schoolReference.schoolId`), with array item paths using the singularized array property name
- **Property Description**: The property description from the API schema; for reference and array-of-`$ref` rows, this holds the `$ref` target instead
- **Data Type**: The property data type (uses `format` if available, otherwise `type`); `reference` for `$ref` properties, `array` for arrays of `$ref` items, or `unknown` when no type is present
- **Min Length**: Minimum string length constraint (if applicable)
- **Max Length**: Maximum string length constraint (if applicable)
- **Validation RegEx**: Regular expression pattern for validation (if applicable)
- **Is Identity Key**: Boolean indicating if the property is part of the resource identity
- **Is Nullable**: Boolean indicating if the property can be null
- **Is Required**: Boolean indicating if the property is required

## Business Logic

Walks the API schema resource definitions built by the upstream API schema plugin,
extracts resource and property metadata rows, and writes a multi-sheet XLSX workbook
covering resources and descriptors. A direct reference has `dataType = 'reference'`.
It gets dotted key rows when the project's reference lookup contains the target. In TPDM,
`financialAids` contains `studentReference` without a
`studentReference.studentUniqueId` row.

- **Project and resource names.** The Project column holds the project endpoint name and the
  Resource Name column holds the resource endpoint name, on both worksheets.
- **`id` omission.** Any property named `id`, at every nesting level, is omitted from the
  Properties worksheet.
- **Recursion.** The generator recurses into common sub-schemas and resolved reference schemas
  reached by a direct `$ref`, and recurses into array items only when they are common
  sub-schemas (using the singularized array property name as the path segment). Nested
  property origins are represented with dot-separated property paths.
- **Hard-coded reference schemas.** The generator contains hard-coded handling for the
  EducationOrganization and SchoolYear reference schemas. It builds a lookup for each
  project by scanning `resourceSchemas`. The core EducationOrganization reference
  schema is under `abstractResources`, outside that collection. The SchoolYear
  reference schema does exist as `EdFi_SchoolYearTypeReference`, but the generator's
  `_Reference` suffix filter misses it.

## Implementation Details

- The plugin has no enhancers or validators
- It contains a single generator that reads from `namespace.data.edfiApiSchema`
- Both regular resources and descriptors are included in the catalog
- Reference properties are included with `dataType = 'reference'`
- Reference schemas for `EducationOrganization` and `SchoolYearType` are hard-coded (see Business Logic for why each is not picked up from the OpenAPI fragments)
- Any property named `id`, at any nesting level, is excluded from the Properties worksheet
- Properties are extracted from OpenAPI fragments (preferring 'resources', falling back to 'descriptors')
