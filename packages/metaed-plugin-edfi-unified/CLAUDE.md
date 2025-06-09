# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi Unified Overview

The `metaed-plugin-edfi-unified` package is the **foundational plugin** for the MetaEd ecosystem when working with the Ed-Fi Data Standard. It serves as the critical first processing layer that validates the parsed MetaEd model against Ed-Fi semantic rules and enhances it into a rich, fully-connected object graph. This plugin does not generate code but provides the essential infrastructure that all other Ed-Fi plugins depend on.

## Plugin Architecture and Foundational Role

### Core Plugin Interface

```typescript
// src/index.ts
export function initialize(): MetaEdPlugin {
  return { 
    validator: validatorList(),   // ~80 validation functions
    enhancer: enhancerList(),     // ~20+ enhancement functions
    generator: [],                // No artifact generation
    shortName: 'edfiUnified'      // Data namespace identifier
  };
}
```

### Architectural Role

**Processor Plugin Pattern:**
- **Primary Purpose** - Process and prepare the AST into a navigable object graph
- **Foundational Layer** - Establishes baseline integrity and structure for Ed-Fi models
- **Dependency Root** - All other Ed-Fi plugins rely on this plugin's enhanced model
- **Data Namespacing** - All enhanced data stored under `entity.data.edfiUnified`

**Key Responsibilities:**
1. **Semantic Validation** - Enforce Ed-Fi rules not expressible in DSL grammar
2. **Reference Resolution** - Link all entity and property references across namespaces  
3. **Relationship Building** - Construct inheritance hierarchies and composition relationships
4. **Path Pre-computation** - Build navigable reference paths for downstream tools
5. **Model Enhancement** - Flatten shared types and resolve merge directives

## Validator Implementation and Rule Categories

### Validator Pattern

All validators follow a consistent functional pattern:

```typescript
// Pattern: src/validator/[EntityType]/[RuleName].ts
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  
  // Iterate through entities and check rule conditions
  entities.forEach((entity) => {
    if (ruleViolation) {
      failures.push({
        validationFailureId: 'MEV###',  // Unique identifier
        message: 'Descriptive error message',
        elementName: entity.metaEdName,
        sourceFileLine: entity.sourceMap?.sourceFileLine,
        // ... additional context
      });
    }
  });
  
  return failures;
}
```

### Rule Categories and Organization

**Directory Structure by Entity Type:**
- `src/validator/AbstractEntity/` - Abstract entity rules
- `src/validator/Association/` - Association relationship rules  
- `src/validator/AssociationProperty/` - Association property rules
- `src/validator/DomainEntity/` - Domain entity rules
- `src/validator/Common/` - Common type rules
- `src/validator/Descriptor/` - Descriptor vocabulary rules
- `src/validator/CrossEntity/` - Multi-entity rules

**Key Rule Categories:**

**1. Identity & Uniqueness Rules:**
- `AbstractEntityMustContainAnIdentity` - Abstract entities require identity properties
- `DomainEntityMustContainAnIdentity` - Domain entities require identity properties
- `MostEntitiesCannotHaveSameName` - Prevent naming conflicts within scope
- `DescriptorNamesMustBeUnique` - Descriptor names unique within namespace

**2. Reference Integrity Rules:**
- `AssociationPropertyMustMatchAnAssociation` - Association properties reference valid associations
- `DomainEntityPropertyMustMatchADomainEntity` - Domain entity properties reference valid entities
- `PropertiesMustReferToValidNamespace` - Cross-namespace references must be valid
- `CommonPropertyMustMatchACommon` - Common properties reference valid common types

**3. Inheritance & Extension Rules:**
- `AbstractEntityMustNotBeExtended` - Abstract entities cannot be extended directly
- `AssociationExtensionMustNotBeInSameNamespaceAsBase` - Extensions must be in different namespaces
- `DomainEntitySubclassMustNotRedeclareProperties` - Subclasses cannot redeclare parent properties
- `AssociationExtensionMustNotRedeclareProperties` - Extensions cannot redeclare base properties

