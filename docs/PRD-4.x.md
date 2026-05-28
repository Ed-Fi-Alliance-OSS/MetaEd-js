# MetaEd Product Requirements Document — Version 4.x

- Status: Done
- Owner: Stephen Fuqua
- Repository: Ed-Fi-Alliance-OSS/MetaEd-Js
- Current Version: 4.7
- Platform: Visual Studio Code Extension + Node.js CLI

> [!TIP] Document Scope
> This PRD defines the product requirements for MetaEd version 4.x primarily from the end-user's perspective, which includes the new JavaScript/TypeScript implementation of the MetaEd generator and the accompanying VS Code extension. It covers the core features, functional and non-functional requirements, system architecture, and known limitations of this major release. The document is intended to guide development and ensure alignment with user needs and strategic goals.
>
> It does _not cover_ details about the MetaEd DSL syntax and semantics, the internal compilation pipeline, or details on how to construct the API model files used by ODS/API code generation and by the Ed-Fi API v8 deployment and runtime processes.

## 1. Product Overview

MetaEd is a technology framework that uses an Ed-Fi-aligned domain-specific language (DSL) to auto-generate software, database, and data standard artifacts from a single source definition. The term "MetaEd" encompasses:

- **MetaEd Language** — a lightweight DSL describing data elements, their properties, and their organization into entities and domains (the Ed-Fi Unified Data Model). Files use the `.metaed` extension.
- **MetaEd Generator** — a command-line application that compiles MetaEd language files into technical artifacts.
- **MetaEd IDE** — a Visual Studio Code extension providing an integrated development environment for authoring `.metaed` files and invoking the generator.
- **MetaEd Packages** — a collection of Node.js packages that implement the parsing, validation, enhancement, and generation pipeline.

The Ed-Fi Alliance uses MetaEd internally to produce core components such as JSON API metadata, SQL scripts, and technical documentation from a single source definition written in the MetaEd DSL. Externally, Ed-Fi Community members use MetaEd to create and maintain Ed-Fi Extensions, which are additive data models that extend the core Ed-Fi Data Standard to meet local needs.

### 1.1 Strategic Alignment

- **Single source of truth for data models.** All Ed-Fi technical artifacts (SQL, XSD, API metadata, documentation) are derived from one set of `.metaed` files, eliminating drift between artifacts.
- **Accelerate extension development.** Community implementers can rapidly create, validate, and build extensions to the Ed-Fi Data Standard without manual artifact authoring.
- **Support continuous integration.** MetaEd can be run headlessly in CI/CD pipelines to validate data models and produce deployment-ready artifacts on every commit.
- **Multi-version support.** A single MetaEd installation can target multiple Data Standard versions and ODS/API versions through configuration.

### 1.2 Target Users and Personas

- **Ed-Fi Alliance Technical Team** — maintains the core Ed-Fi Data Standard using MetaEd in Alliance Mode. Requires full control over core model files and uses advanced features like plugin configuration and CI builds.
- **Education Agency Developers** — extend the Ed-Fi Data Standard for local requirements. Primarily uses the IDE for authoring extensions and deploying artifacts to their ODS/API environment.
- **Ed-Fi Integration Partners** — build and maintain extensions on behalf of education agencies. Uses both the IDE and CI workflows to produce and validate extension artifacts.
- **Business Analysts** — review generated documentation (Data Handbook, API Catalog, Data Dictionaries) to understand the data model without reading source files.

### 1.3 Jobs to Be Done

#### JTBD 1.1. Author data model extensions in a guided IDE

**Personas**: Education Agency Developers, Ed-Fi Integration Partners, Ed-Fi Alliance Technical Team

**When** I need to create or modify an Ed-Fi extension, **I want** to author `.metaed` files in a guided IDE with syntax highlighting and validation, **so that** I can quickly define my extension without learning the internals of XSD, SQL, or API metadata formats.

**How MetaEd Helps**: The VS Code extension provides syntax highlighting, real-time semantic validation, and inline error reporting so authors get immediate feedback on model correctness.

