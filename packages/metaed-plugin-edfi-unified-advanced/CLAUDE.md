# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi Unified Advanced Overview

The `metaed-plugin-edfi-unified-advanced` package is a **validator-only plugin** that serves as a sophisticated second processing layer on top of the foundational `metaed-plugin-edfi-unified` plugin. It enforces complex, high-level semantic and structural rules specific to the Ed-Fi data model that are too intricate for the base plugin. This plugin acts as a critical **quality gate**, ensuring the model is not just syntactically correct but also logically sound and unambiguous before being consumed by downstream generators.

## Layered Architecture and Plugin Dependencies

### Core Design Philosophy

**Validator-Only Specialization:**
```typescript
// src/index.ts - Explicit validator-only plugin
export function initialize(): MetaEdPlugin {
  return {
    validator: [
      // 12 advanced validators for complex scenarios
    ],
    enhancer: [],     // No model enhancement
    generator: [],    // No artifact generation
    shortName: 'edfiUnifiedAdvanced'
  };
}
```

**Strict Dependency on Unified Plugin:**
- Must execute after `metaed-plugin-edfi-unified`
- Operates on enhanced model with resolved references and computed paths
- Leverages unified plugin's relationship building and reference resolution

### Plugin Execution Order

```typescript
// Required execution sequence
const pluginOrder = [
  'edfiUnified',           // Foundation: reference resolution, relationship building
  'edfiUnifiedAdvanced',   // Advanced validation on enriched model
  // ... downstream plugins
];
```

**Test Integration Pattern:**
```typescript
// test/PluginHelper.ts - Shows required execution order
export function metaEdPlugins(): MetaEdPlugin[] {
  return [edfiUnified(), edfiUnifiedAdvanced()]; // Explicit dependency order
}
```

## Advanced Validation Capabilities

### Complex Merge Directive Validation

**Sophisticated Property Path Resolution:**
The plugin implements advanced algorithms for validating merge directives that span entity hierarchies:

```typescript
// Advanced path traversal in FindReferencedProperty.ts
function findReferencedProperty(
  entity: TopLevelEntity,
  propertyPath: string,
  filterStrategy: PropertyFilterStrategy
): EntityProperty | null {
  // Traverses deep property chains (e.g., "EntityA.EntityB.PropertyC")
  // Navigates inheritance and extension hierarchies
  // Resolves property names with role names
  // Handles base entity lookup for extensions/subclasses
}
```

**Key Merge Directive Validators:**
- **`SourcePropertyPathMustExist`** - Validates source paths exist in model
- **`TargetPropertyPathMustExist`** - Validates target paths exist in model  
- **`SourcePropertyAndTargetPropertyMustMatch`** - Ensures type and entity compatibility

### Ambiguous Path Detection and Resolution

**Advanced Graph Analysis:**
The `OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName` validator performs sophisticated analysis:

```typescript
// Detects multiple paths to same destination entity
function validateAmbiguousPaths(entity: TopLevelEntity): ValidationFailure[] {
  // 1. Inspect outReferenceEntityEndpointsMap (from unified plugin)
  // 2. Find cases where multiple paths lead to same destination
  // 3. Check for disambiguation via role names or merge directives
  // 4. Flag unresolved ambiguities as validation errors
}
```

**Security and Data Integrity Benefits:**
- Prevents ambiguous foreign key relationships in generated database schemas
- Ensures API generators create unambiguous JSON paths
- Eliminates potential data access security holes from unclear relationships

### Version-Aware Validation

**Dynamic Validation Based on Technology Version:**
```typescript
// Example from SharedStringPropertyMustNotHaveMinLengthOneOnOptionalFields.ts
const { targetTechnologyVersion } = metaEd.plugin.get('edfiUnifiedAdvanced') as PluginEnvironment;

failures.push({
  category: versionSatisfies(targetTechnologyVersion, '>=7.0.0') ? 'error' : 'warning',
  message: versionSatisfies(targetTechnologyVersion, '>=7.0.0')
    ? 'MinLength of 1 on optional fields is not allowed'
    : 'MinLength of 1 on optional fields will be treated as an error in API version 7.x'
});
```

