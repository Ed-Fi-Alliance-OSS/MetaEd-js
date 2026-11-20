# Jsonnet Configuration Support

MetaEd accepts JSON and [Jsonnet](https://jsonnet.org/) plugin configuration files. Jsonnet lets a configuration reuse values, call functions, and conditionally include rules. After evaluation, MetaEd validates the resulting rules against the same schemas it uses for JSON.

## File Naming

Use the plugin's short name, for example `edfiApiSchema.config.json` or `edfiApiSchema.config.jsonnet`. In each plugin configuration directory, MetaEd prefers the Jsonnet file when both exist. Valid JSON is also valid Jsonnet, so an existing configuration can be renamed before adding Jsonnet expressions.

## Basic Example

This API Schema rule adds the school ID from the responsibility school reference to the securable elements for `DisciplineAction` in Data Standard 5.2.

```json
{
  "config": {
    "rule": "educationOrganizationSecurableElements",
    "matches": { "entity": "domainEntity", "namespace": "EdFi", "entityName": "DisciplineAction" },
    "data": {
      "securableElements": [{ "propertyPath": "ResponsibilitySchool", "requiredIdentityProperty": "SchoolId" }]
    }
  }
}
```

The same rule in Jsonnet can use a function to build the property mapping.

```jsonnet
local school(path) = { propertyPath: path, requiredIdentityProperty: "SchoolId" };
{
  config: {
    rule: "educationOrganizationSecurableElements",
    matches: { entity: "domainEntity", namespace: "EdFi", entityName: "DisciplineAction" },
    data: { securableElements: [school("ResponsibilitySchool")] },
  },
}
```

## Using External Variables

The [checked-in API Schema example](../../metaed-plugin-edfi-api-schema/examples/edfiApiSchema.config.jsonnet) requires one external string, `INCLUDE_REPORTED_SCHOOL`. The value `"true"` includes a mapping from `StudentAssessment.ReportedSchool` to `SchoolId`. The value `"false"` omits that mapping. Both branches apply the other configured security rules.

To run the example with the repository's installed dependencies, save the following as `metaed.conf.json` in the repository root. Set `artifactDirectory` to an absolute output path on your machine.

```json
{
  "accept-license": true,
  "metaEdConfiguration": {
    "artifactDirectory": "/tmp/metaed-example/MetaEdOutput",
    "projects": [
      {
        "projectName": "Ed-Fi",
        "namespaceName": "EdFi",
        "projectExtension": "",
        "projectVersion": "5.2.0",
        "description": "The Ed-Fi Data Standard v5.2"
      }
    ],
    "projectPaths": ["./node_modules/@edfi/ed-fi-model-5.2"],
    "pluginConfigDirectories": ["./packages/metaed-plugin-edfi-api-schema/examples"],
    "defaultPluginTechVersion": "7.3.0",
    "externalVariables": { "INCLUDE_REPORTED_SCHOOL": "false" }
  }
}
```

From the repository root, run the build with the value supplied in JSON.

```bash
npx ts-node --transpile-only packages/metaed-console/src/index.ts -c metaed.conf.json
```

To include the reported school mapping, supply the same field as a dotted build CLI argument.

```bash
npx ts-node --transpile-only packages/metaed-console/src/index.ts -c metaed.conf.json --metaEdConfiguration.externalVariables.INCLUDE_REPORTED_SCHOOL=true
```

The evaluator reads `metaEdConfiguration.externalVariables` from the parsed configuration. A shell environment variable alone does not populate it. If a required name is missing, `std.extVar` fails during evaluation.

## Imports

CLI builds pass the plugin configuration's contents and external variables to the evaluator. A sibling file referenced by `import` or `importstr` is unavailable in this mode. Keep CLI configurations self-contained. When calling the lower-level loader directly, `loadConfigurationFile` accepts individual files in `libraryPaths` and makes their contents available for import by base name. [Jsonnet loader](../src/plugin/JsonnetConfigLoader.ts)
