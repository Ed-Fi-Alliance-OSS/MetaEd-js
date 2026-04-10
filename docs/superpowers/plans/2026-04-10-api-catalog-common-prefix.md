# API Catalog Common Property Name Prefixing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat schema iteration with recursive traversal in `extractPropertyRowsForNamespace` to prefix property names with dot-separated paths reflecting the Common hierarchy (e.g., `address.city`, `internationalAddress.city`).

**Architecture:** Add a recursive helper function `processSchemaProperties` that traverses from the main schema through `$ref` and array items, building a dot-separated prefix path. The helper handles three branches: `$ref` (scalar common or foreign key), array with `$ref` items (array of commons), and scalar properties. Only internal sub-schemas (those present in `allSchemas` and not ending with `_Reference`, `_Readable`, `_Writable`) are recursed.

**Tech Stack:** TypeScript, Jest/snapshot testing, `singularize` utility from `@edfi/metaed-plugin-edfi-api-schema`

---

## Implementation Tasks

### Task 1: Add singularize import and create helper function skeleton

**Files:**
- Modify: `packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts:1-35`

- [ ] **Step 1: Add singularize import**

At the top of ApiCatalogGenerator.ts, after existing imports, add:

```typescript
import { singularize } from '@edfi/metaed-plugin-edfi-api-schema/src/Utility';
```

- [ ] **Step 2: Create helper function skeleton**

Before `extractPropertyRowsForNamespace`, add the skeleton:

```typescript
/**
 * Recursively processes schema properties, building dot-separated path prefixes
 * for properties within commons.
 *
 * @param schema The current schema being processed
 * @param prefix The dot-separated path prefix (empty string for root level)
 * @param allSchemas All schemas in components.schemas (lookup map)
 * @param mainSchemaName The main entity schema name (to avoid recursing into itself)
 * @param rows Array to accumulate PropertyRow objects
 * @param projectEndpointName Project name for the row
 * @param projectVersion Project version for the row
 * @param resourceName Resource name for the row
 */
function processSchemaProperties(
  schema: SchemaObject,
  prefix: string,
  allSchemas: Record<string, ReferenceObject | SchemaObject>,
  mainSchemaName: string,
  rows: PropertyRow[],
  projectEndpointName: string,
  projectVersion: string,
  resourceName: string,
): void {
  // Algorithm will be implemented in subsequent tasks
}
```

- [ ] **Step 3: Verify syntax and no import errors**

Run: `npm run build -w packages/metaed-plugin-edfi-api-catalog`

Expected: Compilation succeeds (function body may be empty, but no syntax errors)

- [ ] **Step 4: Commit**

```bash
cd D:\ed-fi\MetaEd-Js
git add packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts
git commit -m "feat: add singularize import and processSchemaProperties skeleton"
```

---

### Task 2: Implement $ref branch (scalar common and foreign key reference handling)

**Files:**
- Modify: `packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts:processSchemaProperties`
- Modify: `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts`

- [ ] **Step 1: Write test case 7 (scalar common with $ref)**

In the test file, add this fixture and test:

```typescript
describe('extractPropertyRowsForNamespace - scalar common ($ref) handling', () => {
  it('should handle scalar common (direct $ref to internal sub-schema)', () => {
    const fixture: Partial<OpenApiTypes.Document> = {
      components: {
        schemas: {
          EdFi_Contact: {
            properties: {
              contactUniqueId: { type: 'string' },
              homeAddress: { $ref: '#/components/schemas/EdFi_Contact_HomeAddress' },
            },
            required: ['contactUniqueId'],
          } as SchemaObject,
          EdFi_Contact_HomeAddress: {
            properties: {
              streetNumberName: { type: 'string' },
              city: { type: 'string' },
            },
            required: [],
          } as SchemaObject,
        },
      },
    };

    const namespace = createNamespaceWithFixture(fixture);
    const rows = extractPropertyRowsForNamespace(namespace);

    // Should have rows for:
    // 1. contactUniqueId (root property)
    // 2. homeAddress (the $ref itself, as reference type)
    // 3. homeAddress.streetNumberName
    // 4. homeAddress.city
    expect(rows).toHaveLength(4);
    
    const homeAddressRow = rows.find(r => r.propertyName === 'homeAddress' && r.dataType === 'reference');
    expect(homeAddressRow).toBeDefined();
    expect(homeAddressRow?.description).toBe('#/components/schemas/EdFi_Contact_HomeAddress');
    
    const streetRow = rows.find(r => r.propertyName === 'homeAddress.streetNumberName');
    expect(streetRow).toBeDefined();
    expect(streetRow?.dataType).toBe('string');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- --testNamePattern="scalar common"` 

