# MetaEd-js Product Requirements Document

- Status: Draft, reverse-engineered from repository evidence
- Repository: `MetaEd-js`
- Package version source: Lerna version `4.7.1-dev.1`
- Platform and runtime: Node.js packages compiled from TypeScript to ES2017/CommonJS; CI runs Node 22
- Document scope: Product behavior implemented in this repository only
- Evidence basis: package metadata, source entry points, CLI/deploy/configuration code, plugin generators, tests, authoritative artifacts, and workflow configuration

> [!NOTE] Document Scope
> This PRD describes the MetaEd-js command-line generator, deployment utility, default plugin set, and generated artifact families as implemented by package metadata, source code, tests, authoritative artifacts, and workflow configuration in this repository.
>
> It does not define the MetaEd DSL language specification, Ed-Fi ODS/API runtime behavior, database execution semantics, or behavior of an external IDE extension.

## 1. Product Overview

MetaEd-js is a Node.js monorepo that compiles Ed-Fi MetaEd DSL projects into local filesystem artifacts used by downstream Ed-Fi data platform tooling. A MetaEd project is represented by `.metaed` source files plus project metadata such as project name, namespace, version, optional project extension, and description. When project metadata omits a project extension, generated extension artifact names use `EXTENSION` while the core `EdFi` namespace uses no project extension. The generator reads one Data Standard project and zero or more extension projects, validates and enriches the semantic model, runs the default plugin set, and writes generated outputs grouped by namespace.

The repository provides two primary command-line workflows:

- `@edfi/metaed-console`: runs the MetaEd build pipeline and writes generated artifacts.
- `@edfi/metaed-odsapi-deploy-console`: optionally builds from project source directories and then copies generated artifacts into a local Ed-Fi ODS/API source tree layout for supported technology versions.

Repository automation also includes a manually dispatchable API Schema packaging workflow under `eng/ApiSchema` that runs MetaEd, moves selected generated API Schema/XSD artifacts into .NET package projects, packs NuGet packages, and publishes those packages through GitHub Actions when feed credentials are supplied.

The product value is artifact consistency: SQL, XSD, API metadata, API schema, documentation, and dictionary outputs are generated from the same MetaEd model rather than authored independently.

### 1.1 Target Users and Personas

- **Data Standard maintainers** maintain the core Ed-Fi Data Standard MetaEd project and need repeatable generated artifacts for release and packaging workflows.
- **Extension developers** maintain additive MetaEd extension projects and need validation plus generated artifacts for ODS/API integration.
- **Build and release engineers** run MetaEd headlessly in CI, publish npm packages, package API Schema artifacts, and verify generated outputs against authoritative fixtures.
- **Downstream artifact consumers** use generated spreadsheets, HTML documentation, JSON schema/metadata files, SQL scripts, and XSD files without reading `.metaed` source.

### 1.2 Jobs To Be Done

- **JTBD-1: Validate a model.** When a user changes `.metaed` files, they need the pipeline to report syntax, semantic, configuration, and plugin validation failures in a machine-detectable build result.
- **JTBD-2: Generate platform artifacts.** When a user has a valid Data Standard or extension model, they need one build command to produce all configured SQL, XSD, JSON, HTML, and Excel outputs.
- **JTBD-3: Deploy generated artifacts to a local ODS/API source tree.** When a user has generated artifacts for ODS/API technology version 7 or later, they need a deployment command to copy those artifacts into the expected `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` artifact folders.
- **JTBD-4: Produce documentation from the model.** When a user needs to inspect generated model shape, they need handbook, API catalog, SQL dictionary, and XML dictionary outputs that are generated from the same model pipeline.
- **JTBD-5: Run without an IDE.** When a build or release engineer automates MetaEd, they need Node.js command-line packages that can run in CI with deterministic exit codes.

## 2. Enterprise and System Context

### 2.1 External Systems and Integrations

- **Local MetaEd project directories** provide `.metaed` files and optional `package.json` files with `metaEdProject` metadata.
- **Ed-Fi Data Standard npm packages** are package dependencies of `@edfi/metaed-console` for model packages `@edfi/ed-fi-model-4.0`, `@edfi/ed-fi-model-5.0`, `@edfi/ed-fi-model-5.1`, `@edfi/ed-fi-model-5.2`, `@edfi/ed-fi-model-6.0`, and `@edfi/ed-fi-model-6.1`.
- **Ed-Fi ODS/API source trees** consume deployed artifact files under `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` directories.
- **SQL Server and PostgreSQL** are downstream targets for generated database scripts; MetaEd-js generates scripts but does not execute them as part of the build pipeline.
- **API Schema and API metadata consumers** consume `ApiSchema*.json` and `ApiModel*.json` outputs.
- **.NET SDK and NuGet/Azure Artifacts** are used by API Schema packaging automation under `eng/ApiSchema`.
- **GitHub Actions and Azure Artifacts** are used by repository workflows for linting, testing, publishing npm packages, and packaging API Schema artifacts.
- **ANTLR 4.6 generated JavaScript grammar files** are part of the source tree used by the parser.

