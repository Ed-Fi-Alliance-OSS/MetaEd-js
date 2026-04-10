# Design: API Catalog — Common Property Name Prefixing

**Date:** 2026-04-10
**Status:** Approved

## Problem

The Properties worksheet in the generated `Ed-Fi-API-Catalog.xlsx` contains duplicate `propertyName` values when a resource includes the same `Common` type more than once (once plain, once role-named). For example, the `Contact` resource contains both a plain `Address` common and an `InternationalAddress` role-named `Address` common. Both produce rows with `addressTypeDescriptor`, `latitude`, `longitude`, etc. — indistinguishable to a spreadsheet reader.

## Goal

Prefix each property name with a dot-separated path that reflects the Common hierarchy it belongs to, so readers can see at a glance which common (and which role-named variant) a property comes from.

Example output rows for Contact (simplified; `Data Type` column shows structural difference):

| Resource Name | Property Name | Data Type | ... |
|---|---|---|---|
| contacts | contactUniqueId | string | ... |
| contacts | addresses | array | ... |
| contacts | address.streetNumberName | string | ... |
| contacts | address.periods | array | ... |
| contacts | address.period.beginDate | date | ... |
| contacts | internationalAddresses | array | ... |
| contacts | internationalAddress.streetNumberName | string | ... |
| contacts | internationalAddress.addressTypeDescriptor | string | ... |

(Note: `EdFi_Contact_InternationalAddress` has no Period sub-schema; `address.period.*` rows appear only under the plain Address path.)

## Scope

Only `extractPropertyRowsForNamespace` in
`packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts`
changes. `extractResourceRowsForNamespace` and all model types are untouched.

## Design

### Data structures

The OpenAPI fragment's `components.schemas` contains:
- A **main entity schema** (e.g., `EdFi_Contact`) — the top-level resource body
- **Sub-schemas** for embedded commons (e.g., `EdFi_Contact_Address`,
  `EdFi_Contact_InternationalAddress`, `EdFi_Contact_Period`)
- **Inherited sub-schemas** from base entities (e.g., resources that inherit from
  `EducationOrganization` will reference `EdFi_EducationOrganization_Address` rather
  than a schema prefixed with their own name)
- **Reference schemas** (ending `_Reference`, `_Readable`, `_Writable`) — structural,
  not iterated

The TypeScript type of `components.schemas` values is `ReferenceObject | SchemaObject`.
In practice MetaEd only places `SchemaObject` instances as top-level entries; after the
`isInternal` check passes, cast the looked-up value to `SchemaObject`.

### Algorithm

Replace the current flat loop over all schemas with a **recursive traversal** starting
from the main schema.

**Step 1 — Identify main schema name and build schema lookup (single pass).**
Iterate `Object.entries(openApiFragment.components.schemas)` once to:
- Find the main schema entry (same predicate as `extractResourceRowsForNamespace`: name
  does NOT end with `_Reference`, `_Readable`, or `_Writable`, and value has a
  `properties` object). Record its **key string** as `mainSchemaName` (e.g.,
  `"EdFi_Contact"`).
- Collect all entries into a plain object for O(1) lookup by schema name.

**Behavioral note:** The new algorithm reaches sub-schema properties only via recursion from
the main schema. Any sub-schema present in `components.schemas` but unreachable from the main
schema's `$ref` chains (an "orphan") will produce no rows. This is the intended behavior —
an orphaned schema has no corresponding property path in the API document.

**Step 2 — Recursive property walk.**

```
processSchemaProperties(schema, prefix, allSchemas, mainSchemaName, rows, resourceContext):
  requiredProperties = schema.required ?? []

  for each [propertyName, propertyDef] in schema.properties:
    if propertyName === 'id': skip

    qualifiedName = prefix ? `${prefix}.${propertyName}` : propertyName

    // ── $ref branch (foreign-key reference OR scalar common) ──────────────
    if propertyDef has $ref:
      refSchemaName = propertyDef.$ref.split('/').at(-1) ?? ''
      emit row:
        propertyName = qualifiedName
        dataType     = 'reference'
        description  = propertyDef.$ref
        isIdentityKey = propertyDef['x-Ed-Fi-isIdentity'] ?? false   // preserve existing behaviour
        isNullable    = propertyDef['x-nullable'] ?? false            // preserve existing behaviour
        isRequired    = requiredProperties.includes(propertyName)
        minLength, maxLength, validationRegEx = null

      if refSchemaName is an internal sub-schema (see below):
        // Scalar common — recurse to expose its internal properties.
        // Do NOT singularize: scalar common property names are already singular
        // (e.g. "homeAddress"); singularize("homeAddress") → "homeAddres" (corruption).
        context   = propertyName
        subPrefix = prefix ? `${prefix}.${context}` : context
        recurse: processSchemaProperties(
          allSchemas[refSchemaName] as SchemaObject, subPrefix, ...)

    // ── array branch ──────────────────────────────────────────────────────
    else if propertyDef.type === 'array' and items.$ref present:
      refSchemaName = items.$ref.split('/').at(-1) ?? ''
      emit row for the array property itself:
        propertyName = qualifiedName
        dataType     = 'array'
        description  = items.$ref
        isIdentityKey = false   // arrays are never identity keys
        isNullable    = false   // arrays are never nullable in this schema convention
        isRequired    = requiredProperties.includes(propertyName)
        minLength, maxLength, validationRegEx = null

      if refSchemaName is an internal sub-schema:
        // Array of commons — use singularize on the PLURAL property name.
        context   = singularize(propertyName)
          // "addresses" → "address", "internationalAddresses" → "internationalAddress"
        subPrefix = prefix ? `${prefix}.${context}` : context
        recurse: processSchemaProperties(
          allSchemas[refSchemaName] as SchemaObject, subPrefix, ...)

    // ── scalar branch ─────────────────────────────────────────────────────
    else:
      // Covers: scalar properties (string, integer, date, etc.) AND arrays whose
      // items is a scalar type (no $ref). Both are emitted as a single row with
      // no recursion.
      emit row with standard field extraction (same as today):
        propertyName  = qualifiedName
        dataType      = property.format ?? property.type ?? 'unknown'
        description   = property.description ?? ''
        minLength     = property.minLength ?? null
        maxLength     = property.maxLength ?? null
        validationRegEx = property.pattern ?? null
        isIdentityKey = property['x-Ed-Fi-isIdentity'] ?? false
        isNullable    = property['x-nullable'] ?? false
        isRequired    = requiredProperties.includes(propertyName)
```

