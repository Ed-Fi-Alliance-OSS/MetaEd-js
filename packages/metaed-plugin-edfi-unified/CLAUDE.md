# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi Unified Overview

This is the foundational plugin for the MetaEd system, providing core Ed-Fi model validation rules and entity relationship enhancers. Other Ed-Fi plugins depend on this plugin's validators and enhancers.

## Package Structure

```
src/
├── validator/        # 80+ validators organized by entity type
│   ├── domainEntity/
│   ├── association/
│   ├── common/
│   └── ...
├── enhancer/        # 20+ enhancers that add computed properties
├── diminisher/      # Special case handlers
└── shared/          # Utility functions
```

## Core Concepts

### Validators

Validators enforce Ed-Fi model rules and return `ValidationFailure[]`. Key categories:

1. **Identity Validators** - Ensure entities have proper identities
2. **Reference Validators** - Ensure properties reference valid entities
3. **Extension Validators** - Ensure extensions follow naming/inheritance rules
4. **Subclass Validators** - Ensure proper class hierarchy
5. **Property Validators** - Ensure property constraints are valid

### Enhancers

Enhancers add computed properties and relationships to entities. Key enhancers:

1. **Reference Enhancers** - Connect properties to referenced entities
2. **Base Class Enhancers** - Connect subclasses to base entities
3. **Property Enhancers** - Add metadata from shared types
4. **Path Enhancers** - Build reference paths through the model
5. **Merge Directive Enhancer** - Handle property merging logic

## Common Patterns

### Validator Pattern
```typescript
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  
  metaEd.namespace.keys().forEach((namespaceName) => {
    const namespace = metaEd.namespace.get(namespaceName);
    const entities = namespace.domainEntity.all();
    
    entities.forEach((entity) => {
      // Check conditions and add failures
      if (conditionFails) {
        failures.push({
          validationFailureId: 'MEV###',
          message: 'Descriptive error message',
          elementName: entity.metaEdName,
          // ... other properties
        });
      }
    });
  });
  
  return failures;
}
```

### Enhancer Pattern
```typescript
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.keys().forEach((namespaceName) => {
    const namespace = metaEd.namespace.get(namespaceName);
    
    // Process entities and add computed properties
    entities.forEach((entity) => {
      entity.data.edfiUnified = {
        ...entity.data.edfiUnified,
        computedProperty: computeValue(entity)
      };
    });
  });
  
  return { enhancerName: 'EnhancerName', success: true };
}
```

## Key Utilities

- **`getEntityFromNamespaceChain`** - Resolve entity references across namespaces
- **`GroupByMetaEdName`** - Group entities by name for duplicate checking
- **Entity type checks** - `isAssociation()`, `isDomainEntity()`, etc.

## Testing Approach

Tests use `MetaEdTextBuilder` extensively:
```typescript
const metaEdText = MetaEdTextBuilder.build()
  .withBeginNamespace('EdFi')
  .withStartDomainEntity('Student')
  .withStringProperty('firstName')
  .withEndDomainEntity()
  .buildAsString();
```

## Important Notes

1. **Plugin Dependencies**: Other plugins depend on enhancers here - never remove enhancers without checking dependencies
2. **Data Storage**: All plugin data goes under `data.edfiUnified`
3. **Validation IDs**: Each validator has a unique MEV### ID for tracking
4. **Reference Resolution**: Always use namespace chain for resolving references
5. **Property Enhancement**: Properties inherit attributes from their shared types

## Common Development Tasks

- **Adding a Validator**: Create file in appropriate entity folder, export validate function, add to index
- **Adding an Enhancer**: Create file in enhancer folder, follow pattern, add to index
- **Testing**: Write tests for both positive and negative cases
- **Debugging**: Check `entity.data.edfiUnified` for enhanced properties