**4. Property Constraint Rules:**
- `DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits` - Decimal scale validation
- `StringPropertyMinLengthMustNotBeGreaterThanMaxLength` - String length validation
- `IntegerPropertyMinValueMustNotBeGreaterThanMaxValue` - Integer range validation
- `SharedDecimalPropertyMustMatchASharedDecimal` - Shared type reference validation

**5. Cross-Cutting Rules:**
- `NamespacesNamesMustNotHaveOnlyDifferentCasing` - Case-insensitive namespace uniqueness
- `EnumerationExistsOnlyInCoreNamespace` - Enumerations restricted to core namespace
- `CommonExtensionExistsOnlyInExtensionNamespace` - Common extensions namespace restrictions

## Enhancer System and Reference Resolution

### Enhancer Pattern

Enhancers modify the MetaEdEnvironment in-place, adding computed properties under the `data.edfiUnified` namespace:

```typescript
// Pattern: src/enhancer/[Category]/[EnhancerName].ts
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Process entities and add computed properties
  entities.forEach((entity) => {
    entity.data.edfiUnified = {
      ...entity.data.edfiUnified,
      computedProperty: deriveValue(entity, metaEd)
    };
  });
  
  return { enhancerName: 'EnhancerName', success: true };
}
```

### Reference Resolution Architecture

**Core Utility: `getEntityFromNamespaceChain`**
- Searches current namespace first
- Falls back to dependency namespaces in dependency order
- Handles cross-namespace references correctly
- Supports multi-namespace extension scenarios

**Base Class/Extension Linking:**

```typescript
// src/enhancer/DomainEntitySubclassBaseClassEnhancer.ts
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass').forEach((childEntity) => {
    const baseEntity = getEntityFromNamespaceChain(
      metaEd, childEntity.namespaceName, childEntity.baseEntityName, 'domainEntity'
    );
    
    if (baseEntity) {
      childEntity.baseEntity = baseEntity;              // Forward link
      baseEntity.subclassedBy.push(childEntity);        // Back link
    }
  });
}
```

**Property-to-Entity Linking:**

```typescript
// src/enhancer/property/DomainEntityReferenceEnhancer.ts  
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllPropertiesOfType(metaEd, 'domainEntityProperty').forEach((property) => {
    const referencedEntity = getEntityFromNamespaceChain(/*...*/);
    
    if (referencedEntity) {
      property.referencedEntity = referencedEntity;              // Forward reference
      referencedEntity.inReferences.push(property);             // Back reference
      property.parentEntity.outReferences.push(property);       // Parent reference
    }
  });
}
```

### Key Enhancer Categories

**1. Base Class Enhancers:**
- `AssociationExtensionBaseClassEnhancer` - Link association extensions to base associations
- `DomainEntitySubclassBaseClassEnhancer` - Link entity subclasses to base entities  
- `CommonExtensionBaseClassEnhancer` - Link common extensions to base common types
- `InterchangeExtensionBaseClassEnhancer` - Link interchange extensions to base interchanges

**2. Property Reference Enhancers:**
- `AssociationReferenceEnhancer` - Resolve association property references
- `DomainEntityReferenceEnhancer` - Resolve domain entity property references
- `CommonReferenceEnhancer` - Resolve common property references
- `DescriptorReferenceEnhancer` - Resolve descriptor property references
- `EnumerationReferenceEnhancer` - Resolve enumeration property references

**3. Shared Type Enhancers:**
- `SharedDecimalPropertyEnhancer` - Flatten decimal type constraints to properties
- `SharedIntegerPropertyEnhancer` - Flatten integer type constraints to properties
- `SharedStringPropertyEnhancer` - Flatten string type constraints to properties

**4. Path and Relationship Enhancers:**
- `OutReferencePathEnhancer` - Pre-compute all reference paths through model
- `MergeDirectiveEnhancer` - Resolve merge directive property relationships
- `InheritedDocumentationCopyingEnhancer` - Copy documentation from referenced entities