### 2.2 Deployment Boundaries

- MetaEd-js build and deploy commands operate on local files. The build pipeline reads `.metaed` source files and plugin configuration files, then writes artifacts to disk.
- Deploy copies files into a local ODS/API source tree layout. It does not deploy to running services, execute SQL, start databases, or validate ODS/API runtime behavior.
- Publishing workflows communicate with package feeds, but normal build and deploy runtime behavior is filesystem-based.

## 3. Functional Requirements

### 3.1 Project Input and Configuration

- **FR-CFG-1**: The build CLI SHALL accept a JSON configuration file through `-c` / `--config` containing a top-level `metaEdConfiguration` object.
- **FR-CFG-2**: `metaEdConfiguration` SHALL support `artifactDirectory`, `deployDirectory`, `pluginTechVersion`, `projects`, `projectPaths`, `pluginConfigDirectories`, `defaultPluginTechVersion`, `allianceMode`, and `suppressPrereleaseVersion`; it MAY include `externalVariables` for Jsonnet configuration evaluation.
- **FR-CFG-3**: The pipeline SHALL require `projects` and `projectPaths` to have the same length and SHALL map each project metadata entry to the corresponding source path.
- **FR-CFG-4**: The file loader SHALL recursively load files with `.metaed`, `.metaEd`, `.MetaEd`, or `.METAED` extensions from each configured project path.
- **FR-CFG-5**: The build and deploy CLIs SHALL require exactly one Data Standard project, identified by namespace `EdFi`; no Data Standard project or multiple Data Standard projects SHALL cause failure.
- **FR-CFG-6**: The project scanner used by the deploy console source mode SHALL read `package.json` files containing `metaEdProject`, derive `namespaceName` by removing non-alphanumeric characters from `projectName` only when the result starts with an uppercase letter, include the package description when present, sort a project whose `projectName` is exactly `EdFi` ahead of other projects, otherwise sort discovered projects by project name, and de-duplicate discovered projects by project name.
- **FR-CFG-7**: The project scanner MAY accept `projectNames` overrides that update discovered project names and derived namespaces in discovery order.
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
- **FR-BUILD-3**: The build CLI SHALL accept `-x` / `--defaultPluginTechVersion` to override the configured default technology version for all plugins.
- **FR-BUILD-4**: The default plugin technology version SHALL be `6.0.0` when not overridden by configuration or CLI argument.
- **FR-BUILD-5**: The build CLI SHALL support `--suppressPrereleaseVersion`, defaulting to `true` when no configuration object supplies a value.
- **FR-BUILD-6**: The build pipeline SHALL run initialization, plugin setup, file loading, syntax validation, file indexing, parse tree building, model building, namespace initialization, plugin configuration loading, validators, enhancers, generators, output writing, and validation file mapping.
- **FR-BUILD-7**: The build pipeline SHALL stop plugin execution on validation errors when `stopOnValidationFailure` is enabled.
- **FR-BUILD-8**: The build CLI SHALL exit with code `0` only when no validation error and no pipeline failure occurred; otherwise it SHALL exit with code `1`.
- **FR-BUILD-9**: Generated outputs SHALL be written under the configured artifact directory or a `MetaEdOutput` directory under the last input project path. Relative `artifactDirectory` values SHALL be resolved from the last input project path.
- **FR-BUILD-10**: Output writing SHALL group generated files by namespace, with the generator-provided folder path under that namespace.
- **FR-BUILD-11**: Output writing SHALL refuse to delete an existing output directory unless the path contains `MetaEdOutput`.
- **FR-BUILD-12**: Output writing SHALL refuse to write when `.metaed` files are found in the output location.

### 3.3 Generated Artifact Families

#### 1. ODS/API Metadata

- **FR-ODSAPI-METADATA-1**: The build SHALL generate ODS/API metadata JSON files per namespace as `ApiMetadata/ApiModel.json` when `projectExtension` is empty or `ApiMetadata/ApiModel-{projectExtension}.json` when it is not, through `metaed-plugin-edfi-odsapi`.

