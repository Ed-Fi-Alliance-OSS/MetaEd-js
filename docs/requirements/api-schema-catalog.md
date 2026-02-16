# API Schema Catalog

## Purpose

As a business analyst, I want a spreadsheet listing all API resources and properties that will be generated for a data model (with or without extensions), so that I can use it for data cataloging, comparison to other versions, and so forth.

## Initial Prompt

Study packages `metaed-plugin-edfi-api-schema` and `metaed-plugin-edfi-handbook` to learn expected patterns for plugin development, including use of:

- initialize function that creates the plugin
- enhancers for business logic
- generators for creating output
- models for storing values

Then create a new plugin called `metaed-plugin-edfi-api-catalog`.

We need the enhanced metaEd model from the `metaed-plugin-edfi-api-schema`. The code needs to access `namespace.data.edfiApiSchema as NamespaceEdfiApiSchema`. The `edfiApiSchema` should already be in memory, so long as we load the new plugin last in the plugin list (the plugin list is in package `metaed-default-plugins`).

It will need a `generate` function that outputs an Excel spreadsheet. File `EdFiDataHandbookAsExcelGenerator.ts` has a good example of writing Excel files. The output needs a single tab with the following columns, mapped from the `namespace.data.edfiApiSchema as NamespaceEdfiApiSchema` object. Mapping these columns will require looping through objects in the namespace schema.

- `projectEndpointName` as `project`
- `projectVersion` as `version`
- iterate over `resourceSchemas` to extract:
  - the resource schema key as `resourceName`
  - `isDescriptor`
  - iterate over the `openApiFragments` to find its `properties`, ignoring any property called `id`:
    - property key as `propertyName`
    - `description`
    - `type` as `dataType`
      - if the `format` key is present, then use its value to override the `dataType`
    - `minLength`
    - `maxLength`
    - `pattern` as `validationRegEx`
    - `x-Ed-Fi-isIdentity` as `isIdentityKey`
    - `x-nullable` as `isNullable`
  - iterate over the `required` array to set a column value for `isRequired`, matching to the `propertyName` discovered above

## Refactor

- Drop the "Is Descriptor" column
- Change the "Description" column header to "Property Description"
- Rename the "API Catalog" worksheet to "Properties"
- The current list also needs to include all Descriptors
- Add a new worksheet called "Resources", which will not list individual properties on an entity. Instead, it will have:
  - Project
  - Version
  - Resource Name
  - Resource Description
  - Domains
