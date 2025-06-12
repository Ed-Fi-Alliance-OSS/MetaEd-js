# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi API Schema Overview

The `metaed-plugin-edfi-api-schema` package is a sophisticated transformation engine that converts MetaEd domain models into comprehensive API specifications for the Ed-Fi ecosystem. It generates JSON Schema definitions, OpenAPI 3.0.0 specifications, security metadata, and authorization pathways that drive the Ed-Fi ODS/API runtime. This plugin represents one of the most complex parts of the MetaEd system, employing advanced algorithms for property flattening, identity resolution, and path mapping.

## Multi-Step Enhancer Pipeline Architecture

### Pipeline Design Philosophy

The plugin implements a **declarative, multi-step processing pipeline** where transformation is broken into discrete, ordered enhancers. This architecture provides clarity, maintainability, and extensibility by ensuring each enhancer has a single responsibility and builds upon previous enhancer results.

### Pipeline Execution Order

Critical architectural principle: **Enhancers must execute in exact order** defined in `src/enhancer/EnhancerList.ts`. Each enhancer assumes specific metadata exists from its predecessors.

### Plugin Dependency Chain

```
metaed-plugin-edfi-unified (reference resolution, merge directives)
  ↓
metaed-plugin-edfi-ods-relational (database mappings)  
  ↓
metaed-plugin-edfi-api-schema (API specifications)
```

### Pipeline Phases

**1. Setup Phase:**
```typescript
// Initialize data structures to prevent null reference issues
namespaceSetupEnhancer,
entityPropertyApiSchemaDataSetupEnhancer, 
entityApiSchemaDataSetupEnhancer
```

**2. Core Mapping Phase:**
```typescript
subclassPropertyNamingCollisionEnhancer,  // Detect JSON naming conflicts
referenceComponentEnhancer,               // Build reference component graph
apiPropertyMappingEnhancer,              // Define API naming conventions
propertyCollectingEnhancer,              // Gather flattened properties
subclassPropertyCollectingEnhancer       // Handle inheritance
```

**3. Entity and Identity Processing:**
```typescript
apiEntityMappingEnhancer,                    // Create API entity mappings
subclassApiEntityMappingEnhancer,           // Handle subclass mappings
mergeCoveringFlattenedIdentityPropertyEnhancer  // Resolve merge directives
```

**4. Schema and Path Generation:**
```typescript
resourceNameEnhancer,                    // Determine API endpoint names
jsonSchemaForInsertEnhancer,            // Generate JSON Schema Draft 2020-12
openApi*Enhancer,                       // Build OpenAPI 3.0.0 components
allJsonPathsMappingEnhancer,            // Create comprehensive path mappings
mergeJsonPathsMappingEnhancer           // Handle merge directive paths
```

**5. Security and Authorization:**
```typescript
// Security enhancers in src/enhancer/security/
namespaceSecurableElementEnhancer,
educationOrganizationSecurableElementEnhancer,
studentSecurableElementEnhancer,
contactSecurableElementEnhancer,
staffSecurableElementEnhancer,
authorizationPathwayEnhancer
```

**6. Final Assembly:**
```typescript
apiSchemaBuildingEnhancer,              // Assemble final API schema
openApiCoreSpecificationEnhancer,       // Complete OpenAPI for core projects
openApiExtensionFragmentEnhancer        // OpenAPI fragments for extensions
```

## Property Flattening and Collection Algorithms

### Property Collection Algorithm

The `propertyCollectingEnhancer` implements sophisticated recursive traversal using `collectApiProperties` from `BasePropertyCollectingEnhancer.ts`:

```typescript
// Recursive property collection algorithm
function collectApiProperties(
  entity: TopLevelEntity,
  propertyModifier: PropertyModifier = newPropertyModifier(),
  visitedEntities: Set<TopLevelEntity> = new Set()
): CollectedProperty[] {
  
  // Handle inlineCommon and choice transparency
  if (property.isInlineCommon || property.isChoice) {
    // Recursively collect child properties with inherited modifiers
    return collectApiProperties(
      property.referencedEntity,
      updatePropertyModifier(propertyModifier, property),
      visitedEntities
    );
  }
  
  // Apply property modifiers (prefixes, optional flags)
  return properties.map(property => ({
    property,
    propertyModifier: mergeModifiers(propertyModifier, property)
  }));
}
```