#### JTBD 1.2. Compile model changes into deployable artifacts

**Personas**: Education Agency Developers, Ed-Fi Integration Partners, Ed-Fi Alliance Technical Team

**When** I am ready to test my model changes, **I want** to run a Build command that compiles all artifacts, **so that** I can verify correctness before deploying.

**How MetaEd Helps**: The Build command transforms `.metaed` source files into SQL scripts, XSD schemas, API metadata, interchange definitions, and documentation in a single operation.

#### JTBD 1.3. Deploy extension artifacts to the ODS/API

**Personas**: Education Agency Developers, Ed-Fi Integration Partners

**When** I need to integrate my extension with the ODS/API, **I want** to run a Deploy command that copies artifacts to the correct locations, **so that** the ODS/API build process picks them up automatically.

**How MetaEd Helps**: The Deploy command knows the expected directory structure of the ODS/API source tree and copies each artifact type to its correct destination.

#### JTBD 1.4. Validate and produce artifacts in CI

**Personas**: Ed-Fi Alliance Technical Team, Ed-Fi Integration Partners

**When** I maintain a CI pipeline for data model changes, **I want** to run MetaEd headlessly via Node.js, **so that** I can validate and produce artifacts on every commit without a graphical environment.

**How MetaEd Helps**: The `metaed-console` CLI accepts a JSON configuration file and returns a non-zero exit code on failure, integrating cleanly with CI/CD pipelines.

#### JTBD 1.5. Understand the API shape of a data model

**Personas**: Business Analysts, Education Agency Developers, Ed-Fi Integration Partners

**When** I need to understand the API shape of a data model, **I want** a generated API Catalog spreadsheet, **so that** I can catalog resources and their properties for comparison and documentation purposes.

**How MetaEd Helps**: The API Catalog plugin generates an Excel workbook with Resources and Properties tabs that describe every endpoint and field derived from the model.

## 2. Enterprise and System Context

### 2.1 External Systems and Integrations

- **Ed-Fi ODS/API** — the primary consumer of MetaEd-generated artifacts (SQL scripts, XSD, API metadata). MetaEd's Deploy command copies artifacts into the ODS/API source tree for its build process.
- **Ed-Fi API** - successor to the ODS/API, which also consumes MetaEd-generated artifacts, particularly the API metadata.
- **Ed-Fi Data Standard (Model packages)** — versioned npm packages (e.g., `@edfi/ed-fi-model-4.0`) containing the core `.metaed` files. Extensions reference these as dependencies.
- **Visual Studio Code** — host environment for the MetaEd IDE extension.
- **Node.js** — runtime environment for the MetaEd generator and all packages.
- **Ed-Fi npm Registry** — Azure DevOps-hosted npm feed for distributing MetaEd packages.
- **ANTLR 4.6** — parser generator framework used for the MetaEd grammar.

### 2.2 Deployment Boundaries

- MetaEd runs entirely on the developer's local machine (or CI agent). It does not communicate with external services at runtime.
- Generated artifacts are files on disk. MetaEd does not directly deploy to running servers or databases.
- The Deploy command writes to a local clone of the ODS/API source repositories.

## 3. Functional Requirements

### 3.1 VS Code Extension (MetaEd IDE)

- **FR-IDE-1**: The extension SHALL provide syntax highlighting for `.metaed` files.
- **FR-IDE-2**: The extension SHALL provide real-time semantic validation, reporting errors and warnings in the VS Code Problems panel.
- **FR-IDE-3**: Errors SHALL be displayed with red indicators on files/folders in the Explorer tree; warnings SHALL be displayed with gold indicators.
- **FR-IDE-4**: The extension SHALL provide a **Build** command (accessible from the editor toolbar) that compiles all `.metaed` files in the workspace into output artifacts.
- **FR-IDE-5**: The extension SHALL provide a **Deploy** command that copies build artifacts to the configured ODS/API source directory.
- **FR-IDE-6**: The extension SHALL expose workspace-level settings for:
  - Accepted License (boolean, required)
  - Target ODS/API Version (string)
  - ODS/API Deployment Directory (path)
  - Suppress Delete on Deploy (boolean)
  - Alliance Mode (boolean)