#### 2. API Schema

- **FR-API-SCHEMA-1**: The build SHALL generate API Schema JSON files per namespace as `ApiSchema/ApiSchema.json` when `projectExtension` is empty or `ApiSchema/ApiSchema-{projectExtension}.json` when it is not, through `metaed-plugin-edfi-api-schema`.
- **FR-API-SCHEMA-2**: API Schema output SHALL include `apiSchemaVersion` and a project schema containing project identity, endpoint name, `compatibleDsRange` for extension-project compatibility, description, resource schemas, resource-name mappings, case-insensitive endpoint-name mappings, abstract resources, education organization information, domains, extension-project flag, and core OpenAPI base documents where generated by the API Schema model. Resource schemas SHALL include generated JSON schema-for-insert data, identity JSON paths, document path mappings, equality constraints, type-coercion JSON paths, decimal validation information, securable elements, authorization pathways, array uniqueness constraints, OpenAPI fragments, query-field mappings where applicable, school year enumeration resource schema when present, and optional relational naming metadata where generated.

#### 3. SQL Server and PostgreSQL ODS SQL

- **FR-ODS-SQL-1**: The build SHALL generate SQL Server ODS structure and data scripts under `Database/SQLServer/ODS/`.
- **FR-ODS-SQL-2**: The build SHALL generate PostgreSQL ODS structure and data scripts under `Database/PostgreSQL/ODS/`.
- **FR-ODS-SQL-3**: SQL ODS outputs SHALL include schema, table, foreign key, extended property, enumeration, and school year scripts when corresponding model data exists; core file names SHALL use `{prefix}-{suffix}.sql`, and extension file names SHALL include namespace context as `{prefix}-{projectExtension}-{namespaceName}-{suffix}.sql` or `{prefix}-{namespaceName}-{suffix}.sql` when `projectExtension` is empty.
- **FR-ODS-SQL-4**: SQL ODS outputs SHALL include ID column unique index scripts for tables that require generated ID indexes.
- **FR-ODS-SQL-5**: For technology versions `>=7.1.0`, SQL ODS outputs SHALL include education organization authorization index creation scripts when table data exists.
- **FR-ODS-SQL-6**: For technology versions `>=7.3.0`, SQL ODS outputs SHALL include aggregate ID column scripts and education organization authorization index update scripts when table data exists.
- **FR-ODS-SQL-7**: SQL-generating plugins SHALL include Apache-2.0 license headers in supported SQL templates only when `allianceMode` is enabled and the relevant target technology version satisfies `>=5.0.0`.

#### 4. Change Query SQL

- **FR-CHANGE-QUERY-SQL-1**: The change query plugins SHALL generate change schema, change version sequence, change version column/index, tracked delete schema, tracked delete table, delete tracking trigger, change version/key change trigger, and indirect update cascade trigger scripts under `Database/{SQLServer|PostgreSQL}/ODS/Structure/Changes/` when required model data exists. For target technology versions `>=7.3.0`, shared change schema and sequence files SHALL be generated for the core namespace and skipped for extension namespaces, and indirect update cascade triggers SHALL be generated when required model data exists.

#### 5. Record Ownership SQL

- **FR-RECORD-OWNERSHIP-SQL-1**: The record ownership plugins SHALL generate `0010-AddColumnOwnershipTokenForTable.sql` under `Database/{SQLServer|PostgreSQL}/ODS/Structure/RecordOwnership/` for aggregate root tables when the target technology version satisfies `>=3.3.0`.

#### 6. XSD and Interchange Schemas

- **FR-XSD-1**: The XSD plugin SHALL generate `XSD/Ed-Fi-Core.xsd` for the core namespace and `{projectExtension}-Ed-Fi-Extended-Core.xsd` for extension namespaces.
- **FR-XSD-2**: The XSD plugin SHALL generate `XSD/SchemaAnnotation.xsd` for the core namespace.
- **FR-XSD-3**: The XSD plugin SHALL generate interchange schemas under `Interchange/`, using `Interchange-{Name}.xsd` for core interchanges and `{projectExtension}-Interchange-{Name}-Extension.xsd` for extension interchanges.

#### 7. Data Handbook

- **FR-HANDBOOK-1**: The handbook plugin SHALL generate `Documentation/Ed-Fi-Handbook/Ed-Fi-Data-Handbook-Index.html` and `Documentation/Ed-Fi-Handbook/Ed-Fi-Handbook.xlsx`.

#### 8. Data Dictionaries

