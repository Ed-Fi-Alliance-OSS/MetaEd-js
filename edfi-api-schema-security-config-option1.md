# Ed-Fi API Schema Security Configuration - Option 1 Proposal

## Overview

This document proposes using the artifact-specific configuration feature to replace hardcoded security diminishers with a configuration-driven approach for the Ed-Fi API Schema plugin. This solution leverages the existing MetaEd configuration infrastructure to inject security element data into model objects.

## Integration with Artifact-Specific Configuration System

### Configuration File Location and Naming

The configuration file will be named `edfiApiSchema.config.json` and can be placed in:
- Project root directory
- Any directory specified in `pluginConfigDirectories` in the MetaEd configuration
- The artifact output directory

The file follows the standard naming convention: `{pluginShortName}.config.json`

### How the Configuration System Works

1. **Discovery**: During MetaEd pipeline initialization, the configuration loader automatically discovers `edfiApiSchema.config.json` files in the configured directories.

2. **Loading**: The configuration is loaded and validated against the base configuration schema and any plugin-specific schemas registered by the edfiApiSchema plugin.

3. **Matching**: For each configuration rule, the system:
   - Evaluates the `matches` criteria against each model object
   - Checks entity type, namespace, and entity name constraints
   - Only applies data to matching entities

4. **Data Injection**: Matched configuration data is injected into the model object under:
   ```
   entity.config.edfiApiSchema
   ```

5. **Enhancer Processing**: The new `EducationOrganizationSecurityEnhancer` reads this configuration data and applies the security elements.

## Configuration Structure

### File: `edfiApiSchema.config.json`

```json
{
  "config": [
    {
      "rule": "educationOrganizationSecurableElements",
      "matches": {
        "entity": "domainEntity",
        "namespace": "EdFi",
        "entityName": "DisciplineAction"
      },
      "data": {
        "versionRange": ">=4.0.0-a",
        "securableElements": [
          {
            "propertyPath": "ResponsibilitySchool",
            "requiredIdentityProperty": "SchoolId",
            "description": "Maps ResponsibilitySchool reference to SchoolId for security"
          }
        ]
      }
    },
    {
      "rule": "educationOrganizationSecurableElements",
      "matches": {
        "entity": "domainEntity",
        "namespace": "EdFi",
        "entityName": "StudentAssessment"
      },
      "data": {
        "versionRange": ">=4.0.0",
        "securableElements": [
          {
            "propertyPath": "ReportedSchool",
            "requiredIdentityProperty": "SchoolId",
            "description": "Maps ReportedSchool reference to SchoolId for security"
          }
        ]
      }
    },
    {
      "rule": "educationOrganizationSecurableElements",
      "matches": {
        "entity": "domainEntitySubclass",
        "namespace": "EdFi",
        "entityName": "OrganizationDepartment"
      },
      "data": {
        "versionRange": ">=3.3.0-a",
        "mode": "replace",
        "securableElements": [
          {
            "propertyPath": "ParentEducationOrganization",
            "requiredIdentityProperty": "EducationOrganizationId",
            "description": "Replaces default security to use parent organization"
          }
        ]
      }
    },
    {
      "rule": "educationOrganizationIdentitySecurableElements",
      "matches": {
        "entity": "domainEntity",
        "namespace": "EdFi",
        "entityName": ["ProgramEvaluation", "ProgramEvaluationElement", "ProgramEvaluationObjective", "EvaluationRubricDimension"]
      },
      "data": {
        "versionRange": ">=5.0.0",
        "roleName": "Program",
        "description": "Discovers all identity properties with Program role that reference education organizations"
      }
    }
  ]
}
```

## Configuration Data Schema

### Two Rule Types

The configuration supports two different rule types for defining security elements:

1. **`educationOrganizationSecurableElements`**: Direct property mapping for explicit security configurations
2. **`educationOrganizationIdentitySecurableElements`**: Searches all identity properties to discover security elements based on role names

### Mode (for educationOrganizationSecurableElements)

The `mode` field controls how the configuration interacts with existing securable elements:

- **`append`** (default): Adds the configured securable elements to any existing ones
- **`replace`**: Replaces all existing securable elements with the configured ones

This is particularly useful for entities like `OrganizationDepartment` which may have default security elements that need to be completely replaced rather than augmented.

### Validation Schemas

The plugin will register validation schemas for both rule types:

