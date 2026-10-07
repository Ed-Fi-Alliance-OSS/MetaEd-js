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

- **Pipeline stages.** The full stage order is: initialization, plugin setup (target
  technology versions), file loading, syntax validation, file indexing, parse tree building,
  model building (builder walk), namespace initialization, plugin configuration loading,
  per-plugin validators/enhancers/generators, output writing, and validation file mapping.
- **Early return.** The pipeline returns early, skipping all later stages including validation
  file mapping, when file loading fails, plugin configuration loading fails or records an
  error-category failure, or output writing fails. Validation file mapping is also where
  validation failures are logged, so these early returns suppress validation failure output
  (for example, plugin configuration validation messages are not printed). Known issue:
  METAED-1676.
- **Syntax validation.** Syntax validation failures are collected per loaded file before the
  aggregate parse tree is built, and are included in the final validation result. When
  `stopOnValidationFailure` is enabled, existing error-category failures prevent plugin
  enhancers, plugin generators, and output writing.
- **File loading.** Files are loaded recursively from each project path when the extension is
  `.metaed`, `.metaEd`, `.MetaEd`, or `.METAED`. Loading fails the build when no such files are
  found in any configured input directory.
- **Output location.** Output goes to `artifactDirectory` (relative values resolved from the
  last input project path) or, when empty, to `MetaEdOutput` under the last input project path.
- **Output writing.** The writer creates directories recursively and writes each
  `GeneratedOutput` to `{namespace}/{folderName}/{fileName}`, or `{folderName}/{fileName}` when
  the namespace is empty. An output with neither a non-empty `resultString` nor a `resultStream`
  produces no file.
- **Output safety guards.** Before writing, an existing output directory is deleted only if the
  output path contains the substring `MetaEdOutput`; otherwise the writer logs an error and fails.
  This guard is path-name based, not a check of directory contents. The writer also refuses to
  write (and fails) when `.metaed` files (any of the casings above) are found in the output
  location.
- **Project scanner.** `ProjectLoader` (`src/project/ProjectLoader.ts`) implements the
  `package.json` `metaEdProject` scanner used by `metaed-odsapi-deploy-console` source-scan
  mode; its discovery, namespace derivation, sorting (METAED-1675), de-duplication, and
  project-name override rules are documented in that package's README.
- **Compilation target.** Packages are compiled from TypeScript to CommonJS modules targeting
  ES2017.
