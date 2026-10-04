# MetaEd Product Requirements Document — Version 4.x

- Owner: Stephen Fuqua
- Version: 4.8
- Status: completed
- Repository: Ed-Fi-Alliance-OSS/MetaEd-Js
- Platform and runtime: Node.js packages (CommonJS); pull request and npm publish CI run Node 22

> [!TIP]
> This PRD defines the product requirements for MetaEd version 4.8, covering the Node.js monorepo that implements the MetaEd generator and its command-line interfaces. It covers the core features, functional and non-functional requirements, system architecture, and known limitations.
>
> It does _not cover_ the MetaEd DSL syntax and semantics, the MetaEd IDE Visual Studio Code extension (maintained in a separate repository), the Ed-Fi ODS/API runtime behavior, database execution semantics, or the Data Standard content itself.
>
> Package-level behavior details are documented in each package's `README.md` under Business Logic.

## 1. Product Overview

MetaEd is a technology framework that uses an Ed-Fi-aligned domain-specific language (DSL) to auto-generate software, database, and data standard artifacts from a single source definition. The term "MetaEd" encompasses:

- **MetaEd Language** — a lightweight DSL describing data elements, their properties, and their organization into entities and domains (the Ed-Fi Unified Data Model). Files use the `.metaed` extension.
- **MetaEd Generator** — a command-line application that compiles MetaEd language files into technical artifacts.
- **MetaEd Packages** — a collection of Node.js packages that implement the parsing, validation, enhancement, and generation pipeline.

MetaEd-js is a Node.js monorepo that compiles Ed-Fi MetaEd DSL projects into local filesystem artifacts used by downstream Ed-Fi data platform tooling. A MetaEd project is represented by `.metaed` source files plus project metadata such as project name, namespace, version, optional project extension, and description. The generator reads one Data Standard project and zero or more extension projects, validates and enriches the semantic model, runs the default plugin set, and writes generated outputs grouped by namespace.

The repository provides two primary command-line workflows:

- `@edfi/metaed-console` — runs the MetaEd build pipeline and writes generated artifacts.
- `@edfi/metaed-odsapi-deploy-console` — optionally builds from project source directories and then copies generated artifacts into a local Ed-Fi ODS/API source tree layout for supported technology versions.

Repository automation also includes a manually dispatchable API Schema packaging workflow under `eng/ApiSchema` that runs MetaEd, copies selected generated API Schema, XSD, and Interchange artifacts (plus the checked-in core `discovery-spec.json`) into staging directories for .NET package projects, packs NuGet packages, and publishes those packages through GitHub Actions. The workflow runs only on protected refs (`github.ref_protected`); the publish job always attempts to push and fails if the feed secret is missing.

The Ed-Fi Alliance uses MetaEd internally to produce core components such as JSON API metadata, SQL scripts, and technical documentation from a single source definition written in the MetaEd DSL. Externally, Ed-Fi Community members use MetaEd to create and maintain Ed-Fi Extensions, which are additive data models that extend the core Ed-Fi Data Standard to meet local needs.

The product value is artifact consistency: SQL, XSD, API metadata, API schema, documentation, and dictionary outputs are generated from the same MetaEd model rather than authored independently.

### 1.1 Strategic Alignment

- **Single source of truth for data models.** All Ed-Fi technical artifacts (SQL, XSD, API metadata, documentation) are derived from one set of `.metaed` files, eliminating drift between artifacts.
- **Accelerate extension development.** Community implementers can rapidly create, validate, and build extensions to the Ed-Fi Data Standard without manual artifact authoring.
- **Support continuous integration.** MetaEd can be run headlessly in CI/CD pipelines to validate data models and produce deployment-ready artifacts on every commit.
- **Multi-version support.** A single MetaEd installation can target multiple Data Standard versions and ODS/API versions through configuration.

### 1.2 Target Users and Personas

- **Ed-Fi Alliance Technical Team / Data Standard maintainers** — maintain the core Ed-Fi Data Standard MetaEd project and need repeatable generated artifacts for release and packaging workflows. Use internal workflows that rely on plugin configuration, Alliance Mode-enabled builds, and CI automation.
- **Education Agency Developers and Ed-Fi Integration Partners / Extension developers** — maintain additive MetaEd extension projects and need validation plus generated artifacts for ODS/API integration. Build and maintain extensions on behalf of education agencies using both CLI workflows and CI pipelines.
- **Build and release engineers** — run MetaEd headlessly in CI, publish npm packages, package API Schema artifacts, and verify generated outputs against authoritative fixtures.
- **Business Analysts / Downstream artifact consumers** — use generated spreadsheets, HTML documentation, JSON schema and metadata files, SQL scripts, and XSD files without reading `.metaed` source. Review generated documentation to understand the data model.

### 1.3 Jobs to Be Done

#### JTBD 1.1. Compile model changes into deployable artifacts

**Personas**: Education Agency Developers, Ed-Fi Integration Partners, Ed-Fi Alliance Technical Team

**When** I am ready to test my model changes, **I want** to run a Build command that compiles all artifacts, **so that** I can verify correctness before deploying.

**How MetaEd Helps**: The Build command transforms `.metaed` source files into SQL scripts, XSD schemas, API metadata, interchange definitions, and documentation in a single operation.

