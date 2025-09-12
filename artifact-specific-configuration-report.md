# Artifact Specific Configuration Feature Report

## Executive Summary

The "artifact specific configuration" feature was a plugin configuration system in the MetaEd codebase that allowed external configuration files to inject data into MetaEd model objects. This feature existed from August 2018 to April 2023 and provided a way for plugins to customize model behavior based on configuration files.

## Timeline

- **Added**: August 2, 2018 - Commit `fc389cd19` ([METAED-827] loading plugin configurations)
- **Removed**: April 6, 2023 - Commit `2a4d26c86` ([METAED-1375] new plugin setup)
- **Duration**: Approximately 4 years and 8 months

## Design Overview

### Core Concept

The artifact specific configuration feature allowed MetaEd plugins to:
1. Define configuration files (e.g., `edfiXsd.config.json`, `edfiUnified.config.json`)
2. Specify rules that matched against MetaEd model entities
3. Inject configuration data into the `config` field of matched model objects

This was similar to how the `data` field works on model objects, but specifically for configuration purposes.

### Architecture Components

#### 1. Configuration Schema (`ConfigurationSchema.js`)

The system defined TypeScript/Flow types and Joi validation schemas:

```typescript
type ConfigurationMatches = {
  entity: Array<ModelType> | ModelType,      // e.g., "domainEntity", "association"
  namespace?: Array<string> | string,        // e.g., "EdFi", "Extension"
  core?: boolean,                           // Match core namespaces
  extensions?: boolean,                     // Match extension namespaces
  entityName?: Array<string> | string,      // e.g., "Grade", "Student"
};

type ConfigurationRule = {
  rule: string,                             // Rule identifier
  matches?: Array<ConfigurationMatches> | ConfigurationMatches,
  data: any,                               // Configuration data to inject
};

type ConfigurationStructure = {
  config: Array<ConfigurationRule> | ConfigurationRule,
};
```

#### 2. Configuration Loader (`LoadPluginConfiguration.js`)

The loader used `cosmiconfig` to find and load configuration files:
- Searched for configuration files named after the plugin (e.g., `edfiXsd.config.json`)
- Validated the configuration structure using Joi schemas
- Supported plugin-specific validation schemas

#### 3. Model Annotation (`AnnotateModelWithConfiguration.js`)

The annotation process:
1. Iterated through configuration rules
2. Found matching entities based on the `matches` criteria
3. Merged configuration data into the entity's `config` field
4. Used `deepmerge` to handle nested configuration objects

Key implementation detail:
```javascript
entity.config = deepmerge({ [pluginEnvironment.shortName]: configRule.data }, entity.config || {});
```

### Example Configuration File

```json
{
  "config": [
    {
      "rule": "globalConfig",
      "data": {
        "generateComments": true,
        "version": "3.1"
      }
    },
    {
      "rule": "entitySpecificConfig",
      "matches": {
        "entity": "domainEntity",
        "core": true,
        "entityName": ["Grade", "Student"]
      },
      "data": {
        "includeInApi": true,
        "customAttribute": "value"
      }
    },
    {
      "rule": "namespaceConfig",
      "matches": {
        "entity": ["association", "domainEntity"],
        "namespace": "Extension"
      },
      "data": {
        "extensionHandling": "special"
      }
    }
  ]
}
```

## Implementation Details

### 1. Plugin Integration

Plugins registered configuration schemas in their `initialize` function:

```javascript
export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: enhancerList(),
    generator: [generateXsd],
    configurationSchemas: new Map([
      ['globalConfig', Joi.object().keys({
        generateComments: Joi.boolean(),
        version: Joi.string()
      })],
      ['entitySpecificConfig', Joi.object().keys({
        includeInApi: Joi.boolean(),
        customAttribute: Joi.string()
      })]
    ]),
  };
}
```

### 2. Configuration Matching Algorithm

The matching process supported multiple criteria:
- **Entity Type**: Match specific model types (domainEntity, association, etc.)
- **Namespace**: Match by namespace name or core/extension classification
- **Entity Name**: Match specific entity names within a type

Matching logic:
1. If no `matches` field, configuration applied globally to the plugin environment
2. For each match rule:
   - Find namespaces based on `namespace`, `core`, or `extensions` criteria
   - Filter entities by type and name
   - Apply configuration to all matching entities

### 3. Data Storage

