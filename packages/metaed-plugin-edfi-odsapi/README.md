# metaed-plugin-edfi-odsapi

MetaEd plugin that generates the Ed-Fi ODS/API domain model JSON.

## Input Configuration

No plugin-specific configuration. Operates on the enriched MetaEd model.

## Output

Generates one JSON file per namespace:

- `ApiMetadata/ApiModel.json` (for core)
- `ApiMetadata/ApiModel-{projectExtension}.json` (for extensions)

## Business Logic

Builds the Ed-Fi ODS/API domain model by running a large set of API-model enhancers
that derive resource definitions, associations, and metadata. Serializes the enriched
model to JSON for consumption by the ODS/API application. Also includes validators for
API-specific modeling rules.
