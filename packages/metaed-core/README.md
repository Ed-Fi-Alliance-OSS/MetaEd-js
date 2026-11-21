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
- `suppressPrereleaseVersion` — At ODS/API targets `>=7.1.0`, formats a valid Data Standard version as `major.minor.0` in XSD namespaces, schema annotations, and the Data Standard segment of deploy paths. API Schema uses the supplied versions for `projectVersion` and an extension's `compatibleDsRange`.
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
  file mapping, when file loading fails, plugin configuration loading throws or records a
  `LoadPluginConfiguration` error, or output writing fails. An unknown plugin rule takes this
  early return. The CLI logs the plugin's error count and exits `1` before it prints the
  rule diagnostic (METAED-1676). A registered rule targeting an unknown namespace fails
  during annotation. The CLI reaches final reporting, logs the namespace and configuration
  path, and exits `1`.
- **Syntax and plugin validation.** The pipeline collects syntax diagnostics per file before
  building the aggregate parse tree. The build CLI enables both `runValidators` and
  `stopOnValidationFailure`. After each plugin's validators, an accumulated error stops the
  loop before that plugin's enhancers and generators and prevents output writing.
- **Library options.** Disabling `runValidators` also bypasses the stop check. With only plugins
  that accept an invalid model, the pipeline can report a syntax error, write output, and return
  `failure: false` even with `stopOnValidationFailure` enabled. Independently, a plugin with
  `requiresValidModel` skips its own enhancers and generators on accumulated errors, marks the
  run failed, and allows later plugins to run. This failure preserves existing output.
- **File loading.** Files are loaded recursively from each project path when the extension is
  `.metaed`, `.metaEd`, `.MetaEd`, or `.METAED`. Loading fails the build when no such files are
  found in any configured input directory.
- **Output location.** Output goes to `artifactDirectory` (relative values resolved from the
  last input project path) or, when empty, to `MetaEdOutput` under the last input project path.
- **Output writing.** The writer creates directories recursively and writes each
  `GeneratedOutput` to `{namespace}/{folderName}/{fileName}`, or `{folderName}/{fileName}` when
  the namespace is empty. An output with neither a non-empty `resultString` nor a `resultStream`
  produces no file.
- **Output safety guards.** Replacing an existing directory requires `MetaEdOutput` in its
  resolved path. The writer stops if it finds a recognized MetaEd file, but its check skips
  ordinary subdirectories. Recursive replacement can therefore delete nested source files.
- **Project scanner.** `ProjectLoader` (`src/project/ProjectLoader.ts`) implements the
  `package.json` `metaEdProject` scanner used by `metaed-odsapi-deploy-console` source-scan
  mode; its discovery, namespace derivation, sorting (METAED-1675), de-duplication, and
  project-name override rules are documented in that package's README.
- **Compilation target.** Packages are compiled from TypeScript to CommonJS modules targeting
  ES2017.
