# Plan: Reduce Handbook HTML File Size

## Context

The `metaed-plugin-edfi-handbook` package generates `Ed-Fi-Data-Handbook-Index.html`, a self-contained Single Page Application. The file size grows with the Ed-Fi data model: all entity data is embedded as a JSON payload injected into `{JSONData}` in the HTML template. A previous commit added basic whitespace minimization (newlines/spaces), but the JSON payload remains unoptimized.

Two classes of waste exist in the JSON:

1. **Unused fields** — several fields are serialized into the JSON but never read by the Alpine.js template
2. **Empty default values** — every entity includes fields like `deprecationText: ""`, `odsFragment: []`, `typeCharacteristics: []` even when empty

## Approach

Two targeted changes, both isolated to the generator file and the HTML template. TypeScript interfaces and enhancers are left unchanged.

### Change 1: Strip unused fields before serialization

In `EdFiDataHandbookAsHtmlIndexGenerator.ts`, add a mapping step before `JSON.stringify` that omits fields the template never reads.

**Unused fields on `HandbookEntry`** (confirmed by grepping the template):

- `entityUuid` — used internally to build `uniqueIdentifier` but not needed in the JSON output
- `repositoryId` — never referenced in template
- `projectName` — never referenced in template
- `modelReferencesContains` — a string array used only for a `.length > 0` guard; the template should use `modelReferencesContainsProperties.length > 0` instead
- `modelReferencesUsedBy` — a string array never referenced in template at all

**Unused fields on `HandbookEntityReferenceProperty`** (confirmed by grepping the template):

- `propertyUuid` — UUID, never referenced
- `targetPropertyId` — UUID, never referenced
- `extensionParentName` — only `extensionParentNamespaceName` is used

UUIDs are 36 chars each; removing `propertyUuid` and `targetPropertyId` from potentially thousands of property rows is a meaningful saving.

### Change 2: Strip empty/default values before serialization

Many entities and properties have large numbers of empty-string and empty-array fields (`""`, `[]`). Adding a recursive `stripEmpty` transform before `JSON.stringify` removes these. The Alpine.js template already guards all conditional fields with `x-if` checks (e.g., `selectedEntity.odsFragment && selectedEntity.odsFragment.length`), so missing keys are handled safely.

Fields commonly empty across the model:

- `deprecationText`, `deprecationReason` — empty for non-deprecated entities
- `odsFragment`, `xsdFragment` — empty for simple types, enumerations, descriptors
- `typeCharacteristics`, `optionList` — empty for most entity types
- `mergeDirectives` — empty for non-merge properties
- `sqlDatatype`, `extensionParentNamespaceName`, `deprecationText` on properties

### Template update (required for Change 1)

In `EdFiDataHandbookAsHtmlSPAIndex.html`, line 607 checks `selectedEntity.modelReferencesContains && selectedEntity.modelReferencesContains.length > 0`. Replace this with `selectedEntity.modelReferencesContainsProperties && selectedEntity.modelReferencesContainsProperties.length > 0` so `modelReferencesContains` can be safely dropped.

## Files to Modify

- `packages/metaed-plugin-edfi-handbook/src/generator/EdFiDataHandbookAsHtmlIndexGenerator.ts`
  Add `stripEntry()` and `stripEmpty()` helper functions; apply them before `JSON.stringify`.

- `packages/metaed-plugin-edfi-handbook/src/generator/template/EdFiDataHandbookAsHtmlSPAIndex.html`
  Update the `modelReferencesContains` length check (line 607) to use `modelReferencesContainsProperties`.

## Implementation Detail

```typescript
// In EdFiDataHandbookAsHtmlIndexGenerator.ts

/** Remove fields unused by the HTML template */
function stripUnusedFields(entry: HandbookEntry): object {
  const { entityUuid, repositoryId, projectName, modelReferencesContains, modelReferencesUsedBy, ...rest } = entry;
  return {
    ...rest,
    modelReferencesContainsProperties: rest.modelReferencesContainsProperties.map(
      ({ propertyUuid, targetPropertyId, extensionParentName, ...prop }) => prop
    ),
  };
}

/** Recursively remove empty strings and empty arrays */
function stripEmpty(value: unknown): unknown {
  if (Array.isArray(value)) {
    const mapped = value.map(stripEmpty).filter((v) => v !== undefined);
    return mapped.length > 0 ? mapped : undefined;
  }
  if (value !== null && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as object)) {
      const stripped = stripEmpty(v);
      if (stripped !== undefined) result[k] = stripped;
    }
    return result;
  }
  if (value === '') return undefined;
  return value;
}
```

Then in `generate()`:

```typescript
const jsonData = allHandbookEntries.map((e) => stripEmpty(stripUnusedFields(e)));
// replace {JSONData} with JSON.stringify(jsonData)
```

Note: `stripEmpty` omits empty strings and empty arrays but preserves `false` booleans (needed for `isIdentity`, `isSensitiveData`, etc.).

## Verification

1. Run `nx test metaed-plugin-edfi-handbook` — existing integration tests will catch regressions in output structure
2. Verify the generated HTML renders correctly in a browser (Student entity loads, filters work, SQL snippets and XSD display for entities that have them, deprecated entities show correctly)
3. Compare output file sizes before and after with a real MetaEd build