- **FR-DICTIONARY-1**: The SQL dictionary plugin SHALL generate `Documentation/DataDictionary/SqlDataDictionary.xlsx` with table and column worksheets derived from relational ODS model data.
- **FR-DICTIONARY-2**: The XML dictionary plugin SHALL generate `Documentation/DataDictionary/XmlDataDictionary.xlsx` with elements, complex types, and simple types worksheets derived from XSD model data.

#### 9. API Catalog

- **FR-API-CATALOG-1**: The API Catalog plugin SHALL generate `Documentation/Ed-Fi-API-Catalog/Ed-Fi-API-Catalog.xlsx`.
- **FR-API-CATALOG-2**: The API Catalog SHALL include `Resources` and `Properties` worksheets.
- **FR-API-CATALOG-3**: The API Catalog `Resources` worksheet SHALL include project, version, resource name, resource description, and domains.
- **FR-API-CATALOG-4**: The API Catalog `Properties` worksheet SHALL include project, version, resource name, property name, property description, data type, min length, max length, validation regular expression, identity key flag, nullable flag, and required flag.
- **FR-API-CATALOG-5**: The API Catalog SHALL omit the top-level `id` property from the properties worksheet.
- **FR-API-CATALOG-6**: The API Catalog SHALL recurse into common sub-schemas and reference schemas and represent nested property origins with dot-separated property paths.

### 3.4 Model Validation

- **FR-VAL-1**: The pipeline SHALL collect syntax validation failures per loaded file before building the aggregate parse tree and SHALL include them in the final validation result; when `stopOnValidationFailure` is enabled, existing error-category failures SHALL prevent plugin enhancers, plugin generators, and output writing.
- **FR-VAL-2**: The unified plugin SHALL validate core model relationships, including unresolved references, duplicate names, illegal extensions and subclasses, redeclared properties, invalid identity declarations and renames, invalid domain/subdomain/interchange membership, invalid namespace casing, and invalid shared/simple property bounds.
- **FR-VAL-3**: The unified advanced plugin SHALL validate merge directive paths and property compatibility, out-reference paths that need a merge directive or role name, common-property identity requirements, identity-name conflicts, and self-referencing property role names; it SHALL also report deprecation warnings for deprecated entities, extensions, subclasses, properties, domain item references, and interchange item references.
- **FR-VAL-4**: The ODS relational plugin SHALL warn for properties named `Discriminator` when the target technology version is `>=5.1.0`.
- **FR-VAL-5**: The change query plugin SHALL reject namespaces named `Changes`, case-insensitively, because that name is reserved by generated change query artifacts.
- **FR-VAL-6**: The ODS/API plugin SHALL warn when required choice properties appear in extensions and SHALL reject unsupported extension subclasses except EducationOrganization domain entity subclasses and GeneralStudentProgramAssociation association subclasses.
- **FR-VAL-7**: The XSD plugin SHALL suppress XSD generation for a namespace with duplicate entity names in dependency namespaces and SHALL report validation through the duplicate-name validator.
- **FR-VAL-8**: Deprecation validators SHALL report warnings for extension namespace elements, and SHALL report warnings for non-extension namespace elements only when `allianceMode` is enabled.

### 3.5 Deploy Command

