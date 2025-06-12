# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi ODS SQL Server Overview

The `metaed-plugin-edfi-ods-sqlserver` package is a database-specific implementation plugin that transforms the abstract relational model from `metaed-plugin-edfi-ods-relational` into concrete SQL Server DDL scripts and database artifacts. It generates production-ready T-SQL scripts for creating Ed-Fi Operational Data Store (ODS) schemas, tables, indexes, and constraints optimized for Microsoft SQL Server. This plugin serves as the primary database implementation for most Ed-Fi deployments and demonstrates sophisticated SQL Server-specific optimizations.

## SQL Server-Specific Transformation Architecture

### Two-Phase Pipeline Design

**Phase 1: Enhancement (Abstract → SQL Server-Specific Model)**
```
Abstract Relational Model → SQL Server Naming → Type Mapping → Template Preparation → Enhanced SQL Server Model
```

**Phase 2: Generation (Enhanced Model → T-SQL Artifacts)**
```
Enhanced SQL Server Model → Handlebars Templates → Versioned T-SQL Scripts → Deployment-Ready Artifacts
```

### Plugin Dependency Chain

```
metaed-plugin-edfi-unified (foundation)
  ↓
metaed-plugin-edfi-ods-relational (abstract database model)
  ↓
metaed-plugin-edfi-ods-sqlserver (concrete SQL Server implementation)
```

**Critical Dependency:** This plugin operates exclusively on the enhanced model from `ods-relational`, consuming table definitions, column specifications, foreign key relationships, and index configurations.

## SQL Server-Specific Enhancement Pipeline

### Naming Convention Enhancers

**SQL Server Table Naming Strategy:**
```typescript
// SqlServerTableNamingEnhancer.ts
function applySqlServerTableNaming(table: Table): void {
  // Handle SQL Server's 128-character identifier limit (more generous than PostgreSQL)
  let tableName = buildTableName(table.entityName, table.namespace);
  
  if (tableName.length > 128) {
    // Truncate and append hash for uniqueness
    const hash = generateHash(tableName).substring(0, 8);
    tableName = `${tableName.substring(0, 119)}_${hash}`;
  }
  
  // Apply SQL Server bracket escaping for reserved words
  table.data.edfiOdsSqlserver.tableName = escapeSqlServerIdentifier(tableName);
}
```

**SQL Server Column Naming Strategy:**
```typescript
// SqlServerColumnNamingEnhancer.ts
function applySqlServerColumnNaming(column: Column): void {
  // Apply component collapsing and SQL Server identifier rules
  const columnName = collapseComponentNames(column.nameComponents);
  
  // Ensure SQL Server keyword avoidance and bracket escaping
  column.data.edfiOdsSqlserver.columnName = escapeSqlServerIdentifier(columnName);
}
```

**Foreign Key Naming Strategy:**
```typescript
// SqlServerForeignKeyNamingEnhancer.ts
function applySqlServerForeignKeyNaming(foreignKey: ForeignKey): void {
  const parentTableHash = generateTableHash(foreignKey.parentTable);
  const foreignTableName = foreignKey.foreignTable.name;
  
  // Pattern: FK_<parent_hash>_<foreign_table>
  let fkName = `FK_${parentTableHash}_${foreignTableName}`;
  
  // Handle multiple FKs to same table with numeric suffix
  if (hasDuplicateForeignKey(foreignKey.parentTable, foreignTableName)) {
    fkName += `_${getNextForeignKeySequence(foreignKey.parentTable, foreignTableName)}`;
  }
  
  foreignKey.data.edfiOdsSqlserver.constraintName = fkName;
}
```

### SQL Server Data Type Mapping