```typescript
// In the edfiApiSchema plugin's initialize function
export function initialize(): MetaEdPlugin {
  const configurationSchemas = new Map();

  // Schema for direct property mapping rule
  configurationSchemas.set('educationOrganizationSecurableElements',
    Joi.object().keys({
      versionRange: Joi.string(),
      mode: Joi.string().valid('append', 'replace').default('append'),
      securableElements: Joi.array().items(
        Joi.object().keys({
          propertyPath: Joi.string().required(),
          requiredIdentityProperty: Joi.string().required(),
          description: Joi.string()
        })
      ).min(1).required()
    })
  );

  // Schema for identity search rule
  configurationSchemas.set('educationOrganizationIdentitySecurableElements',
    Joi.object().keys({
      versionRange: Joi.string(),
      roleName: Joi.string().required(),
      description: Joi.string()
    })
  );

  return {
    validator: [],
    enhancer: [
      educationOrganizationSecurityEnhancer,
      educationOrganizationIdentitySecurityEnhancer
    ],
    generator: [],
    configurationSchemas
  };
}
```

## How Configuration Data Flows Through the System

### 1. Configuration Loading Phase

```typescript
// The configuration system automatically loads and validates the file
// Configuration data is injected into matching entities during the annotation phase
```

### 2. Entity After Configuration Injection

```typescript
// Example: DisciplineAction entity after configuration injection
{
  metaEdName: "DisciplineAction",
  modelType: "domainEntity",
  namespace: "EdFi",
  // ... other entity properties

  config: {
    edfiApiSchema: {
      versionRange: ">=4.0.0-a",
      mode: "append",  // default value
      securableElements: [
        {
          propertyPath: "ResponsibilitySchool",
          requiredIdentityProperty: "SchoolId",
          description: "Maps ResponsibilitySchool reference to SchoolId for security"
        }
      ]
    }
  }
}
```

### 3. Enhancer Processing

Two separate enhancers handle the different rule types:

#### Direct Mapping Enhancer

```typescript
// EducationOrganizationSecurityEnhancer pseudocode
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const enhancerName = 'EducationOrganizationSecurityEnhancer';

  metaEd.namespace.forEach(namespace => {
    // Process all entity types that might have configuration
    const allEntities = [
      ...namespace.entity.domainEntity.values(),
      ...namespace.entity.domainEntitySubclass.values(),
      // ... other entity types
    ];

    allEntities.forEach(entity => {
      const securityConfig = entity.config?.edfiApiSchema;
      if (!securityConfig?.securableElements) return;

      // Check version constraint
      if (securityConfig.versionRange &&
          !versionSatisfies(metaEd.dataStandardVersion, securityConfig.versionRange)) {
        return;
      }

      // Handle mode
      const mode = securityConfig.mode || 'append';

      if (mode === 'replace') {
        // Clear existing securable elements
        entity.data.edfiApiSchema.educationOrganizationSecurableElements = [];
      }

      // Process each securable element configuration
      securityConfig.securableElements.forEach(elementConfig => {
        // Direct property mapping only
        processDirectMapping(entity, elementConfig);
      });
    });
  });

  return { enhancerName, success: true };
}
```

#### Identity Search Enhancer

```typescript
// EducationOrganizationIdentitySecurityEnhancer pseudocode
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const enhancerName = 'EducationOrganizationIdentitySecurityEnhancer';

  // Get EducationOrganization and its subclasses for validation
  const coreNamespace = metaEd.namespace.get('EdFi');
  const edfiEducationOrganization = coreNamespace?.entity.domainEntity.get('EducationOrganization');
  if (!edfiEducationOrganization) {
    throw new Error('EducationOrganization not found in EdFi namespace');
  }
  const allEducationOrganizations = [...edfiEducationOrganization.subclassedBy, edfiEducationOrganization];

  metaEd.namespace.forEach(namespace => {
    const allEntities = [
      ...namespace.entity.domainEntity.values(),
      // ... other entity types
    ];

    allEntities.forEach(entity => {
      const identityConfig = entity.config?.edfiApiSchema;
      if (!identityConfig?.roleName) return;

      // Check version constraint
      if (identityConfig.versionRange &&
          !versionSatisfies(metaEd.dataStandardVersion, identityConfig.versionRange)) {
        return;
      }

      const { identityFullnames, allJsonPathsMapping } = entity.data.edfiApiSchema;

      // Use Map to deduplicate by JsonPath
      const results = new Map();

      // Search all identity properties for matching role names
      identityFullnames.forEach(identityFullname => {
        const jsonPathsInfo = allJsonPathsMapping[identityFullname];

        const matchingPairs = jsonPathsInfo.jsonPathPropertyPairs.filter(jppp => {
          const { sourceProperty, flattenedIdentityProperty } = jppp;

          // Check if any property in the chain has the target role name
          const hasTargetRoleName = [sourceProperty, ...flattenedIdentityProperty.propertyChain]
            .some(property => property.roleName === identityConfig.roleName);

          // Check if the parent entity is an EducationOrganization
          const hasEdOrgParent = allEducationOrganizations.includes(
            flattenedIdentityProperty.identityProperty.parentEntity
          );

          return hasTargetRoleName && hasEdOrgParent;
        });

        matchingPairs.forEach(match => {
          results.set(match.jsonPath, {
            metaEdName: match.sourceProperty.metaEdName,
            jsonPath: match.jsonPath
          });
        });
      });

      // Add all discovered matches to securable elements
      entity.data.edfiApiSchema.educationOrganizationSecurableElements.push(
        ...[...results.values()].sort((a, b) => a.metaEdName.localeCompare(b.metaEdName))
      );
    });
  });

  return { enhancerName, success: true };
}
```