Expected: FAIL - function body empty, no rows generated

- [ ] **Step 3: Implement $ref branch in processSchemaProperties**

Replace the function body with:

```typescript
function processSchemaProperties(
  schema: SchemaObject,
  prefix: string,
  allSchemas: Record<string, ReferenceObject | SchemaObject>,
  mainSchemaName: string,
  rows: PropertyRow[],
  projectEndpointName: string,
  projectVersion: string,
  resourceName: string,
): void {
  const requiredProperties = schema.required ?? [];

  Object.entries(schema.properties ?? {}).forEach(([propertyName, propertyDef]) => {
    // Skip the 'id' property
    if (propertyName === 'id') {
      return;
    }

    const qualifiedName = prefix ? `${prefix}.${propertyName}` : propertyName;

    // ── $ref branch (foreign-key reference OR scalar common) ──
    if ('$ref' in propertyDef) {
      const reference = propertyDef as EdFiSchemaObject & { $ref: string };
      const refSchemaName = reference.$ref.split('/').at(-1) ?? '';

      // Emit row for the $ref itself
      rows.push({
        project: projectEndpointName,
        version: projectVersion,
        resourceName,
        propertyName: qualifiedName,
        description: reference.$ref,
        dataType: 'reference',
        minLength: null,
        maxLength: null,
        validationRegEx: null,
        isIdentityKey: reference['x-Ed-Fi-isIdentity'] === true,
        isNullable: reference['x-nullable'] === true,
        isRequired: requiredProperties.includes(propertyName),
      });

      // If it's an internal sub-schema, recurse to expose its properties
      if (isInternalSubSchema(refSchemaName, allSchemas, mainSchemaName)) {
        const subPrefix = prefix ? `${prefix}.${propertyName}` : propertyName;
        const subSchema = allSchemas[refSchemaName] as SchemaObject;
        processSchemaProperties(
          subSchema,
          subPrefix,
          allSchemas,
          mainSchemaName,
          rows,
          projectEndpointName,
          projectVersion,
          resourceName,
        );
      }
    }
    // More branches will be added in subsequent tasks
  });
}

/**
 * Checks if a schema name refers to an internal sub-schema that should be recursed.
 * All three conditions must be true:
 * 1. Present as a key in allSchemas
 * 2. Does NOT end with _Reference, _Readable, or _Writable
 * 3. Is not the main schema itself
 */
function isInternalSubSchema(
  schemaName: string,
  allSchemas: Record<string, ReferenceObject | SchemaObject>,
  mainSchemaName: string,
): boolean {
  if (!(schemaName in allSchemas)) return false;
  if (schemaName === mainSchemaName) return false;
  if (
    schemaName.endsWith('_Reference') ||
    schemaName.endsWith('_Readable') ||
    schemaName.endsWith('_Writable')
  ) {
    return false;
  }
  return true;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- --testNamePattern="scalar common"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts
git commit -m "feat: implement \$ref branch for scalar common handling"
```

---

### Task 3: Implement array branch (array of commons with singularization)

**Files:**
- Modify: `packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts:processSchemaProperties`
- Modify: `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts`

- [ ] **Step 1: Write test case 1 (single common collection)**

In the test file, add:

```typescript
describe('extractPropertyRowsForNamespace - array branch handling', () => {
  it('should handle single common collection with no role name', () => {
    const fixture: Partial<OpenApiTypes.Document> = {
      components: {
        schemas: {
          EdFi_Contact: {
            properties: {
              id: { type: 'string' },
              contactUniqueId: { type: 'string' },
              addresses: {
                type: 'array',
                items: { $ref: '#/components/schemas/EdFi_Contact_Address' },
              },
            },
            required: ['contactUniqueId', 'addresses'],
          } as SchemaObject,
          EdFi_Contact_Address: {
            properties: {
              city: { type: 'string' },
              state: { type: 'string' },
            },
            required: ['city'],
          } as SchemaObject,
        },
      },
    };

    const namespace = createNamespaceWithFixture(fixture);
    const rows = extractPropertyRowsForNamespace(namespace);

    // Should have rows for:
    // 1. contactUniqueId (scalar property)
    // 2. addresses (array property itself)
    // 3. address.city
    // 4. address.state
    expect(rows).toHaveLength(4);

    const addressesArrayRow = rows.find(r => r.propertyName === 'addresses' && r.dataType === 'array');
    expect(addressesArrayRow).toBeDefined();
    expect(addressesArrayRow?.isRequired).toBe(true);

    const cityRow = rows.find(r => r.propertyName === 'address.city');
    expect(cityRow).toBeDefined();
    expect(cityRow?.dataType).toBe('string');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- --testNamePattern="single common collection"`

