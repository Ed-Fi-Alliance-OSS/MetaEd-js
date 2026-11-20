# Command Line Interface

The build CLI generates MetaEd artifacts. The deploy CLI copies selected artifacts into a local ODS/API source tree. Run the commands below from the repository root. The core example uses the compiled console entry points. The Sample example runs from source with repository dependencies installed. Use `-h` on either CLI to list its options.

## Build

```bash
node packages/metaed-console/dist/index.js -c metaed.conf.json
```

The examples below accept the license in the JSON file. You can also pass `-a` or `--accept-license` on the command line. Both CLIs require the parsed option. To override the target technology version, pass `-x` with a version such as `6.0.0`. The [build-console README](../packages/metaed-console/README.md#input-configuration) lists the build options.

### Build Output

The build writes core artifacts under `EdFi/`, shared documentation under `Documentation/`, and extension artifacts under each distinct extension namespace. For source-scan deploy, choose extension project names that are distinct after namespace derivation and match their namespace spelling. For example, `Twin-Name` and `TwinName` both generate into `TwinName/`, while deploy looks for a source folder for each project name.

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

With `-c`, deploy reads existing artifacts. Use `--core` to include core artifacts in the copy. The core-only example sets `allianceMode` so the extension path check can pass with no extension folders.

**Check the contents of `artifactDirectory` before deploying.** At targets `>=3.3.0`, every immediate entry except `EdFi`, `Documentation`, and `ApiSchema` selects an ODS/API extension's unversioned `Artifacts/` directory for cleanup. On 6.1, a leftover `Old/` in `artifactDirectory` can cause deploy to delete `EdFi.Ods.Extensions.Old/Artifacts/` even when `Chosen` is the only configured extension. Deploy can then copy `Chosen` and exit `0`. Use `--suppressDelete` to skip cleanup. [Deploy behavior by target version](PRD-4.x.md#deploy-behavior-by-target-version) · [Source-scan build and deploy](../packages/metaed-odsapi-deploy-console/README.md#business-logic)

### Deploy Output

Set `deployDirectory` to the parent of `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation`. For the 6.0 and 6.1 targets used below, the core copy destination is `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/`. The extension copy destination is `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts/`.

| Source under the artifact namespace | Destination under the project's `Artifacts/` |
| --- | --- |
| `ApiMetadata/` | `Metadata/` |
| `Database/SQLServer/ODS/Data/` | `MsSql/Data/Ods/` |
| `Database/SQLServer/ODS/Structure/` | `MsSql/Structure/Ods/` |
| `Database/PostgreSQL/ODS/Data/` | `PgSql/Data/Ods/` |
| `Database/PostgreSQL/ODS/Structure/` | `PgSql/Structure/Ods/` |
| `Interchange/` and `XSD/` | `Schemas/` |

Deploy skips absent source folders. Generated API Schema files and the shared `Documentation/` directory stay in the build tree. [Destinations for other target versions](PRD-4.x.md#deploy-behavior-by-target-version)

## Configuration File

For `artifactDirectory`, choose a dedicated absolute path ending in `MetaEdOutput`. On subsequent builds the writer replaces the output directory and requires its resolved path to contain that exact, case-sensitive text. Set `deployDirectory` to the absolute path of the parent of your ODS/API repositories.

An absolute artifact path also makes build and deploy use the same output. Build resolves a relative `artifactDirectory` from the **last input project**. A separate config-based deploy resolves it from the **process working directory**. If those differ, deploy can fail to find the artifacts or copy an older tree.

### Build the core Data Standard

Save this example as `metaed.conf.json` for the commands above. It builds the installed Data Standard 4.0 package for ODS/API 6.0.0. To use a local copy, replace `./node_modules/@edfi/ed-fi-model-4.0` with its source directory. Relative `projectPaths` start at the working directory.

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

### Build and deploy the Sample extension

Save this configuration as `metaed-sample.json`, adjusting the two absolute paths to your machine. It builds Data Standard 5.2 and the repository's Sample extension for ODS/API 6.1. The order of `projectPaths` matches the order of `projects`. Sample omits `projectExtension`, so the generated API model uses the default suffix `EXTENSION`. [Sample model](../packages/metaed-plugin-edfi-api-schema/test/integration/sample-project)

```json
{
  "accept-license": true,
  "metaEdConfiguration": {
    "artifactDirectory": "/work/metaed/sample/MetaEdOutput",
    "deployDirectory": "/work/ed-fi",
    "projects": [
      {
        "projectName": "Ed-Fi",
        "namespaceName": "EdFi",
        "projectExtension": "",
        "projectVersion": "5.2.0",
        "description": "The Ed-Fi Data Standard v5.2"
      },
      {
        "projectName": "Sample",
        "namespaceName": "Sample",
        "projectVersion": "1.0.0",
        "description": "Sample extension"
      }
    ],
    "projectPaths": [
      "./node_modules/@edfi/ed-fi-model-5.2",
      "./packages/metaed-plugin-edfi-api-schema/test/integration/sample-project"
    ],
    "pluginConfigDirectories": [],
    "defaultPluginTechVersion": "6.1.0",
    "allianceMode": false,
    "suppressPrereleaseVersion": true
  }
}
```

Before deploying, ensure `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/` exists under `deployDirectory`. Run both commands from the MetaEd repository root with the same configuration. The second command copies only the extension.

```bash
npx ts-node --transpile-only packages/metaed-console/src/index.ts -c metaed-sample.json &&
  npx ts-node --transpile-only packages/metaed-odsapi-deploy-console/src/index.ts -c metaed-sample.json
```

The build writes `Sample/ApiMetadata/ApiModel-EXTENSION.json` under `artifactDirectory`. After deploy, the same file is at `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.Sample/Artifacts/Metadata/ApiModel-EXTENSION.json` under `deployDirectory`.
