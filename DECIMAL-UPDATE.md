# MetaEd-js ApiSchema update: decimal precision/scale for `currency` + `percent`

## Background / problem

In the Ed-Fi ApiSchema output, MetaEd-js emits `currency` and `percent` properties in `resourceSchema.jsonSchemaForInsert`
as JSON Schema `type: "number"`. Downstream, DMS (and related tooling) treats JSON Schema `number` as a *decimal* and
requires deterministic precision/scale.

Today, MetaEd-js only emits `resourceSchema.decimalPropertyValidationInfos` entries for `decimal` / `sharedDecimal`.
As a result, `currency` and `percent` JSON paths are missing required precision/scale metadata, which causes:

- DMS relational model compilation errors (no `(totalDigits, decimalPlaces)` for some `type: "number"` paths), and
- DMS runtime request behavior drift (those paths are treated as generic numerics rather than decimals for coercion/validation).

This spec defines a MetaEd-js change so ApiSchema is self-contained and does not rely on `flatteningMetadata`
(which is obsolete and will be removed).

## Goals

- Emit `decimalPropertyValidationInfos` entries for all `currency` and `percent` properties.
- Use deterministic, cross-dialect-safe defaults aligned with existing MetaEd/ODS conventions.
- Keep the ApiSchema contract self-contained (no dependency on `flatteningMetadata`).
- Preserve existing behavior for `decimal` / `sharedDecimal` properties.

## Non-goals

- Changing `jsonSchemaForInsert` to use a new JSON Schema type for currency/percent (they remain `type: "number"`).
- Introducing a new ApiSchema metadata section (e.g., `scalarTypesByJsonPath`) as part of this change.
- Changing DMS behavior (this is intended to unblock DMS by improving ApiSchema fidelity).

## Proposed ApiSchema output change

For each resource schema:

- For every MetaEd property of type:
  - `decimal` / `sharedDecimal`: keep current behavior (use the property’s explicit `totalDigits`/`decimalPlaces`).
  - `currency`: add a decimal validation entry using default `(totalDigits, decimalPlaces) = (19, 4)`.
  - `percent`: add a decimal validation entry using default `(totalDigits, decimalPlaces) = (5, 4)`.

Each entry MUST include:

```jsonc
{
  "path": "$.someNumberPath",
  "totalDigits": 19,
  "decimalPlaces": 4
}
```

### Default precision/scale rationale

Defaults should match existing conventions already implied by MetaEd output and ODS mappings:

- `currency` → `DECIMAL(19,4)` (compatible with SQL Server MONEY semantics and common Ed-Fi ODS usage)
- `percent` → `DECIMAL(5,4)` (the plugin’s existing flattening model already documents this mapping)

These defaults provide deterministic storage constraints and align with DMS’ existing “numbers are decimals” rule.

## Implementation details (MetaEd-js)

### Code locations

Primary change:

- `packages/metaed-plugin-edfi-api-schema/src/enhancer/DecimalPropertyValidationInfoEnhancer.ts`

Current implementation only includes:

- `decimal`
- `sharedDecimal`

Update the enhancer to also include:

- `currency` (default precision/scale)
- `percent` (default precision/scale)

Recommended constants (single source of truth in the enhancer module):

- `const CurrencyTotalDigits = 19;`
- `const CurrencyDecimalPlaces = 4;`
- `const PercentTotalDigits = 5;`
- `const PercentDecimalPlaces = 4;`

### De-duplication and determinism

The enhancer currently uses `Set<DecimalPropertyValidationInfo>` which does not de-duplicate object-literals by value.
To guarantee stable output and avoid duplicates, use a `Map<JsonPath, DecimalPropertyValidationInfo>` keyed by `path`.

Ordering should remain stable by sorting by `path` (existing behavior expects sorted output).

### Descriptor handling

Keep existing behavior:

- Descriptors have no decimal properties, so `decimalPropertyValidationInfos = []`.

## Downstream impact (DMS)

This change is compatible with DMS core and should not “break” pipeline usage; it expands coverage:

- `decimalPropertyValidationInfos` is used for:
  - coercing numeric strings to `decimal` (instead of `double`) for listed paths, and
  - validating values against `(totalDigits, decimalPlaces)` constraints.

After this change, `currency` and `percent` request fields will:

- be coerced via decimal parsing, and
- be range-validated by the existing DMS decimal validator.

This may introduce new 400s for out-of-range values (e.g., `percent` > 9.9999), which is consistent with the
database constraint implied by `DECIMAL(5,4)` and should be treated as a correctness improvement.

## Test plan

### Unit tests (plugin)

Update/add tests under:

- `packages/metaed-plugin-edfi-api-schema/test/enhancer/DecimalPropertyValidationInfoEnhancer.test.ts`

Add coverage that:

- a `currency` property produces a `decimalPropertyValidationInfos` entry with `(19,4)`,
- a `percent` property produces a `decimalPropertyValidationInfos` entry with `(5,4)`,
- `decimal` / `sharedDecimal` continue using property-provided digits/places.

### Integration authoritative artifacts

Regenerate and update the authoritative artifacts for affected projects (at least):

- `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-authoritative.json`
- `packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/sample-api-schema-authoritative.json`

Minimum acceptance checks in artifacts:

- `ds-5.2`: resources with currency/percent fields gain the expected `decimalPropertyValidationInfos` entries.
- `sample`: `BusRoute` includes entries for `$.operatingCost` and `$.optimalCapacity` (plus any other currency/percent paths).

Run:

- `npm run test:lint`
- `npx jest packages/metaed-plugin-edfi-api-schema/test/integration/ApiSchemaAuthoritativeCompare_v7_3.test.ts`

## Acceptance criteria

- ApiSchema for `currency` and `percent` properties includes deterministic `(totalDigits, decimalPlaces)` via
  `decimalPropertyValidationInfos` without using `flatteningMetadata`.
- Existing ApiSchema output for `decimal` / `sharedDecimal` remains unchanged (except for sorting/dedup if adjusted).
- Authoritative integration tests pass after updating expected artifacts.

