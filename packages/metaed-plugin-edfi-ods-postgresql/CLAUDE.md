# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi ODS PostgreSQL Overview

The `metaed-plugin-edfi-ods-postgresql` package is a database-specific implementation plugin that transforms the abstract relational model from `metaed-plugin-edfi-ods-relational` into concrete PostgreSQL DDL scripts and database artifacts. It generates production-ready SQL scripts for creating Ed-Fi Operational Data Store (ODS) schemas, tables, indexes, and constraints optimized for PostgreSQL. This plugin demonstrates sophisticated database-specific transformations while maintaining compatibility across multiple ODS/API versions.

## Database-Specific Transformation Architecture

### Two-Phase Pipeline Design

**Phase 1: Enhancement (Abstract → PostgreSQL-Specific Model)**
```
Abstract Relational Model → PostgreSQL Naming → Type Mapping → Template Preparation → Enhanced PostgreSQL Model
```

**Phase 2: Generation (Enhanced Model → SQL Artifacts)**
```
Enhanced PostgreSQL Model → Handlebars Templates → Versioned SQL Scripts → Deployment-Ready Artifacts
```

### Plugin Dependency Chain

```
metaed-plugin-edfi-unified (foundation)
  ↓
metaed-plugin-edfi-ods-relational (abstract database model)
  ↓
metaed-plugin-edfi-ods-postgresql (concrete PostgreSQL implementation)
```

**Critical Dependency:** This plugin operates exclusively on the enhanced model from `ods-relational`, consuming table definitions, column specifications, foreign key relationships, and index configurations.

## PostgreSQL-Specific Enhancement Pipeline

### Naming Convention Enhancers

**PostgreSQL Table Naming Strategy:**
```typescript
// PostgresqlTableNamingEnhancer.ts
function applyPostgreSQLTableNaming(table: Table): void {
  // Handle PostgreSQL's 63-character identifier limit
  let tableName = buildTableName(table.entityName, table.namespace);
  
  if (tableName.length > 63) {
    // Truncate and append hash for uniqueness
    const hash = generateHash(tableName).substring(0, 6);
    tableName = `${tableName.substring(0, 56)}_${hash}`;
  }
  
  table.data.edfiOdsPostgresql.tableName = tableName;
}
```

**PostgreSQL Column Naming Strategy:**
```typescript
// PostgresqlColumnNamingEnhancer.ts
function applyPostgreSQLColumnNaming(column: Column): void {
  // Apply component collapsing and PostgreSQL identifier rules
  const columnName = collapseComponentNames(column.nameComponents);
  
  // Ensure PostgreSQL keyword avoidance
  column.data.edfiOdsPostgresql.columnName = avoidPostgreSQLKeywords(columnName);
}
```

**Foreign Key Naming Strategy:**
```typescript
// PostgresqlForeignKeyNamingEnhancer.ts
function applyPostgreSQLForeignKeyNaming(foreignKey: ForeignKey): void {
  const parentTableHash = generateTableHash(foreignKey.parentTable);
  const foreignTableName = foreignKey.foreignTable.name;
  
  // Pattern: FK_<parent_hash>_<foreign_table>
  let fkName = `FK_${parentTableHash}_${foreignTableName}`;
  
  // Handle multiple FKs to same table with numeric suffix
  if (hasDuplicateForeignKey(foreignKey.parentTable, foreignTableName)) {
    fkName += `_${getNextForeignKeySequence(foreignKey.parentTable, foreignTableName)}`;
  }
  
  foreignKey.data.edfiOdsPostgresql.constraintName = fkName;
}
```

### Data Type Mapping and Conversion

**PostgreSQL Type Mapping Strategy:**
```typescript
// model/ColumnDataTypes.ts
const postgresqlTypeMapping = {
  'string': (column: Column) => `VARCHAR(${column.maxLength || 255})`,
  'integer': () => 'INTEGER',
  'bigint': () => 'BIGINT',
  'decimal': (column: Column) => `DECIMAL(${column.precision || 18}, ${column.scale || 2})`,
  'boolean': () => 'BOOLEAN',
  'date': () => 'DATE',
  'datetime': () => 'TIMESTAMP',
  'time': () => 'TIME',
  'currency': (column: Column) => `DECIMAL(${column.precision || 19}, ${column.scale || 4})`,
  'percent': (column: Column) => `DECIMAL(${column.precision || 5}, ${column.scale || 4})`
};

function mapToPostgreSQLType(column: AbstractColumn): string {
  const mapper = postgresqlTypeMapping[column.dataType];
  return mapper ? mapper(column) : 'TEXT'; // Fallback for unknown types
}
```

### Template Preparation Enhancement