## Diminisher Functionality and Special Cases

### Diminisher Pattern

Diminishers are specialized enhancers that modify the model to handle special cases or work around DSL limitations:

```typescript
// src/diminisher/AbstractGeneralStudentProgramAssociationDiminisher.ts
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const association = getEntityFromNamespaceChain(
    metaEd, 'EdFi', 'GeneralStudentProgramAssociation', 'association'
  );
  
  // Force association to be abstract (workaround for DSL limitation)
  if (association != null) {
    association.isAbstract = true;
  }
}
```

**Architectural Significance:**
- **Escape Hatch** - Allows programmatic model patches during build process
- **DSL Limitations** - Works around missing keywords or constructs in MetaEd language
- **Trade-off** - Model truth partially resides in plugin code rather than source files
- **Special Cases** - Handles Ed-Fi-specific rules that don't fit standard patterns

## Entity Relationship Building and Cross-References

### Relationship Types Built

**1. Inheritance Relationships ("is-a"):**
- `baseEntity` property on child entities
- `subclassedBy` array on parent entities  
- `extendedBy` array on extended entities
- Enables polymorphic processing and inheritance chains

**2. Composition Relationships ("has-a"):**
- `referencedEntity` property on referential properties
- `inReferences` array on referenced entities
- `outReferences` array on referencing entities
- Enables bidirectional navigation of relationships

**3. Path Pre-computation:**

```typescript
// src/enhancer/OutReferencePathEnhancer.ts
// Builds all possible reference paths from any entity to any other
// Starting from leaf entities (no outgoing references)
// Recursively walks backwards up inReferences chain
// Caches paths for performance optimization
```

**4. Merge Directive Relationships:**
- Logical equivalences between properties
- Foreign key unification for physical model
- `mergeSourcedBy` and `mergeTargetedBy` back-references

### Reference Path Algorithm

The `OutReferencePathEnhancer` implements a sophisticated graph traversal:

1. **Identify Leaf Entities** - Entities with no outgoing references
2. **Recursive Path Building** - Walk backwards through `inReferences` 
3. **Path Caching** - Store all computed paths for performance
4. **Cycle Detection** - Handle circular references gracefully
5. **Path Optimization** - Eliminate redundant or invalid paths

## Namespace and Dependency Management

### Multi-Namespace Architecture

**Namespace Types:**
- **Core Namespace** - "EdFi" contains base data standard
- **Extension Namespaces** - Extend core with additional entities/properties  
- **Profile Namespaces** - Subset/restrict core for specific use cases

**Dependency Chain:**
```
Extension Namespace → Core Namespace (EdFi)
```

**Cross-Namespace Resolution:**

```typescript
// Always uses getEntityFromNamespaceChain for resolution
const referencedEntity = getEntityFromNamespaceChain(
  metaEd,                    // MetaEdEnvironment
  currentNamespaceName,      // Starting namespace
  entityName,               // Target entity name
  entityType               // Target entity type
);
```

**Validation Rules:**
- `AssociationExtensionMustNotBeInSameNamespaceAsBase` - Enforce extension namespace separation
- `PropertiesMustReferToValidNamespace` - Validate cross-namespace references
- `CommonExtensionExistsOnlyInExtensionNamespace` - Restrict extension placement

### Dependency Processing

**Namespace Initialization Order:**
1. Core namespace (EdFi) processed first
2. Extension namespaces processed in dependency order
3. Reference resolution respects dependency chain
4. Validation occurs after all namespaces loaded

## Property Enhancement and Shared Type Handling

### Shared Type Flattening

Shared types define reusable constraints that are "flattened" onto properties:

