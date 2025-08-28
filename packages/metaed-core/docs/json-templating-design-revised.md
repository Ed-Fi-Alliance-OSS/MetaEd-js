# JSON Templating System Design for MetaEd Configuration (Revised)

## Executive Summary

This document outlines the design for adding JSON templating capabilities to the MetaEd artifact-specific configuration system using the [json-templates](https://github.com/datavis-tech/json-templates) library. The templating system will reduce configuration duplication by allowing commonly used values to be defined once and referenced multiple times.

## Important Note on Library Capabilities

The json-templates library provides **simple value substitution** only. It does NOT support:
- Conditional logic
- Array iteration/transformation
- Complex expressions
- Functions or computed values

This design focuses on what the library actually provides while proposing alternatives for advanced needs.

## Problem Statement

Current MetaEd configuration files often contain repeated values:
- Date fields using "2024-06-30" for end of school year
- Common IDs, names, and codes repeated across configurations
- Shared configuration values duplicated for similar entity types

## Solution Overview

Implement a JSON templating system that:
1. Uses json-templates for basic value substitution
2. Supports nested object references
3. Provides default values
4. Maintains complete backward compatibility

## What json-templates Actually Provides

### Basic Variable Substitution
```javascript
const parse = require('json-templates');

// Template with simple substitution
const template = parse({
  "endDate": "{{schoolYearEnd}}",
  "districtName": "{{district.name}}"
});

// Apply values
const result = template({
  schoolYearEnd: "2024-06-30",
  district: { name: "Sample District" }
});
// Result: { endDate: "2024-06-30", districtName: "Sample District" }
```

### Nested Path Access
```javascript
// Template values
const values = {
  dates: {
    schoolYear: {
      start: "2023-09-01",
      end: "2024-06-30"
    }
  }
};

// Configuration template
const template = parse({
  "beginDate": "{{dates.schoolYear.start}}",
  "endDate": "{{dates.schoolYear.end}}"
});

const result = template(values);
// Result: { beginDate: "2023-09-01", endDate: "2024-06-30" }
```

### Default Values
```javascript
const template = parse({
  "timeout": "{{api.timeout:30000}}",  // Default to 30000 if not provided
  "retries": "{{api.retries:3}}"       // Default to 3 if not provided
});

const result = template({});  // Empty values object
// Result: { timeout: "30000", retries: "3" }
```

### Template Keys (Not Just Values)
```javascript
const template = parse({
  "{{dynamicKey}}": "{{dynamicValue}}"
});

const result = template({
  dynamicKey: "schoolYear",
  dynamicValue: "2023-2024"
});
// Result: { schoolYear: "2023-2024" }
```

## Architecture Design

### Core Components

```typescript
// TemplateProcessor.ts
import { parse } from 'json-templates';

export interface ProcessedConfiguration {
  config: any;
  missingParameters: string[];
  usedParameters: string[];
}

export function processConfigurationTemplates(
  configObject: any,
  templateValues: Record<string, any>
): ProcessedConfiguration {
  // Parse the configuration as a template
  const template = parse(configObject);
  
  // Get required parameters
  const requiredParams = template.parameters || [];
  
  // Find missing parameters
  const providedParams = new Set(Object.keys(flattenObject(templateValues)));
  const missingParameters = requiredParams.filter(p => !providedParams.has(p));
  
  // Process the template
  const processedConfig = template(templateValues);
  
  return {
    config: processedConfig,
    missingParameters,
    usedParameters: requiredParams
  };
}
```

### Integration with LoadPluginConfiguration

```typescript
export async function loadPluginConfiguration(state: State): Promise<void> {
  for (const plugin of state.metaEdPlugins) {
    try {
      // 1. Load configuration file
      const configResult = await loadConfigFile(plugin.shortName, state.projectDirectory);
      if (!configResult) continue;

      // 2. Check if configuration contains template syntax
      const configString = JSON.stringify(configResult.config);
      const hasTemplates = configString.includes('{{') && configString.includes('}}');
      
      let processedConfig = configResult.config;
      
      if (hasTemplates) {
        // 3. Load template values
        const templateValues = await loadTemplateValues(
          plugin.shortName,
          state.projectDirectory
        );
        
        // 4. Process templates
        const { config, missingParameters } = processConfigurationTemplates(
          configResult.config,
          templateValues
        );
        
        // 5. Warn about missing parameters
        missingParameters.forEach(param => {
          state.validationFailure.push({
            validatorName: 'ConfigurationTemplating',
            category: 'warning',
            message: `Template parameter "{{${param}}}" not found in template values`,
            sourceMap: null,
            fileMap: { fullPath: configResult.filepath, lineNumber: 0 }
          });
        });
        
        processedConfig = config;
      }
      
      // 6. Continue with validation (existing code)
      const structureErrors = validateConfigurationStructure({
        filepath: configResult.filepath,
        configObject: processedConfig
      });
      
      // ... rest of existing logic
    } catch (error) {
      // Error handling
    }
  }
}
```

## Template Value Files

### File Naming and Discovery

1. **Global Template Values**
   ```
   metaed.templates.json
   ```

2. **Plugin-Specific Template Values**
   ```
   {pluginShortName}.templates.json
   // Example: edfiXsd.templates.json
   ```

### Template Value Structure

```json
{
  "schoolYear": {
    "current": "2023-2024",
    "start": "2023-09-01",
    "end": "2024-06-30",
    "lastInstructionalDay": "2024-06-15"
  },
  "district": {
    "name": "Sample School District",
    "id": "255901",
    "state": "TX"
  },
  "api": {
    "timeout": 30000,
    "maxRetries": 3,
    "baseUrl": "https://api.ed-fi.org"
  },
  "commonDates": {
    "epoch": "1970-01-01",
    "farFuture": "2999-12-31"
  }
}
```

## Realistic Use Cases

### Use Case 1: School Year Dates

**edfiXsd.templates.json**
```json
{
  "schoolYearEnd": "2024-06-30",
  "schoolYearStart": "2023-09-01",
  "currentYear": "2024",
  "districtId": "255901"
}
```

**edfiXsd.config.json**
```json
{
  "config": {
    "rule": "defaultDates",
    "matches": {
      "entity": "domainEntity",
      "entityName": ["SchoolYearType", "Session"]
    },
    "data": {
      "beginDate": "{{schoolYearStart}}",
      "endDate": "{{schoolYearEnd}}",
      "schoolYear": "{{currentYear}}",
      "localEducationAgencyId": "{{districtId}}"
    }
  }
}
```

### Use Case 2: Nested Template Values

**metaed.templates.json**
```json
{
  "defaults": {
    "timeout": 30000,
    "pageSize": 100,
    "maxRecords": 10000
  },
  "database": {
    "schema": "edfi",
    "charset": "utf8mb4"
  }
}
```

**edfiOds.config.json**
```json
{
  "config": {
    "rule": "queryDefaults",
    "data": {
      "queryTimeout": "{{defaults.timeout}}",
      "defaultPageSize": "{{defaults.pageSize}}",
      "maxQueryResults": "{{defaults.maxRecords}}",
      "schemaName": "{{database.schema}}"
    }
  }
}
```

### Use Case 3: Using Default Values

**edfiApi.config.json**
```json
{
  "config": {
    "rule": "apiSettings",
    "data": {
      "timeout": "{{api.timeout:5000}}",
      "retryCount": "{{api.retryCount:3}}",
      "retryDelay": "{{api.retryDelay:1000}}"
    }
  }
}
```

## Handling Advanced Scenarios Without json-templates

Since json-templates doesn't support conditionals or array operations, here are alternative approaches:

### Alternative 1: Multiple Configuration Files

Instead of conditional logic, use different configuration files:
```
edfiXsd.config.development.json
edfiXsd.config.production.json
edfiXsd.config.test.json
```

Load based on environment:
```typescript
const env = process.env.NODE_ENV || 'development';
const configFile = `${pluginShortName}.config.${env}.json`;
```

### Alternative 2: Pre-processing for Arrays

For array values, store them directly in template values:
```json
// templates.json
{
  "requiredFields": ["studentId", "schoolId", "enrollmentDate"],
  "validGradeLevels": ["K", "1", "2", "3", "4", "5"]
}

// config.json
{
  "validation": {
    "required": "{{requiredFields}}",
    "allowedGrades": "{{validGradeLevels}}"
  }
}
```

### Alternative 3: Template Value Generator

Create a script to generate template values with logic:
```javascript
// generate-templates.js
const templates = {
  schoolYearEnd: calculateSchoolYearEnd(),
  isProduction: process.env.NODE_ENV === 'production',
  apiUrl: process.env.API_URL || 'http://localhost:3000'
};

fs.writeFileSync('metaed.templates.json', JSON.stringify(templates, null, 2));
```

## Error Handling

### Missing Template Parameters
```typescript
if (missingParameters.length > 0) {
  // Option 1: Warning (default)
  missingParameters.forEach(param => {
    logger.warn(`Template parameter "${param}" not found, leaving as-is`);
  });
  
  // Option 2: Strict mode (optional)
  if (options.strict) {
    throw new Error(`Missing required template parameters: ${missingParameters.join(', ')}`);
  }
}
```

### Invalid Template Syntax
```typescript
try {
  const template = parse(configObject);
} catch (error) {
  state.validationFailure.push({
    validatorName: 'ConfigurationTemplating',
    category: 'error',
    message: `Invalid template syntax: ${error.message}`,
    sourceMap: null,
    fileMap: { fullPath: configFile, lineNumber: 0 }
  });
}
```

## Implementation Plan

### Phase 1: Core Implementation
1. Add json-templates dependency
2. Implement TemplateProcessor module
3. Implement TemplateValueLoader module
4. Add unit tests

### Phase 2: Integration
1. Modify LoadPluginConfiguration.ts
2. Add template detection logic
3. Implement error handling
4. Add integration tests

### Phase 3: Documentation
1. Document actual capabilities (no conditionals/iteration)
2. Provide migration examples
3. Document alternative approaches for advanced needs

## Testing Strategy

### Unit Tests
```typescript
describe('TemplateProcessor', () => {
  it('should substitute simple variables', () => {
    const config = { "date": "{{schoolYearEnd}}" };
    const values = { schoolYearEnd: "2024-06-30" };
    const result = processConfigurationTemplates(config, values);
    expect(result.config).toEqual({ date: "2024-06-30" });
  });
  
  it('should handle nested paths', () => {
    const config = { "date": "{{dates.school.end}}" };
    const values = { dates: { school: { end: "2024-06-30" } } };
    const result = processConfigurationTemplates(config, values);
    expect(result.config).toEqual({ date: "2024-06-30" });
  });
  
  it('should use default values', () => {
    const config = { "timeout": "{{api.timeout:5000}}" };
    const values = {};
    const result = processConfigurationTemplates(config, values);
    expect(result.config).toEqual({ timeout: "5000" });
  });
  
  it('should report missing parameters', () => {
    const config = { "date": "{{missingValue}}" };
    const values = {};
    const result = processConfigurationTemplates(config, values);
    expect(result.missingParameters).toContain('missingValue');
  });
});
```

## Limitations and Workarounds

| Need | json-templates Support | Workaround |
|------|------------------------|------------|
| Simple substitution | ✅ Supported | Use `{{variable}}` |
| Nested objects | ✅ Supported | Use `{{path.to.value}}` |
| Default values | ✅ Supported | Use `{{var:default}}` |
| Conditionals | ❌ Not supported | Use environment-specific configs |
| Array iteration | ❌ Not supported | Store full arrays in templates |
| Expressions | ❌ Not supported | Pre-compute in template generator |
| Functions | ❌ Not supported | Pre-process values |

## Future Considerations

If advanced templating becomes necessary:

1. **Option A**: Switch to a more powerful library (Handlebars, Mustache)
2. **Option B**: Build a pre-processor for complex logic
3. **Option C**: Keep json-templates for simple cases, add a separate system for complex ones

## Conclusion

The json-templates library provides exactly what we need for the primary use case: reducing duplication of common values like school year dates. While it doesn't support advanced features like conditionals or iteration, the simple substitution it provides covers 90% of configuration templating needs. For advanced scenarios, we can use alternative approaches like environment-specific files or pre-processing scripts.