Expected: FAIL - no array branch implemented yet

- [ ] **Step 3: Implement array branch in processSchemaProperties**

Add this after the `$ref` branch (before the closing brace of `Object.entries`):

```typescript
    // ── array branch (array with $ref items) ──
    else if (
      propertyDef.type === 'array' &&
      propertyDef.items &&
      '$ref' in propertyDef.items
    ) {
      const arrayProperty = propertyDef as ArraySchemaObject;
      const itemsRef = arrayProperty.items as ReferenceObject;
      const refSchemaName = itemsRef.$ref.split('/').at(-1) ?? '';

      // Emit row for the array property itself
      rows.push({
        project: projectEndpointName,
        version: projectVersion,
        resourceName,
        propertyName: qualifiedName,
        description: itemsRef.$ref,
        dataType: 'array',
        minLength: null,
        maxLength: null,
        validationRegEx: null,
        isIdentityKey: false, // arrays are never identity keys
        isNullable: false, // arrays follow schema convention of not nullable
        isRequired: requiredProperties.includes(propertyName),
      });

      // If it's an internal sub-schema, recurse using singularized property name
      if (isInternalSubSchema(refSchemaName, allSchemas, mainSchemaName)) {
        const singularContext = singularize(propertyName);
        const subPrefix = prefix ? `${prefix}.${singularContext}` : singularContext;
        const subSchema = allSchemas[refSchemaName] as SchemaObject;
        processSchemaProperties(
          subSchema,
          subPrefix,
          allSchemas,
          mainSchemaName,
          rows,
          projectEndpointName,
          projectVersion,
          resourceName,
        );
      }
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- --testNamePattern="single common collection"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts
git commit -m "feat: implement array branch for common array handling with singularization"
```

---

### Task 4: Implement scalar properties branch

**Files:**
- Modify: `packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts:processSchemaProperties`
- Modify: `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts`

- [ ] **Step 1: Write test case 5 (main-schema scalar properties)**

In the test file, add:

```typescript
describe('extractPropertyRowsForNamespace - scalar properties', () => {
  it('should emit main-schema scalar properties without prefix', () => {
    const fixture: Partial<OpenApiTypes.Document> = {
      components: {
        schemas: {
          EdFi_Contact: {
            properties: {
              id: { type: 'string' },
              contactUniqueId: { type: 'string', description: 'Unique identifier' },
              enrollmentCount: { type: 'integer', format: 'int32' },
              isPrimary: { type: 'boolean' },
            },
            required: ['contactUniqueId'],
          } as SchemaObject,
        },
      },
    };

    const namespace = createNamespaceWithFixture(fixture);
    const rows = extractPropertyRowsForNamespace(namespace);

    // Should skip 'id', emit 3 properties
    expect(rows).toHaveLength(3);

    const uniqueIdRow = rows.find(r => r.propertyName === 'contactUniqueId');
    expect(uniqueIdRow).toBeDefined();
    expect(uniqueIdRow?.dataType).toBe('string');
    expect(uniqueIdRow?.description).toBe('Unique identifier');
    expect(uniqueIdRow?.isRequired).toBe(true);

    const countRow = rows.find(r => r.propertyName === 'enrollmentCount');
    expect(countRow).toBeDefined();
    expect(countRow?.dataType).toBe('int32'); // format should override type
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- --testNamePattern="scalar properties"`

Expected: FAIL - scalar branch not implemented

- [ ] **Step 3: Implement scalar branch in processSchemaProperties**

Add this after the array branch (before the closing brace of `Object.entries`):