**SQL Server Type Mapping Strategy:**
```typescript
// model/ColumnDataTypes.ts
const sqlServerTypeMapping = {
  'string': (column: Column) => `NVARCHAR(${column.maxLength || 255})`,
  'integer': () => 'INT',
  'bigint': () => 'BIGINT',
  'decimal': (column: Column) => `DECIMAL(${column.precision || 18}, ${column.scale || 2})`,
  'boolean': () => 'BIT',
  'date': () => 'DATE',
  'datetime': () => 'DATETIME2(7)', // High precision datetime
  'time': () => 'TIME(7)',
  'currency': (column: Column) => `MONEY`, // SQL Server native money type
  'percent': (column: Column) => `DECIMAL(${column.precision || 5}, ${column.scale || 4})`,
  'year': () => 'SMALLINT'
};

function mapToSqlServerType(column: AbstractColumn): string {
  const mapper = sqlServerTypeMapping[column.dataType];
  return mapper ? mapper(column) : 'NVARCHAR(MAX)'; // Fallback for unknown types
}
```

**SQL Server-Specific Type Optimizations:**
```typescript
// Enhanced type mapping with SQL Server optimizations
function optimizeSqlServerType(column: AbstractColumn): string {
  const baseType = mapToSqlServerType(column);
  
  // Use SQL Server compressed storage for large text
  if (column.dataType === 'string' && column.maxLength > 4000) {
    return 'NVARCHAR(MAX)';
  }
  
  // Use UNIQUEIDENTIFIER for GUIDs
  if (column.metaEdName.toLowerCase().includes('uniqueid')) {
    return 'UNIQUEIDENTIFIER';
  }
  
  // Use MONEY type for currency with appropriate precision
  if (column.dataType === 'currency') {
    return 'MONEY'; // Built-in SQL Server monetary type
  }
  
  return baseType;
}
```

## Template-Based T-SQL Generation System

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

### T-SQL Artifact Generation Strategy

