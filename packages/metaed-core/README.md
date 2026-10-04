# metaed-core

Core engine for the MetaEd DSL pipeline. Provides the shared model, plugin
abstractions, and pipeline orchestration used by all MetaEd packages.

## Input Configuration

`MetaEdConfiguration` type with key fields:

- `artifactDirectory` — Where generated artifacts are written
- `deployDirectory` — Target for deployment operations
- `pluginTechVersion` — Technology version field (present for compatibility; current plugin setup assigns every plugin `defaultPluginTechVersion`)
- `defaultPluginTechVersion` — Fallback technology version
- `projects` — Array of project metadata (namespace, name, version, description, optional project extension)
- `projectPaths` — File system paths for MetaEd source files, parallel to `projects` (same length and order)
- `pluginConfigDirectories` — Directories containing plugin configuration
- `allianceMode` — Whether running in Ed-Fi Alliance mode
- `suppressPrereleaseVersion` — Formats the Data Standard version as `major.minor.0` in some generated version strings (for example XSD schema versions at technology version `>=7.1.0`) and in ODS/API deploy paths; does not affect build artifact paths
- `externalVariables` — Optional variables passed to Jsonnet plugin configuration evaluation

## Output

- Parsed MetaEd model (domain entities, associations, descriptors, etc.)
- Pipeline execution results (validation failures, generated output)
- `GeneratedOutput` objects containing a human-readable name, namespace, file name,
  folder name, and content as either a string (`resultString`) or a binary `Buffer`
  (`resultStream`; used only when `resultString` is empty — a non-empty `resultString` takes precedence)

## Business Logic

Orchestrates the sequential pipeline: initialize → load → parse → build → namespace
init → plugin config load → then for each plugin in dependency order: validate →
enhance → generate. Output is written once, after the plugin loop, and only if no
failure occurred while running plugins. Defines the plugin contract (validators, enhancers,
generators), the domain model types, and the shared infrastructure for file I/O,
logging, and configuration resolution.
