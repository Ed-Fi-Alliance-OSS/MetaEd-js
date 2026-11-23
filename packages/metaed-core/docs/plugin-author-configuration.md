# Artifact configuration for plugin authors

To configure a build, use the repository guide for file discovery, matching rules, and worked examples. [Artifact Specific Configuration](../../../docs/artifact-specific-configuration.md)

## Register and validate a rule

In the plugin's `initialize` function, return a `configurationSchemas` map keyed by rule name. Each value is a Joi schema for that rule's `data` payload. For example, the API Schema plugin registers `educationOrganizationIdentitySecurableElements` with a schema that requires a string `roleName`. [Plugin registration](../../metaed-plugin-edfi-api-schema/src/index.ts) · [Payload schemas](../../metaed-plugin-edfi-api-schema/src/model/ConfigurationSchema.ts)

MetaEd validates the shared rule structure first, then looks up each rule by name and validates its payload. An unknown rule or invalid payload prevents annotation from that file. For a payload error, the diagnostic includes the file path and the failing field under `data/`. [Configuration loader](../src/plugin/LoadPluginConfiguration.ts)

## Read configuration in the plugin

- For a rule with `matches`, read the merged payload from `entity.config?.[pluginShortName]` on each matched entity.
- For a rule without `matches`, read the plugin-wide payload from `metaEd.plugin.get(pluginShortName)?.config`. [Model annotation](../src/plugin/AnnotateModelWithConfiguration.ts)

The loader checks Joi's validation errors and passes the original payload to annotation. A Joi default changes only the value returned by validation. Handle an omitted field where the plugin reads it. For example, the API Schema enhancer appends securable elements when `mode` is omitted and clears existing elements only for `mode: "replace"`. [Direct-mapping enhancer](../../metaed-plugin-edfi-api-schema/src/enhancer/security/EducationOrganizationConfigurationEnhancer.ts)