```typescript
    // ── scalar branch (direct scalar properties and scalar arrays) ──
    else {
      const property = propertyDef as EdFiSchemaObject;
      let dataType: string;

      // Extract data type - use format if present, otherwise use type
      dataType = property.type || 'unknown';
      if (property.format != null) {
        dataType = property.format;
      }

      rows.push({
        project: projectEndpointName,
        version: projectVersion,
        resourceName,
        propertyName: qualifiedName,
        description: property.description || '',
        dataType,
        minLength: property.minLength ?? null,
        maxLength: property.maxLength ?? null,
        validationRegEx: property.pattern ?? null,
        isIdentityKey: property['x-Ed-Fi-isIdentity'] === true,
        isNullable: property['x-nullable'] === true,
        isRequired: requiredProperties.includes(propertyName),
      });
    }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- --testNamePattern="scalar properties"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts
git commit -m "feat: implement scalar properties branch"
```

---

### Task 5: Refactor extractPropertyRowsForNamespace to use the new helper

**Files:**
- Modify: `packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts:extractPropertyRowsForNamespace`

- [ ] **Step 1: Refactor extractPropertyRowsForNamespace to identify main schema and call helper**

Replace the entire function body (lines 48-136 in current code) with:

```typescript
export function extractPropertyRowsForNamespace(namespace: Namespace): PropertyRow[] {
  const rows: PropertyRow[] = [];

  const namespaceData = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;
  if (namespaceData == null || namespaceData.apiSchema == null) {
    return rows;
  }

  const { projectSchema } = namespaceData.apiSchema;
  const { projectEndpointName } = projectSchema;
  const { projectVersion } = projectSchema;

  // Iterate over all resource schemas
  Object.entries(projectSchema.resourceSchemas).forEach(([resourceEndpoint, resourceSchema]: [string, ResourceSchema]) => {
    const resourceName = resourceEndpoint;

    // Find the OpenAPI fragment - prefer 'resources' type, fall back to 'descriptors'
    const openApiFragment = resourceSchema.openApiFragments.resources || resourceSchema.openApiFragments.descriptors;

    if (openApiFragment == null || openApiFragment.components == null || openApiFragment.components.schemas == null) {
      return;
    }

    const { schemas } = openApiFragment.components;

    // ─── Step 1: Identify main schema ───
    // Find a schema without common suffixes like _Reference, _Readable, or _Writable
    // and one that has properties
    const schemaEntries = Object.entries(schemas);
    const mainSchemaEntry = schemaEntries.find(([schemaName, schema]) => {
      const hasCommonSuffix =
        schemaName.endsWith('_Reference') || schemaName.endsWith('_Readable') || schemaName.endsWith('_Writable');
      return !hasCommonSuffix && (schema as SchemaObject).properties != null;
    });

    if (mainSchemaEntry == null) {
      // No main schema found, skip this resource
      return;
    }

    const [mainSchemaName, mainSchema] = mainSchemaEntry;

    // ─── Step 2: Build schema lookup (O(1) access) ───
    const allSchemas = schemas;

    // ─── Step 3: Recursive property walk starting from main schema ───
    // MetaEd does not allow circular Common references, so no visited-set needed.
    processSchemaProperties(
      mainSchema as SchemaObject,
      '', // prefix starts empty at root
      allSchemas,
      mainSchemaName,
      rows,
      projectEndpointName,
      projectVersion,
      resourceName,
    );
  });

  return rows;
}
```