**Evolution Management:**
- Allows gradual migration from warnings to errors across Ed-Fi versions
- Maintains backward compatibility while encouraging best practices
- Supports long-term data standard evolution strategy

## Comprehensive Validation Categories

### Deprecation Management Validators

**Cascading Deprecation Analysis:**
- **`DeprecatedEntityWarning`** - Flags usage of deprecated entities
- **`DeprecatedPropertyWarning`** - Identifies deprecated property usage
- **`DeprecatedEntityExtensionWarning`** - Warns about extending deprecated entities
- **`DeprecatedEntitySubclassWarning`** - Flags subclassing deprecated entities
- **`DeprecatedEntityReferencedByDomainWarning`** - Cross-domain deprecation warnings
- **`DeprecatedEntityReferencedByInterchangeWarning`** - Interchange deprecation warnings

**Version-Aware Deprecation:**
- Tracks deprecation timelines across Ed-Fi data standard versions
- Provides migration guidance through warning messages
- Enables gradual removal of deprecated features

### Cross-Entity and Relationship Validators

**Complex Relationship Validation:**
- **`CommonPropertyCollectionTargetMustContainIdentity`** - Ensures collection targets have proper identity
- **`SelfReferencingPropertiesMustHaveRoleNameIfAllowed`** - Validates self-referential relationships

**Identity and Collection Validation:**
- Ensures all collections reference entities with natural identity
- Validates self-referencing properties have role name disambiguation
- Prevents circular reference scenarios that would break generators

### Shared Type and Constraint Validators

**Advanced String Property Validation:**
- **`SharedStringPropertyMustNotHaveMinLengthOneOnOptionalFields`** - Prevents problematic string constraints
- Version-aware enforcement of string length constraints
- Ensures database and API generators produce valid schemas

## Model Quality Assurance Role

### Semantic Correctness Guarantees

**What This Plugin Guarantees to Downstream Plugins:**
1. **Merge Directive Validity** - All merge directives point to real, compatible properties
2. **Path Disambiguation** - No ambiguous data paths requiring complex generator logic
3. **Identity Completeness** - All collections based on entities with proper identity
4. **Reference Clarity** - Self-references properly disambiguated with role names
5. **Version Compliance** - Model adheres to target technology version requirements

**Benefits for Generator Plugins:**
```typescript
// Generator plugins can assume:
// - No ambiguous relationship paths
// - All merge directives are resolvable
// - All collections have proper identity handling
// - All self-references are disambiguated
```

### Error Prevention Strategy

**Design-Time Security Controls:**
- Prevents ambiguous relationships that could cause data leakage
- Ensures clear authorization pathways in generated APIs
- Validates entity relationships for proper security model implementation

**Code Generation Simplification:**
- Eliminates need for complex disambiguation logic in generators
- Ensures generators receive semantically sound model
- Reduces generator complexity and potential bugs

## Testing Architecture and Patterns

### Integration Testing Strategy

**Real-World Scenario Validation:**
```typescript
// test/integration/RunAllValidators.test.ts
describe('Running all advanced validators against Ed-Fi 3.2c', () => {
  it('should validate complete Ed-Fi model with extension', async () => {
    // Uses actual Ed-Fi data standard model
    // Tests performance and correctness with real complexity
    // 100 second timeout for complex scenarios
  });
});
```

### Sophisticated Test Setup Patterns

**Multi-Entity Scenario Testing:**
```typescript
describe('when validating merge directive scenarios', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  
  beforeAll(() => {
    const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('Student')
      .withDomainEntityProperty('School', 'School reference', true, false)
      .withDomainEntityProperty('EducationOrganization', 'Ed org reference', true, false)
      .withMergeDirective('EducationOrganization.EducationOrganizationId', 'School.EducationOrganizationId')
      .withEndDomainEntity()
      .withEndNamespace()
      .buildAsString();
      
    // Critical: Run unified plugin enhancers first
    domainEntityReferenceEnhancer(metaEd);
    outReferencePathEnhancer(metaEd);
    
    // Then run advanced validator
    failures = validate(metaEd);
  });
  
  it('should validate merge directive correctly', () => {
    expect(failures).toHaveLength(0);
  });
});
```