**Core Schema Generation:**
```typescript
// generator/SchemaGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const outputs: GeneratedOutput[] = [];
  
  metaEd.namespace.values.forEach(namespace => {
    const schemaContext = {
      schemaName: namespace.namespaceName,
      owner: 'dbo', // SQL Server default schema owner
      tables: namespace.data.edfiOdsSqlserver.odsSchema.tables,
      authorization: 'AUTHORIZATION [dbo]'
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

**Table Generation with SQL Server Features:**
```typescript
// generator/OdsGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsSqlserver') as PluginEnvironment;
  
  return metaEd.namespace.values.flatMap(namespace => {
    const tables = namespace.data.edfiOdsSqlserver.odsSchema.tables;
    
    return tables.map(table => {
      const tableContext = {
        ...table,
        useClusteredPrimaryKey: true, // SQL Server clustered index optimization
        useCompression: versionSatisfies(targetTechnologyVersion, '>=7.0.0'),
        useColumnStore: versionSatisfies(targetTechnologyVersion, '>=7.2.0'),
        includeExtendedProperties: true // SQL Server metadata support
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

### SQL Server-Specific Generator Patterns

**Extended Properties for Metadata:**
```typescript
// generator/ExtendedPropertiesGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  return metaEd.namespace.values.map(namespace => {
    const extendedPropertiesContext = {
      tables: namespace.data.edfiOdsSqlserver.odsSchema.tables.map(table => ({
        tableName: table.tableName,
        schemaName: table.schemaName,
        description: table.documentation || 'Ed-Fi data model table',
        columns: table.columns.map(col => ({
          columnName: col.columnName,
          description: col.documentation || `${col.metaEdName} column`
        }))
      }))
    };
    
    const extendedPropertiesSQL = template('extendedProperties')(extendedPropertiesContext);
    return {
      filename: `${namespace.namespaceName}/0050-ExtendedProperties.sql`,
      content: extendedPropertiesSQL
    };
  });
}
```

**Clustered Index Strategy:**
```typescript
// SQL Server clustered primary key optimization
function generateClusteredPrimaryKey(table: Table): IndexDefinition {
  return {
    indexName: `PK_${table.tableName}`,
    tableName: table.tableName,
    columns: table.primaryKeyColumns,
    isUnique: true,
    isClustered: true, // SQL Server optimization for data locality
    fillFactor: 90,    // Leave room for page splits
    padIndex: true     // Consistent performance
  };
}
```

## SQL Server Performance Optimizations

### Advanced Indexing Strategy

**Clustered Index Optimization:**
```typescript
// generator/IdIndexesGenerator.ts
export function generatePerformanceIndexes(table: Table): Index[] {
  const indexes: Index[] = [];
  
  // Clustered primary key for optimal data access
  indexes.push({
    name: `PK_${table.tableName}`,
    columns: table.primaryKeyColumns,
    isUnique: true,
    isClustered: true,
    includedColumns: [], // SQL Server covering index optimization
    filterPredicate: null
  });
  
  // Non-clustered indexes on foreign keys
  table.foreignKeys.forEach(fk => {
    indexes.push({
      name: `IX_${table.tableName}_${fk.parentColumns.join('_')}`,
      columns: fk.parentColumns,
      isUnique: false,
      isClustered: false,
      includedColumns: ['Id'], // Include PK for covering index benefits
      filterPredicate: null
    });
  });
  
  // Filtered indexes for soft deletes (SQL Server-specific optimization)
  if (table.hasSoftDelete) {
    indexes.push({
      name: `IX_${table.tableName}_Active`,
      columns: ['Id'],
      isUnique: false,
      isClustered: false,
      includedColumns: [],
      filterPredicate: '[DeletedAt] IS NULL' // SQL Server filtered index
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
    columns: [column.columnName],
    includedColumns: ['Id', 'LastModifiedDate'], // Covering index for common queries
    indexType: 'NONCLUSTERED',
    compression: 'PAGE', // SQL Server compression for storage optimization
    comment: 'Performance index for Ed-Fi authorization queries'
  }));
  
  return generateIndexSQL(authIndexes);
}
```

### SQL Server-Specific Features

**UNIQUEIDENTIFIER Support:**
```typescript
// generator/AggregateIdColumnGenerator.ts (v7.3+)
function generateAggregateIdColumn(table: Table): ColumnDefinition {
  return {
    name: 'AggregateId',
    dataType: 'UNIQUEIDENTIFIER',
    defaultValue: 'NEWID()', // SQL Server-specific GUID generation
    isNullable: false,
    comment: 'Unique identifier for change tracking and auditing'
  };
}
```

**Temporal Table Support (v7.2+):**
```typescript
// SQL Server temporal table support for audit history
function generateTemporalTableFeatures(table: Table, version: string): TemporalFeatures | null {
  if (!versionSatisfies(version, '>=7.2.0')) {
    return null;
  }
  
  return {
    systemVersioning: true,
    historyTableName: `${table.tableName}_History`,
    validFromColumn: 'ValidFrom',
    validToColumn: 'ValidTo',
    historyRetention: 'INFINITE' // Configurable retention policy
  };
}
```

**Compression and Storage Optimization:**
```sql
-- templates/table.hbs
CREATE TABLE [{{schemaName}}].[{{tableName}}] (
{{#each columns}}
  [{{name}}] {{dataType}}{{#unless isNullable}} NOT NULL{{/unless}}{{#if defaultValue}} DEFAULT {{defaultValue}}{{/if}},
{{/each}}
{{#if supportAggregateIds}}
  [AggregateId] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
{{/if}}
  CONSTRAINT [PK_{{tableName}}] PRIMARY KEY CLUSTERED (
{{#each primaryKeyColumns}}
    [{{name}}]{{#unless @last}},{{/unless}}
{{/each}}
  ) WITH (PAD_INDEX = ON, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
{{#if useCompression}}
) WITH (DATA_COMPRESSION = PAGE)
{{else}}
)
{{/if}};

{{#if includeExtendedProperties}}
-- Add extended properties for documentation
EXEC sys.sp_addextendedproperty 
  @name = N'MS_Description',
  @value = N'{{description}}',
  @level0type = N'SCHEMA', @level0name = N'{{schemaName}}',
  @level1type = N'TABLE', @level1name = N'{{tableName}}';
{{/if}}
```

## Version-Aware Generation Patterns

### Multi-Version Support Strategy

**Version-Specific Feature Gates:**
```typescript
// Version-specific SQL Server feature support
function getSqlServerFeatures(targetVersion: string): SqlServerFeatures {
  return {
    clusteredIndexes: true, // Always supported
    extendedProperties: true, // Always supported
    compression: versionSatisfies(targetVersion, '>=7.0.0'),
    temporalTables: versionSatisfies(targetVersion, '>=7.2.0'),
    columnStore: versionSatisfies(targetVersion, '>=7.2.0'),
    aggregateIds: versionSatisfies(targetVersion, '>=7.3.0'),
    jsonSupport: versionSatisfies(targetVersion, '>=7.3.0'),
    inMemoryOLTP: versionSatisfies(targetVersion, '>=8.0.0') // Future version
  };
}
```

**Conditional Generator Execution:**
```typescript
// generator/AggregateIdColumnGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsSqlserver') as PluginEnvironment;
  
  // Only generate aggregate ID columns for ODS/API v7.3+
  if (!versionSatisfies(targetTechnologyVersion, '>=7.3.0')) {
    return [];
  }
  
  return generateAggregateIdColumns(metaEd);
}
```

### Alliance Mode and Configuration Support

**Alliance Mode Optimizations:**
```typescript
// Special handling for Ed-Fi Alliance deployments
function applyAllianceModeOptimizations(
  table: Table,
  isAllianceMode: boolean
): TableOptimizations {
  
  if (!isAllianceMode) {
    return getStandardOptimizations(table);
  }
  
  return {
    // Alliance-specific optimizations
    usePartitioning: table.isLargeTable,
    compressionLevel: 'PAGE',
    indexFillFactor: 85, // More aggressive for high-volume systems
    includeStatistics: true,
    autoUpdateStatistics: true
  };
}
```

## Comprehensive Testing Architecture

### Database Integration Testing

**SQL Server Connection Testing:**
```typescript
// test/database/DatabaseTestBase.ts
class DatabaseTestBase {
  protected async validateGeneratedSchema(sqlFiles: GeneratedOutput[]): Promise<void> {
    // Execute generated T-SQL against test SQL Server instance
    const connection = await sql.connect(testConnectionString);
    
    try {
      for (const sqlFile of sqlFiles) {
        await connection.request().query(sqlFile.content);
      }
      
      // Validate schema structure using SQL Server system views
      const tables = await connection.request().query(`
        SELECT 
          t.TABLE_SCHEMA,
          t.TABLE_NAME,
          c.COLUMN_NAME,
          c.DATA_TYPE,
          c.IS_NULLABLE
        FROM INFORMATION_SCHEMA.TABLES t
        JOIN INFORMATION_SCHEMA.COLUMNS c ON t.TABLE_NAME = c.TABLE_NAME
        WHERE t.TABLE_SCHEMA = 'edfi'
        ORDER BY t.TABLE_NAME, c.ORDINAL_POSITION
      `);
      
      expect(tables.recordset.length).toBeGreaterThan(0);
      
    } finally {
      await connection.close();
    }
  }
}
```

**Authoritative Comparison Testing:**
```typescript
// test/integration/OdsAuthoritativeCompare_v7_1.test.ts
describe('SQL Server ODS Generation v7.1', () => {
  it('should generate identical T-SQL to authoritative artifacts', async () => {
    // Load Ed-Fi data standard model
    const metaEd = await loadDataStandard('ed-fi-model-5.1');
    
    // Run complete plugin pipeline
    await runAllEnhancers(metaEd);
    const generatedSQL = await runAllGenerators(metaEd);
    
    // Compare against checked-in authoritative SQL files
    const authoritativeFiles = loadAuthoritativeArtifacts('v7_1');
    
    generatedSQL.forEach(generated => {
      const authoritative = authoritativeFiles[generated.filename];
      expect(normalizeSQL(generated.content)).toBe(normalizeSQL(authoritative));
    });
  });
});
```

### Performance Testing

**Large Schema Generation Testing:**
```typescript
// test/performance/LargeSchemaGeneration.test.ts
describe('SQL Server Large Schema Performance', () => {
  it('should generate schema for 500+ tables within acceptable time', async () => {
    const startTime = Date.now();
    
    const metaEd = await loadLargeDataModel();
    await runCompleteGeneration(metaEd);
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(30000); // 30 second limit
  });
});
```

## Development Patterns and Guidelines

### Adding SQL Server-Specific Features

1. **Enhance the Model** - Add SQL Server-specific data to `data.edfiOdsSqlserver`
2. **Create Enhancer** - Process abstract model into SQL Server-specific structures
3. **Update Templates** - Modify Handlebars templates for new T-SQL features
4. **Add Generator** - Create generator for new artifact types
5. **Version Gate** - Use `versionSatisfies` for version-specific features
6. **Add Tests** - Unit and integration tests including database validation

### Template Development Best Practices

**T-SQL Template Organization:**
```typescript
// Organize templates by SQL Server artifact type
templates/
├── table.hbs                    // Main table definitions with SQL Server optimizations
├── foreignKey.hbs               // Foreign key constraints with cascade options
├── idIndexes.hbs                // Clustered and non-clustered indexes
├── coreSchema.hbs               // Schema creation with authorization
├── extendedProperties.hbs       // SQL Server metadata and documentation
├── enumerationRow.hbs           // Enumeration data inserts
└── aggregateIdColumns.hbs       // v7.3+ aggregate identifier columns
```

**SQL Server Template Helpers:**
```typescript
// Register Handlebars helpers for T-SQL patterns
Handlebars.registerHelper('sqlServerType', (metaEdType: string, constraints: any) => {
  return mapToSqlServerType({ dataType: metaEdType, ...constraints });
});

Handlebars.registerHelper('bracketIdentifier', (identifier: string) => {
  return `[${identifier}]`; // SQL Server identifier bracketing
});

Handlebars.registerHelper('compressionClause', (useCompression: boolean) => {
  return useCompression ? 'WITH (DATA_COMPRESSION = PAGE)' : '';
});
```

## Architecture Strengths

1. **SQL Server Optimization** - Leverages SQL Server-specific features for optimal performance
2. **Template-Based Generation** - Maintainable and extensible T-SQL generation
3. **Version Awareness** - Robust support for multiple ODS/API versions with feature gating
4. **Performance Focus** - Clustered indexes, compression, and covering index strategies
5. **Comprehensive Testing** - Database integration testing with real SQL Server instances
6. **Alliance Mode Support** - Specialized optimizations for high-volume Ed-Fi deployments
7. **Rich Metadata** - Extended properties for comprehensive database documentation

## Areas for Enhancement

1. **Temporal Table Integration** - Full implementation of SQL Server temporal tables
2. **Columnstore Index Support** - Analytics-optimized columnstore indexes for reporting
3. **Memory-Optimized Tables** - In-memory OLTP for high-performance scenarios
4. **Partitioning Strategy** - Table partitioning for very large Ed-Fi deployments
5. **JSON Support** - Native SQL Server JSON support for flexible data scenarios
6. **Security Enhancements** - Row-level security and dynamic data masking features

This plugin represents the production-standard implementation for Ed-Fi SQL Server deployments, demonstrating sophisticated database-specific optimizations while maintaining clean architectural patterns and comprehensive testing strategies.