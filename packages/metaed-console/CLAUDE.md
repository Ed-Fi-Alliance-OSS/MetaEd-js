# CLAUDE.md - MetaEd Console

This file provides guidance to Claude Code when working with the MetaEd Console package.

## Overview

The MetaEd Console (`@edfi/metaed-console`) is a command-line interface for running the MetaEd build process.
It transforms MetaEd domain-specific language (DSL) files into various output artifacts like SQL scripts, XSD schemas, and API specifications.

## Build and Run

**Prerequisites:**
- Build the project from the parent directory: `npm run build`
- Verify functionality: `node ./dist/index.js -h` from the metaed-console directory

**Clean build:**
- **IMPORTANT** Always do this when done working with MetaEd Console Package
- `npm run build:clean` from the parent directory

## Usage

### Basic Command Structure
```bash
node ./dist/index.js [options]
```

### Required Options
- `-a, --accept-license`: Accept the Ed-Fi License Agreement (required)
- `-c, --config <path>`: Path to configuration file (recommended)

### Optional Options
- `-x, --defaultPluginTechVersion <version>`: Default technology version for plugins (semver format)
- `--suppressPrereleaseVersion`: Suppress prerelease identifier in version (default: true)
- `-h, --help`: Show help
- `-v, --version`: Show version

### Example Usage
```bash
# Run with config file
node ./dist/index.js -a -c ./src/metaed.json

# Run with custom plugin tech version
node ./dist/index.js -a -c ./config.json -x "7.2.0"
```

## Configuration File (metaed.json)

Create a `metaed.json` configuration file to specify your MetaEd project settings.

### Basic Configuration Structure
```json
{
  "metaEdConfiguration": {
    "artifactDirectory": "/path/to/output",
    "deployDirectory": "",
    "pluginTechVersion": {},
    "projects": [
      {
        "namespaceName": "EdFi",
        "projectName": "Ed-Fi",
        "projectVersion": "5.2.0",
        "projectExtension": "",
        "description": "The Ed-Fi Data Model 5.2"
      }
    ],
    "projectPaths": [
      "node_modules/@edfi/ed-fi-model-5.2"
    ],
    "pluginConfigDirectories": [],
    "defaultPluginTechVersion": "7.2.0",
    "allianceMode": false,
    "suppressPrereleaseVersion": true
  }
}
```

### Configuration Options

**Core Settings:**
- `artifactDirectory`: Output directory for generated artifacts
- `deployDirectory`: Deployment directory (optional)
- `defaultPluginTechVersion`: Default technology version for all plugins
- `allianceMode`: Enable Alliance Mode (set to `false` for external users)
- `suppressPrereleaseVersion`: Remove prerelease identifiers from versions

**Project Definition:**
- `projects`: Array of MetaEd projects to process
  - `namespaceName`: Namespace for the project (e.g., "EdFi")
  - `projectName`: Human-readable project name
  - `projectVersion`: Version of the data model
  - `projectExtension`: Extension identifier (empty for core models)
  - `description`: Project description

**Paths:**
- `projectPaths`: Array of paths to MetaEd project directories
- `pluginConfigDirectories`: Additional plugin configuration directories

### Using Ed-Fi Data Model 5.2

**Recommended Configuration for Ed-Fi 5.2:**
Note: Have the "MetaEdOutput" folder be under the metaed-console directory.

```json
{
  "metaEdConfiguration": {
    "artifactDirectory": "./MetaEdOutput",
    "projects": [
      {
        "namespaceName": "EdFi",
        "projectName": "Ed-Fi",
        "projectVersion": "5.2.0",
        "projectExtension": "",
        "description": "The Ed-Fi Data Model 5.2"
      }
    ],
    "projectPaths": [
      "node_modules/@edfi/ed-fi-model-5.2"
    ],
    "defaultPluginTechVersion": "7.2.0",
    "allianceMode": false,
    "suppressPrereleaseVersion": true
  }
}
```

**Available Ed-Fi Models:**
The following Ed-Fi data models are installed in `node_modules`:
- `@edfi/ed-fi-model-5.0` (v3.0.0)
- `@edfi/ed-fi-model-5.1` (v3.0.1)
- `@edfi/ed-fi-model-5.2` (v3.0.0) - **Recommended**

### Extension Projects

To include extensions alongside the core Ed-Fi model:
```json
{
  "metaEdConfiguration": {
    "projects": [
      {
        "namespaceName": "EdFi",
        "projectName": "Ed-Fi",
        "projectVersion": "5.2.0",
        "projectExtension": "",
        "description": "The Ed-Fi Data Model 5.2"
      },
      {
        "namespaceName": "MyExtension",
        "projectName": "Custom Extension",
        "projectVersion": "1.0.0",
        "projectExtension": "custom",
        "description": "Custom extension data model"
      }
    ],
    "projectPaths": [
      "node_modules/@edfi/ed-fi-model-5.2",
      "path/to/my/extension/metaed"
    ]
  }
}
```

Extension projects available in this repo:
- `packages/metaed-plugin-edfi-api-schema/test/integration/tpdm-project`
- `packages/metaed-plugin-edfi-api-schema/test/integration/homograph-project`
- `packages/metaed-plugin-edfi-api-schema/test/integration/sample-project`

## Exit Codes

- `0`: Success
- `1`: Failure (validation errors, multiple data standards, or exceptions)

## Common Issues

1. **No data standard project found**: Ensure your configuration includes at least one project with a valid data model
2. **Multiple data standard projects**: Only one data standard project is supported per run
3. **Path resolution**: Use absolute paths in configuration or paths relative to the working directory
