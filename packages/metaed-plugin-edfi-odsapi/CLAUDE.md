# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi ODS/API Overview

The `metaed-plugin-edfi-odsapi` package is a critical metadata generation plugin that bridges the abstract Ed-Fi data model and the running Ed-Fi ODS/API application. It transforms the enhanced relational model into concrete API configuration artifacts that the ODS/API uses to dynamically configure its endpoints, validation rules, and data access logic. This plugin serves as the final transformation layer, converting logical models into runtime application metadata.

## ODS/API Configuration Architecture

### Metadata-Driven API Design

**Core Principle:**
The Ed-Fi ODS/API is designed as a metadata-driven application, meaning it doesn't hardcode knowledge about specific entities or properties. Instead, it reads configuration files at startup to understand:

- What API resources exist and their properties
- How entities relate to each other (associations and cardinality)
- Which database tables and columns correspond to API resources
- What validation rules and constraints apply
- How to construct aggregates for transactional consistency

**Plugin Role in Deployment Pipeline:**
```
MetaEd DSL Files → MetaEd Core Pipeline → Enhanced Model → ODS/API Plugin → API Configuration → Running ODS/API
```

### Configuration Artifact Types

**Primary Artifact - ApiModel.json (v3.1.1+):**
```json
{
  "schemaDefinition": {
    "logicalName": "EdFi",
    "organizationCode": "edfi",
    "version": "5.1.0"
  },
  "entityDefinitions": [...],
  "associationDefinitions": [...], 
  "aggregateDefinitions": [...]
}
```

**Legacy XML Artifacts (Pre-v6.0):**
- `DomainMetadata.xml` - Aggregate and entity composition definitions
- `InterchangeOrderMetadata.xml` - XML interchange dependency ordering
- `EdOrgReferenceMetadata.xml` - Education organization type definitions

## Multi-Version Strategy Pattern Architecture

### Version-Aware Enhancement Pipeline

**Strategic Version Handling:**
The plugin employs the Strategy Pattern to handle different ODS/API versions without complex conditional logic:

```typescript
// Version-specific enhancer selection
const associationEnhancers = [
  versionSatisfies(targetVersion, '<3.3.0') 
    ? AssociationDefinitionEnhancerV3dot2
    : versionSatisfies(targetVersion, '<5.2.0')
    ? AssociationDefinitionEnhancerV5dot1  
    : AssociationDefinitionEnhancer
];
```

**Version-Specific Implementations:**
- **v3.2 Era** - Basic association definitions with simple cardinality
- **v5.1 Era** - Enhanced association metadata with extended properties
- **v5.2+ Era** - Modern association definitions with full relationship semantics

### Multi-Version Enhancement Examples

**Association Definition Evolution:**
```typescript
// AssociationDefinitionEnhancerV3dot2.ts (Legacy)
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  associations.forEach(association => {
    association.data.edfiOdsApi = {
      associationName: association.metaEdName,
      cardinality: deriveBasicCardinality(association),
      // Limited metadata for older API versions
    };
  });
}

// AssociationDefinitionEnhancer.ts (Modern)
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  associations.forEach(association => {
    association.data.edfiOdsApi = {
      associationName: association.metaEdName,
      cardinality: deriveExtendedCardinality(association),
      isNavigable: true,
      sourceEntity: association.sourceEntity,
      targetEntity: association.targetEntity,
      foreignKeyMapping: deriveForeignKeyMapping(association),
      // Rich metadata for modern API versions
    };
  });
}
```

## Comprehensive Enhancement Pipeline

### Enhancement Sequence Architecture

**Setup Phase:**
```typescript
// Initialize API-specific data structures
const setupEnhancers = [
  NamespaceSetupEnhancer,           // Initialize namespace.data.edfiOdsApi
  TopLevelEntitySetupEnhancer,      // Initialize entity.data.edfiOdsApi
  EntityPropertySetupEnhancer       // Initialize property.data.edfiOdsApi
];
```

**Core Enhancement Pipeline:**
```typescript
// 50+ enhancers in carefully orchestrated sequence
const coreEnhancers = [
  // Entity and Property Definition
  EntityDefinitionEnhancer,
  EntityIdentifierDefinitionEnhancer,
  EntityPropertyDefinitionEnhancer,
  
  // Association and Relationship Definition  
  AssociationDefinitionEnhancer,
  AssociationCardinalityEnhancer,
  AssociationNavigabilityEnhancer,
  
  // Aggregate and Composition Definition
  AggregateDefinitionEnhancer,
  AggregateEntityCompositionEnhancer,
  
  // Physical Database Mapping
  DatabaseTableMappingEnhancer,
  DatabaseColumnMappingEnhancer,
  PrimaryKeyDefinitionEnhancer,
  ForeignKeyDefinitionEnhancer,
  
  // Version-specific enhancers selected dynamically
  ...getVersionSpecificEnhancers(targetVersion)
];
```