**Required Pre-Enhancer Setup:**
Most tests require specific unified plugin enhancers:
- `domainEntityReferenceEnhancer` - Resolves entity references
- `outReferencePathEnhancer` - Builds reference path mappings
- `sharedStringPropertyEnhancer` - Flattens shared string constraints
- `mergeDirectiveEnhancer` - Resolves merge directive references

## Development Patterns and Guidelines

### Adding Advanced Validators

1. **Complex Scenario Focus** - Target scenarios too complex for unified plugin
2. **Post-Enhancement Operation** - Assume model has been enhanced by unified plugin
3. **Graph-Level Analysis** - Operate on entity relationship graphs and paths
4. **Version Awareness** - Consider target technology version in validation logic
5. **Security Implications** - Focus on validators that prevent generation-time security issues

### Validator Implementation Pattern

```typescript
// Standard advanced validator pattern
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiUnifiedAdvanced') as PluginEnvironment;
  
  // Operate on entities enhanced by unified plugin
  getAllEntitiesOfType(metaEd, 'domainEntity').forEach((entity) => {
    // Access enhanced data from unified plugin
    const outReferenceEndpoints = entity.data.edfiUnified.outReferenceEntityEndpointsMap;
    
    // Perform complex validation logic
    if (complexValidationCondition(entity, outReferenceEndpoints)) {
      failures.push({
        validationFailureId: 'MEV###',
        category: versionSatisfies(targetTechnologyVersion, '>=7.0.0') ? 'error' : 'warning',
        message: 'Complex validation failure message',
        elementName: entity.metaEdName,
        sourceFileLine: entity.sourceMap?.sourceFileLine
      });
    }
  });
  
  return failures;
}
```

### Testing Complex Scenarios

**Multi-Entity Relationship Testing:**
- Create entities with complex inheritance hierarchies
- Test scenarios with multiple extension levels
- Validate cross-namespace reference scenarios
- Test edge cases with circular references

**Performance Considerations:**
- Use realistic Ed-Fi model complexity in tests
- Allow adequate timeouts for graph analysis algorithms
- Test memory usage with large entity graphs

## Architecture Strengths

1. **Layered Validation** - Clear separation between basic and advanced validation
2. **Semantic Focus** - Concentrates on logical model correctness
3. **Generator Simplification** - Ensures downstream plugins receive clean model
4. **Version Management** - Supports evolution of Ed-Fi data standards
5. **Security Assurance** - Prevents ambiguous relationships that could cause security issues
6. **Quality Gate** - Acts as comprehensive validation before artifact generation
7. **Performance Optimization** - Leverages pre-computed paths and relationships from unified plugin

## Integration with Plugin Ecosystem

**Dependency Chain Position:**
```
metaed-plugin-edfi-unified (foundation + basic validation)
  ↓
metaed-plugin-edfi-unified-advanced (advanced validation)
  ↓
metaed-plugin-edfi-ods-relational (database generation)
  ↓
metaed-plugin-edfi-api-schema (API generation)
  ↓
Database-specific and specialized plugins
```

**Quality Assurance Role:**
This plugin serves as the critical quality assurance layer that ensures all downstream plugins receive a semantically sound, unambiguous, and properly validated Ed-Fi model. By performing complex validation at this stage, it dramatically simplifies the implementation requirements for all subsequent generator plugins while ensuring the integrity and security of the final generated artifacts.

This architectural approach exemplifies excellent separation of concerns, with advanced validation centralized in a specialized plugin that builds upon the foundational work of the unified plugin while providing critical guarantees to the entire downstream plugin ecosystem.