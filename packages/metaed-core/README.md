# metaed-core

Core engine for the MetaEd DSL pipeline. Provides the shared model, plugin
abstractions, and pipeline orchestration used by all MetaEd packages.

## Input Configuration

`MetaEdConfiguration` type with key fields:

- `artifactDirectory` — Where generated artifacts are written
- `deployDirectory` — Target for deployment operations
- `pluginTechVersion` — Technology version for plugin selection
- `defaultPluginTechVersion` — Fallback technology version
- `projects` — Array of project definitions (name, version, namespace, paths)
- `projectPaths` — File system paths for MetaEd source files
- `pluginConfigDirectories` — Directories containing plugin configuration
- `allianceMode` — Whether running in Ed-Fi Alliance mode
- `suppressPrereleaseVersion` — Controls version formatting in output paths

## Output

- Parsed MetaEd model (domain entities, associations, descriptors, etc.)
- Pipeline execution results (validation failures, generated output)
- `GeneratedOutput` objects containing a human-readable name, namespace, file name,
  folder name, and content as either a string (`resultString`) or a binary `Buffer`
  (`resultStream`; takes precedence over `resultString` when set)

## Business Logic

Orchestrates the sequential pipeline: initialize → load → parse → build → validate →
enhance → generate → write. Defines the plugin contract (validators, enhancers,
generators), the domain model types, and the shared infrastructure for file I/O,
logging, and configuration resolution.