### Entity Definition Enhancement

**API Entity Metadata Creation:**
```typescript
// enhancer/EntityDefinitionEnhancer.ts
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity').forEach(entity => {
    const apiDefinition = {
      entityName: entity.metaEdName,
      entityNamePlural: pluralize(entity.metaEdName),
      fullyQualifiedEntityName: `${entity.namespace.namespaceName}.${entity.metaEdName}`,
      
      // Physical database mapping
      tableName: {
        sqlServer: entity.data.edfiOdsSqlserver?.tableName,
        postgreSql: entity.data.edfiOdsPostgresql?.tableName
      },
      schemaName: {
        sqlServer: entity.data.edfiOdsSqlserver?.schemaName,
        postgreSql: entity.data.edfiOdsPostgresql?.schemaName  
      },
      
      // API-specific metadata
      isAbstract: entity.isAbstract,
      isLookup: entity.isLookup,
      hasDiscriminator: entity.hasDiscriminator,
      
      // Properties will be added by subsequent enhancers
      properties: [],
      identifiers: [],
      associations: []
    };
    
    entity.data.edfiOdsApi.entityDefinition = apiDefinition;
  });
}
```

### Association Definition Enhancement

**Relationship Metadata Creation:**
```typescript
// enhancer/AssociationDefinitionEnhancer.ts  
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'association').forEach(association => {
    const associationDefinition = {
      associationName: association.metaEdName,
      cardinality: deriveCardinality(association),
      isNavigable: true,
      
      // Source and target entity references
      sourceEntity: {
        entityName: association.sourceEntity.metaEdName,
        namespace: association.sourceEntity.namespace.namespaceName,
        role: association.sourceRole || association.sourceEntity.metaEdName
      },
      
      targetEntity: {
        entityName: association.targetEntity.metaEdName, 
        namespace: association.targetEntity.namespace.namespaceName,
        role: association.targetRole || association.targetEntity.metaEdName
      },
      
      // Foreign key mapping for database operations
      foreignKeyMapping: {
        sourceColumns: deriveForeignKeyColumns(association.sourceEntity),
        targetColumns: deriveForeignKeyColumns(association.targetEntity),
        constraintName: {
          sqlServer: association.data.edfiOdsSqlserver?.constraintName,
          postgreSql: association.data.edfiOdsPostgresql?.constraintName
        }
      }
    };
    
    association.data.edfiOdsApi.associationDefinition = associationDefinition;
  });
}
```

### Aggregate Definition Enhancement

**Transactional Boundary Definition:**
```typescript
// enhancer/AggregateDefinitionEnhancer.ts
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Aggregate roots are entities that define transactional boundaries
  const aggregateRoots = findAggregateRoots(metaEd);
  
  aggregateRoots.forEach(rootEntity => {
    const aggregateDefinition = {
      aggregateName: rootEntity.metaEdName,
      aggregateRootEntity: rootEntity.metaEdName,
      
      // Find all entities that belong to this aggregate
      memberEntities: findAggregateMembers(rootEntity),
      
      // Define the composition relationships
      aggregateComposition: buildCompositionTree(rootEntity),
      
      // Version-specific aggregate features
      supportsChangeQueries: versionSatisfies(targetVersion, '>=5.0.0'),
      supportsDeletes: !rootEntity.isLookup,
      supportsUpdates: !rootEntity.isImmutable
    };
    
    rootEntity.data.edfiOdsApi.aggregateDefinition = aggregateDefinition;
  });
}
```

## ApiModel.json Generation Strategy

### Comprehensive Model Serialization

**Main Generator Architecture:**
```typescript
// generator/ApiModelGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const apiModel = {
    schemaDefinition: generateSchemaDefinition(metaEd),
    entityDefinitions: generateEntityDefinitions(metaEd),
    associationDefinitions: generateAssociationDefinitions(metaEd),
    aggregateDefinitions: generateAggregateDefinitions(metaEd)
  };
  
  return [{
    filename: 'ApiModel.json',
    content: JSON.stringify(apiModel, null, 2)
  }];
}
```

