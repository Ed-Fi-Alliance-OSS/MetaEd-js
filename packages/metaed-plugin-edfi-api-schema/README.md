# metaed-plugin-edfi-api-schema

MetaEd plugin that generates the DMS API schema JSON used by the Ed-Fi API.

## Input Configuration

Registers two optional configuration schemas:

- `educationOrganizationSecurableElements` — Configures security elements for
  education organizations
- `educationOrganizationIdentitySecurableElements` — Configures identity security
  elements for education organizations

## Output

Generates one JSON file per namespace:

- `ApiSchema/ApiSchema.json` (for core)
- `ApiSchema/ApiSchema-{projectPrefix}.json` (for extensions)

## Business Logic

Builds the DMS API schema from MetaEd-enhanced namespace data through a series of
enhancers that derive resource schemas, document paths, and reference structures.
Serializes the result as pretty-printed JSON. Also exports many API-schema types and
enhancers consumed by downstream plugins (api-catalog, odsapi).
