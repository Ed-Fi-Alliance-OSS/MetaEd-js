# metaed-plugin-edfi-api-schema

MetaEd plugin that generates the DMS API schema JSON used by the Ed-Fi API.

## Input Configuration

Registers two optional configuration schemas:

- `educationOrganizationSecurableElements` — Configures security elements for
  education organizations
- `educationOrganizationIdentitySecurableElements` — Configures identity security
  elements for education organizations

## Output

Generates one JSON file per namespace, under a `{namespace}/` folder:

- `{namespace}/ApiSchema/ApiSchema.json` when `projectExtension` is empty (core), e.g. `EdFi/ApiSchema/ApiSchema.json`
- `{namespace}/ApiSchema/ApiSchema-{projectExtension}.json` otherwise (extensions)

## Business Logic

Builds the DMS API schema from MetaEd-enhanced namespace data through a series of
enhancers that derive resource schemas, document paths, and reference structures.
Serializes the result as pretty-printed JSON. Also exports many API-schema types, helpers,
and enhancers; downstream plugins (api-catalog, handbook) import only types and helpers.

- **Top-level content.** Output includes `apiSchemaVersion` and a project schema containing
  project identity, endpoint name, `compatibleDsRange`, resource schemas,
  resource-name mappings, case-insensitive endpoint-name mappings, abstract resources,
  education organization information, domains, extension-project flag, and core OpenAPI base
  documents where generated. The project schema includes `description` when the project metadata supplies it.
- **`compatibleDsRange`.** Set to the exact Data Standard version for extension projects (not a
  range) and `null` for the core project.
- **Resource schemas.** Each includes resource name; descriptor, school-year-enumeration,
  resource-extension, and subclass flags (with superclass information for subclasses);
  `allowIdentityUpdates`; generated JSON schema-for-insert data; identity JSON paths; document
  path mappings; equality constraints; type-coercion JSON paths; decimal validation
  information; securable elements; authorization pathways; array uniqueness constraints;
  OpenAPI fragments; query-field mappings where applicable; and optional relational naming
  metadata where generated.
  Extension-project resources can include `commonExtensionOverrides`. The field is absent on
  subclasses such as Sample's `studentArtProgramAssociations`.
- **School year enumeration.** The builder adds the hard-coded `schoolYearTypes` entry to
  `resourceSchemas` only for a non-extension project containing a school year enumeration
  named `SchoolYear`. The project-level `schoolYearEnumeration` field stays unpopulated.
- The full schema is documented in the Data Management Service repository's
  `docs/API-SCHEMA-DOCUMENTATION.md`.
