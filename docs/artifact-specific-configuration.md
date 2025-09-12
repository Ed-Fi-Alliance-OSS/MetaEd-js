# Artifact Specific Configuration

## Overview

The artifact specific configuration feature allows MetaEd plugins to customize model behavior through external configuration files. This system provides a flexible way to inject plugin-specific data into MetaEd model objects without modifying the core model definitions or plugin source code.

Configuration files are automatically discovered and loaded during the MetaEd processing pipeline, with data being injected into matched model objects based on configurable matching rules. Each plugin can define its own configuration schema to ensure data validity and provide structured validation.

## Configuration File Format

Configuration files follow a specific JSON structure and are named according to the plugin they configure:

```
{pluginShortName}.config.json
```

For example:
- `edfiXsd.config.json` - Configuration for the EdFi XSD plugin
- `edfiUnified.config.json` - Configuration for the EdFi Unified plugin
- `edfiApiSchema.config.json` - Configuration for the EdFi API Schema plugin

### JSON Schema Structure

```typescript
interface ConfigurationStructure {
  config: ConfigurationRule | ConfigurationRule[];
}

interface ConfigurationRule {
  rule: string;                                    // Rule identifier/name
  matches?: ConfigurationMatches | ConfigurationMatches[];  // Optional matching criteria
  data: any;                                      // Configuration data to inject
}

interface ConfigurationMatches {
  entity: ModelType | ModelType[];               // Entity types to match
  namespace?: string | string[];                 // Namespace names to match
  core?: boolean;                               // Match core namespaces only
  extensions?: boolean;                         // Match extension namespaces only
  entityName?: string | string[];               // Specific entity names to match
}
```

### Joi Validation Schema

The configuration structure is validated using the following Joi schema:

```javascript
const configurationStructureSchema = Joi.object().keys({
  config: Joi.array()
    .items(
      Joi.object().keys({
        rule: Joi.string().required(),
        matches: Joi.array()
          .items(
            Joi.object()
              .keys({
                entity: Joi.array()
                  .items(Joi.string().valid(...allTopLevelEntityModelTypes))
                  .single()
                  .required(),
                namespace: Joi.array().items(Joi.string()).single(),
                core: Joi.boolean(),
                extensions: Joi.boolean(),
                entityName: Joi.array().items(Joi.string()).single(),
              })
              .without('namespace', ['core', 'extensions'])  // namespace and core/extensions are mutually exclusive
              .with('entityName', ['entity'])                // entityName requires entity to be specified
          )
          .single()
          .optional(),
        data: Joi.any().required(),
      })
    )
    .single()
    .required(),
});
```

## Matching Options

### Entity Types (`entity`)

Specifies which MetaEd model types to match. Can be a single type or an array of types.

**Available Model Types:**
- `association` - Association entities
- `associationExtension` - Association extensions  
- `associationSubclass` - Association subclasses
- `choice` - Choice entities
- `common` - Common entities
- `commonExtension` - Common extensions
- `commonSubclass` - Common subclasses
- `descriptor` - Descriptor entities
- `domainEntity` - Domain entities (most common)
- `domainEntityExtension` - Domain entity extensions
- `domainEntitySubclass` - Domain entity subclasses
- `enumeration` - Enumeration types
- `schoolYearEnumeration` - School year enumerations

**Examples:**
```json
"entity": "domainEntity"                    // Single entity type
"entity": ["association", "domainEntity"]   // Multiple entity types
```

### Namespace Filtering

Control which namespaces are matched using one of three mutually exclusive options:

#### Explicit Namespace Names (`namespace`)
Match entities in specific named namespaces.

```json
"namespace": "EdFi"                    // Single namespace
"namespace": ["EdFi", "Extension"]     // Multiple namespaces
```

#### Core Namespaces (`core`)
Match entities in core (non-extension) namespaces only.

```json
"core": true    // Match core namespaces
```

#### Extension Namespaces (`extensions`)
Match entities in extension namespaces only.

```json
"extensions": true    // Match extension namespaces
```

**Note:** The `namespace`, `core`, and `extensions` options are mutually exclusive and cannot be used together in the same match rule.

### Entity Name Filtering (`entityName`)

Match specific entities by their MetaEd names. Requires the `entity` field to be specified.

```json
"entityName": "Student"                      // Single entity name
"entityName": ["Student", "School", "Grade"] // Multiple entity names
```

**Note:** Entity name matching is case-sensitive and must exactly match the MetaEd entity name.

## Configuration Examples

### Global Plugin Configuration

Apply configuration to the entire plugin environment (no matching criteria):

```json
{
  "config": {
    "rule": "globalSettings",
    "data": {
      "outputFormat": "xml",
      "includeTimestamps": true,
      "version": "3.1"
    }
  }
}
```

### Entity Type-Specific Configuration

Apply configuration to all entities of specific types:

```json
{
  "config": [
    {
      "rule": "associationSettings",
      "matches": {
        "entity": "association",
        "core": true
      },
      "data": {
        "generateNavigationalProperties": true,
        "includeInApi": true
      }
    },
    {
      "rule": "domainEntitySettings", 
      "matches": {
        "entity": ["domainEntity", "domainEntityExtension"]
      },
      "data": {
        "generateValidation": true
      }
    }
  ]
}
```

### Namespace-Based Configuration

Apply configuration based on namespace classification:

```json
{
  "config": [
    {
      "rule": "coreNamespaceConfig",
      "matches": {
        "entity": "domainEntity",
        "core": true
      },
      "data": {
        "includeInStandardApi": true,
        "generateDocumentation": true
      }
    },
    {
      "rule": "extensionNamespaceConfig",
      "matches": {
        "entity": ["domainEntity", "common"],
        "extensions": true
      },
      "data": {
        "requireCustomValidation": true,
        "extensionHandling": "special"
      }
    }
  ]
}
```

### Entity-Specific Configuration

Apply configuration to specific named entities:

```json
{
  "config": [
    {
      "rule": "studentConfig",
      "matches": {
        "entity": "domainEntity",
        "entityName": "Student"
      },
      "data": {
        "specialHandling": true,
        "additionalValidation": ["birthdate", "enrollment"],
        "generateReports": true
      }
    },
    {
      "rule": "multiEntityConfig",
      "matches": {
        "entity": "domainEntity",
        "core": true,
        "entityName": ["Grade", "GradingPeriod", "Session"]
      },
      "data": {
        "academicCalendarRelated": true,
        "includeInCalendarApi": true
      }
    }
  ]
}
```

### Complex Matching Rules

Use multiple match rules in a single configuration rule:

```json
{
  "config": {
    "rule": "complexMatching",
    "matches": [
      {
        "entity": "domainEntity",
        "namespace": "EdFi",
        "entityName": ["Student", "Staff"]
      },
      {
        "entity": "association", 
        "extensions": true
      }
    ],
    "data": {
      "requiresSpecialProcessing": true,
      "auditingEnabled": true
    }
  }
}
```

### Multiple Configuration Rules

Combine different types of configuration in a single file:

```json
{
  "config": [
    {
      "rule": "globalConfig",
      "data": {
        "pluginVersion": "2.1.0",
        "enableDebugMode": false
      }
    },
    {
      "rule": "coreEntityConfig",
      "matches": {
        "entity": "domainEntity",
        "core": true
      },
      "data": {
        "generateCRUDOperations": true
      }
    },
    {
      "rule": "descriptorConfig",
      "matches": {
        "entity": "descriptor"
      },
      "data": {
        "generateEnumerations": true,
        "includeCodeValue": true
      }
    }
  ]
}
```

## Plugin Configuration Schema Registration

Plugins can register custom validation schemas for their configuration rules to ensure data integrity and provide helpful validation messages.

### Registering Schemas

In your plugin's `initialize` function, return a `configurationSchemas` map:

```typescript
import Joi from 'joi';
import { MetaEdPlugin } from '@edfi/metaed-core';

export function initialize(): MetaEdPlugin {
  const configurationSchemas = new Map();
  
  // Schema for global settings rule
  configurationSchemas.set('globalSettings', 
    Joi.object().keys({
      outputFormat: Joi.string().valid('xml', 'json').required(),
      includeTimestamps: Joi.boolean().default(false),
      version: Joi.string().pattern(/^\d+\.\d+(\.\d+)?$/)
    })
  );
  
  // Schema for entity-specific settings
  configurationSchemas.set('entitySpecificSettings',
    Joi.object().keys({
      generateValidation: Joi.boolean().default(true),
      customAttributes: Joi.array().items(Joi.string()),
      processingHints: Joi.object().keys({
        priority: Joi.number().min(1).max(10),
        batchSize: Joi.number().positive()
      })
    })
  );
  
  return {
    validator: [],
    enhancer: [],
    generator: [],
    configurationSchemas
  };
}
```

### Schema Validation Benefits

- **Type Safety**: Ensures configuration data matches expected types
- **Required Fields**: Validates that mandatory configuration is provided  
- **Value Constraints**: Enforces valid ranges, patterns, and enum values
- **Default Values**: Automatically applies default values for optional fields
- **Error Messages**: Provides clear, actionable validation error messages

### Validation Error Example

```javascript
// Invalid configuration
{
  "rule": "globalSettings",
  "data": {
    "outputFormat": "csv",  // Invalid: must be 'xml' or 'json'
    "version": "1.2.3.4"    // Invalid: doesn't match version pattern
  }
}

// Resulting validation errors:
// "outputFormat" must be one of [xml, json] at path data/outputFormat
// "version" with value "1.2.3.4" fails to match the required pattern at path data/version
```

## Configuration Data Storage

Configuration data is stored hierarchically in model objects under a `config` field, with each plugin's data namespaced by its short name to prevent conflicts.

### Data Structure