**Key Characteristics:**
- **Recursive Traversal** - Explores property graphs including nested references
- **Transparency Handling** - InlineCommon and Choice properties "pull up" child properties
- **Property Modifiers** - Tracks inherited characteristics (optional flags, role prefixes)
- **Cycle Detection** - Prevents infinite recursion in circular references

### Identity Flattening Algorithm

Complex entity identities are flattened into scalar properties using `flattenIdentityPropertiesFrom`:

```typescript
// Identity flattening process
function flattenIdentityPropertiesFrom(
  identityProperties: EntityProperty[]
): FlattenedIdentityProperty[] {
  
  return identityProperties.flatMap(property => {
    if (property.isReferential) {
      // Recursively flatten referenced entity's identity
      const referencedIdentities = property.referencedEntity.identityProperties;
      return flattenIdentityPropertiesFrom(referencedIdentities).map(flattened => ({
        ...flattened,
        propertyChain: [property, ...flattened.propertyChain],
        propertyPaths: [property.metaEdName, ...flattened.propertyPaths]
      }));
    } else {
      // Base case: scalar property
      return [{
        property,
        propertyChain: [property],
        propertyPaths: [property.metaEdName]
      }];
    }
  });
}
```

**Example:** `Section` identity includes reference to `CourseOffering` → `School`. Flattening produces `SchoolId` as a flattened identity property with complete property chain and path information.

## JSON Schema and OpenAPI Specification Creation

### JSON Schema Generation

The `JsonSchemaForInsertEnhancer` generates JSON Schema Draft 2020-12 for resource request bodies:

```typescript
// JSON Schema generation pattern
function generateJsonSchema(entity: TopLevelEntity): SchemaRoot {
  const properties: Record<string, Schema> = {};
  
  entity.data.edfiApiSchema.collectedApiProperties.forEach(collectedProperty => {
    const { property, propertyModifier } = collectedProperty;
    const propertyName = getApiPropertyName(property, propertyModifier);
    
    properties[propertyName] = schemaPropertyFor(property, propertyModifier);
  });
  
  return {
    type: 'object',
    properties,
    required: getRequiredProperties(entity),
    additionalProperties: false
  };
}
```

**Schema Property Types:**
- **Scalars** - Direct mapping (`string`, `integer`, `boolean`) with constraints
- **Collections** - Wrapped in `SchemaArray` with `type: 'array'`
- **References** - Object containing flattened identity properties of referenced entity

### OpenAPI Specification Creation

Multi-stage process creating comprehensive OpenAPI 3.0.0 specifications:

**1. Component Generation:**
- `OpenApiReferenceComponentEnhancer` - Reference objects (e.g., `EdFi_School_Reference`)
- `OpenApiRequestBodyComponentEnhancer` - Main resource schemas (e.g., `EdFi_School`)
- `OpenApiRequestBodyCollectionComponentEnhancer` - Collection item schemas

**2. Final Assembly:**
- `OpenApiCoreSpecificationEnhancer` - Complete OpenAPI documents for data standards
- `OpenApiExtensionFragmentEnhancer` - Extension fragments for runtime merging

**Generated OpenAPI Structure:**
```typescript
interface OpenApiDocument {
  openapi: "3.0.0";
  info: InfoObject;
  paths: PathsObject;           // GET, POST, PUT, DELETE for each resource
  components: {
    schemas: ComponentSchemas;   // All schema components
  };
  tags: TagObject[];           // Resource groupings
}
```

## Security Model and Authorization Pathways

### Securable Elements Architecture

The security model identifies JSON paths to key identifiers used for authorization:

**Security Types:**
- **Namespace** - Data ownership via namespace URIs
- **EducationOrganization** - Hierarchical organization security via EducationOrganizationId
- **Student** - Student data privacy via StudentUniqueId  
- **Contact** - Contact information security via ContactUniqueId
- **Staff** - Staff data access via StaffUniqueId

**Implementation Pattern:**
```typescript
// Security element detection pattern
function findSecurableElements(
  entity: TopLevelEntity,
  securityType: SecurityType
): SecurityElement[] {
  
  const securableElements: SecurityElement[] = [];
  
  entity.data.edfiApiSchema.identityFullnames.forEach(identityName => {
    if (matchesSecurityPattern(identityName, securityType)) {
      const jsonPath = entity.data.edfiApiSchema.allJsonPathsMapping[identityName];
      securableElements.push({
        jsonPath,
        securityType,
        // ... additional metadata
      });
    }
  });
  
  return securableElements;
}
```

