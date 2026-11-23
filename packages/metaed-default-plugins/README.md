# metaed-default-plugins

Convenience package that assembles the standard MetaEd plugin stack in the correct
dependency order.

## Input Configuration

None. This package has no runtime configuration of its own.

## Output

Exports `defaultPlugins(): MetaEdPlugin[]` which returns the canonical ordered list of
all standard MetaEd plugins, cached after first initialization.

## Business Logic

Imports and initializes the standard Ed-Fi plugins and returns them in the dependency order
required by the pipeline. The order is:

1. `@edfi/metaed-plugin-edfi-unified`
2. `@edfi/metaed-plugin-edfi-unified-advanced`
3. `@edfi/metaed-plugin-edfi-ods-relational`
4. `@edfi/metaed-plugin-edfi-api-schema`
5. `@edfi/metaed-plugin-edfi-ods-sqlserver`
6. `@edfi/metaed-plugin-edfi-ods-postgresql`
7. `@edfi/metaed-plugin-edfi-xsd`
8. `@edfi/metaed-plugin-edfi-ods-changequery`
9. `@edfi/metaed-plugin-edfi-ods-changequery-sqlserver`
10. `@edfi/metaed-plugin-edfi-ods-changequery-postgresql`
11. `@edfi/metaed-plugin-edfi-ods-recordownership`
12. `@edfi/metaed-plugin-edfi-ods-recordownership-sqlserver`
13. `@edfi/metaed-plugin-edfi-ods-recordownership-postgresql`
14. `@edfi/metaed-plugin-edfi-odsapi`
15. `@edfi/metaed-plugin-edfi-xml-dictionary`
16. `@edfi/metaed-plugin-edfi-sql-dictionary`
17. `@edfi/metaed-plugin-edfi-handbook`
18. `@edfi/metaed-plugin-edfi-api-catalog`

The authoritative order is in [`src/index.ts`](src/index.ts).