**Schema Definition Generation:**
```typescript
function generateSchemaDefinition(metaEd: MetaEdEnvironment): SchemaDefinition {
  const coreNamespace = findCoreNamespace(metaEd);
  const extensionNamespaces = findExtensionNamespaces(metaEd);
  
  return {
    logicalName: coreNamespace.namespaceName,
    organizationCode: coreNamespace.namespaceName.toLowerCase(),
    version: metaEd.configuration.dataStandardVersion,
    
    // Extension schema information
    extensions: extensionNamespaces.map(ext => ({
      logicalName: ext.namespaceName,
      organizationCode: ext.organizationCode || ext.namespaceName.toLowerCase(),
      version: ext.version || '1.0.0'
    }))
  };
}
```

### Entity Definitions Serialization

**Complete Entity Metadata:**
```typescript
function generateEntityDefinitions(metaEd: MetaEdEnvironment): EntityDefinition[] {
  return getAllApiEntities(metaEd).map(entity => {
    const apiData = entity.data.edfiOdsApi;
    
    return {
      name: apiData.entityDefinition.entityName,
      pluralName: apiData.entityDefinition.entityNamePlural,
      fullyQualifiedName: apiData.entityDefinition.fullyQualifiedEntityName,
      
      // Physical database mapping
      tableName: apiData.entityDefinition.tableName,
      schemaName: apiData.entityDefinition.schemaName,
      
      // Entity characteristics
      isAbstract: apiData.entityDefinition.isAbstract,
      isLookup: apiData.entityDefinition.isLookup,
      
      // Properties and relationships
      properties: generatePropertyDefinitions(entity),
      identifiers: generateIdentifierDefinitions(entity),
      associations: generateEntityAssociationReferences(entity),
      
      // Inheritance information
      baseEntity: entity.baseEntity?.metaEdName,
      derivedEntities: entity.subclassedBy?.map(sub => sub.metaEdName) || []
    };
  });
}
```

## Legacy XML Generation Support

### Version-Conditional XML Artifacts

**Domain Metadata XML (Pre-v6.0):**
```typescript
// generator/DomainMetadataGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const { targetTechnologyVersion } = getPluginEnvironment(metaEd);
  
  // Only generate for older API versions
  if (versionSatisfies(targetTechnologyVersion, '>=6.0.0')) {
    return [];
  }
  
  const domainMetadata = generateDomainMetadataXML(metaEd);
  return [{
    filename: 'DomainMetadata.xml',
    content: domainMetadata
  }];
}
```

**Handlebars Template System:**
```handlebars
{{!-- templates/DomainMetadata.hbs --}}
<?xml version="1.0" encoding="utf-8"?>
<DomainModel>
  <AggregateDefinitions>
    {{#each aggregates}}
    <AggregateDefinition name="{{name}}">
      <RootEntity name="{{rootEntity}}" />
      {{#each memberEntities}}
      <MemberEntity name="{{name}}" />
      {{/each}}
    </AggregateDefinition>
    {{/each}}
  </AggregateDefinitions>
</DomainModel>
```

## Validation and Quality Assurance

### ODS/API-Specific Validation Rules

**Extension Constraints:**
```typescript
// validator/SubclassingAnythingInExtensionsIsUnsupported.ts
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  
  // ODS/API doesn't support subclassing in extension namespaces
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass').forEach(subclass => {
    if (subclass.namespace.isExtensionNamespace) {
      failures.push({
        validationFailureId: 'ODSAPI001',
        category: 'error',
        message: 'ODS/API does not support subclassing entities in extension namespaces',
        elementName: subclass.metaEdName,
        sourceFileLine: subclass.sourceMap?.sourceFileLine
      });
    }
  });
  
  return failures;
}
```

**API Resource Naming Validation:**
```typescript
// validator/ApiResourceNamingValidator.ts
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  const reservedNames = ['api', 'metadata', 'swagger', 'health'];
  
  getAllApiEntities(metaEd).forEach(entity => {
    const pluralName = entity.data.edfiOdsApi?.entityDefinition?.entityNamePlural;
    
    if (reservedNames.includes(pluralName?.toLowerCase())) {
      failures.push({
        validationFailureId: 'ODSAPI002', 
        category: 'error',
        message: `Entity plural name '${pluralName}' conflicts with reserved API endpoint`,
        elementName: entity.metaEdName,
        sourceFileLine: entity.sourceMap?.sourceFileLine
      });
    }
  });
  
  return failures;
}
```

## Integration with ODS/API Runtime

### Application Startup Integration

**Configuration Loading:**
```csharp
// How the ODS/API application consumes the generated artifacts
public void ConfigureServices(IServiceCollection services)
{
    // Load the generated API model
    var apiModel = ApiModelProvider.Load("ApiModel.json");
    
    // Configure the ORM with entity mappings
    services.AddDbContext<OdsContext>(options => {
        options.ConfigureFromApiModel(apiModel);
    });
    
    // Configure API controllers dynamically
    services.AddControllers(options => {
        options.AddApiModelControllers(apiModel);
    });
    
    // Configure validation rules
    services.AddValidation(options => {
        options.ConfigureFromApiModel(apiModel);
    });
}
```