- **FR-IDE-7**: The extension SHALL require acceptance of the Ed-Fi License Agreement before Build or Deploy can execute.
- **FR-IDE-8**: The extension SHALL support multi-folder workspaces, allowing users to open both the core data model and one or more extension projects simultaneously.
- **FR-IDE-9**: Build output SHALL be written to a `MetaEdOutput` directory in the last workspace folder.
- **FR-IDE-10**: The extension SHALL display a notification on build success or failure, with error details available in the output panel.

### 3.2 Build Command

- **FR-BUILD-1**: The Build command SHALL compile all `.metaed` files from configured project paths into output artifacts.
- **FR-BUILD-2**: The Build command SHALL accept configuration via a JSON config file (`-c` / `--config` flag) or VS Code workspace settings.
- **FR-BUILD-3**: The Build command SHALL require the `-a` / `--accept-license` flag (or equivalent workspace setting) to acknowledge the Ed-Fi License Agreement.
- **FR-BUILD-4**: The Build command SHALL support the `--defaultPluginTechVersion` flag to specify the target ODS/API version in semver format.
- **FR-BUILD-5**: The Build command SHALL support the `--suppressPrereleaseVersion` flag (default: true) to suppress prerelease identifiers in version output.
- **FR-BUILD-6**: The Build command SHALL exit with code `1` on failure, enabling CI pipelines to detect build errors.
- **FR-BUILD-7**: The Build command SHALL produce output in a configured output directory; details about the output files depend on the plugins used at build time.

### 3.3 Deploy Command

- **FR-DEPLOY-1**: The Deploy command SHALL copy built artifacts from the artifact directory into the correct locations within the ODS/API source tree.
- **FR-DEPLOY-2**: The Deploy command SHALL accept configuration via a JSON config file or command-line switches (`-s` source, `-t` target).
- **FR-DEPLOY-3**: The Deploy command SHALL require the `-a` / `--accept-license` flag.
- **FR-DEPLOY-4**: The Deploy command SHALL support the `--core` flag to deploy core artifacts in addition to extensions.
- **FR-DEPLOY-5**: The Deploy command SHALL support the `--suppressDelete` flag to prevent deletion of existing extension artifact directories before deploying.
- **FR-DEPLOY-6**: When the `--core` flag is specified (ODS/API version ≥ 7.0), the Deploy command SHALL copy core artifacts into the configured `deployDirectory` under `Ed-Fi-ODS/Application/EdFi.Ods.Standard/Standard/{dataStandardVersion}/Artifacts/`:
  - `ApiMetadata/` → `Metadata/`
  - `Database/SQLServer/ODS/Data/` → `MsSql/Data/Ods/`
  - `Database/SQLServer/ODS/Structure/` → `MsSql/Structure/Ods/`
  - `Database/PostgreSQL/ODS/Data/` → `PgSql/Data/Ods/`
  - `Database/PostgreSQL/ODS/Structure/` → `PgSql/Structure/Ods/`
  - `Interchange/` → `Schemas/`
  - `XSD/` → `Schemas/`
- **FR-DEPLOY-7**: The Deploy command SHALL copy extension artifacts into the configured `deployDirectory` under `Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Versions/{projectVersion}/Standard/{dataStandardVersion}/Artifacts/` using the same mapping as FR-DEPLOY-6.
- **FR-DEPLOY-8**: The `deployDirectory` SHALL point to the parent directory containing `Ed-Fi-ODS` and `Ed-Fi-ODS-Implementation` folders.
- **FR-DEPLOY-9**: Unless `--suppressDelete` is specified, the Deploy command SHALL remove existing extension artifact directories (`Ed-Fi-ODS-Implementation/Application/EdFi.Ods.Extensions.{projectName}/Artifacts`) before deploying new artifacts.