- **FR-DEPLOY-1**: `@edfi/metaed-odsapi-deploy-console` SHALL run from Node.js and execute deploy tasks from `@edfi/metaed-odsapi-deploy`.
- **FR-DEPLOY-2**: The deploy CLI SHALL require `-a` / `--accept-license`.
- **FR-DEPLOY-3**: The deploy CLI SHALL accept configuration through `-c` / `--config`.
- **FR-DEPLOY-4**: When no configuration is supplied, the deploy CLI SHALL use `-s` / `--source`, `-t` / `--target`, and `-p` / `--projectNames` to scan project source directories, build artifacts into `MetaEdOutput` under the last resolved project path, and then deploy.
- **FR-DEPLOY-5**: The deploy CLI SHALL accept `-x` / `--defaultPluginTechVersion` to override the configured default technology version for build and deploy behavior.
- **FR-DEPLOY-6**: In source-scan mode, the deploy CLI SHALL support `--suppressPrereleaseVersion`, defaulting to `true` when the option is not supplied; in config-based mode, deploy SHALL use the `suppressPrereleaseVersion` value supplied by `metaEdConfiguration`.
- **FR-DEPLOY-7**: The deploy CLI SHALL accept `--core` to deploy core artifacts in addition to extension artifacts.
- **FR-DEPLOY-8**: The deploy CLI SHALL accept `--suppressDelete` to skip deletion of existing extension artifact directories.
- **FR-DEPLOY-9**: The deploy CLI SHALL accept `--additionalMssqlScriptsDirectory` and `--additionalPostgresScriptsDirectory`; when a core or extension artifact copy task runs for a supported `defaultPluginTechVersion`, deploy SHALL copy those scripts into the corresponding deployed ODS data folders.
- **FR-DEPLOY-10**: For `defaultPluginTechVersion` values `>=3.0.0`, deploy SHALL check that extension C# project directories exist under `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/` for each immediate artifact directory except `ApiSchema`, `Documentation`, and `EdFi`.
- **FR-DEPLOY-11**: Unless suppressed, deploy SHALL remove existing `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts` directories for `defaultPluginTechVersion` values `>=3.3.0`.
- **FR-DEPLOY-12**: Core artifact copy SHALL run only when `--core` is supplied and `defaultPluginTechVersion` satisfies `>=7.0.0`.
- **FR-DEPLOY-13**: Extension artifact copy SHALL run only when `defaultPluginTechVersion` satisfies `>=7.0.0`.
- **FR-DEPLOY-14**: Core deploy SHALL copy from artifact namespace `EdFi` into `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Standard/{dataStandardVersion}/Artifacts/`.
- **FR-DEPLOY-15**: Extension deploy SHALL copy each non-EdFi project from an artifact source folder named by `projectName` into `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Versions/{projectVersion}/Standard/{dataStandardVersion}/Artifacts/`.
- **FR-DEPLOY-16**: For ODS/API technology versions satisfying `>=7.1.0`, deploy SHALL format Data Standard versions with prerelease suppression according to `suppressPrereleaseVersion`.
- **FR-DEPLOY-17**: Deploy SHALL refresh existing extension `.csproj` files by updating their filesystem modification timestamp after copy tasks run.
- **FR-DEPLOY-18**: For `defaultPluginTechVersion` values `>=3.3.0`, deploy SHALL warn when legacy `SupportingArtifacts` directories exist for the standard or extension projects.
- **FR-DEPLOY-19**: Deploy SHALL skip a generated source folder when that folder is absent rather than failing the entire deploy.
- **FR-DEPLOY-20**: Deploy SHALL map generated folders to ODS/API artifact folders as follows:

| Generated Folder                     | Deployed Folder        |
| ------------------------------------ | ---------------------- |
| `ApiMetadata/`                       | `Metadata/`            |
| `Database/SQLServer/ODS/Data/`       | `MsSql/Data/Ods/`      |
| `Database/SQLServer/ODS/Structure/`  | `MsSql/Structure/Ods/` |
| `Database/PostgreSQL/ODS/Data/`      | `PgSql/Data/Ods/`      |
| `Database/PostgreSQL/ODS/Structure/` | `PgSql/Structure/Ods/` |
| `Interchange/`                       | `Schemas/`             |
| `XSD/`                               | `Schemas/`             |

- **FR-DEPLOY-21**: Deploy SHALL leave generated `ApiSchema/` and `Documentation/` outputs in the artifact directory because deploy tasks only map API metadata, database, interchange, and XSD artifact families into the ODS/API source tree.

### 3.6 API Schema Packaging Automation

- **FR-PKG-1**: The repository MAY create MetaEd build configuration files for API Schema packaging automation using `eng/ApiSchema/CreateMetaEdConfig.ps1`.
- **FR-PKG-2**: API Schema packaging configuration generation SHALL write `eng/ApiSchema/MetaEdConfig.json` with `artifactDirectory` set to the packaging `MetaEdOutput` path, a core namespace `EdFi` project named `Ed-Fi`, an optional extension project, `defaultPluginTechVersion`, `allianceMode` set to `true`, and `suppressPrereleaseVersion` set to `true`. Extension project versions SHALL come from `metaEdProject.projectVersion` in the extension `package.json` when present; otherwise the default SHALL be `1.1.0` for TPDM and `1.0.0` for other extensions.
- **FR-PKG-3**: The API Schema packaging automation MAY run MetaEd through `eng/ApiSchema/build.ps1 -Command RunMetaEd`.
- **FR-PKG-4**: The API Schema packaging automation MAY copy generated `ApiSchema*.json` files from `MetaEdOutput` into `eng/ApiSchema` package projects for Core, TPDM, Homograph, or Sample package variants; it MAY also copy core XSD and interchange files for Core and extension XSD/interchange files for TPDM and Sample, while the Homograph packaging path currently copies only API Schema JSON.
- **FR-PKG-5**: The API Schema packaging automation MAY build, pack, and publish .NET packages through `dotnet` and Azure Artifacts when the corresponding workflow commands and credentials are supplied.