- [ ] **Step 2: Run existing tests to verify no regression**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- extractPropertyRowsForNamespace`

Expected: All existing tests PASS (no snapshot changes expected yet, as existing tests use fixtures without internal sub-schemas)

- [ ] **Step 3: Commit**

```bash
git add packages/metaed-plugin-edfi-api-catalog/src/generator/ApiCatalogGenerator.ts
git commit -m "feat: refactor extractPropertyRowsForNamespace to use recursive helper"
```

---

### Task 6: Add test cases 2, 3, 4 (role-named, nested, and shared nested commons)

**Files:**
- Modify: `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts`

- [ ] **Step 1: Write test case 2 (plain + role-named common collections)**

```typescript
it('should handle plain + role-named common collections', () => {
  const fixture: Partial<OpenApiTypes.Document> = {
    components: {
      schemas: {
        EdFi_Contact: {
          properties: {
            id: { type: 'string' },
            addresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_Contact_Address' },
            },
            internationalAddresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_Contact_InternationalAddress' },
            },
          },
          required: [],
        } as SchemaObject,
        EdFi_Contact_Address: {
          properties: {
            city: { type: 'string' },
          },
          required: [],
        } as SchemaObject,
        EdFi_Contact_InternationalAddress: {
          properties: {
            city: { type: 'string' },
          },
          required: [],
        } as SchemaObject,
      },
    },
  };

  const namespace = createNamespaceWithFixture(fixture);
  const rows = extractPropertyRowsForNamespace(namespace);

  // Should have:
  // 1. addresses (array)
  // 2. address.city
  // 3. internationalAddresses (array)
  // 4. internationalAddress.city
  expect(rows).toHaveLength(4);

  const addressCity = rows.find(r => r.propertyName === 'address.city');
  const intlCity = rows.find(r => r.propertyName === 'internationalAddress.city');

  expect(addressCity).toBeDefined();
  expect(intlCity).toBeDefined();
  
  // No unqualified 'city' property should exist
  const unqualifiedCity = rows.find(r => r.propertyName === 'city');
  expect(unqualifiedCity).toBeUndefined();
});
```

- [ ] **Step 2: Write test case 3 (nested common collection)**

```typescript
it('should emit nested common properties with full path', () => {
  const fixture: Partial<OpenApiTypes.Document> = {
    components: {
      schemas: {
        EdFi_Contact: {
          properties: {
            id: { type: 'string' },
            addresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_Contact_Address' },
            },
          },
          required: [],
        } as SchemaObject,
        EdFi_Contact_Address: {
          properties: {
            city: { type: 'string' },
            periods: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_Contact_Period' },
            },
          },
          required: [],
        } as SchemaObject,
        EdFi_Contact_Period: {
          properties: {
            beginDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
          },
          required: [],
        } as SchemaObject,
      },
    },
  };

  const namespace = createNamespaceWithFixture(fixture);
  const rows = extractPropertyRowsForNamespace(namespace);

  // Should have:
  // 1. addresses (array)
  // 2. address.city
  // 3. address.periods (array)
  // 4. address.period.beginDate
  // 5. address.period.endDate
  expect(rows).toHaveLength(5);

  const periodBeginRow = rows.find(r => r.propertyName === 'address.period.beginDate');
  expect(periodBeginRow).toBeDefined();
  expect(periodBeginRow?.dataType).toBe('date');
});
```

- [ ] **Step 3: Write test case 4 (two role-named commons each with same nested common)**

```typescript
it('should emit shared nested commons under separate paths', () => {
  const fixture: Partial<OpenApiTypes.Document> = {
    components: {
      schemas: {
        EdFi_Contact: {
          properties: {
            id: { type: 'string' },
            addresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_Contact_Address' },
            },
            internationalAddresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_Contact_InternationalAddress' },
            },
          },
          required: [],
        } as SchemaObject,
        EdFi_Contact_Address: {
          properties: {
            city: { type: 'string' },
            periods: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_Contact_Period' },
            },
          },
          required: [],
        } as SchemaObject,
        EdFi_Contact_InternationalAddress: {
          properties: {
            city: { type: 'string' },
            periods: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_Contact_Period' },
            },
          },
          required: [],
        } as SchemaObject,
        EdFi_Contact_Period: {
          properties: {
            beginDate: { type: 'string', format: 'date' },
          },
          required: [],
        } as SchemaObject,
      },
    },
  };

  const namespace = createNamespaceWithFixture(fixture);
  const rows = extractPropertyRowsForNamespace(namespace);

  const addressPeriodBegin = rows.find(r => r.propertyName === 'address.period.beginDate');
  const intlPeriodBegin = rows.find(r => r.propertyName === 'internationalAddress.period.beginDate');

  expect(addressPeriodBegin).toBeDefined();
  expect(intlPeriodBegin).toBeDefined();
  // Two separate rows for same nested schema under different paths
});
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- --testNamePattern="(plain.*role-named|nested|shared nested)"`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts
git commit -m "test: add test cases 2, 3, 4 for rolenamed and nested commons"
```

---

### Task 7: Add test cases 6 and 8 (inherited sub-schema and _Reference schema guard)

**Files:**
- Modify: `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts`

- [ ] **Step 1: Write test case 6 (cross-entity inherited sub-schema)**