**Internal sub-schema definition.**
`refSchemaName` is an internal sub-schema if all three conditions hold:
1. It is present as a key in `allSchemas`.
2. It does NOT end with `_Reference`, `_Readable`, or `_Writable`.
3. It is not `mainSchemaName` itself.

This deliberately does NOT require the referenced schema to start with
`mainSchemaName + '_'`, because resources that inherit from a base entity (e.g.,
`CommunityProvider` inheriting `EducationOrganization`) reference sub-schemas named
with the base entity prefix (e.g., `EdFi_EducationOrganization_Address`).

**Context prefix derivation.**

| Branch | Property name | Derivation | Result |
|---|---|---|---|
| `$ref` (scalar common) | `homeAddress` | `propertyName` (no change) | `homeAddress` |
| `array` | `addresses` | `singularize(propertyName)` | `address` |
| `array` | `internationalAddresses` | `singularize(propertyName)` | `internationalAddress` |

For `singularize`, import from the existing declared dependency — do NOT add `inflection`
as a direct dependency of `metaed-plugin-edfi-api-catalog`:

```ts
import { singularize } from '@edfi/metaed-plugin-edfi-api-schema/src/Utility';
```

**`isRequired` in sub-schemas.**
Each sub-schema has its own `required` array. The recursive call reads `schema.required`
from the sub-schema being processed, so `isRequired` is always scoped to the correct
schema level.

**Shared nested commons.**
If two role-named commons both contain the same nested common (e.g., both `Address` and
`InternationalAddress` include a `Period` sub-collection), Period's properties are emitted
twice — once as `address.period.*` and once as `internationalAddress.period.*`. This is
correct: both paths are valid in the API document.

**Guard against infinite recursion.**
MetaEd does not allow circular Common references, so no visited-set is needed. Document
this assumption with a code comment at the recursion site.

## Testing

All changes are in
`packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts`.

**Existing tests unaffected.** Tests for simple schemas (no commons) exercise only
the main schema and produce no sub-schema rows. The existing test "should handle array
properties with $ref items" uses a fixture where `items.$ref` points to
`EdFi_Student_Address`, but `EdFi_Student_Address` is NOT present in the fixture's
`components.schemas`. The `isInternal` check (condition 1: present in `allSchemas`)
therefore fails and no recursion occurs — test output is unchanged.

**New test cases** for `extractPropertyRowsForNamespace` (all use synthetic fixture data):

| # | Scenario | Key assertion |
|---|---|---|
| 1 | Single common collection, no role name | `address.city` and `address.state` produced |
| 2 | Plain + rolenamed common collections | `address.city` and `internationalAddress.city` both appear; no unqualified `city` |
| 3 | Nested common collection (Address → Period) | `address.period.beginDate` produced |
| 4 | Two rolenamed commons each with the same nested common (synthetic) | `address.period.beginDate` and `internationalAddress.period.beginDate` as separate rows |
| 5 | Main-schema scalar properties carry no prefix | `contactUniqueId` remains `contactUniqueId` |
| 6 | Cross-entity inherited sub-schema | Array property with `items.$ref` to `EdFi_EducationOrganization_Address` (not matching main schema prefix) is recursed; properties prefixed as `address.*` |
| 7 | Scalar common (direct `$ref` to internal sub-schema) | Fixture: main schema has `homeAddress: { $ref: '#/components/schemas/EdFi_Contact_HomeAddress' }`; `EdFi_Contact_HomeAddress` has `streetNumberName`. Expect: row `{ propertyName: 'homeAddress', dataType: 'reference', description: '#/components/schemas/EdFi_Contact_HomeAddress' }` plus row `{ propertyName: 'homeAddress.streetNumberName', dataType: 'string' }` |
| 8 | `_Reference` schema present in `allSchemas` is NOT recursed | Fixture: main schema has `studentReference: { $ref: '#/components/schemas/EdFi_Student_Reference' }`; `EdFi_Student_Reference` is also in `components.schemas`. Expect: one row `{ propertyName: 'studentReference', dataType: 'reference' }`; NO rows for properties inside `EdFi_Student_Reference` |

## Files changed

| File | Change |
|---|---|
| `packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts` | Replace flat schema loop with recursive traversal in `extractPropertyRowsForNamespace` |
| `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts` | Update affected snapshots; add 8 new test cases |
