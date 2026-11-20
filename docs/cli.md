# Command Line Interface

The build CLI generates MetaEd artifacts. The deploy CLI copies selected artifacts into a local ODS/API source tree. Run the commands below from the repository root with the compiled console entry points available. Use `-h` on either entry point to list its options.

## Build

```bash
node packages/metaed-console/dist/index.js -c metaed.conf.json
```

The examples below accept the license in the JSON file. You can also pass `-a` or `--accept-license` on the command line. Both CLIs require the parsed option. To override the target technology version, pass `-x` with a version such as `6.0.0`. The [build-console README](../packages/metaed-console/README.md#input-configuration) lists the build options.

### Build Output

For the core project in the examples, the build writes the following directories under `artifactDirectory`. Each extension gets its own namespace directory alongside `EdFi/`.

```text
Documentation/
  DataDictionary/
  Ed-Fi-API-Catalog/
  Ed-Fi-Handbook/
EdFi/
  ApiMetadata/
  ApiSchema/
  Database/
  Interchange/
  XSD/
```

## Deploy

```bash
node packages/metaed-odsapi-deploy-console/dist/index.js -c metaed.conf.json --core
```

With `-c`, deploy reads existing artifacts. The examples use a core-only model and set `allianceMode` to allow the extension path precheck to pass with no extension folders. The `--core` option includes the core artifacts in the copy. For source-scan build and deploy, see the [deploy-console README](../packages/metaed-odsapi-deploy-console/README.md#business-logic).

### Deploy Output

Set `deployDirectory` to the parent of `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation`. For the ODS/API 6.0.0 target in these examples, the core copy destination is `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/`. If the build includes an extension with matching project and namespace names, its destination is `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts/`.

| Source under the artifact namespace | Destination under the project's `Artifacts/` |
| --- | --- |
| `ApiMetadata/` | `Metadata/` |
| `Database/SQLServer/ODS/Data/` | `MsSql/Data/Ods/` |
| `Database/SQLServer/ODS/Structure/` | `MsSql/Structure/Ods/` |
| `Database/PostgreSQL/ODS/Data/` | `PgSql/Data/Ods/` |
| `Database/PostgreSQL/ODS/Structure/` | `PgSql/Structure/Ods/` |
| `Interchange/` and `XSD/` | `Schemas/` |

Deploy skips absent source folders. Generated API Schema files and the shared `Documentation/` directory stay in the build tree. See the [deploy library README](../packages/metaed-odsapi-deploy/README.md#output) for other target versions.

## Configuration File

Save one of the following examples as `metaed.conf.json`. Replace the absolute artifact and deploy paths with paths on your machine. Build resolves a relative `artifactDirectory` from the **last input project**. A separate config-based deploy resolves it from the **process working directory**. If those differ, deploy can fail to find the artifacts or copy an older tree. A shared absolute artifact path makes both commands use the same output.

This example builds the installed Data Standard 4.0 package for ODS/API 6.0.0. Relative `projectPaths` start at the working directory.

```json
{
  "accept-license": true,
  "metaEdConfiguration": {
    "artifactDirectory": "/work/metaed/MetaEdOutput",
    "deployDirectory": "/work/ed-fi",
    "projects": [
      {
        "projectName": "Ed-Fi",
        "namespaceName": "EdFi",
        "projectExtension": "",
        "projectVersion": "4.0.0",
        "description": "The Ed-Fi Data Standard v4.0"
      }
    ],
    "projectPaths": ["./node_modules/@edfi/ed-fi-model-4.0"],
    "pluginConfigDirectories": [],
    "defaultPluginTechVersion": "6.0.0",
    "allianceMode": true,
    "suppressPrereleaseVersion": true
  }
}
```

To use a local copy of the same model, set `projectPaths` to the directory containing its MetaEd sources.

```json
{
  "accept-license": true,
  "metaEdConfiguration": {
    "artifactDirectory": "/work/metaed/MetaEdOutput",
    "deployDirectory": "/work/ed-fi",
    "projects": [
      {
        "projectName": "Ed-Fi",
        "namespaceName": "EdFi",
        "projectExtension": "",
        "projectVersion": "4.0.0",
        "description": "The Ed-Fi Data Standard v4.0"
      }
    ],
    "projectPaths": ["./ed-fi-model-4.0"],
    "pluginConfigDirectories": [],
    "defaultPluginTechVersion": "6.0.0",
    "allianceMode": true,
    "suppressPrereleaseVersion": true
  }
}
```