```typescript
// src/enhancer/SharedDecimalPropertyEnhancer.ts
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Find all properties that reference shared decimal types
  getAllPropertiesOfType(metaEd, 'sharedDecimalProperty').forEach((property) => {
    const sharedDecimal = property.referencedEntity as SharedDecimal;
    
    // Flatten shared type attributes onto property
    property.totalDigits = sharedDecimal.totalDigits;
    property.decimalPlaces = sharedDecimal.decimalPlaces;
    property.minValue = sharedDecimal.minValue;
    property.maxValue = sharedDecimal.maxValue;
  });
}
```

**Benefits of Flattening:**
- **Simplified Access** - Generators don't need secondary lookups
- **Denormalized Data** - All constraints available directly on property
- **Performance** - Eliminates need for runtime resolution
- **Consistency** - Standard pattern across all shared types

### Shared Type Categories

**1. SharedDecimal:**
- `totalDigits` - Maximum number of digits
- `decimalPlaces` - Number of digits after decimal point  
- `minValue` / `maxValue` - Value range constraints

**2. SharedInteger:**
- `minValue` / `maxValue` - Value range constraints

**3. SharedString:**
- `minLength` / `maxLength` - Length constraints

## Merge Directive Processing

### Merge Directive Purpose

Merge directives declare logical equivalences between properties, primarily for foreign key unification:

```metaed
domain entity Student {
  documentation "Student entity"
  domain entity property School
  domain entity property EducationOrganization
  
  merge EducationOrganization.EducationOrganizationId with School.EducationOrganizationId
}
```

### Implementation Algorithm

```typescript
// src/enhancer/MergeDirectiveEnhancer.ts
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  entities.forEach((entity) => {
    entity.mergeDirectives.forEach((directive) => {
      // Parse source and target paths (e.g., "School.EducationOrganizationId")
      const sourceProperty = findProperty(entity, directive.sourcePropertyPath);
      const targetProperty = findProperty(entity, directive.targetPropertyPath);
      
      // Populate resolved references
      directive.sourceProperty = sourceProperty;
      directive.targetProperty = targetProperty;
      
      // Add back-references for bidirectional navigation
      sourceProperty.mergeSourcedBy.push(directive);
      targetProperty.mergeTargetedBy.push(directive);
    });
  });
}
```

### Path Resolution Algorithm

The `findProperty` function implements recursive path traversal:

1. **Parse Path Components** - Split on '.' (e.g., ["School", "EducationOrganizationId"])
2. **Navigate Object Graph** - Follow property references step by step
3. **Handle Collections** - Support array and collection properties
4. **Resolve References** - Use `referencedEntity` to traverse entity boundaries
5. **Return Target Property** - Final property in the path chain

## Testing Infrastructure and Patterns

### MetaEdTextBuilder Pattern

The testing infrastructure uses a fluent API for creating test models:

```typescript
// Example test setup
describe('when validating domain entity identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  
  beforeAll(() => {
    const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('Student')
      .withDocumentation('Student entity')
      .withIntegerIdentity('StudentUniqueId', 'Student unique identifier')
      .withStringProperty('FirstName', 'Student first name', true, false, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));
      
    // Run enhancers in dependency order
    domainEntityReferenceEnhancer(metaEd);
    // ... other enhancers
  });
  
  it('should pass validation', () => {
    const failures = validate(metaEd);
    expect(failures).toHaveLength(0);
  });
});
```

### Test Organization Patterns

**1. Unit Testing:**
- One test file per validator/enhancer
- Focused scenarios with minimal setup
- Positive and negative test cases
- Snapshot testing for error messages

**2. Integration Testing:**
- Multi-namespace scenarios in `test/multi-namespace/`
- Complex entity relationship scenarios
- Cross-plugin integration validation
- End-to-end pipeline testing

**3. Test Utilities:**
- `MetaEdTextBuilder` for fluent model construction
- Helper functions for entity retrieval
- Consistent setup patterns across tests
- Reusable test data builders

### Testing Best Practices