Configuration data was stored in a hierarchical structure:
```javascript
entity.config = {
  "edfiXsd": {
    "includeInApi": true,
    "customAttribute": "value"
  },
  "edfiUnified": {
    "otherConfig": "data"
  }
}
```

Each plugin's configuration was namespaced under its `shortName` to prevent conflicts.

## Usage Patterns

### 1. Global Plugin Configuration
```json
{
  "config": {
    "rule": "globalSettings",
    "data": {
      "outputFormat": "xml",
      "includeTimestamps": true
    }
  }
}
```

### 2. Type-Specific Configuration
```json
{
  "config": {
    "rule": "associationSettings",
    "matches": {
      "entity": "association",
      "core": true
    },
    "data": {
      "generateNavigationalProperties": true
    }
  }
}
```

### 3. Entity-Specific Configuration
```json
{
  "config": {
    "rule": "studentConfig",
    "matches": {
      "entity": "domainEntity",
      "entityName": "Student"
    },
    "data": {
      "specialHandling": true,
      "additionalValidation": ["birthdate", "enrollment"]
    }
  }
}
```

## Reimplementation Guide

To reimplement this feature:

### 1. Create Configuration Types
```typescript
interface ConfigurationMatches {
  entity: ModelType | ModelType[];
  namespace?: string | string[];
  core?: boolean;
  extensions?: boolean;
  entityName?: string | string[];
}

interface ConfigurationRule {
  rule: string;
  matches?: ConfigurationMatches | ConfigurationMatches[];
  data: any;
}

interface ConfigurationStructure {
  config: ConfigurationRule | ConfigurationRule[];
}
```

### 2. Add Config Field to Model Objects
Modify the base model type to include a `config` field alongside the existing `data` field.

### 3. Implement Configuration Loader
```typescript
function loadPluginConfiguration(
  pluginName: string,
  projectDirectory: string
): PluginConfiguration | null {
  // Use cosmiconfig or similar to find config files
  const explorer = cosmiconfig(pluginName);
  const result = explorer.searchSync(projectDirectory);
  
  if (!result || result.isEmpty) return null;
  
  return {
    filepath: result.filepath,
    configObject: result.config
  };
}
```

### 4. Implement Model Annotation
```typescript
function annotateModelWithConfiguration(
  models: ModelBase[],
  configuration: PluginConfiguration,
  pluginName: string
): void {
  const rules = Array.isArray(configuration.config) 
    ? configuration.config 
    : [configuration.config];
    
  rules.forEach(rule => {
    if (!rule.matches) {
      // Global plugin configuration
      pluginEnvironment.config = deepmerge(
        rule.data, 
        pluginEnvironment.config || {}
      );
    } else {
      const matchingEntities = findMatchingEntities(models, rule.matches);
      matchingEntities.forEach(entity => {
        entity.config = deepmerge(
          { [pluginName]: rule.data },
          entity.config || {}
        );
      });
    }
  });
}
```

### 5. Add Validation
- Validate configuration structure using Joi or similar
- Allow plugins to register custom validation schemas for their rules
- Report validation errors with helpful messages

### 6. Integration Points
- Load configurations during the pipeline initialization phase
- Apply configurations after model building but before enhancement
- Make configuration data available to enhancers and generators

## Benefits of the Feature

1. **Flexibility**: Allowed external configuration without code changes
2. **Separation of Concerns**: Configuration separate from model definitions
3. **Plugin Independence**: Each plugin managed its own configuration namespace
4. **Granular Control**: Could target specific entities, types, or namespaces
5. **Validation**: Built-in validation ensured configuration correctness

## Potential Improvements for Reimplementation

1. **Type Safety**: Use TypeScript generics for strongly-typed configuration data
2. **Configuration Inheritance**: Allow configurations to inherit from base configurations
3. **Environment-Specific Configs**: Support different configurations for different environments
4. **Hot Reloading**: Allow configuration changes without restarting the build
5. **Configuration Documentation**: Auto-generate documentation from configuration schemas
6. **Migration Tools**: Provide tools to migrate configurations between versions

## Conclusion

The artifact specific configuration feature provided a powerful way to customize MetaEd's behavior through external configuration files. Its removal in 2023 was part of a larger plugin system refactoring, but the core concepts remain valuable for providing flexibility in build-time configuration of code generation artifacts.