```typescript
// Example entity with configuration data
{
  metaEdName: "Student",
  modelType: "domainEntity", 
  // ... other entity properties
  
  config: {
    "edfiXsd": {
      "generateComments": true,
      "includeInSchema": true
    },
    "edfiUnified": {
      "generateCRUDOperations": true,
      "apiIncluded": true
    },
    "edfiApiSchema": {
      "resourceName": "students",
      "supportsPaging": true
    }
  }
}
```

### Plugin Environment Configuration

Global plugin configuration (rules without `matches`) is stored in the plugin environment:

```typescript
// Plugin environment with global configuration
{
  shortName: "edfiXsd",
  // ... other plugin environment properties
  
  config: {
    "outputFormat": "xml",
    "version": "3.1.0",
    "includeTimestamps": true
  }
}
```

### Accessing Configuration Data

Configuration data can be accessed in enhancers and generators:

```typescript
// Accessing entity-specific configuration
function myEnhancer(metaEd: MetaEd): void {
  metaEd.namespace.forEach(namespace => {
    namespace.entity.domainEntity.forEach(entity => {
      const myPluginConfig = entity.config?.myPlugin;
      if (myPluginConfig?.specialHandling) {
        // Apply special processing
      }
    });
  });
}

// Accessing plugin-wide configuration
function myGenerator(metaEd: MetaEd): void {
  const pluginEnv = metaEd.plugin.get('myPlugin');
  const globalConfig = pluginEnv?.config;
  
  if (globalConfig?.outputFormat === 'xml') {
    // Generate XML format
  }
}
```

## Best Practices

### Configuration File Organization

1. **Use descriptive rule names** that clearly indicate what the configuration does:
   ```json
   "rule": "studentApiConfiguration"  // Good
   "rule": "config1"                  // Poor
   ```

2. **Group related configuration** using multiple rules rather than complex data structures:
   ```json
   // Good: Separate concerns
   "config": [
     { "rule": "validationSettings", "data": { ... } },
     { "rule": "outputFormatting", "data": { ... } }
   ]
   
   // Less ideal: Mixed concerns
   "config": {
     "rule": "allSettings", 
     "data": { "validation": { ... }, "formatting": { ... } }
   }
   ```

3. **Use specific matching criteria** to avoid unintended side effects:
   ```json
   // Good: Specific matching
   "matches": {
     "entity": "domainEntity",
     "core": true,
     "entityName": ["Student", "Staff"]
   }
   
   // Risky: Too broad
   "matches": {
     "entity": "domainEntity"
   }
   ```

### Schema Design

1. **Define comprehensive schemas** with proper validation:
   ```javascript
   configurationSchemas.set('myRule', 
     Joi.object().keys({
       // Use specific types and constraints
       priority: Joi.number().min(1).max(10).required(),
       mode: Joi.string().valid('strict', 'permissive').default('strict'),
       features: Joi.array().items(Joi.string()).unique()
     })
   );
   ```

2. **Provide helpful error messages** using custom labels:
   ```javascript
   Joi.string().label('Output Format').valid('xml', 'json')
   ```

3. **Use appropriate defaults** for optional configuration:
   ```javascript
   includeTimestamps: Joi.boolean().default(false)
   ```

### Configuration Management

1. **Environment-specific configurations** can be managed using multiple configuration files or environment variables within configurations:
   ```json
   {
     "config": {
       "rule": "environmentSettings",
       "data": {
         "debugMode": "${DEBUG_MODE:-false}",
         "apiEndpoint": "${API_ENDPOINT:-http://localhost:3000}"
       }
     }
   }
   ```

2. **Configuration validation** should happen early in the pipeline to catch issues before processing:
   - Use plugin schema registration
   - Validate file structure before annotation
   - Provide clear error messages with file paths

3. **Documentation** should accompany configuration schemas:
   ```typescript
   // Document each configuration rule
   configurationSchemas.set('entityProcessing', 
     Joi.object().keys({
       // Controls whether to generate validation rules for this entity type
       generateValidation: Joi.boolean().default(true),
       
       // Custom processing priority (1=highest, 10=lowest)  
       priority: Joi.number().min(1).max(10).default(5)
     }).description('Controls entity processing behavior')
   );
   ```

### Performance Considerations

1. **Minimize configuration complexity** - Simple matching rules perform better than complex nested matches
2. **Cache configuration lookups** in generators that process many entities
3. **Use specific entity names** when possible rather than broad type matching
4. **Consider configuration inheritance** for common patterns across multiple entities

### Error Handling

1. **Provide context** in error messages:
   ```javascript
   message: `Entity name '${entityName}' in rule '${ruleName}' does not match any entities`
   ```

2. **Validate early** to prevent downstream errors:
   - Check that referenced namespaces exist
   - Verify entity names match actual entities
   - Validate data types before injection

3. **Graceful degradation** - Consider how plugins should behave when configuration is missing or invalid

This configuration system provides powerful flexibility while maintaining type safety and validation. When used following these best practices, it enables sophisticated customization of MetaEd's artifact generation without requiring code changes.