# Jsonnet Configuration Support

MetaEd now supports [Jsonnet](https://jsonnet.org/) configuration files in addition to JSON. Jsonnet is a data templating language that extends JSON with variables, functions, conditionals, and more, making it easier to manage complex configurations.

## Benefits

- **Variables**: Reduce duplication by defining values once and reusing them
- **Functions**: Create reusable templates for similar configuration patterns
- **Comments**: Document your configuration directly in the file
- **Conditionals**: Include or exclude configuration based on conditions
- **Imports**: Split large configurations into multiple files
- **External Variables**: Pass environment-specific values at runtime

## File Naming

Configuration files can use either extension:
- `.config.json` - Standard JSON configuration
- `.config.jsonnet` - Jsonnet configuration with advanced features

When both files exist for the same plugin, the `.config.jsonnet` file takes precedence.

## Migration from JSON

Since JSON is a valid subset of Jsonnet, you can rename any `.config.json` file to `.config.jsonnet` and it will continue to work. Then you can gradually add Jsonnet features as needed.

## Basic Example

### Original JSON
```json
{
  "config": [
    {
      "rule": "rule123",
      "matches": {
        "entity": "domainEntity",
        "namespace": "EdFi",
        "entityName": "Grade"
      },
      "data": {
        "DataGoesHere": true
      }
    },
    {
      "rule": "rule456",
      "matches": {
        "entity": "domainEntity",
        "namespace": "EdFi",
        "entityName": "Student"
      },
      "data": {
        "DataGoesThere": true
      }
    }
  ]
}
```

### Improved Jsonnet
```jsonnet
// Define common values as variables
local namespace = "EdFi";

// Create a reusable function
local createRule(ruleName, entityName, data) = {
  rule: ruleName,
  matches: {
    entity: "domainEntity",
    namespace: namespace,
    entityName: entityName,
  },
  data: data,
};

{
  config: [
    createRule("rule123", "Grade", { DataGoesHere: true }),
    createRule("rule456", "Student", { DataGoesThere: true }),
  ],
}
```

## Advanced Features

### Using External Variables

External variables allow you to pass values from the environment or command line:

```jsonnet
local environment = std.extVar("ENVIRONMENT");
local enableFeature = std.extVar("ENABLE_FEATURE") == "true";

{
  config: [
    {
      rule: "baseRule",
      data: {
        environment: environment,
      },
    },
  ] + if enableFeature then [
    {
      rule: "optionalRule",
      data: {
        enabled: true,
      },
    },
  ] else [],
}
```

Pass external variables via MetaEd configuration:
```javascript
{
  externalVariables: {
    ENVIRONMENT: "production",
    ENABLE_FEATURE: "true"
  }
}
```

### Complex Configuration Example

See [examples/edfiApiSchema.config.jsonnet](../examples/edfiApiSchema.config.jsonnet) for a comprehensive example showing:
- Helper functions for creating rules
- Version range constants
- Conditional configuration
- Array concatenation for dynamic rules

## Backward Compatibility

All existing JSON configuration files continue to work without any changes. Jsonnet support is purely additive and optional.

## Troubleshooting

### Common Errors

1. **Undefined external variable**: Make sure all external variables used in the Jsonnet file are provided in the configuration
2. **Syntax errors**: Jsonnet requires proper syntax - use a Jsonnet linter or validator
3. **Import not found**: Ensure imported files are in the library paths

### Validation

Configuration validation using Joi schemas works the same for both JSON and Jsonnet files. The Jsonnet is evaluated to JSON first, then validated against the plugin's configuration schema.