**Version-Aware Template Context:**
```typescript
// TemplateSpecificTablePropertyEnhancer.ts (v7.0+)
function prepareTemplateContext(table: Table, version: string): TemplateContext {
  return {
    tableName: table.data.edfiOdsPostgresql.tableName,
    schemaName: table.schemaName,
    columns: table.columns.map(col => ({
      name: col.data.edfiOdsPostgresql.columnName,
      dataType: mapToPostgreSQLType(col),
      isNullable: col.isNullable,
      isPrimaryKey: col.isPrimaryKey
    })),
    foreignKeys: table.foreignKeys.map(fk => ({
      constraintName: fk.data.edfiOdsPostgresql.constraintName,
      parentColumns: fk.parentColumns,
      foreignColumns: fk.foreignColumns,
      referencedTable: fk.referencedTable.data.edfiOdsPostgresql.tableName
    })),
    // Version-specific features
    useUtcTimestamp: versionSatisfies(version, '>=7.2.0'),
    includeAggregateColumns: versionSatisfies(version, '>=7.3.0')
  };
}
```

## Template-Based SQL Generation System

### Handlebars Template Architecture

**Template Loading and Compilation:**
```typescript
// generator/OdsGeneratorBase.ts
class OdsGeneratorBase {
  private templateCache = new Map<string, HandlebarsTemplateDelegate>();
  
  protected template(templateName: string): HandlebarsTemplateDelegate {
    if (!this.templateCache.has(templateName)) {
      const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);
      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = Handlebars.compile(templateSource);
      this.templateCache.set(templateName, compiledTemplate);
    }
    
    return this.templateCache.get(templateName)!;
  }
}
```

### SQL Artifact Generation Strategy

**Core Schema Generation:**
```typescript
// generator/SchemaGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const outputs: GeneratedOutput[] = [];
  
  metaEd.namespace.values.forEach(namespace => {
    const schemaContext = {
      schemaName: namespace.namespaceName.toLowerCase(),
      owner: 'postgres', // Configurable in production
      tables: namespace.data.edfiOdsPostgresql.odsSchema.tables
    };
    
    const coreSchemaSQL = template('coreSchema')(schemaContext);
    outputs.push({
      filename: `${namespace.namespaceName}/0010-Schema.sql`,
      content: coreSchemaSQL
    });
  });
  
  return outputs;
}
```

**Table Generation with Version Awareness:**
```typescript
// generator/OdsGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsPostgresql') as PluginEnvironment;
  
  return metaEd.namespace.values.flatMap(namespace => {
    const tables = namespace.data.edfiOdsPostgresql.odsSchema.tables;
    
    return tables.map(table => {
      const tableContext = {
        ...table,
        useUtcOnDefaultTimestamp: versionSatisfies(targetTechnologyVersion, '>=7.2.0'),
        includeExtendedProperties: versionSatisfies(targetTechnologyVersion, '>=5.0.0'),
        supportAggregateIds: versionSatisfies(targetTechnologyVersion, '>=7.3.0')
      };
      
      const tableSQL = template('table')(tableContext);
      return {
        filename: `${namespace.namespaceName}/0020-Tables.sql`,
        content: tableSQL
      };
    });
  });
}
```

### Specialized Generator Patterns

**Foreign Key Generation:**
```typescript
// Foreign keys generated after tables to avoid dependency issues
export function generateForeignKeys(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  return metaEd.namespace.values.map(namespace => {
    const foreignKeyContext = {
      foreignKeys: namespace.data.edfiOdsPostgresql.odsSchema.foreignKeys,
      cascadeDeletes: true, // PostgreSQL supports cascade deletes
      cascadeUpdates: true  // PostgreSQL supports cascade updates
    };
    
    const foreignKeySQL = template('foreignKey')(foreignKeyContext);
    return {
      filename: `${namespace.namespaceName}/0030-ForeignKeys.sql`,
      content: foreignKeySQL
    };
  });
}
```

**Index Generation for Performance:**
```typescript
// generator/IdIndexesGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  return metaEd.namespace.values.flatMap(namespace => {
    const indexContext = {
      indexes: namespace.data.edfiOdsPostgresql.odsSchema.indexes.map(index => ({
        indexName: `IX_${index.tableName}_${index.columns.join('_')}`,
        tableName: index.tableName,
        columns: index.columns,
        isUnique: index.isUnique,
        isClustered: false // PostgreSQL doesn't support clustered indexes like SQL Server
      }))
    };
    
    const indexSQL = template('idIndexes')(indexContext);
    return {
      filename: `${namespace.namespaceName}/0040-IdColumnUniqueIndexes.sql`,
      content: indexSQL
    };
  });
}
```

## Version-Aware Generation Patterns