**Setup Patterns:**
```typescript
// Standard test setup
const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
const failures: ValidationFailure[] = [];

// Use builders to populate environment  
.sendToListener(new NamespaceBuilder(metaEd, failures))
.sendToListener(new DomainEntityBuilder(metaEd, failures));

// Run prerequisite enhancers
prerequisiteEnhancer(metaEd);

// Test the target validator/enhancer
const result = targetValidator(metaEd);
```

**Assertion Patterns:**
```typescript
// Validator testing
expect(failures).toHaveLength(1);
expect(failures[0].message).toContain('expected error text');

// Enhancer testing  
expect(entity.data.edfiUnified.computedProperty).toBe(expectedValue);
expect(entity.referencedEntity).toBe(expectedReferencedEntity);
```

## Integration with Other Plugins

### Plugin Dependency Chain

```
metaed-plugin-edfi-unified (foundation)
  ↓
metaed-plugin-edfi-ods-relational (database mappings)
  ↓  
metaed-plugin-edfi-api-schema (API schemas)
  ↓
metaed-plugin-edfi-ods-postgresql (PostgreSQL generation)
```

### Enhanced Model Contract

This plugin provides a stable API for downstream plugins through enhanced model properties:

**Entity Enhancements:**
- `baseEntity` - Parent entity for inheritance
- `subclassedBy` - Array of child entities
- `extendedBy` - Array of extension entities
- `inReferences` - Array of incoming property references
- `outReferences` - Array of outgoing property references  
- `outReferencePaths` - Pre-computed reference paths

**Property Enhancements:**
- `referencedEntity` - Target entity for referential properties
- Flattened shared type constraints (`totalDigits`, `maxLength`, etc.)
- `mergeSourcedBy` / `mergeTargetedBy` - Merge directive relationships

### Plugin Integration Patterns

**Explicit Exports:**
```typescript
// src/index.ts - Exports for other plugins
export { enhance as domainEntityReferenceEnhancer } from './enhancer/property/DomainEntityReferenceEnhancer';
export { enhance as outReferencePathEnhancer } from './enhancer/OutReferencePathEnhancer';
// ... other key enhancers
```

**Data Access Patterns:**
```typescript
// How other plugins access enhanced data
const enhancedData = entity.data.edfiUnified;
const baseEntity = entity.baseEntity;  // Set by this plugin
const referencedEntity = property.referencedEntity;  // Set by this plugin
```

**Dependency Declaration:**
Other plugins implicitly depend on this plugin having run first. The core engine ensures proper execution order through the plugin loading sequence.

## Development Patterns

### Adding New Validators

1. **Create validator file:** `src/validator/[EntityType]/[RuleName].ts`
2. **Implement validation function** following the standard pattern
3. **Add to validator list** in `src/index.ts`
4. **Write comprehensive tests** with positive and negative cases
5. **Assign unique MEV### identifier** for error tracking

### Adding New Enhancers  

1. **Create enhancer file:** `src/enhancer/[Category]/[EnhancerName].ts`
2. **Implement enhancement function** following the standard pattern
3. **Add to enhancer list** in correct execution order
4. **Write tests** verifying model modifications
5. **Export if needed** by other plugins

### Testing New Rules

1. **Use MetaEdTextBuilder** to create focused test scenarios
2. **Set up minimal environment** with only required entities
3. **Run prerequisite enhancers** in correct dependency order
4. **Test both positive and negative cases**
5. **Verify error messages and source locations**

## Architecture Strengths

1. **Modular Design** - Each rule encapsulated in its own file
2. **Comprehensive Validation** - 80+ validators cover Ed-Fi semantic rules
3. **Rich Enhancement** - Transforms flat model into navigable graph
4. **Cross-Namespace Support** - Robust handling of Ed-Fi extension model
5. **Excellent Testing** - MetaEdTextBuilder enables comprehensive test coverage
6. **Clear Contracts** - Well-defined APIs for downstream plugins
7. **Performance Optimization** - Pre-computed paths and flattened constraints

This plugin exemplifies excellent architectural design for a foundational system component, providing the essential infrastructure that makes the entire Ed-Fi MetaEd ecosystem possible.