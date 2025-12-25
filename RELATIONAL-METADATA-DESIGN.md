# Relational Metadata Design (No Flattening Metadata Dependency)

## Goals and Constraints
- Add an optional `relational` block to each `resourceSchema` that captures only naming overrides.
- Emit the `relational` block only when overrides exist.
- New enhancers must not depend on `FlatteningMetadata` enhancers or the data they produce.
- New enhancers must have single responsibility; intermediate data is acceptable.
- Reuse existing model data (property chains, API naming, JSONPath mapping); avoid string parsing when model data is available.
- It is acceptable to copy logic from flattening enhancers into new relational-only helpers.

## ResourceSchema Shape
Add a new optional `relational` object:
```json
{
  "relational": {
    "rootTableNameOverride": "Student",
    "nameOverrides": {
      "$.someVeryLongPropertyName...": "ShortColumnName",
      "$.addresses[*]": "Address",
      "$.addresses[*].periods[*]": "AddressPeriod"
    }
  }
}
```

Notes:
- `rootTableNameOverride` is optional.
- `nameOverrides` is optional; when present it maps JSONPath to a base name for columns or child tables.
- Keys ending with `[*]` target a child-table base name (suffix).
- Other keys target a column base name (before `_Id`/`_DescriptorId`).

## Inputs Used (No Flattening Metadata)
These new enhancers may only use existing non-flattening data:
- `EntityApiSchemaData.collectedApiProperties` (property chains, modifiers).
- `EntityApiSchemaData.allJsonPathsMapping` (JsonPath keys, collection container JsonPaths).
- `EntityApiSchemaData.documentPathsMapping` (reference structure and identity alignment).
- `EntityApiSchemaData.resourceName`, `entity.metaEdName`, `entity.namespace.extensionEntitySuffix`.
- `ApiPropertyMapping` values for API naming (from `ApiPropertyMappingEnhancer`).

No new enhancer should read `EntityApiSchemaData.flatteningMetadata`.

## New Model Types
Add types in `packages/metaed-plugin-edfi-api-schema/src/model/api-schema`:
- `RelationalMetadata` with:
  - `rootTableNameOverride?: RelationalBaseName`
  - `nameOverrides?: { [key: JsonPath]: RelationalBaseName }`
- `RelationalBaseName` branded string type (mirrors `JsonPath` branding).

Add to `EntityApiSchemaData` (intermediate fields):
- `relationalTableNodes?: RelationalTableNode[]`
- `relationalNamingPlan?: RelationalNamingPlan`
- `relationalNameOverrides?: RelationalNameOverrides`
- `relational?: RelationalMetadata`

## New Helper Modules (Copied, Not Dependent)
Create new helpers under `packages/metaed-plugin-edfi-api-schema/src/enhancer/relational`:

1) `RelationalPropertyChainBuilder.ts`
- Copy logic from `FlatteningPropertyChainBuilder` to compute property chains.
- Output should include array ownership info (needed for table derivation).

2) `RelationalTableNodeHelper.ts`
- Copy logic from `FlatteningTableHelper` to:
  - Identify table-defining properties (arrays only; no standalone tables for non-array objects per redesign).
  - Collect `RelationalTableNode` objects:
    - `tablePath`, `property`, `propertyChain`, `collectionJsonPath`, `parentPath`.
  - Derive table suffix using the same naming conventions as flattening (`adjustedFullPropertyName`, inline common prefixes, etc).

3) `RelationalNamingConventions.ts`
- Copy and rename the naming rules used by flattening:
  - `deriveTableSuffix(node)`
  - `collectReferencePrefixes(chain)` and reference base name derivation.
  - `prefixedName` and `canonicalRoleNamePrefix` use is allowed.
- This module is strictly relational naming, not flattening metadata.

## New Enhancers (Single Responsibility)
Order these after `allJsonPathsMappingEnhancer` and `documentPathsMappingEnhancer`, before `apiSchemaBuildingEnhancer`.

1) `RelationalTableNodeEnhancer`
- Builds `RelationalTableNode[]` using `RelationalPropertyChainBuilder` and `allJsonPathsMapping`.
- Records `collectionJsonPath` only for array properties (paths ending with `[*]`).

2) `RelationalJsonPathNamingPlanEnhancer`
- Builds JSON-derived base names without parsing JSONPath strings:
  - Uses property chains + `ApiPropertyMapping` and `PropertyModifier` to derive the JSON property name.
  - Produces JSON base names for:
    - Array tables (singularized collection name).
    - Reference objects (reference property name without `Reference` suffix).
    - Scalars (property JSON name).
- Stores results in a `RelationalNamingPlan` keyed by JsonPath.

3) `RelationalPhysicalNamingPlanEnhancer`
- Computes physical (relational) base names using copied naming conventions:
  - Table suffix from `RelationalTableNodeHelper.deriveTableSuffix`.
  - Reference column base name from role prefixes + referenced metaEdName.
  - Scalar base name from `prefixedName` and role prefix rules.
- Produces a parallel plan keyed by JsonPath.

4) `RelationalNameOverrideBuilderEnhancer`
- Compares JSON-derived base names to relational base names and creates overrides:
  - Root table: compare `resourceName` to derived relational root name; set `rootTableNameOverride` if different.
  - Array tables: compare JSON-derived suffix vs relational suffix; override on `$.path[*]`.
  - Reference columns: compare JSON-derived base vs relational base; override on the reference object JsonPath (not identity leaf).
  - Scalar columns: compare JSON-derived base vs relational base; override on scalar JsonPath.