### Multi-Version Support Strategy

**Version-Specific Enhancer Selection:**
```typescript
// EnhancerList.ts pattern
function getVersionSpecificEnhancers(targetVersion: string): Enhancer[] {
  const baseEnhancers = [
    postgresqlTableNamingEnhancer,
    postgresqlColumnNamingEnhancer,
    postgresqlForeignKeyNamingEnhancer
  ];
  
  if (versionSatisfies(targetVersion, '>=7.0.0')) {
    baseEnhancers.push(templateSpecificTablePropertyEnhancer);
  } else {
    baseEnhancers.push(templateSpecificTablePropertyEnhancerV6x);
  }
  
  baseEnhancers.push(addSchemaContainerEnhancer);
  return baseEnhancers;
}
```

**Conditional Generator Execution:**
```typescript
// generator/AggregateIdColumnGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsPostgresql') as PluginEnvironment;
  
  // Only generate aggregate ID columns for ODS/API v7.3+
  if (!versionSatisfies(targetTechnologyVersion, '>=7.3.0')) {
    return [];
  }
  
  return generateAggregateIdColumns(metaEd);
}
```

### Version-Specific Template Features

**Template Conditional Logic:**
```handlebars
{{!-- templates/table.hbs --}}
CREATE TABLE {{schemaName}}.{{tableName}} (
{{#each columns}}
  {{name}} {{dataType}}{{#unless isNullable}} NOT NULL{{/unless}}{{#if defaultValue}} DEFAULT {{defaultValue}}{{/if}},
{{/each}}
{{#if supportAggregateIds}}
  AggregateId UUID DEFAULT gen_random_uuid(),
{{/if}}
  CONSTRAINT PK_{{tableName}} PRIMARY KEY ({{#each primaryKeyColumns}}{{name}}{{#unless @last}}, {{/unless}}{{/each}})
);

{{#if useUtcOnDefaultTimestamp}}
-- Add UTC timestamp triggers for v7.2+
{{/if}}
```

## PostgreSQL-Specific Optimizations

### Database Performance Enhancements

**Index Strategy for PostgreSQL:**
```typescript
// PostgreSQL-optimized index creation
function generatePerformanceIndexes(table: Table): Index[] {
  const indexes: Index[] = [];
  
  // Foreign key indexes for join performance
  table.foreignKeys.forEach(fk => {
    indexes.push({
      name: `IX_${table.tableName}_${fk.parentColumns.join('_')}`,
      columns: fk.parentColumns,
      isUnique: false,
      indexType: 'BTREE' // PostgreSQL default, optimal for most queries
    });
  });
  
  // Partial indexes for soft deletes (PostgreSQL-specific optimization)
  if (table.hasSoftDelete) {
    indexes.push({
      name: `IX_${table.tableName}_Active`,
      columns: ['Id'],
      whereClause: 'DeletedAt IS NULL',
      indexType: 'BTREE'
    });
  }
  
  return indexes;
}
```

**Authorization Performance Indexes:**
```typescript
// generator/CreateEducationOrganizationAuthorizationIndexesGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  // Create specialized indexes for Ed-Fi authorization queries
  const authIndexes = findEducationOrganizationColumns(metaEd).map(column => ({
    indexName: `IX_${column.tableName}_EdOrgAuth`,
    tableName: column.tableName,
    columns: [`${column.columnName}`, 'Id'], // Composite index for authorization + primary key
    indexType: 'BTREE',
    comment: 'Performance index for Ed-Fi authorization queries'
  }));
  
  return generateIndexSQL(authIndexes);
}
```

### PostgreSQL-Specific Features

**UUID Support for Aggregate IDs:**
```typescript
// generator/AggregateIdColumnGenerator.ts (v7.3+)
function generateAggregateIdColumn(table: Table): ColumnDefinition {
  return {
    name: 'AggregateId',
    dataType: 'UUID',
    defaultValue: 'gen_random_uuid()', // PostgreSQL-specific UUID generation
    isNullable: false,
    comment: 'Unique identifier for change tracking and auditing'
  };
}
```

**Schema Ownership and Permissions:**
```sql
-- templates/coreSchema.hbs
CREATE SCHEMA IF NOT EXISTS {{schemaName}} AUTHORIZATION postgres;

-- Grant appropriate permissions
GRANT USAGE ON SCHEMA {{schemaName}} TO edfi_ods_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA {{schemaName}} TO edfi_ods_user;
```

## Testing Architecture and Validation

### Comprehensive Test Strategy