### Dynamic API Endpoint Generation

**Runtime Endpoint Creation:**
The ODS/API uses the generated metadata to dynamically create REST endpoints:

```
GET    /data/v3/ed-fi/students           -> Read student collection
POST   /data/v3/ed-fi/students           -> Create student
GET    /data/v3/ed-fi/students/{id}      -> Read specific student
PUT    /data/v3/ed-fi/students/{id}      -> Update student
DELETE /data/v3/ed-fi/students/{id}      -> Delete student
```

Each endpoint's behavior is determined by the entity and association definitions in ApiModel.json.

## Development Patterns and Extension

### Adding New API Features

1. **Define Model Interface** - Add TypeScript interface in `src/model/`
2. **Create Enhancer** - Implement enhancement logic in `src/enhancer/`
3. **Add to Pipeline** - Insert enhancer in correct sequence in EnhancerList.ts
4. **Update Generator** - Modify generator to include new metadata
5. **Add Validation** - Create validators for new feature constraints
6. **Version Gate** - Use version checks for backward compatibility

### Version-Specific Development

**Adding Support for New API Version:**
```typescript
// Pattern for adding v8.0 support
function getVersionSpecificEnhancers(targetVersion: string): Enhancer[] {
  const enhancers: Enhancer[] = [];
  
  if (versionSatisfies(targetVersion, '>=8.0.0')) {
    enhancers.push(
      NewFeatureEnhancerV8,
      AdvancedAssociationEnhancerV8,
      ExtendedValidationEnhancerV8
    );
  } else if (versionSatisfies(targetVersion, '>=7.0.0')) {
    enhancers.push(
      NewFeatureEnhancerV7,
      AssociationEnhancerV7
    );
  }
  
  return enhancers;
}
```

## Testing and Quality Assurance

### Authoritative Comparison Testing

**ApiModel.json Validation:**
```typescript
// test/integration/ApiModelAuthoritativeCompare.test.ts
describe('API Model Generation', () => {
  it('should generate identical ApiModel.json for Ed-Fi 5.1', async () => {
    const metaEd = await loadEdFiDataStandard('5.1');
    const generatedApiModel = await generateApiModel(metaEd);
    
    const authoritativeApiModel = loadAuthoritativeApiModel('v5.1');
    
    expect(normalizeApiModel(generatedApiModel)).toEqual(
      normalizeApiModel(authoritativeApiModel)
    );
  });
});
```

### Integration Testing with ODS/API

**Runtime Configuration Testing:**
```typescript
// Validate that generated configuration works with actual ODS/API
describe('ODS/API Integration', () => {
  it('should successfully configure ODS/API with generated artifacts', async () => {
    const apiModel = generateApiModel(testMetaEd);
    
    // Test that the API can load and validate the configuration
    const configurationResult = await testOdsApiConfiguration(apiModel);
    expect(configurationResult.isValid).toBe(true);
    
    // Test that all expected endpoints are created
    const endpoints = await getGeneratedEndpoints(configurationResult);
    expect(endpoints.length).toBeGreaterThan(100); // Ed-Fi has 100+ resources
  });
});
```

## Architecture Strengths

1. **Metadata-Driven Design** - Enables dynamic API configuration without hardcoded entity knowledge
2. **Version Strategy Pattern** - Clean separation of version-specific logic
3. **Comprehensive Enhancement Pipeline** - Systematic transformation from logical to runtime model
4. **Quality Validation** - ODS/API-specific validation rules prevent deployment issues
5. **Legacy Support** - Backward compatibility with older API versions through conditional generation
6. **Integration Testing** - Authoritative comparison ensures consistent output
7. **Runtime Bridge** - Seamless integration between build-time generation and runtime consumption

## Areas for Enhancement

1. **Performance Optimization** - Caching and lazy loading for large models
2. **Advanced Validation** - Cross-entity validation rules and constraint checking
3. **Documentation Generation** - Automated API documentation from metadata
4. **Feature Flags** - Conditional API feature enablement through configuration
5. **Monitoring Integration** - Built-in telemetry and monitoring configuration
6. **Security Metadata** - Enhanced security and authorization metadata generation

This plugin represents the critical final transformation in the MetaEd pipeline, successfully bridging the gap between abstract data modeling and concrete API runtime configuration while maintaining sophisticated version management and quality assurance patterns.