## 4. Non-Functional Requirements

### 4.1 Runtime and Compatibility

- **NFR-RUN-1**: Runtime packages SHALL execute under Node.js.
- **NFR-RUN-2**: TypeScript SHALL compile to CommonJS modules targeting ES2017.
- **NFR-RUN-3**: CI SHALL verify repository lint and test workflows on Node 22.
- **NFR-RUN-4**: Generated SQL artifacts SHALL distinguish SQL Server and PostgreSQL output directories and generator plugins.

### 4.2 Reliability and Data Safety

- **NFR-REL-1**: The CLI SHALL return non-zero exit codes for validation errors, pipeline failures, uncaught pipeline exceptions, and unsuccessful deploy tasks.
- **NFR-REL-2**: The output writer SHALL protect source projects by refusing to delete output directories that do not contain `MetaEdOutput` in the path.
- **NFR-REL-3**: The output writer SHALL protect source projects by refusing to write into a directory containing `.metaed` files.
- **NFR-REL-4**: Deploy tasks SHALL stop at the first unsuccessful task and return the failure message.

### 4.3 Security and Privacy

- **NFR-SEC-1**: Normal build and deploy runtime behavior SHALL operate on local files and SHALL NOT require credentials.
- **NFR-SEC-2**: Publishing workflows MAY use package-feed credentials, but those credentials are outside normal build and deploy runtime behavior.
- **NFR-SEC-3**: Packages SHALL be licensed as Apache-2.0 as declared in package metadata and repository license files.

### 4.4 Observability

- **NFR-OBS-1**: Build and deploy commands SHALL log major stages, plugin execution, artifact directory, deploy copy operations, warnings, and elapsed time.
- **NFR-OBS-2**: Validation failures SHALL carry category, message, and source/file mapping where available.

### 4.5 SDLC Quality

- **NFR-SDLC-1**: Pull request CI SHALL run TypeScript and ESLint checks through `npm run test:lint`.
- **NFR-SDLC-2**: Pull request CI SHALL run non-database unit tests, SQL Server database tests, and PostgreSQL database tests.
- **NFR-SDLC-3**: Repository workflows SHOULD run dependency review, CodeQL analysis, and OpenSSF Scorecard checks where configured.
- **NFR-SDLC-4**: Release workflows MAY publish npm packages to Azure Artifacts using Lerna.

## 5. System Architecture

### 5.1 Processing Pipeline

The build pipeline is sequential:

1. Initialize MetaEd environment.
2. Set up plugins and target technology versions.
3. Load `.metaed` files.
4. Validate syntax.
5. Load file indexes.
6. Build the parse tree.
7. Walk builders to construct the semantic model.
8. Initialize namespaces.
9. Load plugin configuration.
10. For each plugin in dependency order, run validators, enhancers, and generators.
11. Write generated output.
12. Map validation failures to files.

Plugins are ordered by `@edfi/metaed-default-plugins`, allowing upstream plugins to create semantic data used by downstream artifact generators.

### 5.2 Component Packages

