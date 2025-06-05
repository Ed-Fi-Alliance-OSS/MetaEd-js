# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi Unified Advanced Overview

This plugin extends the **metaed-plugin-edfi-unified** plugin with advanced validators for complex Ed-Fi data model scenarios. It provides **validator-only functionality** (no enhancers or generators) and focuses on sophisticated validation patterns.

## Package Structure

```
src/
├── index.ts                    # Plugin entry point
└── validator/
    ├── CommonProperty/         # Common property validation
    ├── CrossProperty/          # Cross-property validation  
    ├── Deprecated/             # Deprecation warnings
    ├── MergeDirective/         # Merge directive validation
    ├── MergeScenarios/         # Complex merge scenarios
    └── SharedStringProperty/   # Shared string validation
```

## What Makes This "Advanced"

This plugin handles **complex validation scenarios** beyond basic Ed-Fi rules:

1. **Merge Directive Validation** - Complex property path matching and validation
2. **Deprecation Management** - Version-aware warnings for deprecated elements
3. **Ambiguous Merge Detection** - Identifies scenarios requiring role names or merge directives
4. **Cross-Property Validation** - Self-referencing property validation
5. **Version-Aware Validation** - Different behaviors based on target technology version

## Key Validators

### Merge Directive Validators
- **`SourcePropertyAndTargetPropertyMustMatch`** - Validates merge directive property compatibility
- **`SourcePropertyPathMustExist`** - Ensures source paths exist
- **`TargetPropertyPathMustExist`** - Ensures target paths exist

### Complex Merge Scenarios
- **`OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName`** - Detects ambiguous merge paths that need disambiguation

### Deprecation Warnings
- **`DeprecatedEntityWarning`** - Warns about deprecated entities
- **`DeprecatedPropertyWarning`** - Warns about deprecated properties
- **`DeprecatedEntityExtensionWarning`** - Warns about deprecated extensions
- **`DeprecatedEntitySubclassWarning`** - Warns about deprecated subclasses

### Property Validators
- **`CommonPropertyCollectionTargetMustContainIdentity`** - Validates collection targets have identity
- **`SelfReferencingPropertiesMustHaveRoleNameIfAllowed`** - Validates self-referencing properties

## Key Algorithms

### Complex Path Resolution
The `FindReferencedProperty` module provides sophisticated property resolution:
- Traverses entity inheritance hierarchies
- Handles role name resolution
- Supports multiple filter strategies
- Manages base entity lookup for extensions/subclasses

### Merge Path Conflict Detection
Identifies potentially ambiguous paths using:
- Out-reference path mapping to endpoints
- Identity-based path analysis
- Disambiguation checking (role names/merge directives)
- Inheritance scenario handling

### Version-Aware Validation
Uses `versionSatisfies` for different behaviors:
```typescript
const isError = versionSatisfies(metaEd.configuration.technologyVersion, '>=6.1.0');
// Warnings in older versions become errors in newer versions
```

## Testing Patterns

### Integration Testing
- **`RunAllValidators.test.ts`** - Tests complete plugin against Ed-Fi 3.2c + extension
- Real-world scenario validation with actual Ed-Fi data standard
- Performance testing (100s timeout for complex scenarios)

### Validator Testing
```typescript
describe('when [scenario description]', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let failures: ValidationFailure[];
  
  beforeAll(() => {
    // Build test model
    const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      // ... build scenario
      .buildAsString();
      
    // Run required enhancers from unified plugin
    domainEntityReferenceEnhancer.enhance(metaEd);
    outReferencePathEnhancer.enhance(metaEd);
    
    // Execute validator
    failures = validate(metaEd);
  });
  
  it('should have expected failures', () => {
    expect(failures).toHaveLength(expectedCount);
    expect(failures).toMatchSnapshot();
  });
});
```

## Dependencies

### Required Plugin
- **metaed-plugin-edfi-unified** - Must run before this plugin
- Uses unified plugin's enhancers in tests
- Designed as layered extension, not standalone

### Common Enhancer Dependencies
Tests frequently require these unified plugin enhancers:
- `domainEntityReferenceEnhancer`
- `outReferencePathEnhancer`
- `sharedStringPropertyEnhancer`
- `stringReferenceEnhancer`

## Development Notes

1. **Validator-Only Plugin** - No enhancers or generators, pure validation focus
2. **Complex Scenario Testing** - Requires sophisticated test setups with multiple entities
3. **Version Awareness** - Consider technology version when adding new validators
4. **Inheritance Handling** - Many validators must account for entity inheritance chains
5. **Performance Considerations** - Complex algorithms may require timeout adjustments in tests

## Common Development Tasks

- **Adding Advanced Validator** - Focus on complex scenarios not covered by unified plugin
- **Testing Complex Scenarios** - Use realistic Ed-Fi model patterns in tests
- **Version-Aware Logic** - Use `versionSatisfies` for version-dependent behavior
- **Inheritance Testing** - Test scenarios with extensions and subclasses