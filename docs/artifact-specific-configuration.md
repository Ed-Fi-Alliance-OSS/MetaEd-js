# Artifact Specific Configuration

MetaEd can apply plugin configuration to a project model before running plugin validators, enhancers, and generators. The API Schema plugin uses configuration on matched entities to determine which education organization identifiers to include as securable elements.

## Configuration File Format

Name the file after the plugin's short name. For the API Schema plugin, use `edfiApiSchema.config.json` or `edfiApiSchema.config.jsonnet`. The build searches the configured `pluginConfigDirectories`, falling back to the input project directories when that list is empty. In each directory the Jsonnet file takes precedence over JSON. [Jsonnet configuration guide](../packages/metaed-core/docs/jsonnet-configuration.md)

The top-level `config` field accepts one rule or an array of rules. Each rule contains a registered `rule` name and a `data` payload. An optional `matches` object or array selects the entities that receive the data. With no `matches`, the loader merges the data into the plugin environment's `config` field. The API Schema security enhancers read entity-level configuration, so the examples below include matches.

## Matching Options

| Field | How the matcher uses it |
| --- | --- |
| `entity` | Required in each match. Accepts a top-level model type or an array of types, such as `domainEntity`, `association`, or `domainEntitySubclass`. |
| `entityName` | Optional MetaEd name or array of names. Matches exactly, including case, within the selected types and namespaces. |
| `namespace` | A namespace name or array of names. An explicit `namespace` cannot appear alongside either `core` or `extensions` in the same match. |
| `core`, `extensions` | `core: true` selects non-extension namespaces. Otherwise `extensions: true` selects extension namespaces. Both flags may appear together. If both are true, only core namespaces match. With no explicit namespace and neither flag true, all namespaces are eligible. |

Within one match, an entity must meet the type, namespace, and name criteria. An array of matches selects the union of their results. MetaEd applies the rule once per matched entity. The accepted model types and match fields are defined in the [configuration schema](../packages/metaed-core/src/plugin/ConfigurationSchema.ts) and the [model type list](../packages/metaed-core/src/model/ModelType.ts).

## Configuration Examples

Save the following JSON as `edfiApiSchema.config.json` in a plugin configuration directory for a Data Standard 5.2 build. The first rule adds the responsibility school's ID to the securable elements for `DisciplineAction`. It uses both namespace flags to demonstrate core precedence. The second finds education organization IDs among identity paths with the `Program` role for the named evaluation entities.

```json
{
  "config": [
    {
      "rule": "educationOrganizationSecurableElements",
      "matches": { "entity": "domainEntity", "core": true, "extensions": true, "entityName": "DisciplineAction" },
      "data": {
        "securableElements": [
          { "propertyPath": "ResponsibilitySchool", "requiredIdentityProperty": "SchoolId" }
        ]
      }
    },
    {
      "rule": "educationOrganizationIdentitySecurableElements",
      "matches": {
        "entity": "domainEntity",
        "namespace": "EdFi",
        "entityName": ["ProgramEvaluation", "ProgramEvaluationElement"]
      },
      "data": { "versionRange": ">=5.0.0", "roleName": "Program" }
    }
  ]
}
```

## Plugin Configuration Schema Registration

The loader validates the rule structure, then validates each `data` payload against the Joi schema registered for its rule name in the plugin's `configurationSchemas` map. The API Schema plugin registers the two rules shown above. [Rule registration](../packages/metaed-plugin-edfi-api-schema/src/index.ts) · [Payload schemas](../packages/metaed-plugin-edfi-api-schema/src/model/ConfigurationSchema.ts)

- `educationOrganizationSecurableElements` requires a nonempty `securableElements` array. Each element names a `propertyPath` and a `requiredIdentityProperty`. The enhancer appends matching paths by default. With `mode: "replace"`, it clears the entity's existing education organization securable elements first.
- `educationOrganizationIdentitySecurableElements` requires a `roleName`. Both rules accept a `versionRange` that the enhancers compare with the Data Standard version.

## Configuration Data Storage

The loader deep-merges a matching rule's `data` under `entity.config[pluginShortName]`. For the first example, the direct-mapping enhancer reads `entity.config.edfiApiSchema.securableElements` on `DisciplineAction`. [Model annotation](../packages/metaed-core/src/plugin/AnnotateModelWithConfiguration.ts) · [Direct-mapping enhancer](../packages/metaed-plugin-edfi-api-schema/src/enhancer/security/EducationOrganizationConfigurationEnhancer.ts)

An unregistered rule fails configuration validation. The build CLI reports the plugin's error count and exits `1`. An unknown namespace in a registered rule produces an annotation error with the namespace and configuration path. An entity name that matches no entity of the specified type and namespace produces a warning.
