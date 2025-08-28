# JSON Templating System Design for MetaEd Configuration

## Executive Summary

This document outlines the design for adding JSON templating capabilities to the MetaEd artifact-specific configuration system. The templating system will reduce configuration duplication by allowing commonly used values (e.g., "last day of school year") to be defined once and referenced multiple times through template variables.

## Problem Statement

Current MetaEd configuration files often contain repeated values across multiple configuration rules. For example:
- Date fields that all use "2024-06-30" for end of school year
- Common namespace prefixes repeated across multiple entity configurations  
- Shared validation rules duplicated for similar entity types

This duplication creates maintenance burden and increases the risk of inconsistencies when values need to be updated.

## Proposed Solution

Implement a JSON templating system using the [json-templates](https://github.com/datavis-tech/json-templates) library that:
1. Processes template variables in configuration files before validation
2. Supports both global and plugin-specific template value files
3. Maintains complete backward compatibility with existing configurations
4. Provides clear error messages for template-related issues

## Architecture Overview

### Component Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Pipeline.ts                           │
│                                                         │
│  1. setupPlugins()                                     │
│  2. loadPluginConfiguration() ◄── Integration Point    │
│     └── LoadPluginConfiguration.ts                     │
│         ├── loadConfigFile()                          │
│         ├── loadTemplateValues() ◄── NEW              │
│         ├── processTemplates() ◄── NEW                │
│         ├── validateConfiguration()                    │
│         └── annotateModelWithConfiguration()           │
└─────────────────────────────────────────────────────────┘
```

### New Modules

#### 1. TemplateProcessor.ts
```typescript
import jsonTemplates from 'json-templates';

export interface TemplateProcessorOptions {
  strict?: boolean;  // Throw on missing variables
  warnOnMissing?: boolean;  // Log warnings for missing variables
}

export function processConfigurationTemplates(
  configObject: any,
  templateValues: Record<string, any>,
  options: TemplateProcessorOptions = {}
): { 
  processedConfig: any;
  warnings: string[];
  missingVariables: string[];
}
```

#### 2. TemplateValueLoader.ts
```typescript
export interface TemplateValueSource {
  global?: Record<string, any>;
  pluginSpecific?: Record<string, any>;
  environment?: Record<string, any>;
}

export async function loadTemplateValues(
  pluginShortName: string,
  projectDirectory: string
): Promise<TemplateValueSource>

export function mergeTemplateValues(
  sources: TemplateValueSource
): Record<string, any>
```

#### 3. TemplateError.ts
```typescript
export class TemplateError extends Error {
  constructor(
    message: string,
    public readonly type: 'missing_variable' | 'parse_error' | 'load_error',
    public readonly details?: any
  ) {
    super(message);
    this.name = 'TemplateError';
  }
}
```

## File Naming Conventions

### Template Value Files

1. **Global Template Values**
   - Filename: `metaed.templates.json`
   - Location: Project root or configuration directory
   - Scope: Available to all plugins
   - Priority: Lowest (can be overridden)

2. **Plugin-Specific Template Values**
   - Filename: `{pluginShortName}.templates.json`
   - Example: `edfiXsd.templates.json`
   - Location: Same directory as plugin configuration
   - Scope: Specific plugin only
   - Priority: Highest (overrides global values)

### File Discovery Order

1. Check for `{pluginShortName}.templates.json` in same directory as config
2. Check for `metaed.templates.json` in project root
3. Check parent directories up to project root
4. Merge values with plugin-specific taking precedence

## Template Syntax and Features

### Basic Variable Substitution
```json
// Template values file
{
  "schoolYearEnd": "2024-06-30",
  "districtName": "Sample District"
}

// Configuration file (before processing)
{
  "config": {
    "rule": "dateConfig",
    "data": {
      "endDate": "{{schoolYearEnd}}",
      "organization": "{{districtName}}"
    }
  }
}

// Configuration file (after processing)
{
  "config": {
    "rule": "dateConfig", 
    "data": {
      "endDate": "2024-06-30",
      "organization": "Sample District"
    }
  }
}
```

### Nested Object References
```json
// Template values
{
  "dates": {
    "schoolYear": {
      "start": "2023-09-01",
      "end": "2024-06-30"
    }
  }
}

// Configuration usage
{
  "startDate": "{{dates.schoolYear.start}}",
  "endDate": "{{dates.schoolYear.end}}"
}
```

### Array Iteration
```json
// Template values
{
  "requiredFields": ["studentId", "schoolId", "enrollmentDate"]
}

// Configuration usage
{
  "validation": {
    "required": "{{requiredFields}}"
  }
}
```

### Conditional Templates
```json
// Template values
{
  "environment": "production",
  "debugMode": false
}

// Configuration usage
{
  "logging": {
    "level": "{{environment === 'production' ? 'error' : 'debug'}}"
  }
}
```

## Integration with Existing System

### Modified LoadPluginConfiguration.ts

```typescript
export async function loadPluginConfiguration(state: State): Promise<void> {
  for (const plugin of state.metaEdPlugins) {
    try {
      // 1. Load configuration file (existing)
      const configResult = await loadConfigFile(plugin.shortName, state.projectDirectory);
      if (!configResult) continue;

      // 2. Load template values (new)
      const templateValues = await loadTemplateValues(
        plugin.shortName, 
        state.projectDirectory
      );

      // 3. Process templates if values exist (new)
      let processedConfig = configResult.config;
      if (Object.keys(templateValues).length > 0) {
        const { processedConfig: processed, warnings } = processConfigurationTemplates(
          configResult.config,
          templateValues,
          { warnOnMissing: true }
        );
        
        // Add warnings to validation failures
        warnings.forEach(warning => {
          state.validationFailure.push({
            validatorName: 'ConfigurationTemplating',
            category: 'warning',
            message: warning,
            sourceMap: null,
            fileMap: { fullPath: configResult.filepath, lineNumber: 0 }
          });
        });
        
        processedConfig = processed;
      }

      // 4. Validate configuration (existing, but now with processed config)
      const structureErrors = validateConfigurationStructure({
        filepath: configResult.filepath,
        configObject: processedConfig
      });
      
      // ... rest of existing validation logic
    } catch (error) {
      // Error handling
    }
  }
}
```

## Error Handling Strategy

### Template Processing Errors

1. **Missing Template Variables**
   - Default: Log warning, leave placeholder as-is
   - Strict mode: Throw error and halt processing
   - Report as validation warning/error

2. **Malformed Template Syntax**
   - Report as validation error with line number
   - Provide helpful error message with context

3. **Template File Loading Errors**
   - File not found: Continue without templates (backward compatibility)
   - Invalid JSON: Report as validation error
   - Permission errors: Report as pipeline failure

### Error Reporting Examples

```typescript
// Warning for missing variable
{
  validatorName: 'ConfigurationTemplating',
  category: 'warning',
  message: 'Template variable "{{schoolYearEnd}}" not found in template values',
  fileMap: { fullPath: 'edfiXsd.config.json', lineNumber: 15 }
}

// Error for invalid template file
{
  validatorName: 'ConfigurationTemplating',
  category: 'error',
  message: 'Invalid JSON in template file: Unexpected token } at line 10',
  fileMap: { fullPath: 'edfiXsd.templates.json', lineNumber: 10 }
}
```

## Security Considerations

1. **No Code Execution**: Templates only support variable substitution, not arbitrary code
2. **Path Traversal Prevention**: Template files must be within project directory
3. **Environment Variable Access**: Optionally allow `{{env.VARIABLE_NAME}}` with explicit whitelist
4. **Size Limits**: Enforce reasonable limits on template file sizes
5. **Circular Reference Detection**: Prevent infinite recursion in nested templates

## Migration Strategy

### Phase 1: Infrastructure (Week 1)
1. Implement core template processing modules
2. Add json-templates dependency
3. Create unit tests for template processing

### Phase 2: Integration (Week 2)
1. Integrate with LoadPluginConfiguration
2. Update validation error reporting
3. Add integration tests

### Phase 3: Documentation (Week 3)
1. Update configuration documentation
2. Create migration guide for existing configs
3. Add examples to documentation

### Phase 4: Adoption (Week 4+)
1. Create template files for example projects
2. Gather feedback from plugin developers
3. Iterate on features based on usage

## Example Use Cases

### Use Case 1: School Year Configuration

**metaed.templates.json**
```json
{
  "schoolYear": {
    "current": "2023-2024",
    "startDate": "2023-09-01",
    "endDate": "2024-06-30",
    "lastInstructionalDay": "2024-06-15"
  },
  "district": {
    "name": "Sample School District",
    "id": "255901"
  }
}
```

**edfiXsd.config.json**
```json
{
  "config": [{
    "rule": "schoolYearDates",
    "matches": {
      "entity": "domainEntity",
      "entityName": ["SchoolYearType", "Session", "GradingPeriod"]
    },
    "data": {
      "currentSchoolYear": "{{schoolYear.current}}",
      "beginDate": "{{schoolYear.startDate}}",
      "endDate": "{{schoolYear.endDate}}"
    }
  }]
}
```

### Use Case 2: Environment-Specific Configuration

**edfiApi.templates.json**
```json
{
  "api": {
    "baseUrl": "{{env.API_BASE_URL || 'http://localhost:5000'}}",
    "timeout": "{{env.API_TIMEOUT || 30000}}",
    "retryCount": "{{env.NODE_ENV === 'production' ? 3 : 1}}"
  }
}
```

## Performance Considerations

1. **Template Processing Overhead**
   - Process templates once during configuration loading
   - Cache processed configurations in memory
   - Minimal impact on pipeline performance

2. **File I/O Optimization**
   - Load template files asynchronously
   - Cache template values for entire pipeline run
   - Use file watching for development mode

3. **Memory Usage**
   - Template values typically small (<1MB)
   - Processed configs replace original in memory
   - No significant memory overhead

## Testing Strategy

### Unit Tests
- Template variable substitution
- Nested object reference resolution
- Missing variable handling
- Template syntax validation

### Integration Tests
- Configuration loading with templates
- Template value file discovery
- Error reporting through validation pipeline
- Backward compatibility with non-templated configs

### End-to-End Tests
- Full pipeline execution with templated configs
- Plugin configuration with mixed template/static values
- Multi-plugin template value inheritance

## Success Metrics

1. **Adoption Rate**: % of projects using templates within 6 months
2. **Configuration Reduction**: Average % reduction in config file size
3. **Error Reduction**: Decrease in configuration-related errors
4. **Developer Satisfaction**: Survey feedback on feature usefulness

## Future Enhancements

1. **Template Functions**: Support for built-in functions like date formatting
2. **Schema Validation**: Validate template values against expected types
3. **IDE Support**: VS Code extension for template autocomplete
4. **Template Libraries**: Shareable template value sets for common scenarios
5. **Dynamic Templates**: Support for computed values and expressions

## Conclusion

The JSON templating system will provide a powerful yet simple mechanism for reducing configuration duplication in MetaEd projects. By integrating cleanly with the existing configuration system and maintaining backward compatibility, teams can adopt templates incrementally while immediately benefiting from reduced maintenance burden and improved consistency.