- Ignores deterministic conventions that DMS will derive (descriptor `DescriptorId`, schoolYear wrapper flattening).

5) `RelationalMetadataAssemblerEnhancer`
- If no overrides, leave `relational` undefined.
- Otherwise, build `RelationalMetadata` and attach to `EntityApiSchemaData`.
- If only `rootTableNameOverride` is present, omit `nameOverrides`.

## Override Rules and Scenario Coverage
- Scenario 1 (parent-prefix removal) -> array table overrides at `$.collection[*]`.
- Scenario 2 (collision-driven naming) -> array table overrides for decollisioned names.
- Scenario 3 (reference role prefixes) -> reference overrides at `$.xReference`.
- Scenario 4 (role-prefixed scalars in child tables) -> scalar overrides at `$.arr[*].scalar`.
- Scenario 5 and 6 -> no overrides; covered by deterministic DMS derivation and `documentPathsMapping.referenceJsonPaths`.

## Tests
Add unit tests under `packages/metaed-plugin-edfi-api-schema/test/enhancer/relational`, mirroring existing enhancer test patterns:
- One test file per enhancer, named like other enhancer tests (e.g., `RelationalTableNodeEnhancer.test.ts`).
- Use MetaEd builder patterns (`newMetaEdEnvironment`, `MetaEdTextBuilder`, `NamespaceBuilder`, `DomainEntityBuilder`, etc.)
  and the standard prerequisite enhancer chain, as seen in
  `packages/metaed-plugin-edfi-api-schema/test/enhancer/flattening/FlatteningMetadataComprehensive.test.ts`.
- Use `toMatchInlineSnapshot()` for all expected outputs, capturing full objects rather than individual properties.
- Use a consistent set of modeled scenarios across enhancer tests to reduce maintenance and align with current plugin tests.

Suggested enhancer test coverage (each item is its own test file):

1) `RelationalTableNodeEnhancer.test.ts`
- Covers table node extraction and `collectionJsonPath` assignment for:
  - Simple collection property (scenario 1 baseline).
  - Nested collection (scenario 4 baseline).
  - Inline common and choice containers to ensure table-defining properties only.
- Snapshot `entity.data.edfiApiSchema.relationalTableNodes`.

2) `RelationalJsonPathNamingPlanEnhancer.test.ts`
- Covers JSON-derived names:
  - Parent-prefix removal (scenario 1).
  - Decollisioned top-level names (scenario 2).
  - Reference object naming (scenario 3).
- Snapshot the JSON naming plan (`relationalNamingPlan.jsonBaseNames`).

3) `RelationalPhysicalNamingPlanEnhancer.test.ts`
- Covers relational naming conventions:
  - Table suffix derivation (scenario 1).
  - Reference role-prefix behavior (scenario 3).
  - Role-prefixed scalars inside child tables (scenario 4).
- Snapshot the relational naming plan (`relationalNamingPlan.relationalBaseNames`).

4) `RelationalNameOverrideBuilderEnhancer.test.ts`
- Builds overrides from the same scenarios:
  - Table override for prefix removal and decollisioned names (scenarios 1, 2).
  - Reference override for role prefix duplication (scenario 3).
  - Scalar override for role-prefixed columns (scenario 4).
- Snapshot `entity.data.edfiApiSchema.relationalNameOverrides` (or equivalent).

5) `RelationalMetadataAssemblerEnhancer.test.ts`
- Verifies optionality:
  - No overrides → `relational` absent.
  - Root override only → `relational.rootTableNameOverride` present, `nameOverrides` omitted.
  - Name overrides only → `nameOverrides` present, `rootTableNameOverride` omitted.
- Snapshot `entity.data.edfiApiSchema.relational`.

Update integration artifacts and authoritative compare tests for generated `ApiSchema.json` when the new block appears.

## Implementation Plan
1) Model/wiring: add `RelationalMetadata`/`RelationalBaseName`, update `ResourceSchema`, `EntityApiSchemaData` init fields,
   and `ApiSchemaBuildingEnhancer` pass-through; no behavior changes yet.
2) Relational table node pipeline: add relational helpers (property chain + table node + naming conventions), implement
   `RelationalTableNodeEnhancer`, and add `RelationalTableNodeEnhancer.test.ts` with inline snapshots.
3) JSON naming plan: implement `RelationalJsonPathNamingPlanEnhancer` + `RelationalJsonPathNamingPlanEnhancer.test.ts`
   covering scenarios 1-3.
4) Physical naming plan: implement `RelationalPhysicalNamingPlanEnhancer` + `RelationalPhysicalNamingPlanEnhancer.test.ts`
   covering scenarios 1, 3, 4.
5) Overrides: implement `RelationalNameOverrideBuilderEnhancer` + `RelationalNameOverrideBuilderEnhancer.test.ts`
   covering scenarios 1-4.
6) Assemble + wiring: implement `RelationalMetadataAssemblerEnhancer` + `RelationalMetadataAssemblerEnhancer.test.ts`,
   then add enhancers to `EnhancerList` in order.
7) Integration artifacts: update generated ApiSchema artifacts + authoritative compare tests after all enhancers land.
