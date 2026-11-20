# MetaEd Product Requirements Document — Version 4.9.0

- Owner: Stephen Fuqua
- Release baseline: [MetaEd-js v4.9.0](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/tree/v4.9.0)
- Status: completed
- Repository: Ed-Fi-Alliance-OSS/MetaEd-Js
- Platform and runtime: Node.js (CommonJS)

> [!TIP]
> This snapshot describes the generator, command-line tools, and release workflows shipped with MetaEd 4.9.0.
>
> It does _not cover_ the MetaEd DSL syntax and semantics, the MetaEd IDE Visual Studio Code extension (maintained in a separate repository), the Ed-Fi ODS/API runtime behavior, database execution semantics, or the Data Standard content itself.
>
> For package-specific behavior, follow the README links in the [component package table](#52-component-packages).

## 1. Product Overview

MetaEd is a technology framework that uses an Ed-Fi-aligned domain-specific language (DSL) to auto-generate software, database, and data standard artifacts from a single source definition. The term "MetaEd" encompasses:

- **MetaEd Language** — a lightweight DSL describing data elements, their properties, and their organization into entities and domains (the Ed-Fi Unified Data Model). Files use the `.metaed` extension.
- **MetaEd Generator** — a command-line application that compiles MetaEd language files into technical artifacts.
- **MetaEd Packages** — a collection of Node.js packages that implement the parsing, validation, enhancement, and generation pipeline.

MetaEd-js is a Node.js monorepo that compiles Ed-Fi MetaEd DSL projects into local filesystem artifacts used by downstream Ed-Fi data platform tooling. A MetaEd project is represented by `.metaed` source files plus project metadata such as project name, namespace, version, optional project extension, and description. The generator reads one Data Standard project and zero or more extension projects, validates and enriches the semantic model, runs the default plugin set, and writes generated outputs grouped by namespace.

The repository provides two primary command-line workflows:

- `@edfi/metaed-console` — runs the MetaEd build pipeline and writes generated artifacts.
- `@edfi/metaed-odsapi-deploy-console` — optionally builds from project source directories and then copies generated artifacts into a local Ed-Fi ODS/API source tree layout for supported technology versions.

Release engineers can also publish generated API Schema assets as NuGet packages for downstream consumers (§3.6).

The Ed-Fi Alliance uses MetaEd internally to produce core components such as JSON API metadata, SQL scripts, and technical documentation from a single source definition written in the MetaEd DSL. Externally, Ed-Fi Community members use MetaEd to create and maintain Ed-Fi Extensions, which are additive data models that extend the core Ed-Fi Data Standard to meet local needs.

### 1.1 Strategic Alignment

- **Generate artifacts from a shared model.** The plugins use the same core and extension models to generate SQL, XSD, API metadata, API schemas, documentation, and dictionaries. Plugin configuration can also shape the output.
- **Support extension development.** Implementers can validate an extension alongside the core Data Standard and generate artifacts for that extension.
- **Support continuous integration.** CI jobs can run the build CLI headlessly and use its exit code to detect build failures.
- **Build for multiple versions.** Each build uses the model files for the selected Data Standard release and a separately configured ODS/API target (NFR-COMPAT-5).

### 1.2 Target Users and Personas

- **Ed-Fi Alliance Technical Team / Data Standard maintainers** — maintain the core Ed-Fi Data Standard MetaEd project and need repeatable generated artifacts for release and packaging workflows. Use internal workflows that rely on plugin configuration, Alliance Mode-enabled builds, and CI automation.
- **Education Agency Developers and Ed-Fi Integration Partners / Extension developers** — maintain additive MetaEd extension projects and need validation plus generated artifacts for ODS/API integration. Build and maintain extensions on behalf of education agencies using both CLI workflows and CI pipelines.
- **Build and release engineers** — run MetaEd headlessly in CI, publish npm packages, package API Schema artifacts, and verify generated outputs against authoritative fixtures.
- **Business Analysts / Downstream artifact consumers** — use generated spreadsheets, HTML documentation, JSON schema and metadata files, SQL scripts, and XSD files without reading `.metaed` source. Review generated documentation to understand the data model.

### 1.3 Jobs to Be Done

#### JTBD 1.1. Compile model changes into deployable artifacts

**Personas**: Education Agency Developers, Ed-Fi Integration Partners, Ed-Fi Alliance Technical Team

**When** I am ready to test my model changes, **I want** to generate the artifacts for my model and target version, **so that** I can verify them before deploying.

**Acceptance.** Build Data Standard 5.2 and TPDM 1.1 for ODS/API 7.3 using the project metadata (`projects`) and API Schema configuration (`pluginConfigDirectories`) from the linked comparison test. The build exits `0` and produces core and extension API schemas matching the reference outputs. [4.9.0 schema comparison](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-plugin-edfi-api-schema/test/integration/ApiSchemaAuthoritativeCompare_v7_3.test.ts#L29-L110) · [Core fixture](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-authoritative.json) · [TPDM fixture](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/tpdm-api-schema-authoritative.json)

#### JTBD 1.2. Validate a model

**Personas**: Education Agency Developers, Ed-Fi Integration Partners, Ed-Fi Alliance Technical Team

**When** I change `.metaed` files, **I need** the pipeline to report syntax, semantic, configuration, and plugin validation failures in a machine-detectable build result, **so that** errors can be identified and corrected before deployment.

**Acceptance.** A model with a syntax error makes the build exit `1` before writing artifacts. A plugin configuration error also produces exit `1`, though its detailed message can be missing from the log (§6.2).

#### JTBD 1.3. Deploy extension artifacts to the ODS/API

**Personas**: Education Agency Developers, Ed-Fi Integration Partners

**When** I need to integrate my extension with the ODS/API, **I want** to copy its generated artifacts into the local ODS/API source tree, **so that** I can find its API model in the extension project's metadata directory.

**Acceptance.** Deploying the Sample extension to ODS/API 6.1 places `ApiModel-EXTENSION.json` in the extension project's `Artifacts/Metadata/` directory. [Expected deploy output](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-odsapi-deploy/test/integration/DeployExtensionV6.test.ts#L52-L70)

#### JTBD 1.4. Validate and produce artifacts in CI

**Personas**: Ed-Fi Alliance Technical Team, Ed-Fi Integration Partners, Build and release engineers

**When** I maintain a CI pipeline for data model changes, **I want** to run MetaEd headlessly via Node.js, **so that** I can validate and produce artifacts on every commit without a graphical environment.

**Acceptance.** A CI job can invoke the build with `-a -c <config>`, collect artifacts on exit `0`, and fail the job on exit `1`.

#### JTBD 1.5. Understand the API shape of a data model

**Personas**: Business Analysts, Education Agency Developers, Ed-Fi Integration Partners

**When** I need to understand the API shape of a data model, **I want** generated documentation including a handbook, API catalog, and data dictionaries, **so that** I can understand the data model without reading source files.

**Acceptance.** In the API Catalog fixture, a reader can find `assessments` in the Resources worksheet and its required `programReference.programId` in Properties. [Expected workbook rows](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-plugin-edfi-api-catalog/test/integration/ApiCatalogGenerator.test.ts#L135-L210)

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
- The build and deploy commands require no network credentials. Publishing workflows communicate with package feeds.
- Opening the generated HTML Data Handbook in a browser loads JavaScript and stylesheets from public CDNs.

## 3. Functional Requirements

### 3.1 Project Input and Configuration

- **FR-CFG-1**: The build CLI SHALL accept a JSON configuration file through `-c` / `--config` containing a top-level `metaEdConfiguration` object.
- **FR-CFG-2**: `metaEdConfiguration` SHALL support `artifactDirectory`, `deployDirectory`, `projects`, `projectPaths`, `pluginConfigDirectories`, `defaultPluginTechVersion`, `allianceMode`, and `suppressPrereleaseVersion`; it SHALL accept `pluginTechVersion` but ignore it (see §6.2); it SHALL support an optional `externalVariables` field for Jsonnet configuration evaluation.
- **FR-CFG-3**: The pipeline SHALL require `projects` and `projectPaths` to have the same length and SHALL map each project metadata entry to the corresponding source path.
- **FR-CFG-4**: The file loader SHALL recursively load files with exactly the `.metaed`, `.metaEd`, `.MetaEd`, or `.METAED` extension from each configured project path.
- **FR-CFG-5**: The build and deploy CLIs SHALL check for exactly one project with namespace `EdFi` before running the pipeline or deploy tasks. In source-scan deploy, an empty discovery result fails earlier when the CLI reads the last project's path. A nonempty list with zero or multiple `EdFi` projects fails the Data Standard check.
- **FR-CFG-6**: Deploy console source mode SHALL discover projects from `package.json` files containing `metaEdProject` metadata, deriving each project's namespace from its project name (see §6.2 for discovery limitations).
- **FR-CFG-7**: Source-scan deploy starts discovery only when both `source` and `projectNames` are present. An otherwise valid invocation that omits either exits `0` before project validation, build, or deploy. Supplied names override discovered names by position. If the list contains more names than discovered projects, the scanner retains all discovered names.
- **FR-CFG-8**: Plugin configuration files SHALL be discovered from configured `pluginConfigDirectories`, or from input project directories when no plugin config directories are configured, as `{pluginShortName}.config.jsonnet` or `{pluginShortName}.config.json`, with Jsonnet preferred when both exist.
- **FR-CFG-9**: The build SHALL pass the configured `externalVariables` to the Jsonnet evaluator when loading a plugin configuration (§6.2). [4.9.0 configuration loader](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-core/src/plugin/LoadPluginConfiguration.ts#L129-L135)
- **FR-CFG-10**: Plugin configuration rules SHALL support plugin-wide data or entity-matched data using `entity`, `namespace`, `core`, `extensions`, and `entityName` matching fields.
- **FR-CFG-11**: Configuration matching SHALL reject a single match rule that combines `namespace` with `core` or `extensions`. A match may set both `core` and `extensions` to true. In that case it selects only core namespaces.
- **FR-CFG-12**: The API Schema plugin SHALL validate plugin-specific configuration rules for `educationOrganizationSecurableElements` and `educationOrganizationIdentitySecurableElements`. When rules match the same entity, the first supplied `versionRange` applies to their combined configuration. [Version ranges and overlapping rules](artifact-specific-configuration.md#version-ranges-and-overlapping-rules)
- **FR-CFG-13**: When project metadata omits `projectExtension` or sets it to an empty string, the file loader SHALL use an empty project extension for namespace `EdFi` and `EXTENSION` for non-EdFi namespaces.
- **FR-CFG-14**: File loading SHALL fail the build when no `.metaed` files are found in any configured input directory.

### 3.2 Build Command

For a command example and the generated directory layout, see the [CLI build guide](cli.md#build).

- **FR-BUILD-1**: `@edfi/metaed-console` SHALL run from Node.js and execute the MetaEd pipeline using the default plugin set.
- **FR-BUILD-2**: The build CLI SHALL require the parsed license acceptance option (NFR-LIC-1).
- **FR-BUILD-3**: The build CLI SHALL resolve relative `-c` / `--config` paths from the current working directory.
- **FR-BUILD-4**: The build CLI SHALL accept `-x` / `--defaultPluginTechVersion` to override the configured default technology version for all plugins.
- **FR-BUILD-5**: The default plugin technology version SHALL be `6.0.0` when not overridden by configuration or CLI argument.
- **FR-BUILD-6**: The build CLI SHALL support `--suppressPrereleaseVersion`, defaulting to `true`; when a configuration file is supplied, the configuration's `suppressPrereleaseVersion` value governs instead. The option affects generated version data, not artifact output paths.
- **FR-BUILD-7**: The build pipeline SHALL load source files, build the model, run each plugin's validators, enhancers, and generators in order, and write the generated output on success (§5.1).
- **FR-BUILD-8**: The build pipeline SHALL stop plugin execution on validation errors when `stopOnValidationFailure` is enabled.
- **FR-BUILD-9**: The build CLI SHALL exit with code `0` only when no validation error and no pipeline failure occurred; otherwise it SHALL exit with code `1`.
- **FR-BUILD-10**: Generated outputs SHALL be written under the configured artifact directory or a `MetaEdOutput` directory under the last input project path. Relative `artifactDirectory` values SHALL be resolved from the last input project path.
- **FR-BUILD-11**: Output writing SHALL group generated files by namespace, with the generator-provided folder path under that namespace.
- **FR-BUILD-12**: The writer SHALL replace an existing output directory only if its resolved path contains `MetaEdOutput`.
- **FR-BUILD-13**: Before replacement, the writer SHALL check for the source file extensions listed in FR-CFG-4. In 4.9.0 this check skips ordinary subdirectories, so replacing the output tree can delete nested source files.

### 3.3 Generated Artifact Families

#### 3.3.1 ODS/API Metadata

- **FR-ODSAPI-METADATA-1**: The ODS/API plugin SHALL write `EdFi/ApiMetadata/ApiModel.json` for core regardless of the configured `projectExtension`. For extensions it SHALL write `{namespace}/ApiMetadata/ApiModel-{projectExtension}.json`, using `EXTENSION` as the default suffix (FR-CFG-13).

#### 3.3.2 API Schema

- **FR-API-SCHEMA-1**: The API Schema plugin SHALL write `EdFi/ApiSchema/ApiSchema.json` for core regardless of the configured `projectExtension`. For extensions it SHALL write `{namespace}/ApiSchema/ApiSchema-{projectExtension}.json`, using `EXTENSION` as the default suffix (FR-CFG-13).
- **FR-API-SCHEMA-2**: Each file SHALL contain `apiSchemaVersion` and a `projectSchema` describing the project and its resources. The Data Management Service (DMS) consumes these schemas. [4.9.0 output type](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-plugin-edfi-api-schema/src/model/api-schema/ApiSchema.ts) · [DMS schema guide](https://github.com/Ed-Fi-Alliance-OSS/Data-Management-Service/blob/4a602608e23fe18cb40c8a29031fe0b8ce38f529/docs/API-SCHEMA-DOCUMENTATION.md)

#### 3.3.3 SQL Server and PostgreSQL ODS SQL

- **FR-ODS-SQL-1**: The build SHALL generate SQL Server ODS structure and data scripts under `Database/SQLServer/ODS/`.
- **FR-ODS-SQL-2**: The build SHALL generate PostgreSQL ODS structure and data scripts under `Database/PostgreSQL/ODS/`.
- **FR-ODS-SQL-3**: Both dialects SHALL generate a schema script per namespace. Table and extended-property scripts require tables, foreign-key scripts require foreign keys, and enumeration and school-year seed scripts require corresponding rows. Extension file names include the namespace. The writer skips an output with empty text and no stream.
- **FR-ODS-SQL-4**: SQL ODS outputs SHALL include ID column unique index scripts for tables that require generated ID indexes.
- **FR-ODS-SQL-5**: For technology versions `>=7.1.0`, both dialects SHALL render `1410` for namespaces with relational tables. It indexes aggregate-root columns derived from `EducationOrganizationId` (including renames) when none of their source properties has a role name. With no qualifying column, the file is omitted unless the Alliance Mode license header supplies content.
- **FR-ODS-SQL-6**: For technology versions `>=7.3.0`, both dialects SHALL render `1465` for namespaces with relational tables. It updates indexes on the columns eligible for `1410` and creates indexes on aggregate-root columns derived from USI properties. With neither kind of column, the file is omitted unless the license header supplies content. The `1460` aggregate ID script requires an aggregate root table in the namespace's own database schema.
- **FR-ODS-SQL-7**: SQL-generating plugins SHALL include Apache-2.0 license headers in supported SQL templates only when `allianceMode` is enabled and the relevant target technology version satisfies `>=5.0.0`.

#### 3.3.4 Change Query SQL

- **FR-CHANGE-QUERY-SQL-1**: The change query plugins SHALL generate change-tracking SQL (change schema and version sequence, change version columns and indexes, tracked deletes, and supporting triggers) under `Database/{SQLServer|PostgreSQL}/ODS/Structure/Changes/`, with the script set varying by target technology version.

#### 3.3.5 Record Ownership SQL

- **FR-RECORD-OWNERSHIP-SQL-1**: The record ownership plugins SHALL generate `0010-AddColumnOwnershipTokenForTable.sql` under `Database/{SQLServer|PostgreSQL}/ODS/Structure/RecordOwnership/` for aggregate root tables when the target technology version satisfies `>=3.3.0`.

#### 3.3.6 XSD and Interchange Schemas

- **FR-XSD-1**: The XSD plugin SHALL generate `XSD/Ed-Fi-Core.xsd` for the core namespace and `XSD/{projectExtension}-Ed-Fi-Extended-Core.xsd` for extension namespaces, subject to the duplicate-name check in FR-VAL-7.
- **FR-XSD-2**: The XSD plugin SHALL generate `XSD/SchemaAnnotation.xsd` for the core namespace.
- **FR-XSD-3**: The XSD plugin SHALL generate interchange schemas under `Interchange/`, using `Interchange-{Name}.xsd` for core interchanges and `{projectExtension}-Interchange-{Name}-Extension.xsd` for extension interchanges, subject to FR-VAL-7.

#### 3.3.7 Data Handbook

- **FR-HANDBOOK-1**: The handbook plugin SHALL generate `Documentation/Ed-Fi-Handbook/Ed-Fi-Data-Handbook-Index.html` and `Documentation/Ed-Fi-Handbook/Ed-Fi-Handbook.xlsx`.

#### 3.3.8 Data Dictionaries

- **FR-DICTIONARY-1**: The SQL dictionary plugin SHALL generate `Documentation/DataDictionary/SqlDataDictionary.xlsx` with table and column worksheets derived from relational ODS model data, using SQL Server-dialect table names, column names, and data types.
- **FR-DICTIONARY-2**: The XML dictionary plugin SHALL generate `Documentation/DataDictionary/XmlDataDictionary.xlsx` with elements, complex types, and simple types worksheets derived from XSD model data.

#### 3.3.9 API Catalog

- **FR-API-CATALOG-1**: The API Catalog plugin SHALL generate `Documentation/Ed-Fi-API-Catalog/Ed-Fi-API-Catalog.xlsx`.
- **FR-API-CATALOG-2**: The API Catalog SHALL include `Resources` and `Properties` worksheets.
- **FR-API-CATALOG-3**: The API Catalog `Resources` worksheet SHALL include `Project` (the API project endpoint, such as `ed-fi`), `Version`, `Resource Name` (the API resource endpoint, such as `academicWeeks`), `Resource Description`, and `Domains` columns.
- **FR-API-CATALOG-4**: The API Catalog `Properties` worksheet SHALL include `Project` (the API project endpoint, such as `ed-fi`), `Version`, `Resource Name` (the API resource endpoint, such as `academicWeeks`), `Property Name`, `Property Description`, `Data Type`, `Min Length`, `Max Length`, `Validation RegEx`, `Is Identity Key`, `Is Nullable`, and `Is Required` columns.
- **FR-API-CATALOG-5**: The API Catalog SHALL omit `id` properties from the `Properties` worksheet.
- **FR-API-CATALOG-6**: The API Catalog SHALL list nested properties from common sub-schemas using dotted paths. It adds key rows for a direct reference when its schema is in the current project's reference lookup, which includes built-in entries for EducationOrganization and SchoolYearType. For example, TPDM's `financialAids` has a `studentReference` row without child key rows.

### 3.4 Model Validation

- **FR-VAL-1**: The pipeline SHALL report syntax validation failures in the build's validation result; when `stopOnValidationFailure` is enabled, error-category failures SHALL prevent enhancement, generation, and output writing.
- **FR-VAL-2**: The unified plugin SHALL validate core model relationships, including references, naming, extensions and subclasses, identities, domain/interchange membership, and property bounds.
- **FR-VAL-3**: The unified advanced plugin SHALL validate merge directives, role names, and common-property identity rules, and SHALL report deprecation warnings for use of deprecated model elements.
- **FR-VAL-4**: The ODS relational plugin SHALL warn for properties named `Discriminator` when the target technology version is `>=5.1.0`.
- **FR-VAL-5**: The change query plugin SHALL reject namespaces named `Changes`, case-insensitively, because that name is reserved by generated change query artifacts.
- **FR-VAL-6**: The ODS/API plugin SHALL validate ODS/API-specific extension restrictions, including unsupported extension subclasses.
- **FR-VAL-7**: The XSD plugin SHALL warn and suppress core/extension XSD and interchange output for an affected namespace when a checked entity has the same name and model type as one in a dependency namespace. A domain entity and its same-named domain entity extension have different types and pass this check. Core `SchemaAnnotation.xsd` is still generated.
- **FR-VAL-8**: Deprecation validators SHALL report warnings for extension namespace elements, and SHALL report warnings for non-extension namespace elements only when `allianceMode` is enabled.

### 3.5 Deploy Command

For a command example and the destination folders in the ODS/API tree, see the [CLI deploy guide](cli.md#deploy).

- **FR-DEPLOY-1**: `@edfi/metaed-odsapi-deploy-console` SHALL run from Node.js and execute deploy tasks from `@edfi/metaed-odsapi-deploy`.
- **FR-DEPLOY-2**: The deploy CLI SHALL require the parsed license acceptance option (NFR-LIC-1).
- **FR-DEPLOY-3**: With `-c` / `--config`, deploy SHALL skip the build and read existing artifacts. A relative `artifactDirectory` is resolved from the process working directory. Reusing a build config can therefore select a missing or older tree when the last input project is elsewhere (FR-BUILD-10). A shared absolute path selects the same artifacts for both commands.
- **FR-DEPLOY-4**: In source-scan mode, the CLI SHALL discover projects using `-s` / `--source` and `-p` / `--projectNames`, build, then deploy to `-t` / `--target`. The CLI does not enforce `-t`.
  - With absolute source paths, the build writes to `MetaEdOutput` under the last resolved project. Supplying that project directly as a relative path can repeat it in the output path (e.g., `models/Sample/models/Sample/MetaEdOutput`).
  - A failed source-scan build sets exit code `1`, but deploy still runs and can copy artifacts left by an earlier build.
- **FR-DEPLOY-5**: The deploy CLI SHALL accept `-x` / `--defaultPluginTechVersion` to override the configured default technology version for build and deploy behavior.
- **FR-DEPLOY-6**: The deploy CLI SHALL support `--suppressPrereleaseVersion` in source-scan mode, defaulting to `true`; in config-based mode, the configuration's `suppressPrereleaseVersion` value governs (see §6.2).
- **FR-DEPLOY-7**: The deploy CLI SHALL accept `--core` to deploy core artifacts in addition to extension artifacts.
- **FR-DEPLOY-8**: The deploy CLI SHALL accept `--suppressDelete` to skip removal of existing unversioned extension artifact directories.
- **FR-DEPLOY-9**: For targets `>=5.4.0`, deploy SHALL copy files supplied through `--additionalMssqlScriptsDirectory` and `--additionalPostgresScriptsDirectory` into the corresponding ODS data folders.
- **FR-DEPLOY-10**: Before copying, deploy SHALL check that the expected `EdFi.Ods.Extensions.{name}` path exists for each extension entry in the artifact directory. The path alone satisfies the check, even without a `.csproj` file. Deploy skips this check for target versions below `3.0.0` and runs it when the target version is omitted. [4.9.0 precheck](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-odsapi-deploy/src/task/ExtensionProjectsExists.ts#L15-L62)
- **FR-DEPLOY-11**: For targets `>=3.3.0`, deploy SHALL remove existing unversioned extension artifact directories before the copy step unless `--suppressDelete` is supplied.
- **FR-DEPLOY-12**: Deploy SHALL copy core artifacts only when `--core` is supplied.

  Deploy strips the prerelease suffix from the ODS/API target before comparing it with the ranges below, regardless of `suppressPrereleaseVersion`. For example, `3.3.0-rc.1` counts as `3.3.0`. With default cleanup, deploy can remove an existing unversioned extension `Artifacts/` directory, copy no replacements, and exit `0`.

  | `defaultPluginTechVersion` | Unversioned extension artifacts (unless `--suppressDelete`) | Core copy target | Extension copy target |
  | --- | --- | --- | --- |
  | `<3.3.0` | Kept | None | None |
  | `>=3.3.0 <5.4.0` | Removed | None | None |
  | `>=5.4.0 <7.0.0` | Removed | `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Artifacts/` | `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts/` |
  | `>=7.0.0` | Removed | `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Standard/{dataStandardVersion}/Artifacts/` | `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Versions/{projectVersion}/Standard/{dataStandardVersion}/Artifacts/` |

- **FR-DEPLOY-13**: For targets `>=5.4.0`, deploy SHALL copy the mapped folders it finds under each extension source into the target shown in FR-DEPLOY-12. For `>=7.0.0`, copying overwrites matching files in the active versioned target and leaves files that are absent from the new output in place.
- **FR-DEPLOY-14**: Core deploy SHALL copy from the `EdFi` artifact namespace folder.
- **FR-DEPLOY-15**: The build names each extension output folder by `namespaceName`. Cleanup uses that folder name, while the copy task looks for a source folder named by `projectName`. When these differ, deploy can remove existing unversioned artifacts, skip their replacement, and exit `0` (§6.2).
- **FR-DEPLOY-16**: For targets `>=7.1.0`, deploy SHALL format a valid Data Standard version as `major.minor.0` in target paths when `suppressPrereleaseVersion` is enabled. Otherwise it uses the supplied version string.
- **FR-DEPLOY-17**: Deploy SHALL refresh the timestamps of existing extension `EdFi.Ods.Extensions.{name}.csproj` files after copying.
- **FR-DEPLOY-18**: For targets `>=3.3.0`, deploy SHALL warn when it finds `SupportingArtifacts` at the legacy core or extension project paths.
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

- **FR-PKG-1**: Packaging SHALL configure a build for the selected Data Standard and target technology version, with the core project and any selected extension.
- **FR-PKG-2**: Packaging builds SHALL enable Alliance Mode and prerelease suppression. The extension version SHALL come from `metaEdProject.projectVersion`, defaulting to `1.1.0` for TPDM and `1.0.0` otherwise.
- **FR-PKG-3**: Each NuGet package SHALL include the generated `ApiSchema.json` and any generated XSD and Interchange schemas. Core packaging also copies the checked-in `eng/ApiSchema/discovery-spec.json`. [4.9.0 staging script](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/eng/ApiSchema/build.ps1#L278-L355)
- **FR-PKG-4**: Packaging SHALL build Core, Sample, and Homograph for Data Standards 4.0.0, 5.2.0, 6.0.0, and 6.1.0, and TPDM for 5.2.0 only. The 4.0.0 Sample and Homograph packages are build artifacts only.
- **FR-PKG-4a**: Each package SHALL have a Data Standard-qualified ID and a `package-manifest.json`. Packaging SHALL validate the finished package before publishing. [4.9.0 package contract](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/eng/ApiSchema/PACKAGE-CONTRACT.md)
- **FR-PKG-5**: A manually triggered run on a protected ref SHALL publish eligible packages to Azure Artifacts. Missing feed credentials SHALL fail publication. [4.9.0 packaging workflow](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/.github/workflows/api-schema-packaging.yml) · [Build commands](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/eng/ApiSchema/README.md#build-flow)

## 4. Non-Functional Requirements

### Compatibility

- **NFR-COMPAT-1**: MetaEd SHALL run in local and CI Node.js environments compatible with its dependencies. The 4.9.0 CI workflows use Ubuntu.
- **NFR-COMPAT-2**: The 4.9.0 pull-request, npm publish, and API Schema generation jobs explicitly select Node `24.22.1`. [Pull-request workflow](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/.github/workflows/on-pullrequest.yml#L34-L37) · [npm publish workflow](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/.github/workflows/reusable-publish.yml#L52-L55) · [API Schema generation](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/.github/workflows/api-schema-packaging.yml#L99-L102)
- **NFR-COMPAT-3**: Published packages SHALL be CommonJS modules (compilation target details are in the `metaed-core` README).
- **NFR-COMPAT-4**: Generated SQL artifacts SHALL distinguish SQL Server and PostgreSQL output directories and generator plugins, targeting both database platforms.
- **NFR-COMPAT-5**: `projectPaths` selects the directories containing the model files. Each corresponding `projects` entry identifies the supplied model with `projectVersion`. Independently, `defaultPluginTechVersion` selects version-dependent generator and deploy behavior.

### Licensing

- **NFR-LIC-1**: The build and deploy CLIs SHALL require the license acceptance option. Callers can supply `-a` / `--accept-license` on the command line or set `"accept-license": true` at the top level of the JSON configuration.
- **NFR-LIC-2**: Packages SHALL be licensed as Apache-2.0 as declared in package metadata and repository license files.

### Reliability

- **NFR-REL-1**: The CLI SHALL return non-zero exit codes for validation errors, pipeline failures, uncaught pipeline exceptions, and unsuccessful deploy tasks.
- **NFR-REL-2**: A failed output path check SHALL leave the existing directory intact (FR-BUILD-12).
- **NFR-REL-3**: If the source-file check finds a match, the writer SHALL stop before deleting or writing files (FR-BUILD-13).
- **NFR-REL-4**: The deploy task runner SHALL stop when a task returns failure, and the CLI SHALL exit `1`. Within an extension copy task, a copy error is logged and later extensions can still be processed before the task returns. [4.9.0 task runner](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-odsapi-deploy/src/RunDeployTasks.ts#L39-L65)
- **NFR-REL-5**: A build with an invalid plugin configuration rule SHALL exit `1` even when the CLI prints only an error count for the rule validation (§6.2).

### Security

- **NFR-SEC-1**: Normal build and deploy runtime behavior SHALL operate on local files and SHALL NOT require credentials.
- **NFR-SEC-2**: Publishing workflows SHALL use package-feed credentials; those credentials are outside normal build and deploy runtime behavior.
- **NFR-SEC-3**: The build and deploy commands SHALL operate on local files without transmitting data to external services.

### Observability

- **NFR-OBS-1**: At the default `info` level, a build logs file loading, the plugins it runs, and the artifact directory when writing output. Deploy logs the copy operations it attempts. Source-scan deploy also emits build logs. Both CLIs log elapsed time when they reach the end of the command. Set `LOG_LEVEL=debug` for detailed stage tracing.
- **NFR-OBS-2**: Validation failures carry a category and message and can already include a file path. The final reporting step maps remaining source locations to files where possible and logs the diagnostics. An early return skips this step. The file loader and output writer log their own errors. [4.9.0 pipeline](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-core/src/pipeline/Pipeline.ts) · [Diagnostic reporting](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-core/src/pipeline/FileMapForValidationFailure.ts#L30-L40)

### SDLC

- **NFR-SDLC-1**: For pull requests targeting `main`, CI SHALL run TypeScript and ESLint checks through `npm run test:lint`.
- **NFR-SDLC-2**: For pull requests targeting `main`, CI SHALL run non-database unit tests, SQL Server database tests, and PostgreSQL database tests.
- **NFR-SDLC-3**: Repository workflows SHOULD run dependency review, CodeQL analysis, and OpenSSF Scorecard checks where configured.
- **NFR-SDLC-4**: Release workflows SHALL publish npm packages to Azure Artifacts using Lerna.

## 5. System Architecture

### 5.1 Processing Pipeline

The pipeline loads and parses source files, builds the model, then runs each plugin's validators, enhancers, and generators in dependency order. With `stopOnValidationFailure` enabled, validation errors stop the plugin loop before output is written. With that option disabled, validators in later plugins can still run. A plugin marked `requiresValidModel` skips enhancement and generation when errors exist and marks the run failed. The pipeline then leaves existing output in place. [Validation and output regression tests](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-core/test/pipeline/Pipeline.test.ts#L92-L141) · [Pipeline stages](../packages/metaed-core/README.md#business-logic) · [4.9.0 plugin order](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-default-plugins/src/index.ts#L29-L65)

### 5.2 Component Packages

| Package | Product Responsibility |
| --- | --- |
| [`@edfi/metaed-core`](../packages/metaed-core/README.md) | Core pipeline, configuration model, file loading, grammar parsing, model builders, validators/enhancers/generators contracts, plugin configuration loading, and output writing. |
| [`@edfi/metaed-console`](../packages/metaed-console/README.md) | Build CLI for running the MetaEd pipeline with default plugins. |
| [`@edfi/metaed-default-plugins`](../packages/metaed-default-plugins/README.md) | Default ordered plugin list used by the build and deploy-console build flow. |
| [`@edfi/metaed-odsapi-deploy`](../packages/metaed-odsapi-deploy/README.md) | Deploy task library for copying generated artifacts into an ODS/API source tree. |
| [`@edfi/metaed-odsapi-deploy-console`](../packages/metaed-odsapi-deploy-console/README.md) | Deploy CLI for source-scan build-and-deploy mode or config-based deploy mode. |
| [`@edfi/metaed-plugin-edfi-unified`](../packages/metaed-plugin-edfi-unified/README.md) | Foundational Ed-Fi semantic validators and enhancers, including reference resolution, base class resolution, domain/subdomain links, merge directives, and shared type enrichment. |
| [`@edfi/metaed-plugin-edfi-unified-advanced`](../packages/metaed-plugin-edfi-unified-advanced/README.md) | Additional validation for merge scenarios, deprecation warnings, common property identity rules, and self-referencing property role names. |
| [`@edfi/metaed-plugin-edfi-ods-relational`](../packages/metaed-plugin-edfi-ods-relational/README.md) | Shared relational ODS model enhancers and a relational validator, used by SQL Server, PostgreSQL, API Schema, SQL dictionary, change query, record ownership, ODS/API, and handbook plugins. |
| [`@edfi/metaed-plugin-edfi-api-schema`](../packages/metaed-plugin-edfi-api-schema/README.md) | API Schema model enhancers, security-related configuration rules, OpenAPI fragment and relational metadata, and `ApiSchema*.json` generation with API Schema version metadata. |
| [`@edfi/metaed-plugin-edfi-ods-sqlserver`](../packages/metaed-plugin-edfi-ods-sqlserver/README.md) | SQL Server ODS naming, schema/table/column enhancements, and SQL Server ODS SQL script generation. |
| [`@edfi/metaed-plugin-edfi-ods-postgresql`](../packages/metaed-plugin-edfi-ods-postgresql/README.md) | PostgreSQL ODS naming, schema/table/column enhancements, and PostgreSQL ODS SQL script generation. |
| [`@edfi/metaed-plugin-edfi-xsd`](../packages/metaed-plugin-edfi-xsd/README.md) | XSD model enhancers, duplicate-name validation for dependency namespaces, core/extension XSD generation, schema annotation generation, and interchange XSD generation. |
| [`@edfi/metaed-plugin-edfi-ods-changequery`](../packages/metaed-plugin-edfi-ods-changequery/README.md) | Common change query validator, common model types, shared generation helpers for change query SQL artifacts, and shared indirect update cascade trigger enhancer and generator logic registered by the dialect-specific plugins. |
| [`@edfi/metaed-plugin-edfi-ods-changequery-sqlserver`](../packages/metaed-plugin-edfi-ods-changequery-sqlserver/README.md) | SQL Server-specific change query enhancers and SQL script generators. |
| [`@edfi/metaed-plugin-edfi-ods-changequery-postgresql`](../packages/metaed-plugin-edfi-ods-changequery-postgresql/README.md) | PostgreSQL-specific change query enhancers and SQL script generators. |
| [`@edfi/metaed-plugin-edfi-ods-recordownership`](../packages/metaed-plugin-edfi-ods-recordownership/README.md) | Common record ownership table enhancement that marks aggregate root tables for ownership token columns for target technology versions `>=3.3.0`. |
| [`@edfi/metaed-plugin-edfi-ods-recordownership-sqlserver`](../packages/metaed-plugin-edfi-ods-recordownership-sqlserver/README.md) | SQL Server record ownership SQL generation. |
| [`@edfi/metaed-plugin-edfi-ods-recordownership-postgresql`](../packages/metaed-plugin-edfi-ods-recordownership-postgresql/README.md) | PostgreSQL record ownership SQL generation. |
| [`@edfi/metaed-plugin-edfi-odsapi`](../packages/metaed-plugin-edfi-odsapi/README.md) | ODS/API model validators/enhancers and `ApiModel*.json` generation. |
| [`@edfi/metaed-plugin-edfi-xml-dictionary`](../packages/metaed-plugin-edfi-xml-dictionary/README.md) | XML data dictionary Excel generation from XSD model data. |
| [`@edfi/metaed-plugin-edfi-sql-dictionary`](../packages/metaed-plugin-edfi-sql-dictionary/README.md) | SQL data dictionary Excel generation from relational ODS model data. |
| [`@edfi/metaed-plugin-edfi-handbook`](../packages/metaed-plugin-edfi-handbook/README.md) | Handbook-specific model enhancers plus HTML and Excel Data Handbook generation. |
| [`@edfi/metaed-plugin-edfi-api-catalog`](../packages/metaed-plugin-edfi-api-catalog/README.md) | API Catalog Excel generation from API Schema and OpenAPI fragment data. |

### 5.3 Output Model

Generated files are written beneath the artifact directory by namespace and folder; the `GeneratedOutput` shape and write rules are documented in the `metaed-core` README.

## 6. Out of Scope and Known Limitations

### 6.1 Explicit Exclusions

- **MetaEd IDE (VS Code Extension)** — the authoring extension is maintained in a separate repository.
- **The MetaEd DSL language specification and grammar semantics** — documented separately.
- **ODS/API runtime behavior, API service hosting, database execution, migrations, and production deployment** — outside this PRD.
- **Data Standard content** — this repository processes model files but does not define data element requirements.

### 6.2 Known Limitations

- `MetaEdConfiguration` includes `pluginTechVersion`, and some fixtures contain it, but current plugin setup assigns every plugin the single `defaultPluginTechVersion`.
- Config-based deploy uses the supplied configuration directly. Omitting `suppressPrereleaseVersion` leaves the supplied version string intact, even if the CLI flag is set. Omitting `defaultPluginTechVersion` without a `-x` override skips artifact removal, copying, and legacy-directory warnings. The extension path check and project timestamp refresh can still run.
- Source-scan discovery applies `--projectNames` overrides before sorting and keeps one project per resulting name. Distinct overrides can preserve two projects with the same declared name. Mixed source inputs can also miss nested projects, and project names that cannot form a namespace yield an empty namespace. [Deploy-console discovery rules](../packages/metaed-odsapi-deploy-console/README.md#business-logic)
- Source-scan deploy sorts by project name. For example, extension `Alpha` precedes core project `Ed-Fi`. The last resolved project determines where the CLI puts `MetaEdOutput` (FR-DEPLOY-4). [METAED-1675](https://edfi.atlassian.net/browse/METAED-1675)
- For an unknown plugin configuration rule, the build records the rule name, reason, and configuration file path. The CLI logs the plugin's error count and exits `1` before printing the detailed diagnostic. A registered rule targeting an unknown namespace passes rule validation, then fails during model annotation. The CLI reaches diagnostic reporting, logs the namespace and configuration path, and exits `1`. [4.9.0 rule validation](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-core/src/plugin/LoadPluginConfiguration.ts#L53-L65) · [METAED-1676](https://edfi.atlassian.net/browse/METAED-1676)
- Importing a sibling `.libsonnet` file from a plugin configuration fails in a CLI build. The lower-level Jsonnet loader accepts explicit library files through `libraryPaths`, and the build supplies only external variables (FR-CFG-9). [4.9.0 Jsonnet loader](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-core/src/plugin/JsonnetConfigLoader.ts#L82-L103) · [METAED-1677](https://edfi.atlassian.net/browse/METAED-1677)
- On ODS/API 6.1, a source-scan build of `Twin-Name` writes artifacts under `TwinName/`. With default cleanup, deploy can remove `EdFi.Ods.Extensions.TwinName/Artifacts/`, find no source under `Twin-Name/`, refresh the existing `.csproj`, and exit `0` with no replacement artifacts. [4.9.0 cleanup](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-odsapi-deploy/src/task/RemoveExtensionArtifacts.ts#L13-L38) · [4.9.0 extension copy](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-odsapi-deploy/src/task/DeployExtensionV6.ts#L36-L59) · [METAED-1678](https://edfi.atlassian.net/browse/METAED-1678)
- A core-only deploy with no extension artifact folders can fail the extension project precheck when `allianceMode` is false.
- Deploy does not copy generated `ApiSchema/` or `Documentation/` artifact folders into the ODS/API source tree.
- Deploy assumes the local ODS/API source tree follows expected `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` folder conventions.
- The console packages declare no package `bin` commands; run them through their Node.js entry points or repository scripts.
- API Schema packaging uses the [4.9.0 plugin configuration](https://github.com/Ed-Fi-Alliance-OSS/MetaEd-js/blob/v4.9.0/packages/metaed-plugin-edfi-api-schema/test/integration/edfiApiSchema.config.json).
- Alliance Mode is an internal setting used by Ed-Fi Alliance workflows. It affects selected validators, SQL license headers, and the extension path check.

## 7. Glossary

| Term | Definition |
| --- | --- |
| MetaEd-js | The Node.js monorepo that parses MetaEd DSL projects and generates artifacts through plugins. |
| MetaEd | Umbrella term for the DSL, the compiler, and the supporting packages. |
| MetaEd DSL | The `.metaed` source language processed by this repository. |
| MetaEd Generator | The command-line application that compiles `.metaed` files into artifacts. |
| Data Standard project | The core project identified by namespace `EdFi`. The build and deploy project checks require exactly one. |
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
| ODS/API | The Ed-Fi project whose source tree receives artifacts from the deploy CLI. |
| API Model | ODS/API metadata JSON generated as `ApiModel*.json`. |
| API Schema | JSON schema output generated as `ApiSchema*.json` for API schema consumers. |
| Change Query | SQL artifacts for change version, tracked delete, and related change tracking support. |
| Record Ownership | SQL artifacts that add ownership token support to aggregate root tables when enabled by target version. |
| Alliance Mode | The `allianceMode` configuration setting used by Ed-Fi Alliance builds and deploys. |
| SemVer | Semantic Versioning 2.0.0 — the versioning scheme used for project versions. |
| Tech Version | The target ODS/API version (e.g., `6.0.0`) that determines which plugin behaviors and output formats to use. |