### 3.4 Configuration

- **FR-CFG-1**: The system SHALL support a JSON configuration file with the following top-level structure:
  - `metaEdConfiguration.artifactDirectory` — output directory for build artifacts
  - `metaEdConfiguration.deployDirectory` — target for deploy
  - `metaEdConfiguration.projects[]` — array of project definitions (projectName, namespaceName, projectExtension, projectVersion, description)
  - `metaEdConfiguration.projectPaths[]` — array of filesystem paths to `.metaed` source directories
  - `metaEdConfiguration.pluginConfigDirectories[]` — array of paths to plugin configuration files
  - `metaEdConfiguration.defaultPluginTechVersion` — target ODS/API version
  - `metaEdConfiguration.allianceMode` — enables editing of core model files
  - `metaEdConfiguration.suppressPrereleaseVersion` — suppresses prerelease version identifiers
- **FR-CFG-2**: The system MAY support artifact-specific configuration files (`{pluginShortName}.config.json`) placed in plugin configuration directories.
- **FR-CFG-3**: Artifact-specific configuration files SHALL support matching rules based on entity type, namespace, core/extensions flag, and entity name.
- **FR-CFG-4**: Artifact-specific configuration data SHALL be validated using Joi schemas registered by each plugin.
- **FR-CFG-5**: Configuration matching options (`namespace`, `core`, `extensions`) SHALL be mutually exclusive within a single match rule.

### 3.5 Build Outputs

#### 3.5.1 SQL Scripts

- **FR-SQL-1**: The Build SHALL generate SQL scripts compatible with both Microsoft SQL Server and PostgreSQL for creating an operational data store (ODS).
- **FR-SQL-2**: Generated SQL files SHALL include (but are not limited to):
  - `xxxx-Schemas.sql` — core database schema definitions
  - `xxxx-Tables.sql` — core database tables
  - `xxxx-IdColumnUniqueIndexes.sql` — indexing for API support on core tables
  - `xxxx-CreateTrackedChangeTables.sql`  — core tracked delete tables for Change Queries
  - `xxxx-CreateTriggersForDeleteTracking.sql` (MSSQL only) - triggers for tracked delete support
- **FR-SQL-3**: The Build SHALL generate separate SQL files for core and extension artifacts, with extension files prefixed by "EXTENSION" (e.g., `EXTENSION-xxxx-Tables.sql`).
- **FR-SQL-4**: Files prefixed with "EXTENSION" SHALL be additive to the standard ODS/API script set; files without "EXTENSION" SHALL replace the corresponding shipped files.

#### 3.5.2 XSD Files

- **FR-XSD-1**: The Build SHALL generate XSD files for defining the structure of bulk data exchange and bulk loading of Ed-Fi data.
- **FR-XSD-2**: Generated XSD files SHALL include:
  - `Ed-Fi-Core.xsd` — the core Ed-Fi XSD
  - `EXTENSION-Ed-Fi-Extended-Core.xsd` — the extension XSD
  - `SchemaAnnotation.xsd` — annotation definitions
  - `Interchange-*.xsd` — core interchange schemas
  - `EXTENSION-Interchange-*.xsd` — extension interchange schemas

#### 3.5.3 API Metadata

- **FR-API-1**: The Build SHALL generate API metadata files used by the ODS/API build process, including: `ApiModel{prefix}.json`
- **FR-API-2**: The Build SHALL generate API metadata files used by the Ed-Fi API v8+ build and runtime processes, including: `ApiSchema{prefix}.json`

#### 3.5.4 Data Handbook

- **FR-HBK-1**: The Build SHALL generate a comprehensive data handbook combining core and extension definitions.
- **FR-HBK-2**: The handbook SHALL be produced in an HTML format: `Ed-Fi-Data-Handbook-Index.html` — interactive, searchable HTML file (self-contained, can be hosted on a web server or run locally)
- **FR-HBK-3**: The handbook MAY be produced in an Excel format: `Ed-Fi-Handbook.xlsx`