```typescript
it('should recurse inherited sub-schema (cross-entity reference)', () => {
  const fixture: Partial<OpenApiTypes.Document> = {
    components: {
      schemas: {
        EdFi_CommunityProvider: {
          properties: {
            id: { type: 'string' },
            addresses: {
              type: 'array',
              items: { $ref: '#/components/schemas/EdFi_EducationOrganization_Address' },
            },
          },
          required: [],
        } as SchemaObject,
        EdFi_EducationOrganization_Address: {
          properties: {
            city: { type: 'string' },
            state: { type: 'string' },
          },
          required: [],
        } as SchemaObject,
      },
    },
  };

  const namespace = createNamespaceWithFixture(fixture);
  const rows = extractPropertyRowsForNamespace(namespace);

  // Should recurse even though EdFi_EducationOrganization_Address
  // doesn't start with EdFi_CommunityProvider_
  // Rows:
  // 1. addresses (array)
  // 2. address.city
  // 3. address.state
  expect(rows).toHaveLength(3);

  const cityRow = rows.find(r => r.propertyName === 'address.city');
  expect(cityRow).toBeDefined();
});
```

- [ ] **Step 2: Write test case 8 (_Reference schema present in allSchemas is NOT recursed)**

```typescript
it('should NOT recurse _Reference schema even if present in allSchemas', () => {
  const fixture: Partial<OpenApiTypes.Document> = {
    components: {
      schemas: {
        EdFi_Contact: {
          properties: {
            id: { type: 'string' },
            studentReference: { $ref: '#/components/schemas/EdFi_Student_Reference' },
          },
          required: [],
        } as SchemaObject,
        EdFi_Student_Reference: {
          properties: {
            studentId: { type: 'string' },
            firstName: { type: 'string' },
          },
          required: [],
        } as SchemaObject,
      },
    },
  };

  const namespace = createNamespaceWithFixture(fixture);
  const rows = extractPropertyRowsForNamespace(namespace);

  // Should have only 1 row: studentReference as reference type
  // NO rows for studentId, firstName (even though EdFi_Student_Reference is in schemas)
  expect(rows).toHaveLength(1);

  const studentRefRow = rows[0];
  expect(studentRefRow.propertyName).toBe('studentReference');
  expect(studentRefRow.dataType).toBe('reference');
  expect(studentRefRow.description).toBe('#/components/schemas/EdFi_Student_Reference');
});
```

- [ ] **Step 3: Run tests to verify they pass**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- --testNamePattern="(inherited.*sub-schema|_Reference)"`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts
git commit -m "test: add test cases 6 and 8 for inherited schemas and _Reference guards"
```

---

### Task 8: Run full test suite, update snapshots, and verify no regressions

**Files:**
- Modify: `packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts` (snapshots only)

- [ ] **Step 1: Run full test suite for the generator**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- ApiCatalogGenerator`

Expected: All tests PASS or snapshots need updating

- [ ] **Step 2: If snapshots changed, review and update them**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- ApiCatalogGenerator -u`

This updates snapshots. Review the changes:

Run: `git diff packages/metaed-plugin-edfi-api-catalog/test/unit/__snapshots__/`

Verify that:
- Old flat-iteration tests now show prefixed property names (e.g., `address.city` instead of `city`)
- All 8 new test cases are captured
- No unexpected rows are missing or extra

- [ ] **Step 3: Verify all tests pass after snapshot update**

Run: `npm test -w packages/metaed-plugin-edfi-api-catalog -- ApiCatalogGenerator`

Expected: PASS

- [ ] **Step 4: Run broader test suite to ensure no cross-plugin regression**

Run: `npm test`

Expected: All tests PASS

- [ ] **Step 5: Final commit**

```bash
git add packages/metaed-plugin-edfi-api-catalog/test/unit/__snapshots__/ packages/metaed-plugin-edfi-api-catalog/test/unit/ApiCatalogGenerator.test.ts
git commit -m "test: update snapshots for prefixed property names and add all 8 test cases"
```

---

## Summary

After completing all tasks:

1. ✅ Helper function `processSchemaProperties` implements recursive schema traversal with three branches ($ref, array, scalar)
2. ✅ Helper correctly identifies internal sub-schemas and avoids recursing into _Reference, _Readable, _Writable schemas
3. ✅ `extractPropertyRowsForNamespace` refactored to identify main schema and call helper
4. ✅ All 8 test cases added and passing
5. ✅ Snapshots updated
6. ✅ No regressions in existing tests
7. ✅ Frequent commits with clear messages

The implementation matches the approved design specification exactly.