### Authorization Pathways

The `AuthorizationPathwayEnhancer` hardcodes specific authorization pathway names onto key associations:

```typescript
// Authorization pathway assignment
const authorizationPathways = {
  'StudentSchoolAssociation': ['StudentSchoolAssociationAuthorization'],
  'StaffEducationOrganizationAssociation': ['StaffEducationOrganizationAssociationAuthorization'],
  // ... other critical associations
};
```

**Purpose:** Tells runtime API which associations directly link entities for authorization (e.g., Student to EducationOrganization).

## Identity Property Handling and JSON Path Mapping

### Identity Processing Pipeline

```typescript
// Complete identity processing flow
1. collectAllIdentityPropertiesFor()    // Gather all identity properties
2. flattenIdentityPropertiesFrom()      // Flatten to scalar properties  
3. IdentityFullnameEnhancer             // Generate correctly prefixed fullnames
4. IdentityJsonPathsEnhancer            // Map fullnames to JSON paths
```

### JSON Path Mapping Algorithm

The `AllJsonPathsMappingEnhancer` creates comprehensive bidirectional mapping:

```typescript
// JSON path mapping core algorithm
function jsonPathsFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  jsonPathPrefix: string = '$'
): JsonPathsMapping {
  
  const propertyName = getApiPropertyName(property, propertyModifier);
  const currentPath = `${jsonPathPrefix}.${propertyName}`;
  
  if (property.isSimple) {
    return { [property.fullMetaEdName]: currentPath };
  }
  
  if (property.isReferential) {
    // Flatten referenced entity's identity
    const referencedIdentity = flattenIdentityPropertiesFrom(
      property.referencedEntity.identityProperties
    );
    
    return referencedIdentity.reduce((mapping, flattened) => {
      const fullPath = `${property.fullMetaEdName}.${flattened.propertyPaths.join('.')}`;
      const jsonPath = `${currentPath}.${getJsonPropertyName(flattened)}`;
      return { ...mapping, [fullPath]: jsonPath };
    }, {});
  }
  
  // Handle collections, extensions, etc.
}
```

**Key Features:**
- **Recursive Traversal** - Handles nested property structures
- **Naming Conventions** - Applies camelCase, pluralization, suffix rules
- **Collection Support** - Adds `[*]` JSONPath operators for arrays
- **Reference Flattening** - Expands references to identity properties
- **Extension Handling** - Nests extensions under `_ext.extensionName`

## API Entity and Property Mapping Strategies

### Property Mapping Rules

**Naming Conventions (`ApiPropertyMappingEnhancer`):**
```typescript
// API naming strategy
const apiNaming = {
  propertyName: uncapitalize(property.metaEdName),           // camelCase
  collectionName: pluralize(uncapitalize(property.metaEdName)), // pluralized
  referenceNames: `${uncapitalize(property.metaEdName)}Reference`, // suffixed
  descriptorNames: `${uncapitalize(property.metaEdName)}Descriptor` // suffixed
};
```

**Prefix Removal Strategy:**
```typescript
// Remove redundant prefixes for readability
function parentPrefixRemovalConvention(
  property: EntityProperty,
  parentEntity: TopLevelEntity
): string {
  
  const propertyName = property.metaEdName;
  const parentPrefix = parentEntity.metaEdName;
  
  // Remove parent prefix if property name starts with it
  if (propertyName.startsWith(parentPrefix)) {
    return propertyName.substring(parentPrefix.length);
  }
  
  return propertyName;
}
```

**Example:** `AssessmentIdentificationCode` on `Assessment` → `identificationCodes`

### Entity Mapping Process

**ApiEntityMapping Creation:**
```typescript
interface ApiEntityMapping {
  flattenedIdentityProperties: FlattenedIdentityProperty[];
  referenceGroups: ReferenceGroup[];
  superClass?: TopLevelEntity;
  // ... additional metadata
}
```

## Subclass Handling and Naming Collision Resolution

### Subclass Property Aggregation

**Property Collection Strategy:**
```typescript
// SubclassPropertyCollectingEnhancer pattern
function collectSubclassProperties(subclass: TopLevelEntity): CollectedProperty[] {
  const subclassProperties = collectApiProperties(subclass);
  const superclassProperties = collectApiProperties(subclass.baseEntity);
  
  // Exclude superclass properties that have been renamed by subclass
  const nonConflictingSuperclassProperties = superclassProperties.filter(
    superProp => !hasRenamedProperty(subclass, superProp.property)
  );
  
  return [...subclassProperties, ...nonConflictingSuperclassProperties];
}
```