#### JTBD 1.2. Validate a model

**Personas**: Education Agency Developers, Ed-Fi Integration Partners, Ed-Fi Alliance Technical Team

**When** I change `.metaed` files, **I need** the pipeline to report syntax, semantic, configuration, and plugin validation failures in a machine-detectable build result, **so that** errors can be identified and corrected before deployment.

**How MetaEd Helps**: The pipeline collects and reports validation failures at every stage, stops on errors when configured to do so, and exits with a non-zero code for CI detection.

#### JTBD 1.3. Deploy extension artifacts to the ODS/API

**Personas**: Education Agency Developers, Ed-Fi Integration Partners

**When** I need to integrate my extension with the ODS/API, **I want** to run a Deploy command that copies artifacts to the correct locations, **so that** the ODS/API build process picks them up automatically.

**How MetaEd Helps**: The Deploy command knows the expected directory structure of the ODS/API source tree and copies each artifact type to its correct destination.

#### JTBD 1.4. Validate and produce artifacts in CI

**Personas**: Ed-Fi Alliance Technical Team, Ed-Fi Integration Partners, Build and release engineers

**When** I maintain a CI pipeline for data model changes, **I want** to run MetaEd headlessly via Node.js, **so that** I can validate and produce artifacts on every commit without a graphical environment.

**How MetaEd Helps**: The `metaed-console` CLI accepts a JSON configuration file and returns a non-zero exit code on failure, integrating cleanly with CI/CD pipelines.

#### JTBD 1.5. Understand the API shape of a data model

**Personas**: Business Analysts, Education Agency Developers, Ed-Fi Integration Partners

**When** I need to understand the API shape of a data model, **I want** generated documentation including a handbook, API catalog, and data dictionaries, **so that** I can understand the data model without reading source files.

**How MetaEd Helps**: The pipeline generates an HTML Data Handbook, API Catalog Excel workbook, SQL Data Dictionary, and XML Data Dictionary from the same model.

## 2. Enterprise and System Context

### 2.1 External Systems and Integrations

- **Local MetaEd project directories** provide `.metaed` files and optional `package.json` files with `metaEdProject` metadata.
- **Ed-Fi Data Standard npm packages** are package dependencies of `@edfi/metaed-console` for model packages `@edfi/ed-fi-model-4.0`, `@edfi/ed-fi-model-5.0`, `@edfi/ed-fi-model-5.1`, `@edfi/ed-fi-model-5.2`, `@edfi/ed-fi-model-6.0`, and `@edfi/ed-fi-model-6.1`.
- **Ed-Fi ODS/API source trees** consume deployed artifact files under `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` directories.
- **SQL Server and PostgreSQL** are downstream targets for generated database scripts; MetaEd-js generates scripts but does not execute them.
- **API Schema and API metadata consumers** consume `ApiSchema*.json` and `ApiModel*.json` outputs.
- **.NET SDK and NuGet/Azure Artifacts** are used by API Schema packaging automation under `eng/ApiSchema`.
- **GitHub Actions and Azure Artifacts** are used by repository workflows for linting, testing, publishing npm packages, and packaging API Schema artifacts.
- **Ed-Fi npm Registry** — Azure DevOps-hosted npm feed for distributing MetaEd packages.
- **ANTLR 4.6 generated JavaScript grammar files** are part of the source tree used by the parser.

### 2.2 Deployment Boundaries

- MetaEd-js build and deploy commands operate on local files. The build pipeline reads `.metaed` source files and plugin configuration files, then writes artifacts to disk.
- Deploy copies files into a local ODS/API source tree layout. It does not deploy to running services, execute SQL, start databases, or validate ODS/API runtime behavior.
- Publishing workflows communicate with package feeds, but normal build and deploy runtime behavior is entirely filesystem-based.
- MetaEd does not communicate with external services during normal operation and does not require credentials at runtime.

## 3. Functional Requirements

### 3.1 Project Input and Configuration