#### 3.5.5 Data Dictionaries

- **FR-DICT-1**: The Build MAY generate data dictionaries documenting generated structures:
  - `SqlDataDictionary.xlsx` — documentation on core and extension database tables
  - `XmlDataDictionary.xlsx` — documentation on core and extension XSD elements

#### 3.5.6 API Catalog

- **FR-CAT-1**: The Build SHALL generate an API Catalog spreadsheet (`Ed-Fi-API-Catalog.xlsx`) describing the data model as it will be represented in the Open API specification.
- **FR-CAT-2**: The API Catalog SHALL contain a **Resources** worksheet with columns: Project, Version, Resource Name, Resource Description, Domains.
- **FR-CAT-3**: The API Catalog SHALL contain a **Properties** worksheet with columns: Project, Version, Resource Name, Property Name, Property Description, Data Type, Min Length, Max Length, Validation RegEx, Is Identity Key, Is Nullable, Is Required.
- **FR-CAT-4**: Properties belonging to embedded Common types or References SHALL be prefixed with a dot-separated path indicating their origin (e.g., `address.streetNumberName`).
- **FR-CAT-5**: The `id` property SHALL be omitted from the Properties worksheet.
- **FR-CAT-6**: The API Catalog output SHALL appear in an `Ed-Fi-API-Catalog` folder within the artifact directory.

### 3.6 Extension Project Structure

- **FR-EXT-1**: An extension project SHALL contain a `package.json` with a `metaEdProject` field specifying `projectName` and `projectVersion`.
- **FR-EXT-2**: The `projectName` SHALL start with an uppercase alphabetic character and contain at least two alphabetic characters.
- **FR-EXT-3**: The `projectVersion` SHALL follow SemVer 2.0.0 format.
- **FR-EXT-4**: Extension projects SHALL use the standard MetaEd directory structure:
  - `Association/`, `Choice/`, `Common/`, `Descriptor/`, `Domain/`, `DomainEntity/`, `Enumeration/`, `Interchange/`, `Shared/`

### 3.7 Continuous Integration Support

- **FR-CI-1**: MetaEd SHALL be operable directly through Node.js without requiring VS Code or a graphical environment.
- **FR-CI-2**: The `@edfi/metaed-console` package SHALL be installable from the Ed-Fi npm registry for use in CI pipelines.
- **FR-CI-3**: The `@edfi/metaed-odsapi-deploy` package SHALL be installable from the Ed-Fi npm registry for deploy in CI pipelines.
- **FR-CI-4**: Both packages SHALL support the same configuration file format used by the IDE.

## 4. Non-Functional Requirements

### Compatibility

- **NFR-COMPAT-1**: MetaEd SHALL run on Windows, macOS, and Linux (any platform supported by VS Code and Node.js).
- **NFR-COMPAT-2**: MetaEd SHALL support Node.js LTS versions current at the time of release.
- **NFR-COMPAT-3**: The MetaEd IDE extension SHALL be compatible with the current stable release of Visual Studio Code.
- **NFR-COMPAT-4**: Generated SQL scripts SHALL be compatible with both Microsoft SQL Server and PostgreSQL.
- **NFR-COMPAT-5**: MetaEd SHALL support multiple Ed-Fi Data Standard versions (configurable via `projectVersion` and `defaultPluginTechVersion`).

### Licensing

- **NFR-LIC-1**: Usage of the Ed-Fi Unifying Data Model SHALL require explicit acceptance of the Ed-Fi License Agreement.
- **NFR-LIC-2**: The system SHALL not execute Build or Deploy commands until the license is accepted.
- **NFR-LIC-3**: The IDE itself SHALL be freely available on the Visual Studio Marketplace under the Apache-2.0 license.

### Reliability

- **NFR-REL-1**: MetaEd runs continuously in the IDE environment. The system SHALL NOT crash or throw unhandled exceptions during normal operation; failures SHALL be reported as validation messages.
- **NFR-REL-2**: Build failures SHALL be reported with clear, actionable error messages and a non-zero exit code.

