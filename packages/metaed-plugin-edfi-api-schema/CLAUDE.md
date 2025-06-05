# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi API Schema Overview

This plugin transforms MetaEd domain models into comprehensive API schemas and JSON specifications that drive the Ed-Fi Data
Management Service (DMS). It generates critical metadata including JSON schemas, OpenAPI specifications, path mappings,
validation rules, and security configurations.

## Package Structure

```
src/
├── generator/          # Core API schema generators
├── enhancer/           # multi-step processing pipeline
│   └── security/       # Security-related enhancers
├── model/              # Data models and type definitions
│   └── api-schema/     # API schema specific models
└── test/
    ├── enhancer/       # Unit tests for enhancers
    └── integration/    # Integration tests with sample projects
```

## Core Processing Pipeline

The plugin uses a **multi-step enhancer pipeline** that processes MetaEd models sequentially:

### Key Pipeline Phases

1. **Setup** - Initialize namespace and entity API schema data
2. **Reference Processing** - Handle entity references and relationships
3. **Property Mapping** - Map MetaEd properties to API properties
4. **Identity Processing** - Handle identity property flattening and JSON paths
5. **Schema Generation** - Generate JSON schemas for insert/update operations
6. **OpenAPI Generation** - Create OpenAPI specifications and components
7. **Security Processing** - Generate authorization pathways and security metadata
8. **Final Assembly** - Build complete API schema

### Critical Enhancers

- **`apiPropertyMappingEnhancer`** - Maps MetaEd properties to API representation
- **`propertyCollectingEnhancer`** - Collects flattened properties for API
- **`identityJsonPathsEnhancer`** - Maps identity properties to JSON paths
- **`jsonSchemaForInsertEnhancer`** - Generates JSON Schema Draft 2020-12 schemas
- **`openApiCoreSpecificationEnhancer`** - Assembles OpenAPI 3.0.0 specifications
- **`apiSchemaBuildingEnhancer`** - Final API schema assembly

## Core Data Models

### EntityApiSchemaData
Central structure containing:
```typescript
{
  apiMapping: ApiMapping;              // API shape metadata
  jsonSchemaForInsert: JsonSchema;     // JSON schema for insert operations
  openApiRequestBodyComponent: Object; // OpenAPI request body components
  collectedApiProperties: Property[]; // Flattened API properties
  allJsonPathsMapping: PathMapping;   // Complete path mappings
  identityJsonPaths: string[];        // Identity property paths
  securableElements: SecurityElement[]; // Security configuration
  authorizationPathways: Authorization[]; // Authorization metadata
}
```

### Output Schema Types
- **CoreProjectSchema** - Complete data standard projects with full OpenAPI specs
- **ExtensionProjectSchema** - Extension projects with fragment-based specs

## Key Algorithms

### Property Flattening
Recursively flattens nested entity references while preserving:
- Property chains and paths
- Role-based naming conventions
- Merge directive effects
- Identity property relationships

### Naming Collision Resolution
Handles property naming conflicts through:
- Superclass/subclass conflict detection
- Role-based prefixing
- "shortenTo" override application
- API naming consistency maintenance

### Path Mapping
Creates bidirectional mappings between:
- MetaEd property paths (dot-separated)
- JSON paths (JSONPath syntax)
- Database column paths
- Query parameter names

## Security and Authorization

### Security Elements Generated
- **Namespace-based** - Security based on data ownership
- **EducationOrganization-based** - Hierarchical organization security
- **Student-based** - Student data privacy protections
- **Contact-based** - Contact information security
- **Staff-based** - Staff data access controls

### Authorization Pathways
Defines how entities relate to securable elements and security inheritance patterns.

## Testing Patterns

### Unit Testing
```typescript
describe('when processing [scenario]', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  
  beforeAll(() => {
    // Build test MetaEd model
    const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      // ... build scenario
      .buildAsString();
      
    // Run required enhancers from dependencies
    runUnifiedEnhancers(metaEd);
    runRelationalEnhancers(metaEd);
    
    // Run API schema enhancers
    runApiSchemaEnhancers(metaEd);
  });
  
  it('should generate expected API schema', () => {
    const apiSchema = metaEd.namespace.get('EdFi').data.edfiApiSchema;
    expect(apiSchema.collectedApiProperties).toHaveLength(expectedCount);
    expect(apiSchema).toMatchSnapshot();
  });
});
```

### Integration Testing
- Full pipeline testing with sample MetaEd projects
- Authoritative comparison against known good outputs
- Multi-version data standard testing (DS 5.0, 5.1, 5.2)
- Extension project testing (TPDM, Sample, Homograph)

## Dependencies

### Required Plugins
- **metaed-plugin-edfi-unified** - Reference resolution and merge directives
- **metaed-plugin-edfi-ods-relational** - Database mapping information

### Plugin Processing Order
1. Unified plugin processes basic model
2. Relational plugin creates database mappings
3. **This plugin** creates API schemas and specifications

## Generated Artifacts

### Output Files
- **`ApiSchema.json`** - Complete API metadata for data standard projects
- **`ApiSchema-{extension}.json`** - Extension-specific API metadata

### Schema Content
- Resource schemas with JSON Schema definitions
- OpenAPI specifications for resources and descriptors
- Path mappings for all properties
- Security and authorization metadata
- Validation constraints and type coercion rules
- Query field mappings for search operations

## Development Notes

1. **Multi-Step Pipeline** - Enhancers must run in exact order defined in `enhancerList()`
2. **Property Flattening** - Complex algorithm for handling nested references
3. **Path Mappings** - Critical for ODS/API runtime property resolution
4. **Security Metadata** - Essential for authorization pathway evaluation
5. **JSON Schema Compliance** - Must generate valid JSON Schema Draft 2020-12

## Common Development Tasks

- **Adding Enhancer** - Insert in correct pipeline position, update `enhancerList()`
- **Property Mapping Changes** - Update flattening and path mapping algorithms
- **Security Rules** - Modify security enhancers for new authorization patterns
- **Schema Generation** - Update JSON schema generators for new property types
- **Testing** - Add integration tests for new scenarios with authoritative comparison