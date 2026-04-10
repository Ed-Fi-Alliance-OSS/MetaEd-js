# Design: API Catalog — Common Property Name Prefixing

**Date:** 2026-04-10
**Status:** Approved

## Problem

The Properties worksheet in the generated `Ed-Fi-API-Catalog.xlsx` contains duplicate `propertyName` values when a resource includes the same `Common` type more than once (once plain, once role-named). For example, the `Contact` resource contains both a plain `Address` common and an `InternationalAddress` role-named `Address` common. Both produce rows with `city`, `state`, etc. — indistinguishable to a spreadsheet reader.

## Goal

Prefix each property name with a dot-separated path that reflects the Common hierarchy it belongs to, so readers can see at a glance which common (and which role-named variant) a property comes from.

Example output rows for Contact:

| Resource Name | Property Name | ... |
|---|---|---|
| contacts | contactUniqueId | ... |
| contacts | addresses | ... |
| contacts | address.streetNumberName | ... |
| contacts | address.periods | ... |
| contacts | address.period.beginDate | ... |
| contacts | internationalAddresses | ... |
| contacts | internationalAddress.streetNumberName | ... |
| contacts | internationalAddress.periods | ... |
| contacts | internationalAddress.period.beginDate | ... |

## Scope

Only `extractPropertyRowsForNamespace` in
`packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts`
changes. `extractResourceRowsForNamespace` and all model types are untouched.

## Design

### Data structures

The OpenAPI fragment's `components.schemas` contains:
- A **main entity schema** (e.g., `EdFi_Contact`) — the top-level resource body
- **Sub-schemas** for embedded commons (e.g., `EdFi_Contact_Address`, `EdFi_Contact_InternationalAddress`, `EdFi_Contact_Period`)
- **Reference schemas** (ending `_Reference`, `_Readable`, `_Writable`) — structural, not iterated

Sub-schema names follow the convention `{mainSchemaName}_{Suffix}` where `Suffix` is either the common's name (no role) or the role name prepended to the common name. The suffix, uncapitalized, is the display prefix for properties in that sub-schema.

### Algorithm

Replace the current flat loop over all schemas with a **recursive traversal** starting from the main schema.

**Step 1 — Identify main schema.**
Same logic as today: find the schema entry with no `_Reference`/`_Readable`/`_Writable` suffix that has a `properties` object. Record its name (e.g., `EdFi_Contact`) as `mainSchemaName`.

**Step 2 — Build schema lookup.**
Collect all schemas into a `Map<string, SchemaObject>` for O(1) lookup by name.

**Step 3 — Recursive property walk.**

```
processSchemaProperties(schema, prefix, allSchemas, mainSchemaName, rows, context):
  for each [propertyName, propertyDef] in schema.properties:
    if propertyName === 'id': skip

    qualifiedName = prefix ? `${prefix}.${propertyName}` : propertyName

    if propertyDef has $ref (direct reference):
      emit row: dataType='reference', description=propertyDef.$ref

    else if propertyDef.type === 'array' and items.$ref present:
      emit row for the array property (dataType='array', description=items.$ref)
      refSchemaName = last path segment of items.$ref
      if refSchemaName is internal sub-schema:
        suffix   = refSchemaName.slice(mainSchemaName.length + 1)   // e.g. "Address"
        context  = uncapitalize(suffix)                              // e.g. "address"
        subPrefix = prefix ? `${prefix}.${context}` : context
        recurse: processSchemaProperties(allSchemas[refSchemaName], subPrefix, ...)

    else (scalar, format, etc.):
      emit row with standard field extraction (same as today)
```

**Internal sub-schema test:**
`refSchemaName` is internal if it is present in `allSchemas`, starts with `mainSchemaName + '_'`, and does NOT end with `_Reference`, `_Readable`, or `_Writable`.

**Consequence of rolenamed commons sharing a nested common:**
If both `EdFi_Contact_Address` and `EdFi_Contact_InternationalAddress` each reference `EdFi_Contact_Period`, Period's properties will be emitted twice — once as `address.period.*` and once as `internationalAddress.period.*`. This is correct: both paths exist in the API document.

## Testing

All changes are in `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts`.

Existing tests for simple schemas (no commons) remain unaffected — they use the main schema only and produce no sub-schema rows.

New test cases for `extractPropertyRowsForNamespace`:

| # | Scenario | Key assertion |
|---|---|---|
| 1 | Single common collection (no role name) | `address.city`, `address.state` |
| 2 | Two common collections: plain + rolenamed | `address.city` and `internationalAddress.city` — no unqualified `city` |
| 3 | Nested common (Address → Period) | `address.period.beginDate` |
| 4 | Rolenamed + nested (Address + InternationalAddress, both with Period) | `address.period.beginDate` and `internationalAddress.period.beginDate` |
| 5 | Main-schema scalar properties carry no prefix | `contactUniqueId` not `contact.contactUniqueId` |

## Files changed

| File | Change |
|---|---|
| `packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts` | Replace flat schema loop with recursive traversal in `extractPropertyRowsForNamespace` |
| `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts` | Update affected snapshots; add 5 new test cases |