- **FR-CFG-1**: The build CLI SHALL accept a JSON configuration file through `-c` / `--config` containing a top-level `metaEdConfiguration` object.
- **FR-CFG-2**: `metaEdConfiguration` SHALL support `artifactDirectory`, `deployDirectory`, `projects`, `projectPaths`, `pluginConfigDirectories`, `defaultPluginTechVersion`, `allianceMode`, and `suppressPrereleaseVersion`; it SHALL accept `pluginTechVersion` but ignore it (see §6.2); it SHALL support an optional `externalVariables` field for Jsonnet configuration evaluation.
- **FR-CFG-3**: The pipeline SHALL require `projects` and `projectPaths` to have the same length and SHALL map each project metadata entry to the corresponding source path.
- **FR-CFG-4**: The file loader SHALL recursively load `.metaed` files (case-insensitive extension) from each configured project path.
- **FR-CFG-5**: The build and deploy CLIs SHALL require exactly one Data Standard project, identified by namespace `EdFi`; no Data Standard project or multiple Data Standard projects SHALL cause failure.
- **FR-CFG-6**: Deploy console source mode SHALL discover projects from `package.json` files containing `metaEdProject` metadata, deriving each project's namespace from its project name (see §6.2 for discovery limitations).
- **FR-CFG-7**: Source-mode project discovery SHALL accept optional `projectNames` overrides for discovered project names.
- **FR-CFG-8**: Plugin configuration files SHALL be discovered from configured `pluginConfigDirectories`, or from input project directories when no plugin config directories are configured, as `{pluginShortName}.config.jsonnet` or `{pluginShortName}.config.json`, with Jsonnet preferred when both exist.
- **FR-CFG-9**: Plugin configuration loading SHALL support `externalVariables` for Jsonnet evaluation.
- **FR-CFG-10**: Plugin configuration rules SHALL support plugin-wide data or entity-matched data using `entity`, `namespace`, `core`, `extensions`, and `entityName` matching fields.
- **FR-CFG-11**: Configuration matching SHALL reject a single match rule that combines `namespace` with `core` or `extensions`.
- **FR-CFG-12**: The API Schema plugin SHALL validate plugin-specific configuration rules for `educationOrganizationSecurableElements` and `educationOrganizationIdentitySecurableElements`.
- **FR-CFG-13**: When project metadata does not provide `projectExtension`, the file loader SHALL use an empty project extension for namespace `EdFi` and `EXTENSION` for non-EdFi namespaces.
- **FR-CFG-14**: File loading SHALL fail the build when no `.metaed` files are found in any configured input directory.

### 3.2 Build Command

- **FR-BUILD-1**: `@edfi/metaed-console` SHALL run from Node.js and execute the MetaEd pipeline using the default plugin set.
- **FR-BUILD-2**: The build CLI SHALL require `-a` / `--accept-license` before executing.
- **FR-BUILD-3**: The build CLI SHALL accept `-c` / `--config` to specify a JSON configuration file.
- **FR-BUILD-4**: The build CLI SHALL accept `-x` / `--defaultPluginTechVersion` to override the configured default technology version for all plugins.
- **FR-BUILD-5**: The default plugin technology version SHALL be `6.0.0` when not overridden by configuration or CLI argument.
- **FR-BUILD-6**: The build CLI SHALL support `--suppressPrereleaseVersion`, defaulting to `true`; when a configuration file is supplied, the configuration's `suppressPrereleaseVersion` value governs instead. The option affects generated version data, not artifact output paths.
- **FR-BUILD-7**: The build pipeline SHALL load source files, validate, enhance, and generate artifacts through each plugin, and write output, in that order (see §5.1). Some failures end the run before validation messages are reported (see §6.2, METAED-1676).
- **FR-BUILD-8**: The build pipeline SHALL stop plugin execution on validation errors when `stopOnValidationFailure` is enabled.
- **FR-BUILD-9**: The build CLI SHALL exit with code `0` only when no validation error and no pipeline failure occurred; otherwise it SHALL exit with code `1`.
- **FR-BUILD-10**: Generated outputs SHALL be written under the configured artifact directory or a `MetaEdOutput` directory under the last input project path. Relative `artifactDirectory` values SHALL be resolved from the last input project path.
- **FR-BUILD-11**: Output writing SHALL group generated files by namespace, with the generator-provided folder path under that namespace.
- **FR-BUILD-12**: Output writing SHALL NOT delete MetaEd source: it SHALL replace an existing output directory only when that directory's path identifies it as a MetaEd output location (contains `MetaEdOutput`), and SHALL otherwise fail.
- **FR-BUILD-13**: Output writing SHALL NOT overwrite MetaEd source: it SHALL refuse to write when `.metaed` files are found in the output location.

### 3.3 Generated Artifact Families

#### 3.3.1 ODS/API Metadata

- **FR-ODSAPI-METADATA-1**: The build SHALL generate ODS/API metadata JSON files per namespace as `ApiMetadata/ApiModel.json` when `projectExtension` is empty or `ApiMetadata/ApiModel-{projectExtension}.json` when it is not, through `metaed-plugin-edfi-odsapi`.

#### 3.3.2 API Schema

- **FR-API-SCHEMA-1**: The build SHALL generate API Schema JSON files per namespace as `ApiSchema/ApiSchema.json` when `projectExtension` is empty or `ApiSchema/ApiSchema-{projectExtension}.json` when it is not, through `metaed-plugin-edfi-api-schema`.
- **FR-API-SCHEMA-2**: API Schema output SHALL contain an `apiSchemaVersion` and a project schema describing the project and its resource schemas in the format documented by the DMS (see the note below).

