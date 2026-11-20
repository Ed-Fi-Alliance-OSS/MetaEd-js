# metaed-plugin-edfi-odsapi

MetaEd plugin that generates the Ed-Fi ODS/API domain model JSON.

## Input Configuration

No plugin-specific configuration. Operates on the enriched MetaEd model.

## Output

Generates one JSON file per namespace, under a `{namespace}/` folder:

- Core always writes `EdFi/ApiMetadata/ApiModel.json`, even when the configuration supplies a `projectExtension`.
- Extensions write `{namespace}/ApiMetadata/ApiModel-{projectExtension}.json`. The suffix defaults to `EXTENSION` when omitted or empty.

## Business Logic

Builds the Ed-Fi ODS/API domain model by running a large set of API-model enhancers
that derive resource definitions, associations, and metadata. Serializes the enriched
model to JSON for consumption by the ODS/API application. Also includes validators for
API-specific modeling rules.

- Warns when required choice properties appear in extensions.
- Rejects extension subclasses except EducationOrganization domain entity subclasses and
  GeneralStudentProgramAssociation association subclasses.