### Naming Collision Resolution

**Problem:** Superclass and subclass collections that would shorten to same name.
**Example:** `EducationOrganizationCategories` and `SchoolCategories` both → `categories`

**Solution (`SubclassPropertyNamingCollisionEnhancer`):**
```typescript
function detectNamingCollisions(subclass: TopLevelEntity): CollisionResult {
  const superclassCollections = findPrefixedCollections(subclass.baseEntity);
  const subclassCollections = findCollections(subclass);
  
  superclassCollections.forEach(superProp => {
    const suffix = removePrefixFromName(superProp.metaEdName, subclass.baseEntity.metaEdName);
    
    subclassCollections.forEach(subProp => {
      if (subProp.metaEdName.endsWith(suffix)) {
        // Mark both properties with collision flag
        markCollision(superProp, subProp);
      }
    });
  });
}
```

**Resolution (`topLevelApiNameOnEntity`):**
```typescript
function getApiPropertyName(property: EntityProperty): string {
  if (property.data.edfiApiSchema.hasNamingCollision) {
    return property.data.edfiApiSchema.decollisionedTopLevelName; // Keep prefix
  }
  return property.data.edfiApiSchema.topLevelName; // Remove prefix
}
```

**Result:** `educationOrganizationCategories` and `schoolCategories` (collision avoided)

## Integration Testing and Authoritative Comparison

### Golden File Testing Strategy

The plugin employs comprehensive integration testing using "authoritative comparison":

```typescript
// Integration test pattern
describe('API Schema Generation v7.1', () => {
  it('should match authoritative ApiSchema.json', async () => {
    // 1. Run complete MetaEd pipeline
    const state = await buildCompleteApiSchema('@edfi/ed-fi-model-5.1');
    
    // 2. Generate ApiSchema.json artifact
    const generatedSchema = await generateApiSchema(state);
    
    // 3. Compare against checked-in authoritative version
    const authoritativeSchema = readAuthoritativeSchema('v7.1');
    const gitDiff = execSync(`git diff --no-index ${authoritativeSchema} ${generatedSchema}`);
    
    // 4. Assert no differences
    expect(gitDiff.toString()).toBe('');
  });
});
```

**Test Structure:**
- `ApiSchemaAuthoritativeCompare_v7_1.test.ts` - Ed-Fi Data Standard 5.1
- `ApiSchemaAuthoritativeCompare_v7_2.test.ts` - Ed-Fi Data Standard 5.2  
- `ApiSchemaAuthoritativeCompare_v7_3.test.ts` - Ed-Fi Data Standard 5.3

**Benefits:**
- **Comprehensive Regression Testing** - Catches any unintended changes
- **Multi-Version Support** - Validates compatibility across data standard versions
- **Living Documentation** - Authoritative files serve as expected output examples
- **Full Pipeline Validation** - Tests complete transformation including all dependencies

## Data Model Structures and Type Definitions

### Intermediate Processing Models

**EntityApiSchemaData (Primary Processing Container):**
```typescript
interface EntityApiSchemaData {
  apiMapping: ApiEntityMapping;                    // Core API shape metadata
  collectedApiProperties: CollectedProperty[];     // Flattened property list
  allJsonPathsMapping: JsonPathsMapping;          // MetaEd path → JSON path mapping
  identityFullnames: string[];                    // Processed identity property names
  identityJsonPaths: string[];                    // JSON paths for identity properties
  securableElements: SecurityElement[];           // Security configuration  
  authorizationPathways: AuthorizationPathway[];  // Authorization metadata
  jsonSchemaForInsert: JsonSchema;               // Generated JSON Schema
  openApiRequestBodyComponent: OpenApiComponent;  // OpenAPI request body schema
  // ... additional processing metadata
}
```

**Supporting Processing Models:**
```typescript
interface CollectedProperty {
  property: EntityProperty;
  propertyModifier: PropertyModifier;  // Inherited characteristics (optional flags, prefixes)
}

interface FlattenedIdentityProperty {
  property: EntityProperty;            // Final scalar property
  propertyChain: EntityProperty[];     // Complete property traversal path
  propertyPaths: string[];            // Dot-notation path components
}

interface JsonPathsMapping {
  [metaEdPropertyPath: string]: string; // MetaEd path → JSONPath mapping
}
```