### Performance

- **NFR-PERF-1**: Real-time validation in the IDE SHOULD complete within 2 seconds of a file save for typical extension projects.
- **NFR-PERF-2**: Full build of a standard-sized project SHOULD complete within 60 seconds on typical developer hardware.

### Security

- **NFR-SEC-1**: MetaEd SHALL NOT transmit data to external services during operation.
- **NFR-SEC-2**: MetaEd SHALL NOT store or require credentials for normal operation.

### Observability

- **NFR-OBS-1**: Build and deploy operations SHALL produce log output with sufficient detail to diagnose failures.
- **NFR-OBS-2**: The IDE SHALL display build progress notifications and final status.

### SDLC

- **NFR-SDLC-1**: The repository SHALL maintain automated CI checks including TypeScript type checking, ESLint, and unit tests on every pull request.
- **NFR-SDLC-2**: Test coverage SHALL include both unit tests and database integration tests (SQL Server and PostgreSQL).

## 5. System Architecture

### 5.1 Component Packages

| Package                                             | Description                                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `metaed-core`                                       | Core engine providing parsing, model, pipeline, validation, enhancement, and generation APIs.     |
| `metaed-console`                                    | CLI entry point for running the MetaEd build process from the command line.                       |
| `metaed-default-plugins`                            | Returns the default ordered set of MetaEd plugins used for a standard build.                      |
| `metaed-odsapi-deploy`                              | Provides deployment tasks for copying generated artifacts into an Ed-Fi ODS/API target directory. |
| `metaed-odsapi-deploy-console`                      | CLI entry point for running the ODS/API deployment workflow.                                      |
| `metaed-plugin-edfi-api-catalog`                    | Generates an Excel catalog of API resources and their properties from the MetaEd API schema.      |
| `metaed-plugin-edfi-api-schema`                     | Builds the enhanced Ed-Fi API schema model used by downstream plugins and generators.             |
| `metaed-plugin-edfi-handbook`                       | Generates the Ed-Fi Data Handbook outputs (HTML and Excel) from the MetaEd model.                 |
| `metaed-plugin-edfi-ods-changequery`                | Provides the common change-query model logic for Ed-Fi ODS/API change tracking.                   |
| `metaed-plugin-edfi-ods-changequery-postgresql`     | Generates PostgreSQL-specific change-query database artifacts.                                    |
| `metaed-plugin-edfi-ods-changequery-sqlserver`      | Generates SQL Server-specific change-query database artifacts.                                    |
| `metaed-plugin-edfi-ods-postgresql`                 | Generates Ed-Fi ODS database artifacts for PostgreSQL.                                            |
| `metaed-plugin-edfi-ods-recordownership`            | Generates the record-ownership database artifacts used by the ODS/API.                            |
| `metaed-plugin-edfi-ods-recordownership-postgresql` | Generates record-ownership database artifacts for PostgreSQL.                                     |
| `metaed-plugin-edfi-ods-recordownership-sqlserver`  | Generates record-ownership database artifacts for SQL Server.                                     |
| `metaed-plugin-edfi-ods-relational`                 | Provides the shared relational ODS generation logic used by database-specific plugins.            |
| `metaed-plugin-edfi-ods-sqlserver`                  | Generates Ed-Fi ODS database artifacts for SQL Server.                                            |
| `metaed-plugin-edfi-odsapi`                         | Generates the Ed-Fi ODS/API metadata artifacts and coordinates overall API build outputs.         |
| `metaed-plugin-edfi-sql-dictionary`                 | Generates the Ed-Fi SQL data dictionary output.                                                   |
| `metaed-plugin-edfi-unified`                        | Provides the shared unified model foundation (validators, enhancers) used by multiple plugins.    |
| `metaed-plugin-edfi-unified-advanced`               | Provides the advanced unified model layer for richer cross-plugin generation.                     |
| `metaed-plugin-edfi-xml-dictionary`                 | Generates the Ed-Fi XML data dictionary output.                                                   |
| `metaed-plugin-edfi-xsd`                            | Generates Ed-Fi XSD schema artifacts.                                                             |