| Package                                                   | Product Responsibility                                                                                                                                                             |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@edfi/metaed-core`                                       | Core pipeline, configuration model, file loading, grammar parsing, model builders, validators/enhancers/generators contracts, plugin configuration loading, and output writing.    |
| `@edfi/metaed-console`                                    | Build CLI for running the MetaEd pipeline with default plugins.                                                                                                                    |
| `@edfi/metaed-default-plugins`                            | Default ordered plugin list used by the build and deploy-console build flow.                                                                                                       |
| `@edfi/metaed-odsapi-deploy`                              | Deploy task library for copying generated artifacts into an ODS/API source tree.                                                                                                   |
| `@edfi/metaed-odsapi-deploy-console`                      | Deploy CLI for source-scan build-and-deploy mode or config-based deploy mode.                                                                                                      |
| `@edfi/metaed-plugin-edfi-unified`                        | Foundational Ed-Fi semantic validators and enhancers, including reference resolution, base class resolution, domain/subdomain links, merge directives, and shared type enrichment. |
| `@edfi/metaed-plugin-edfi-unified-advanced`               | Additional validation for merge scenarios, deprecation warnings, common property identity rules, and self-referencing property role names.                                         |
| `@edfi/metaed-plugin-edfi-ods-relational`                 | Shared relational ODS model enhancers and relational validators used by SQL Server, PostgreSQL, API Schema, dictionaries, change query, and record ownership plugins.              |
| `@edfi/metaed-plugin-edfi-api-schema`                     | API Schema model enhancers, security-related configuration rules, OpenAPI fragment and relational metadata, and `ApiSchema*.json` generation with API Schema version metadata.     |
| `@edfi/metaed-plugin-edfi-ods-sqlserver`                  | SQL Server ODS naming, schema/table/column enhancements, and SQL Server ODS SQL script generation.                                                                                 |
| `@edfi/metaed-plugin-edfi-ods-postgresql`                 | PostgreSQL ODS naming, schema/table/column enhancements, and PostgreSQL ODS SQL script generation.                                                                                 |
| `@edfi/metaed-plugin-edfi-xsd`                            | XSD model enhancers, duplicate-name validation for dependency namespaces, core/extension XSD generation, schema annotation generation, and interchange XSD generation.             |
| `@edfi/metaed-plugin-edfi-ods-changequery`                | Common change query validator, common model types, and shared generation helpers for change query SQL artifacts.                                                                   |
| `@edfi/metaed-plugin-edfi-ods-changequery-sqlserver`      | SQL Server-specific change query enhancers and SQL script generators.                                                                                                              |
| `@edfi/metaed-plugin-edfi-ods-changequery-postgresql`     | PostgreSQL-specific change query enhancers and SQL script generators.                                                                                                              |
| `@edfi/metaed-plugin-edfi-ods-recordownership`            | Common record ownership table enhancement that marks aggregate root tables for ownership token columns for target technology versions `>=3.3.0`.                                   |
| `@edfi/metaed-plugin-edfi-ods-recordownership-sqlserver`  | SQL Server record ownership SQL generation.                                                                                                                                        |
| `@edfi/metaed-plugin-edfi-ods-recordownership-postgresql` | PostgreSQL record ownership SQL generation.                                                                                                                                        |
| `@edfi/metaed-plugin-edfi-odsapi`                         | ODS/API model validators/enhancers and `ApiModel*.json` generation.                                                                                                                |
| `@edfi/metaed-plugin-edfi-xml-dictionary`                 | XML data dictionary Excel generation from XSD model data.                                                                                                                          |
| `@edfi/metaed-plugin-edfi-sql-dictionary`                 | SQL data dictionary Excel generation from relational ODS model data.                                                                                                               |
| `@edfi/metaed-plugin-edfi-handbook`                       | Handbook-specific model enhancers plus HTML and Excel Data Handbook generation.                                                                                                    |
| `@edfi/metaed-plugin-edfi-api-catalog`                    | API Catalog Excel generation from API Schema and OpenAPI fragment data.                                                                                                            |

### 5.3 Default Plugin Order

The default plugin order is:

`edfiUnified`, `edfiUnifiedAdvanced`, `edfiOdsRelational`, `edfiApiSchema`, `edfiOdsSqlServer`, `edfiOdsPostgresql`, `edfiXsd`, `edfiOdsChangeQuery`, `edfiOdsChangeQuerySqlServer`, `edfiOdsChangeQueryPostgresql`, `edfiOdsRecordOwnership`, `edfiOdsRecordOwnershipSqlServer`, `edfiOdsRecordOwnershipPostgresql`, `edfiOdsApi`, `edfiXmlDictionary`, `edfiSqlDictionary`, `edfiHandbook`, `edfiApiCatalog`.

### 5.4 Output Model

Generators return `GeneratedOutput` objects containing a human-readable name, namespace, folder name, file name, and either string or binary stream output. The writer creates directories recursively and writes files beneath the artifact directory using `{namespace}/{folderName}/{fileName}`.

## 6. Out of Scope and Known Limitations

### 6.1 Explicit Exclusions

- The MetaEd DSL language specification and grammar semantics are outside this PRD.
- External IDE behavior is outside this repository and outside this PRD.
- ODS/API runtime behavior, API service hosting, database execution, migrations, and production deployment are outside this PRD.
- Data Standard content itself is outside this PRD; this repository processes model files but does not define every data element requirement here.

### 6.2 Known Limitations

- `MetaEdConfiguration` includes `pluginTechVersion`, and some fixtures contain it, but current plugin setup assigns every plugin the single `defaultPluginTechVersion`.
- The license acceptance CLI option is required by yargs, but the source does not validate the option value or persist acceptance.
- The build console's custom config loader resolves relative `-c` / `--config` paths relative to the console module directory; absolute config paths avoid that ambiguity.
- Config-based deploy mode runs deploy tasks against an existing `artifactDirectory`; source-scan mode is the path that builds before deploy.
- Config-based deploy mode copies the supplied `metaEdConfiguration` without merging defaults from `newMetaEdConfiguration`, and it does not apply the `--suppressPrereleaseVersion` CLI option to the supplied configuration.
- Source-scan deploy mode returns without deploying when required source-mode inputs are absent, including `source` or `projectNames`.
- After source-scan deploy mode attempts a build, the deploy console still invokes deploy tasks even when the build has set a non-zero exit code; if an existing artifact directory remains, deploy can attempt to copy those artifacts.
- Source-scan project discovery scans subdirectories only while no projects have been discovered yet, so mixed source inputs can miss nested projects after an earlier project has already been found.
- Source-scan project discovery de-duplicates projects by project name, so two discovered projects with the same project name cannot both be represented in one deploy build.
- Source-scan namespace derivation returns an empty namespace when `projectName` cannot be converted to an alphanumeric string that starts with an uppercase letter.
- Deploy copies extension artifacts from folders named by `projectName`, while generators write output folders using `namespaceName`; source-scan and config-based deployments where those values differ can cause deploy to skip generated extension folders.
- Source-scan project sorting only special-cases a project whose `projectName` is exactly `EdFi`; Data Standard packages with `projectName` values such as `Ed-Fi` are sorted alphabetically with other discovered projects after namespace derivation.
- Core and extension artifact copy tasks are no-ops for `defaultPluginTechVersion` values below `7.0.0`.
- A core-only deploy with no extension artifact folders can fail the extension project existence precheck when `allianceMode` is false, because that precheck runs before core copy and ignores root `EdFi`, `Documentation`, and `ApiSchema` folders.
- Deploy does not copy generated `ApiSchema/` or `Documentation/` artifact folders into the ODS/API source tree.
- Deploy assumes the local ODS/API source tree follows expected `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` folder conventions.
- The console packages declare Node.js `main` entry points but no package `bin` commands, so command execution is through Node.js entry points or repository scripts rather than package-installed binary names.
- API Schema packaging `RunMetaEd` copies `packages/metaed-plugin-edfi-api-schema/test/integration/edfiApiSchema.config.json` into the core project path before running MetaEd, so packaging output depends on that checked-in configuration fixture.
- The API Schema packaging workflow matrix uses `TPDM`, but the TPDM checkout step currently checks for lowercase `tpdm`, so that workflow step does not run for the TPDM matrix entries as written.
- The API Catalog generator contains hard-coded handling for EducationOrganization and SchoolYear reference schemas because those reference schemas are not always discoverable from generated OpenAPI fragments.
- The output writer's deletion guard is path-name based: it requires `MetaEdOutput` to appear in the output path before deleting an existing output directory.

## 7. Glossary

| Term                              | Definition                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| MetaEd-js                         | The Node.js monorepo that parses MetaEd DSL projects and generates artifacts through plugins.                                       |
| MetaEd DSL                        | The `.metaed` source language processed by this repository.                                                                         |
| Data Standard project             | The core Ed-Fi project identified by namespace `EdFi`; exactly one is required by the CLIs.                                         |
| Extension project                 | A non-EdFi MetaEd project processed alongside the Data Standard project.                                                            |
| Namespace                         | The model and output grouping used by MetaEd to separate core and extension artifacts.                                              |
| Project extension                 | A string used by generators in some extension artifact file names; non-EdFi projects default to `EXTENSION` when metadata omits it. |
| Default plugin technology version | The version string assigned to plugin environments to select version-specific generator behavior.                                   |
| Plugin                            | A package that contributes validators, enhancers, generators, and optional configuration schemas.                                   |
| Validator                         | A plugin function that reports syntax, semantic, relationship, or configuration failures.                                           |
| Enhancer                          | A plugin function that adds derived semantic data to the model for downstream processing.                                           |
| Generator                         | A plugin function that produces one or more generated outputs.                                                                      |
| Artifact                          | A generated file written by the build pipeline, such as SQL, XSD, JSON, HTML, or Excel.                                             |
| ODS                               | Operational Data Store, represented here by generated SQL artifacts and ODS/API source tree folders.                                |
| ODS/API                           | The downstream Ed-Fi source tree layout targeted by deploy tasks.                                                                   |
| API Model                         | ODS/API metadata JSON generated as `ApiModel*.json`.                                                                                |
| API Schema                        | JSON schema output generated as `ApiSchema*.json` for API schema consumers.                                                         |
| Change Query                      | SQL artifacts for change version, tracked delete, and related change tracking support.                                              |
| Record Ownership                  | SQL artifacts that add ownership token support to aggregate root tables when enabled by target version.                             |
