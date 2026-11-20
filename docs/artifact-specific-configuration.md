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
- `educationOrganizationIdentitySecurableElements` requires a `roleName`.

### New resources and additions

For a new domain entity or association, including one declared in an extension project, the generated resource schema includes the education organization paths found by the security enhancers. An addition to an existing resource (`domainEntityExtension` or `associationExtension`) can also match a rule. The schema builder emits empty `securableElements` arrays for both kinds of addition.

For example, a `Domain Entity EdFi.Student additions` declaration can add a school reference with the role name `Review`. A rule matching that addition can select `ReviewSchool` and its `SchoolId`. The generated `students` extension schema includes `ReviewSchool` in `documentPathsMapping`, while `securableElements.EducationOrganization` is `[]`. [Resource schema builder](../packages/metaed-plugin-edfi-api-schema/src/enhancer/ApiSchemaBuildingEnhancer.ts)

### Version ranges and overlapping rules

Both rules accept an optional `versionRange` for the Data Standard version. When several API Schema rules match the same entity, MetaEd combines their `securableElements` arrays and keeps the first `versionRange` supplied for that entity. Each security enhancer checks that shared range before applying its configuration.

For example, suppose two rules map `DisciplineAction` to the IDs of `ResponsibilitySchool` and `AssignmentSchool`, with ranges `>=6.0.0` and `>=5.0.0` respectively. On Data Standard 5.2, putting the responsibility school rule first skips both mappings. Putting the assignment school rule first applies both.

## Configuration Data Storage

The loader deep-merges a matching rule's `data` under `entity.config[pluginShortName]`. For the first example, the direct-mapping enhancer reads `entity.config.edfiApiSchema.securableElements` on `DisciplineAction`. [Model annotation](../packages/metaed-core/src/plugin/AnnotateModelWithConfiguration.ts) · [Direct-mapping enhancer](../packages/metaed-plugin-edfi-api-schema/src/enhancer/security/EducationOrganizationConfigurationEnhancer.ts)

An unregistered rule fails configuration validation. The build CLI reports the plugin's error count and exits `1`. An unknown namespace in a registered rule produces an annotation error with the namespace and configuration path. An entity name that matches no entity of the specified type and namespace produces a warning.