### Final Output Models

**ApiSchema (Root Output Structure):**
```typescript
interface ApiSchema {
  projectSchemas: Record<string, ProjectSchema>;  // Per-project schemas
  // ... global metadata
}

interface ProjectSchema {
  projectName: string;
  resourceSchemas: Record<string, ResourceSchema>; // Per-resource schemas
  isExtensionProject: boolean;
  // ... project metadata
}

interface ResourceSchema {
  jsonSchemaForInsert: JsonSchema;                // JSON Schema Draft 2020-12
  identityJsonPaths: string[];                   // Identity property JSON paths
  documentPathsMapping: DocumentPathsMapping;    // Public path mappings
  queryFieldMapping: QueryFieldMapping;          // Query parameter mappings
  securableElements: SecurityElement[];          // Security configuration
  authorizationPathways: AuthorizationPathway[]; // Authorization metadata
  // ... additional resource metadata
}
```

## Performance Optimizations and Build-Time Caching

### Build-Time Pre-Calculation Strategy

**Primary Performance Principle:** Perform complex computation once at build time, cache results for runtime.

**ApiSchema.json as Comprehensive Cache:**
- **Resolved JSON Schemas** - No runtime schema generation
- **Complete OpenAPI Specifications** - Ready for API documentation
- **Pre-calculated JSON Paths** - Eliminates runtime path resolution
- **Flattened Identity Properties** - No runtime identity traversal
- **Security Metadata** - Pre-identified authorization pathways

**Runtime Performance Benefits:**
```typescript
// Runtime API can directly use pre-calculated data:
const resourceSchema = apiSchema.projectSchemas['EdFi'].resourceSchemas['School'];
const identityPaths = resourceSchema.identityJsonPaths;  // Pre-calculated
const jsonSchema = resourceSchema.jsonSchemaForInsert;   // Pre-generated
```

### Performance Constraints

**Array Nesting Limitation (`hasAtMostTwoArrayLevels`):**
```typescript
// Prevents deeply nested arrays that cause database performance issues
function validateArrayNesting(jsonPath: string): void {
  const arrayCount = (jsonPath.match(/\[\*\]/g) || []).length;
  if (arrayCount > 2) {
    throw new Error(`JSON path ${jsonPath} exceeds maximum array nesting depth`);
  }
}
```

**Rationale:** Deeply nested arrays (`[*][*][*]`) cause performance issues in:
- Database query generation
- JSON validation processing  
- API response serialization

## Development Patterns

### Adding New Enhancers

1. **Determine Correct Pipeline Position** - Review `EnhancerList.ts` execution order
2. **Create Enhancer File** - Follow naming convention `[Purpose]Enhancer.ts`
3. **Implement Enhancement Logic** - Follow established patterns for data modification
4. **Add to Pipeline** - Insert in correct position in `enhancerList()`
5. **Write Tests** - Unit tests for logic, integration tests for pipeline effects

### Property Mapping Modifications

1. **Update Flattening Algorithm** - Modify `collectApiProperties` logic
2. **Adjust Naming Conventions** - Update `ApiPropertyMappingEnhancer`
3. **Validate Path Mappings** - Ensure `AllJsonPathsMappingEnhancer` compatibility
4. **Test Across Data Standards** - Run integration tests for all supported versions

### Security Rule Changes

1. **Modify Security Enhancers** - Update detection logic in `src/enhancer/security/`
2. **Update Authorization Pathways** - Modify `AuthorizationPathwayEnhancer` assignments
3. **Validate Security Metadata** - Ensure proper securable element identification
4. **Test Authorization Scenarios** - Verify correct pathway assignment

## Architecture Strengths

1. **Multi-Step Pipeline** - Clear separation of concerns with ordered execution
2. **Property Flattening** - Sophisticated algorithms handle complex nested structures  
3. **Build-Time Optimization** - Pre-calculation eliminates runtime complexity
4. **Comprehensive Testing** - Golden file testing prevents regressions
5. **Security Integration** - First-class authorization pathway support
6. **Standards Compliance** - Generates valid JSON Schema Draft 2020-12 and OpenAPI 3.0.0
7. **Extension Support** - Robust handling of Ed-Fi extension model

This plugin represents one of the most sophisticated parts of the MetaEd ecosystem, successfully transforming complex domain models into production-ready API specifications while maintaining performance and extensibility.