## Configuration Validation and Error Handling

### Validation Checks

1. **Schema Validation**: Automatic validation against the registered Joi schema
2. **Entity Existence**: Enhancer verifies that specified entities exist
3. **Property Existence**: Validates that `propertyPath` references exist on the entity
4. **Version Compatibility**: Checks `versionRange` against current data standard

### Error Messages

```javascript
// Schema validation error example
"config[0].data.securableElements[0]" must contain either [propertyPath] or [findByRoleName]

// Entity validation error example
"EducationOrganizationSecurityEnhancer: Property 'ResponsibilitySchool' not found on entity 'DisciplineAction'"

// Version constraint message
"Skipping security configuration for 'ProgramEvaluation': requires version >=5.0.0, current version is 4.0.0"
```

## Differences Between Rule Types

### educationOrganizationSecurableElements
- **Purpose**: Direct, explicit property mapping
- **Use Case**: When you know the exact property name and its required identity field
- **Examples**: DisciplineAction.ResponsibilitySchool, StudentAssessment.ReportedSchool
- **Processing**: Simple lookup and validation of specified properties
- **Mode Support**: Supports `append` and `replace` modes

### educationOrganizationIdentitySecurableElements
- **Purpose**: Discovers security elements by searching all identity properties for a specific role name
- **Use Case**: When entities need security based on role-named references that appear in identity properties
- **Examples**: All Program-related entities that need security based on Program role
- **Processing**: Searches all identity properties, filters by role name and EducationOrganization parent, deduplicates results
- **Configuration**: Minimal - just specify the role name to search for
- **Assumptions**: Always requires parent entity to be EducationOrganization or subclass, always adds all matches

## Advantages of This Approach

### 1. Leverages Existing Infrastructure
- Uses the proven artifact-specific configuration system
- Automatic discovery, loading, and validation
- Consistent with other MetaEd configuration patterns

### 2. Clear Separation of Concerns
- Configuration is external to code
- Each rule is self-contained and explicit
- Easy to understand what each configuration does

### 3. Extensibility
- New entities can be added without code changes
- Extension projects can provide their own security configurations
- Pattern-based rules can be extended with new patterns

### 4. Validation and Safety
- Schema validation ensures configuration correctness
- Version constraints prevent applying rules to incompatible versions
- Clear error messages for debugging

### 5. Maintainability
- Configuration changes don't require code compilation
- Easy to review and audit security rules
- Documentation can be embedded in configuration

## Migration from Current Diminishers

### Phase 1: Implement Enhancers
1. Create `EducationOrganizationSecurityEnhancer` for direct mappings
2. Create `EducationOrganizationIdentitySecurityEnhancer` for identity-based discovery
3. Register configuration schemas for both rule types
4. Implement validation and processing logic for each enhancer

### Phase 2: Create Configuration
1. Create `edfiApiSchema.config.json` with current hardcoded rules
2. Place in appropriate configuration directory
3. Test against existing output

### Phase 3: Validation
1. Run MetaEd build with both diminishers and new enhancer
2. Compare output to ensure identical results
3. Verify all security elements are correctly applied

### Phase 4: Cleanup
1. Remove old diminisher files
2. Update plugin initialization to exclude diminishers
3. Document configuration format for extension developers

## Example Usage for Extensions

Extension projects can provide their own security configurations:

```json
{
  "config": [
    {
      "rule": "educationOrganizationSecurableElements",
      "matches": {
        "entity": "domainEntity",
        "namespace": "MyExtension",
        "entityName": "CustomEntity"
      },
      "data": {
        "mode": "append",
        "securableElements": [
          {
            "propertyPath": "SchoolReference",
            "requiredIdentityProperty": "SchoolId",
            "description": "Custom entity school-based security"
          }
        ]
      }
    }
  ]
}
```

## Conclusion

This configuration-driven approach provides a clean, maintainable solution for defining education organization security elements. By leveraging the existing artifact-specific configuration system, we gain automatic discovery, validation, and injection capabilities while maintaining flexibility for future enhancements and extension support.