> [!TIP]
> The API Schema JSON files are intended for use by the Data Management Service, aka DMS (part of Ed-Fi API v8).
> The schema is [fully documented](https://github.com/Ed-Fi-Alliance-OSS/Data-Management-Service/blob/main/docs/API-SCHEMA-DOCUMENTATION.md)
> in the DMS code repository.

#### 3.3.3 SQL Server and PostgreSQL ODS SQL

- **FR-ODS-SQL-1**: The build SHALL generate SQL Server ODS structure and data scripts under `Database/SQLServer/ODS/`.
- **FR-ODS-SQL-2**: The build SHALL generate PostgreSQL ODS structure and data scripts under `Database/PostgreSQL/ODS/`.
- **FR-ODS-SQL-3**: SQL ODS outputs SHALL include schema, table, foreign key, and extended property scripts, plus enumeration and school year seed-data scripts when such data exists; extension script file names SHALL include the namespace.
- **FR-ODS-SQL-4**: SQL ODS outputs SHALL include ID column unique index scripts for tables that require generated ID indexes.
- **FR-ODS-SQL-5**: For technology versions `>=7.1.0`, SQL ODS outputs SHALL include education organization authorization index creation scripts.
- **FR-ODS-SQL-6**: For technology versions `>=7.3.0`, SQL ODS outputs SHALL include aggregate ID column scripts and education organization authorization index update scripts.
- **FR-ODS-SQL-7**: SQL-generating plugins SHALL include Apache-2.0 license headers in supported SQL templates only when `allianceMode` is enabled and the relevant target technology version satisfies `>=5.0.0`.

#### 3.3.4 Change Query SQL

- **FR-CHANGE-QUERY-SQL-1**: The change query plugins SHALL generate change-tracking SQL (change schema and version sequence, change version columns and indexes, tracked deletes, and supporting triggers) under `Database/{SQLServer|PostgreSQL}/ODS/Structure/Changes/`, with the script set varying by target technology version.

#### 3.3.5 Record Ownership SQL

- **FR-RECORD-OWNERSHIP-SQL-1**: The record ownership plugins SHALL generate `0010-AddColumnOwnershipTokenForTable.sql` under `Database/{SQLServer|PostgreSQL}/ODS/Structure/RecordOwnership/` for aggregate root tables when the target technology version satisfies `>=3.3.0`.

#### 3.3.6 XSD and Interchange Schemas

- **FR-XSD-1**: The XSD plugin SHALL generate `XSD/Ed-Fi-Core.xsd` for the core namespace and `XSD/{projectExtension}-Ed-Fi-Extended-Core.xsd` for extension namespaces.
- **FR-XSD-2**: The XSD plugin SHALL generate `XSD/SchemaAnnotation.xsd` for the core namespace.
- **FR-XSD-3**: The XSD plugin SHALL generate interchange schemas under `Interchange/`, using `Interchange-{Name}.xsd` for core interchanges and `{projectExtension}-Interchange-{Name}-Extension.xsd` for extension interchanges.

#### 3.3.7 Data Handbook

- **FR-HANDBOOK-1**: The handbook plugin SHALL generate `Documentation/Ed-Fi-Handbook/Ed-Fi-Data-Handbook-Index.html` and `Documentation/Ed-Fi-Handbook/Ed-Fi-Handbook.xlsx`.

#### 3.3.8 Data Dictionaries

- **FR-DICTIONARY-1**: The SQL dictionary plugin SHALL generate `Documentation/DataDictionary/SqlDataDictionary.xlsx` with table and column worksheets derived from relational ODS model data, using SQL Server-dialect table names, column names, and data types.
- **FR-DICTIONARY-2**: The XML dictionary plugin SHALL generate `Documentation/DataDictionary/XmlDataDictionary.xlsx` with elements, complex types, and simple types worksheets derived from XSD model data.

#### 3.3.9 API Catalog

- **FR-API-CATALOG-1**: The API Catalog plugin SHALL generate `Documentation/Ed-Fi-API-Catalog/Ed-Fi-API-Catalog.xlsx`.
- **FR-API-CATALOG-2**: The API Catalog SHALL include `Resources` and `Properties` worksheets.
- **FR-API-CATALOG-3**: The API Catalog `Resources` worksheet SHALL include project, version, resource name, resource description, and domains.
- **FR-API-CATALOG-4**: The API Catalog `Properties` worksheet SHALL include project, version, resource name, property name, property description, data type, min length, max length, validation regular expression, identity key flag, nullable flag, and required flag.
- **FR-API-CATALOG-5**: The API Catalog SHALL omit `id` properties from the `Properties` worksheet.
- **FR-API-CATALOG-6**: The API Catalog SHALL list nested properties from common sub-schemas and references using dot-separated property paths.

### 3.4 Model Validation

- **FR-VAL-1**: The pipeline SHALL report syntax validation failures in the build's validation result; when `stopOnValidationFailure` is enabled, error-category failures SHALL prevent enhancement, generation, and output writing.
- **FR-VAL-2**: The unified plugin SHALL validate core model relationships, including references, naming, extensions and subclasses, identities, domain/interchange membership, and property bounds.
- **FR-VAL-3**: The unified advanced plugin SHALL validate merge directives, role names, and common-property identity rules, and SHALL report deprecation warnings for use of deprecated model elements.
- **FR-VAL-4**: The ODS relational plugin SHALL warn for properties named `Discriminator` when the target technology version is `>=5.1.0`.
- **FR-VAL-5**: The change query plugin SHALL reject namespaces named `Changes`, case-insensitively, because that name is reserved by generated change query artifacts.
- **FR-VAL-6**: The ODS/API plugin SHALL validate ODS/API-specific extension restrictions, including unsupported extension subclasses.
- **FR-VAL-7**: The XSD plugin SHALL suppress core/extension XSD and interchange generation for a namespace with duplicate entity names in dependency namespaces and SHALL report a warning through the duplicate-name validator; `SchemaAnnotation.xsd` SHALL still be generated.
- **FR-VAL-8**: Deprecation validators SHALL report warnings for extension namespace elements, and SHALL report warnings for non-extension namespace elements only when `allianceMode` is enabled.

### 3.5 Deploy Command

- **FR-DEPLOY-1**: `@edfi/metaed-odsapi-deploy-console` SHALL run from Node.js and execute deploy tasks from `@edfi/metaed-odsapi-deploy`.
- **FR-DEPLOY-2**: The deploy CLI SHALL require `-a` / `--accept-license`.
- **FR-DEPLOY-3**: The deploy CLI SHALL accept configuration through `-c` / `--config`.
- **FR-DEPLOY-4**: When no configuration is supplied, the deploy CLI SHALL use `-s` / `--source` and `-p` / `--projectNames` to scan project source directories, build artifacts into `MetaEdOutput` under the last resolved project path, and then deploy to the `-t` / `--target` directory (`-t` is not enforced).
- **FR-DEPLOY-5**: The deploy CLI SHALL accept `-x` / `--defaultPluginTechVersion` to override the configured default technology version for build and deploy behavior.
- **FR-DEPLOY-6**: The deploy CLI SHALL support `--suppressPrereleaseVersion` in source-scan mode, defaulting to `true`; in config-based mode, the configuration's `suppressPrereleaseVersion` value governs (see §6.2).
- **FR-DEPLOY-7**: The deploy CLI SHALL accept `--core` to deploy core artifacts in addition to extension artifacts.
- **FR-DEPLOY-8**: The deploy CLI SHALL accept `--suppressDelete` to skip deletion of existing extension artifact directories.
- **FR-DEPLOY-9**: The deploy CLI SHALL accept `--additionalMssqlScriptsDirectory` and `--additionalPostgresScriptsDirectory` and SHALL copy those scripts into the deployed ODS data folders.
- **FR-DEPLOY-10**: Before copying, deploy SHALL verify that the target ODS/API source tree contains an `EdFi.Ods.Extensions.{name}` project for each generated extension artifact folder.
- **FR-DEPLOY-11**: Unless `--suppressDelete` is supplied (FR-DEPLOY-8), deploy SHALL remove previously deployed extension artifacts in the unversioned layout before copying.
- **FR-DEPLOY-12**: Deploy SHALL copy core artifacts only when `--core` is supplied, into the core target for the selected technology version:

  | `defaultPluginTechVersion` | Core target | Extension target |
  | --- | --- | --- |
  | `<5.4.0` | nothing copied | nothing copied |
  | `>=5.4.0 <7.0.0` | `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/` | `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts/` |
  | `>=7.0.0` | `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Standard/{dataStandardVersion}/Artifacts/` | `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Versions/{projectVersion}/Standard/{dataStandardVersion}/Artifacts/` |

- **FR-DEPLOY-13**: Deploy SHALL copy extension artifacts into the extension target for the selected technology version (see the FR-DEPLOY-12 table).
- **FR-DEPLOY-14**: Core deploy SHALL copy from the `EdFi` artifact namespace folder.
- **FR-DEPLOY-15**: Extension deploy SHALL copy each non-EdFi project from the artifact folder named by its `projectName` (see §6.2, METAED-1678).
- **FR-DEPLOY-16**: For technology versions `>=7.1.0`, the Data Standard version used in deploy paths SHALL honor `suppressPrereleaseVersion` (formatted as `major.minor.0`).
- **FR-DEPLOY-17**: Deploy SHALL refresh the timestamps of existing extension `EdFi.Ods.Extensions.{name}.csproj` files after copying.
- **FR-DEPLOY-18**: Deploy SHALL warn when legacy `SupportingArtifacts` directories exist in the target tree.
- **FR-DEPLOY-19**: Deploy SHALL skip a generated source folder when that folder is absent rather than failing the entire deploy.
- **FR-DEPLOY-20**: Deploy SHALL map generated folders to ODS/API artifact folders as follows:
  - `ApiMetadata/` → `Metadata/`
  - `Database/SQLServer/ODS/Data/` → `MsSql/Data/Ods/`
  - `Database/SQLServer/ODS/Structure/` → `MsSql/Structure/Ods/`
  - `Database/PostgreSQL/ODS/Data/` → `PgSql/Data/Ods/`
  - `Database/PostgreSQL/ODS/Structure/` → `PgSql/Structure/Ods/`
  - `Interchange/` → `Schemas/`
  - `XSD/` → `Schemas/`
- **FR-DEPLOY-21**: Deploy SHALL leave generated `ApiSchema/` and `Documentation/` outputs in the artifact directory because deploy tasks only map API metadata, database, interchange, and XSD artifact families into the ODS/API source tree.

### 3.6 API Schema Packaging Automation

- **FR-PKG-1**: The repository SHALL create MetaEd build configuration files for API Schema packaging automation using `eng/ApiSchema/CreateMetaEdConfig.ps1`.
- **FR-PKG-2**: API Schema packaging configuration generation SHALL write `eng/ApiSchema/MetaEdConfig.json` with the packaging `MetaEdOutput` path as `artifactDirectory`, a core project named `Ed-Fi` (namespace `EdFi`), an optional extension project, `defaultPluginTechVersion`, and `allianceMode` and `suppressPrereleaseVersion` set to `true`. Extension versions SHALL come from the extension's `metaEdProject.projectVersion`, defaulting to `1.1.0` for TPDM and `1.0.0` otherwise.
- **FR-PKG-3**: The API Schema packaging automation SHALL run MetaEd through `eng/ApiSchema/build.ps1 -Command RunMetaEd`.
- **FR-PKG-4**: The API Schema packaging automation SHALL stage per-package assets (Core, TPDM, Homograph, Sample) via `build.ps1 -Command StageAssets` as described in `eng/ApiSchema/README.md`. The workflow matrix builds TPDM only for DS-5.2.0, and builds Homograph and Sample for DS-4.0.0 without publishing them.
- **FR-PKG-4a**: The packaging automation SHALL write `package-manifest.json` into each staging directory (after `StageAssets`), SHALL use Data Standard-qualified package IDs, and SHALL validate the package contract as described in `eng/ApiSchema/PACKAGE-CONTRACT.md`.
- **FR-PKG-5**: The API Schema packaging automation SHALL build, pack, and publish .NET packages through `dotnet` and Azure Artifacts when the workflow runs on a protected ref (`github.ref_protected`); the publish job SHALL always attempt to push and SHALL fail if the feed credentials are missing.

## 4. Non-Functional Requirements

### Compatibility

- **NFR-COMPAT-1**: MetaEd SHALL run in Node.js-based local and CI environments compatible with its dependencies; this repository's automation currently verifies Ubuntu-based execution.
- **NFR-COMPAT-2**: The pull request and npm publish workflows SHALL verify Node 22; the API Schema packaging workflow does not set up a specific Node version.
- **NFR-COMPAT-3**: Published packages SHALL be CommonJS modules (compilation target details are in the `metaed-core` README).
- **NFR-COMPAT-4**: Generated SQL artifacts SHALL distinguish SQL Server and PostgreSQL output directories and generator plugins, targeting both database platforms.
- **NFR-COMPAT-5**: MetaEd SHALL support multiple Ed-Fi Data Standard versions configurable via `projectVersion` and `defaultPluginTechVersion`.

### Licensing

- **NFR-LIC-1**: Usage of the Ed-Fi Unifying Data Model SHALL require explicit acceptance of the Ed-Fi License Agreement via the `-a` / `--accept-license` CLI flag.
- **NFR-LIC-2**: Packages SHALL be licensed as Apache-2.0 as declared in package metadata and repository license files.

### Reliability

- **NFR-REL-1**: The CLI SHALL return non-zero exit codes for validation errors, pipeline failures, uncaught pipeline exceptions, and unsuccessful deploy tasks.
- **NFR-REL-2**: The output writer SHALL protect source projects from deletion (see FR-BUILD-12).
- **NFR-REL-3**: The output writer SHALL protect source projects from being overwritten (see FR-BUILD-13).
- **NFR-REL-4**: Deploy SHALL stop at the first unsuccessful task and report failure through a non-zero exit code (see §6.2, METAED-1678).
- **NFR-REL-5**: Build failures SHALL be reported with a non-zero exit code and, except where the pipeline ends early (see §6.2, METAED-1676), with clear, actionable error messages.

### Performance

- **NFR-PERF-1**: Full build of a standard-sized project SHOULD complete within 60 seconds on typical developer hardware.

### Security

- **NFR-SEC-1**: Normal build and deploy runtime behavior SHALL operate on local files and SHALL NOT require credentials.
- **NFR-SEC-2**: Publishing workflows SHALL use package-feed credentials; those credentials are outside normal build and deploy runtime behavior.
- **NFR-SEC-3**: MetaEd SHALL NOT transmit data to external services during normal operation.

### Observability

- **NFR-OBS-1**: Default build and deploy runs SHALL log high-level progress, plugin execution, artifact directory, deploy copy operations, warnings, and elapsed time; more detailed stage tracing SHALL require debug logging, enabled through the `LOG_LEVEL` environment variable (for example `LOG_LEVEL=debug`); there is no CLI flag for log level.
- **NFR-OBS-2**: Validation failures SHALL carry category, message, and source/file mapping where available; failures recorded before a pipeline early return are not file-mapped or logged (see §6.2).

### SDLC

- **NFR-SDLC-1**: Pull request CI SHALL run TypeScript and ESLint checks through `npm run test:lint`.
- **NFR-SDLC-2**: Pull request CI SHALL run non-database unit tests, SQL Server database tests, and PostgreSQL database tests.
- **NFR-SDLC-3**: Repository workflows SHOULD run dependency review, CodeQL analysis, and OpenSSF Scorecard checks where configured.
- **NFR-SDLC-4**: Release workflows SHALL publish npm packages to Azure Artifacts using Lerna.

## 5. System Architecture

### 5.1 Processing Pipeline

The build pipeline is sequential: load `.metaed` files → validate → enhance → generate → write output, with validation, enhancement, and generation running per plugin in dependency order. When `stopOnValidationFailure` is enabled, the pipeline stops after validation errors. The detailed stage list and early-return behavior are documented in the `metaed-core` README.

Plugins are ordered by `@edfi/metaed-default-plugins`, allowing upstream plugins to create semantic data used by downstream artifact generators.

### 5.2 Component Packages

| Package | Product Responsibility |
| --- | --- |
| `@edfi/metaed-core` | Core pipeline, configuration model, file loading, grammar parsing, model builders, validators/enhancers/generators contracts, plugin configuration loading, and output writing. |
| `@edfi/metaed-console` | Build CLI for running the MetaEd pipeline with default plugins. |
| `@edfi/metaed-default-plugins` | Default ordered plugin list used by the build and deploy-console build flow. |
| `@edfi/metaed-odsapi-deploy` | Deploy task library for copying generated artifacts into an ODS/API source tree. |
| `@edfi/metaed-odsapi-deploy-console` | Deploy CLI for source-scan build-and-deploy mode or config-based deploy mode. |
| `@edfi/metaed-plugin-edfi-unified` | Foundational Ed-Fi semantic validators and enhancers, including reference resolution, base class resolution, domain/subdomain links, merge directives, and shared type enrichment. |
| `@edfi/metaed-plugin-edfi-unified-advanced` | Additional validation for merge scenarios, deprecation warnings, common property identity rules, and self-referencing property role names. |
| `@edfi/metaed-plugin-edfi-ods-relational` | Shared relational ODS model enhancers and a relational validator, used by SQL Server, PostgreSQL, API Schema, SQL dictionary, change query, record ownership, ODS/API, and handbook plugins. |
| `@edfi/metaed-plugin-edfi-api-schema` | API Schema model enhancers, security-related configuration rules, OpenAPI fragment and relational metadata, and `ApiSchema*.json` generation with API Schema version metadata. |
| `@edfi/metaed-plugin-edfi-ods-sqlserver` | SQL Server ODS naming, schema/table/column enhancements, and SQL Server ODS SQL script generation. |
| `@edfi/metaed-plugin-edfi-ods-postgresql` | PostgreSQL ODS naming, schema/table/column enhancements, and PostgreSQL ODS SQL script generation. |
| `@edfi/metaed-plugin-edfi-xsd` | XSD model enhancers, duplicate-name validation for dependency namespaces, core/extension XSD generation, schema annotation generation, and interchange XSD generation. |
| `@edfi/metaed-plugin-edfi-ods-changequery` | Common change query validator, common model types, shared generation helpers for change query SQL artifacts, and shared indirect update cascade trigger enhancer and generator logic registered by the dialect-specific plugins. |
| `@edfi/metaed-plugin-edfi-ods-changequery-sqlserver` | SQL Server-specific change query enhancers and SQL script generators. |
| `@edfi/metaed-plugin-edfi-ods-changequery-postgresql` | PostgreSQL-specific change query enhancers and SQL script generators. |
| `@edfi/metaed-plugin-edfi-ods-recordownership` | Common record ownership table enhancement that marks aggregate root tables for ownership token columns for target technology versions `>=3.3.0`. |
| `@edfi/metaed-plugin-edfi-ods-recordownership-sqlserver` | SQL Server record ownership SQL generation. |
| `@edfi/metaed-plugin-edfi-ods-recordownership-postgresql` | PostgreSQL record ownership SQL generation. |
| `@edfi/metaed-plugin-edfi-odsapi` | ODS/API model validators/enhancers and `ApiModel*.json` generation. |
| `@edfi/metaed-plugin-edfi-xml-dictionary` | XML data dictionary Excel generation from XSD model data. |
| `@edfi/metaed-plugin-edfi-sql-dictionary` | SQL data dictionary Excel generation from relational ODS model data. |
| `@edfi/metaed-plugin-edfi-handbook` | Handbook-specific model enhancers plus HTML and Excel Data Handbook generation. |
| `@edfi/metaed-plugin-edfi-api-catalog` | API Catalog Excel generation from API Schema and OpenAPI fragment data. |

### 5.3 Default Plugin Order

The default plugin order is:

`edfiUnified`, `edfiUnifiedAdvanced`, `edfiOdsRelational`, `edfiApiSchema`, `edfiOdsSqlServer`, `edfiOdsPostgresql`, `edfiXsd`, `edfiOdsChangeQuery`, `edfiOdsChangeQuerySqlServer`, `edfiOdsChangeQueryPostgresql`, `edfiOdsRecordOwnership`, `edfiOdsRecordOwnershipSqlServer`, `edfiOdsRecordOwnershipPostgresql`, `edfiOdsApi`, `edfiXmlDictionary`, `edfiSqlDictionary`, `edfiHandbook`, `edfiApiCatalog`.

### 5.4 Output Model

Generated files are written beneath the artifact directory by namespace and folder; the `GeneratedOutput` shape and write rules are documented in the `metaed-core` README.

## 6. Out of Scope and Known Limitations

### 6.1 Explicit Exclusions

- **MetaEd IDE (VS Code Extension)** — the Visual Studio Code extension for authoring `.metaed` files is maintained in a separate repository and is out of scope for this PRD. Its build and deploy capabilities are driven by the CLI packages documented here.
- **The MetaEd DSL language specification and grammar semantics** — documented separately.
- **ODS/API runtime behavior, API service hosting, database execution, migrations, and production deployment** — outside this PRD.
- **Data Standard content** — this repository processes model files but does not define data element requirements.

### 6.2 Known Limitations

- `MetaEdConfiguration` includes `pluginTechVersion`, and some fixtures contain it, but current plugin setup assigns every plugin the single `defaultPluginTechVersion`.
- The `-a` / `--accept-license` flag is required, but acceptance is not persisted.
- The build console resolves relative `-c` / `--config` paths relative to the console module directory; use absolute config paths.
- Config-based deploy mode runs deploy tasks against an existing `artifactDirectory`; source-scan mode is the path that builds before deploy.
- Config-based deploy mode does not apply defaults or the `--suppressPrereleaseVersion` CLI option: an omitted `suppressPrereleaseVersion` means no prerelease suppression, and an omitted `defaultPluginTechVersion` without `-x` causes version-gated deploy tasks to be skipped.
- Source-scan deploy mode returns without deploying when `source` or `projectNames` is absent.
- After source-scan deploy mode attempts a build, the deploy console still invokes deploy tasks even when the build failed; if an existing artifact directory remains, deploy can copy those artifacts.
- Source-scan project discovery can miss nested projects in mixed source inputs, cannot represent two projects with the same project name, and yields an empty namespace for project names that cannot form one; see the `metaed-odsapi-deploy-console` README.
- Source-scan project ordering does not place the `EdFi` project first (METAED-1675).
- Some build failures (file loading, plugin configuration, output writing) end the run without printing validation messages (METAED-1676).
- Deploy can mismatch extension folders when `projectName` and `namespaceName` differ, does not remove previously deployed artifacts in the `>=7.0.0` versioned layout, and does not print per-project copy failure messages (METAED-1678).
- Core and extension artifact copy tasks are no-ops for `defaultPluginTechVersion` values below `5.4.0`.
- A core-only deploy with no extension artifact folders can fail the extension project precheck when `allianceMode` is false.
- Deploy does not copy generated `ApiSchema/` or `Documentation/` artifact folders into the ODS/API source tree.
- Deploy assumes the local ODS/API source tree follows expected `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` folder conventions.
- The console packages declare no package `bin` commands; run them through their Node.js entry points or repository scripts.
- API Schema packaging output depends on the checked-in API Schema plugin configuration fixture that `RunMetaEd` copies into the core project path (`packages/metaed-plugin-edfi-api-schema/test/integration/edfiApiSchema.config.json`).
- Alliance Mode is an internal setting used by Ed-Fi Alliance workflows. In this repository it affects some validation, SQL header, and deploy behaviors; any IDE-side editability behavior is outside the scope of MetaEd-js.

## 7. Glossary

| Term | Definition |
| --- | --- |
| MetaEd-js | The Node.js monorepo that parses MetaEd DSL projects and generates artifacts through plugins. |
| MetaEd | Umbrella term for the DSL, the compiler, and the supporting packages. |
| MetaEd DSL | The `.metaed` source language processed by this repository. |
| MetaEd Generator | The command-line application that compiles `.metaed` files into artifacts. |
| Data Standard project | The core Ed-Fi project identified by namespace `EdFi`; exactly one is required by the CLIs. |
| Extension project | A non-EdFi MetaEd project processed alongside the Data Standard project. |
| Namespace | The model and output grouping used by MetaEd to separate core and extension artifacts. |
| Project extension | A string used by generators in some extension artifact file names; non-EdFi projects default to `EXTENSION` when metadata omits it. |
| Default plugin technology version | The version string assigned to plugin environments to select version-specific generator behavior. |
| Plugin | A package that contributes validators, enhancers, generators, and optional configuration schemas. |
| Validator | A plugin function that reports model or configuration failures. |
| Enhancer | A plugin function that adds derived data to the model. |
| Generator | A plugin function that produces generated outputs. |
| Artifact | A generated file written by the build pipeline, such as SQL, XSD, JSON, HTML, or Excel. |
| ODS | Operational Data Store — the database backing an Ed-Fi API. |
| ODS/API | The downstream Ed-Fi source tree layout targeted by deploy tasks; the legacy reference implementation of the Ed-Fi REST API. |
| Ed-Fi API | Successor to the ODS/API, which also consumes MetaEd-generated artifacts, particularly the API Schema (`ApiSchema*.json`). |
| API Model | ODS/API metadata JSON generated as `ApiModel*.json`. |
| API Schema | JSON schema output generated as `ApiSchema*.json` for API schema consumers. |
| Change Query | SQL artifacts for change version, tracked delete, and related change tracking support. |
| Record Ownership | SQL artifacts that add ownership token support to aggregate root tables when enabled by target version. |
| Alliance Mode | An internal configuration setting used by Ed-Fi Alliance workflows. In MetaEd-js it affects selected validation, generation, and deploy behaviors; any IDE-side editability behavior is implemented outside this repository. |
| SemVer | Semantic Versioning 2.0.0 — the versioning scheme used for project versions. |
| Tech Version | The target ODS/API version (e.g., `6.0.0`) that determines which plugin behaviors and output formats to use. |
