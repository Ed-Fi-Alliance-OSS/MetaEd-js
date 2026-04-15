# API Schema Catalog

## Purpose

As a business analyst, I want a spreadsheet listing all API resources and properties that will be generated for a data model (with or without extensions), so that I can use it for data cataloging, comparison to other versions, and so forth.

## Plugin

Package: `metaed-plugin-edfi-api-catalog`

The plugin reads the enhanced MetaEd model produced by `metaed-plugin-edfi-api-schema` (accessed as `namespace.data.edfiApiSchema`) and generates an Excel workbook named `Ed-Fi-API-Catalog.xlsx`. It must be loaded last in the plugin list (in `metaed-default-plugins`) so that the API schema data is already in memory.

## Output: `Ed-Fi-API-Catalog.xlsx`

The workbook contains two worksheets in the following order:

### Worksheet 1 — Resources

One row per API resource (including descriptors), with the following columns:

| Column               | Source                                          |
| -------------------- | ----------------------------------------------- |
| Project              | `projectEndpointName`                           |
| Version              | `projectVersion`                                |
| Resource Name        | resource schema key                             |
| Resource Description | description from the main OpenAPI schema object |
| Domains              | comma-separated list of domain names            |

The **main schema** for a resource is the entry in `components.schemas` whose name does NOT end with `_Reference`, `_Readable`, or `_Writable` and whose value has a `properties` object.

### Worksheet 2 — Properties

One row per property for every resource and descriptor, with the following columns:

| Column               | Source                                                                                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Project              | `projectEndpointName`                                                                                             |
| Version              | `projectVersion`                                                                                                  |
| Resource Name        | resource schema key                                                                                               |
| Property Name        | dot-separated path (see below)                                                                                    |
| Property Description | `description` for scalar properties; `items.$ref` path for array properties; `$ref` path for reference properties |
| Data Type            | `format` if present, else `type`; `'array'` for array properties; `'reference'` for `$ref` properties             |
| Min Length           | `minLength` (null if absent)                                                                                      |
| Max Length           | `maxLength` (null if absent)                                                                                      |
| Validation RegEx     | `pattern` (null if absent)                                                                                        |
| Is Identity Key      | `x-Ed-Fi-isIdentity` (false if absent)                                                                            |
| Is Nullable          | `x-nullable` (false if absent)                                                                                    |
| Is Required          | `true` if the property name appears in the enclosing schema's `required` array                                    |

The property `id` is always omitted.

## Property Name Prefixing for Embedded Commons and References

Properties that belong to an embedded Common type or a Reference are prefixed with a dot-separated path so that readers can identify which common (and which role-named variant) a property originates from. Top-level scalar properties carry no prefix.

> [!NOTE]
> `educationOrganizationReference` and `schoolYearTypeReference` are hard-coded, because their schemas are not defined following the normal pattern.

### Examples

#### Contact resource, simplified

| Property Name                                | Data Type |
| -------------------------------------------- | --------- |
| `contactUniqueId`                            | string    |
| `addresses`                                  | array     |
| `address.streetNumberName`                   | string    |
| `address.periods`                            | array     |
| `address.period.beginDate`                   | date      |
| `internationalAddresses`                     | array     |
| `internationalAddress.streetNumberName`      | string    |
| `internationalAddress.addressTypeDescriptor` | string    |

#### AccountabilityRatings, simplified

| Property Name                                            | Data Type |
| -------------------------------------------------------- | --------- |
| `educationOrganizationReference`                         | reference |
| `educationOrganizationReference.educationOrganizationId` | int64     |
| `ratingTitle`                                            | string    |
| `rating`                                                 | string    |
| `ratingDate`                                             | date      |
| `schoolYearTypeReference`                                | reference |
| `schoolYearTypeReference.schoolYear`                     | int32     |

### Algorithm

The generator performs a **recursive traversal** starting from the main schema:

1. **Build schema lookup.** Collect all `components.schemas` entries into a lookup map; identify the main schema name (same rule as the Resources worksheet).

2. **Walk properties recursively** (`processSchemaProperties(schema, prefix, ...)`):

   - **`$ref` property** (scalar common or foreign-key reference):
     - Emit a row with `dataType = 'reference'` and `description = $ref path`.
     - If the referenced schema is an *internal sub-schema* (see below), recurse into it using `propertyName` as the next prefix segment (no singularization — scalar common names are already singular).

   - **`array` property with `items.$ref`**:
     - Emit a row with `dataType = 'array'` and `description = items.$ref path`.
     - If the referenced schema is an internal sub-schema, recurse into it using `singularize(propertyName)` as the next prefix segment (e.g., `"addresses"` → `"address"`).

   - **Scalar / other property**:
     - Emit a single row using the standard field extraction. No recursion.

   The qualified property name at any level is `prefix ? "${prefix}.${propertyName}" : propertyName`.

3. **Internal sub-schema definition.** A referenced schema name is considered an internal sub-schema when all three conditions hold:
   - It is present as a key in the schema lookup.
   - It does NOT end with `_Reference`, `_Readable`, or `_Writable`.
   - It is not the main schema name itself.

   This deliberately does *not* require the sub-schema name to start with the main schema's prefix, because resources that inherit from a base entity (e.g., `CommunityProvider` inheriting `EducationOrganization`) reference sub-schemas named after the base entity (e.g., `EdFi_EducationOrganization_Address`).

4. **Shared nested commons** are emitted once per containing path. If both `Address` and `InternationalAddress` include a `Period` sub-collection, Period's properties appear as both `address.period.*` and `internationalAddress.period.*` — this is correct.

5. **Orphaned sub-schemas** (present in `components.schemas` but unreachable from the main schema's `$ref` chains) produce no rows. This is intentional.

6. **Circular references** are not possible in MetaEd Common definitions, so no visited-set is required.

For singularization, import from `@edfi/metaed-plugin-edfi-api-schema/src/Utility` (do NOT add `inflection` as a direct dependency of this plugin).