**Authoritative Comparison Testing:**
```typescript
// test/integration/OdsAuthoritativeCompare_v7_1.test.ts
describe('PostgreSQL ODS Generation v7.1', () => {
  it('should generate identical SQL to authoritative artifacts', async () => {
    // Load Ed-Fi data standard model
    const metaEd = await loadDataStandard('ed-fi-model-5.1');
    
    // Run complete plugin pipeline
    await runAllEnhancers(metaEd);
    const generatedSQL = await runAllGenerators(metaEd);
    
    // Compare against checked-in authoritative SQL files
    const authoritativeFiles = loadAuthoritativeArtifacts('v7_1');
    
    generatedSQL.forEach(generated => {
      const authoritative = authoritativeFiles[generated.filename];
      expect(generated.content).toBe(authoritative);
    });
  });
});
```

**Database Integration Testing:**
```typescript
// test/database/DatabaseTestBase.ts
class DatabaseTestBase {
  protected async validateGeneratedSchema(sqlFiles: GeneratedOutput[]): Promise<void> {
    // Execute generated SQL against test PostgreSQL instance
    const connection = await createTestConnection();
    
    for (const sqlFile of sqlFiles) {
      await connection.query(sqlFile.content);
    }
    
    // Validate schema structure
    const tables = await connection.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'edfi'
    `);
    
    expect(tables.rows.length).toBeGreaterThan(0);
  }
}
```

### Version-Specific Testing

**Multi-Version Validation:**
```typescript
// Separate test files for each supported ODS/API version
describe('ODS Generation v5.0', () => { /* ... */ });
describe('ODS Generation v7.1', () => { /* ... */ });
describe('ODS Generation v7.2', () => { /* ... */ });
describe('ODS Generation v7.3', () => { /* ... */ });
```

**Snapshot Testing for Consistency:**
```typescript
// Capture and validate complete SQL output
it('should generate consistent table definitions', () => {
  const tableSQL = generateTableSQL(testEntity);
  expect(tableSQL).toMatchSnapshot();
});
```

## Development Patterns and Guidelines

### Adding PostgreSQL-Specific Features

1. **Enhance the Model** - Add PostgreSQL-specific data to `data.edfiOdsPostgresql`
2. **Create Enhancer** - Process abstract model into PostgreSQL-specific structures
3. **Update Templates** - Modify Handlebars templates for new SQL features
4. **Add Generator** - Create generator for new artifact types
5. **Version Gate** - Use `versionSatisfies` for version-specific features
6. **Add Tests** - Unit and integration tests for new functionality

### Template Development Best Practices

**Template Organization:**
```typescript
// Organize templates by artifact type
templates/
├── table.hbs              // Main table definitions
├── foreignKey.hbs         // Foreign key constraints
├── idIndexes.hbs          // Performance indexes
├── coreSchema.hbs         // Schema creation
└── extendedProperties.hbs // Metadata and documentation
```

**Template Helper Functions:**
```typescript
// Register Handlebars helpers for common SQL patterns
Handlebars.registerHelper('postgresqlType', (metaEdType: string, constraints: any) => {
  return mapToPostgreSQLType({ dataType: metaEdType, ...constraints });
});

Handlebars.registerHelper('quotedIdentifier', (identifier: string) => {
  return `"${identifier}"`; // PostgreSQL identifier quoting
});
```

### Performance Optimization Guidelines

**SQL Generation Performance:**
- Cache compiled Handlebars templates for reuse
- Use streaming for large schema generation
- Minimize memory allocation during template rendering

**Database Performance:**
- Generate indexes after tables and foreign keys
- Use appropriate PostgreSQL data types for optimal storage
- Include comments and documentation in generated SQL

## Architecture Strengths

1. **Clean Separation** - Abstract model cleanly separated from PostgreSQL implementation
2. **Template-Based Generation** - Maintainable and extensible SQL generation
3. **Version Awareness** - Robust support for multiple ODS/API versions
4. **PostgreSQL Optimization** - Database-specific features and performance optimizations
5. **Comprehensive Testing** - Authoritative comparison and database integration testing
6. **Naming Strategy** - Handles PostgreSQL identifier limitations intelligently
7. **Type Safety** - Strong typing throughout enhancement and generation pipeline

## Areas for Enhancement

1. **Schema Ownership Configuration** - Make database user/role configurable
2. **Dependency Security** - Update Handlebars to address security vulnerabilities
3. **Code Deduplication** - Refactor shared logic between version-specific enhancers
4. **Performance Monitoring** - Add timing metrics for large schema generation
5. **Advanced PostgreSQL Features** - Support for partitioning, tablespaces, and advanced indexing
6. **Template Testing** - Unit tests for individual Handlebars templates

This plugin exemplifies excellent database-specific transformation architecture, successfully converting abstract data models into production-ready PostgreSQL implementations while maintaining version compatibility and performance optimization.