### 5.2 Runtime and Deployment

- **Runtime**: Node.js (with TypeScript compiled to ES2017/CommonJS)
- **Package Management**: npm workspaces managed by Lerna
- **Grammar**: ANTLR 4.6 (JavaScript target)
- **Distribution**: npm packages published to the Ed-Fi Azure DevOps npm registry; VS Code extension published to the Visual Studio Marketplace

### 5.3 Processing Pipeline

The system follows a sequential pipeline: **Initialize → Load → Parse → Build → Validate → Enhance → Generate → Write**. The DSL and pipeline internals are documented separately and are out of scope for this PRD.

## 6. Out of Scope and Known Limitations

### Explicit Exclusions from the Document

- **The MetaEd DSL syntax and semantics** — documented in the MetaEd Language Specification.
- **Internal compilation pipeline details** — the Initialize → Load → Parse → Build → Validate → Enhance → Generate → Write pipeline is documented in developer-facing architecture docs, not in this product requirements document.
- **Internal package implementation details** — individual package internals are documented in developer-facing architecture docs.
- **ODS/API runtime behavior** — MetaEd generates artifacts for the ODS/API; it does not define ODS/API runtime requirements.
- **Data Standard content** — the actual entities, descriptors, and associations in any Data Standard version are authored in `.metaed` files and are not part of this product's requirements.

### Known Limitations of the Current Implementation

- MetaEd does not validate that the ODS/API deployment directory is correctly structured before deploying; it assumes the target follows the expected repository layout.
- The IDE's workspace file includes user-specific paths (e.g., to `node_modules` inside the extension directory) that are not portable across machines and should not be committed to version control.
- Alliance Mode enables editing of core files; non-Alliance users must leave this disabled to avoid inadvertent and costly errors.
- The Deploy command deletes existing extension artifact directories by default unless `--suppressDelete` is specified.

## 7. Glossary

| Term                 | Definition                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **MetaEd**           | Umbrella term for the DSL, the compiler, the IDE, and the supporting packages.                                    |
| **MetaEd DSL**       | The domain-specific language used to define Ed-Fi data models.                                                    |
| **MetaEd IDE**       | The Visual Studio Code extension providing authoring and build/deploy capabilities.                               |
| **MetaEd Generator** | The command-line application that compiles `.metaed` files into artifacts.                                        |
| **ODS**              | Operational Data Store — the database backing an Ed-Fi API.                                                       |
| **ODS/API**          | The Ed-Fi ODS / API platform is the legacy reference implementation of REST API based on the Ed-Fi Data Standard.                                                      |
| **Ed-Fi API**        | The successor to the ODS/API, which also consumes MetaEd-generated artifacts, particularly the API metadata.      |
| **Data Standard**    | The Ed-Fi Unifying Data Model, versioned and expressed in `.metaed` files.                                        |
| **Extension**        | A user-defined addition to the core Ed-Fi Data Standard.                                                          |
| **Alliance Mode**    | A configuration setting that makes core model files editable; intended only for the Ed-Fi Alliance internal team. |
| **Plugin**           | A MetaEd package that provides validators, enhancers, and/or generators for a specific output format.             |
| **Artifact**         | Any file generated by the MetaEd build process (SQL, XSD, JSON, HTML, Excel).                                     |
| **Deploy**           | The act of copying generated artifacts into the ODS/API source tree for its build process to consume.             |
| **Namespace**        | A scoping mechanism for MetaEd projects (e.g., `EdFi` for core, custom names for extensions).                     |
| **Tech Version**     | The target ODS/API version (e.g., `6.0.0`) that determines which plugin behaviors and output formats to use.      |
| **SemVer**           | Semantic Versioning 2.0.0 — the versioning scheme used for project versions.                                      |
