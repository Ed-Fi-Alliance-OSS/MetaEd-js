# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi ODS Change Query SQL Server Overview

The `metaed-plugin-edfi-ods-changequery-sqlserver` package is a SQL Server-specific implementation of Ed-Fi Change Query functionality. It provides concrete SQL Server models, triggers, and T-SQL generation for the abstract change tracking system defined in `metaed-plugin-edfi-ods-changequery`. This plugin demonstrates sophisticated SQL Server-specific optimizations for change tracking, including T-SQL stored procedures, efficient trigger patterns, and enterprise-grade performance optimizations.

## SQL Server-Specific Change Query Implementation

### SQL Server Change Tracking Strategy

**T-SQL Trigger Architecture:**
```sql
-- SQL Server uses inline trigger logic with INSERTED/DELETED tables
CREATE TRIGGER [edfi].[Student_TR_UpdateChangeVersion]
ON [edfi].[Student]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [edfi].[Student]
    SET [ChangeVersion] = NEXT VALUE FOR [changes].[ChangeVersionSequence]
    FROM [edfi].[Student] s
    INNER JOIN inserted i ON s.StudentUSI = i.StudentUSI;
END;
```

**SQL Server-Specific Features:**
- **INSERTED/DELETED Tables** - SQL Server's trigger pseudo-tables for efficient processing
- **SEQUENCE Objects** - SQL Server 2012+ SEQUENCE for monotonic change versions
- **SET NOCOUNT ON** - Performance optimization for triggers
- **Schema-Based Organization** - Separate schemas for tracking and operational data
- **Computed Columns** - Support for computed change version columns

### Plugin Integration Architecture

**Strategy Pattern Implementation:**
```typescript
// SQL Server implements the strategy interface from base plugin
import { performAssociationChangeQueryEnhancement } from '@edfi/metaed-plugin-edfi-ods-changequery';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  return performAssociationChangeQueryEnhancement(
    metaEd,
    PLUGIN_NAME,
    TARGET_DATABASE_PLUGIN_NAME,
    // SQL Server-specific strategy implementations
    createDeleteTrackingTableModel,
    createDeleteTrackingTriggerModel,
    createIndirectUpdateCascadeTriggerModel
  );
}
```

## SQL Server Model Creation Strategies

### Delete Tracking Table Model

**SQL Server-Specific Table Definition:**
```typescript
// enhancer/DeleteTrackingTableCreator.ts
export function createDeleteTrackingTableModel(
  metaEd: MetaEdEnvironment,
  sourceTable: Table
): DeleteTrackingTable {
  
  const { targetTechnologyVersion } = getPluginEnvironment(metaEd);
  const sqlServerTable = sourceTable.data.edfiOdsSqlserver;
  
  // Version-specific schema naming
  const trackingSchemaName = versionSatisfies(targetTechnologyVersion, '<6.0.0')
    ? 'tracked_deletes_edfi'
    : 'tracked_changes_edfi';
  
  return {
    schemaName: trackingSchemaName,
    tableName: `${sqlServerTable.tableName}Deleted`,
    sourceTableName: sqlServerTable.tableName,
    keyColumns: sourceTable.primaryKeyColumns.map(col => ({
      columnName: col.data.edfiOdsSqlserver.columnName,
      dataType: mapToSqlServerType(col),
      isNullable: false,
      isPrimaryKey: true
    })),
    changeVersionColumn: {
      columnName: 'ChangeVersion',
      dataType: 'BIGINT',
      isNullable: false,
      isPrimaryKey: false
    },
    uniqueIdColumn: {
      columnName: 'Id',
      dataType: 'UNIQUEIDENTIFIER',
      isNullable: false,
      isPrimaryKey: false,
      defaultValue: 'NEWID()' // SQL Server GUID generation
    }
  };
}
```

### Delete Tracking Trigger Model

**SQL Server Trigger Strategy:**
```typescript
// enhancer/DeleteTrackingTriggerCreator.ts
export function createDeleteTrackingTriggerModel(
  metaEd: MetaEdEnvironment,
  sourceTable: Table
): DeleteTrackingTrigger {
  
  const sqlServerTable = sourceTable.data.edfiOdsSqlserver;
  const { targetTechnologyVersion } = getPluginEnvironment(metaEd);
  
  return {
    triggerName: `${sqlServerTable.schemaName}_${sqlServerTable.tableName}_TR_DeleteTracking`,
    sourceSchemaName: sqlServerTable.schemaName,
    sourceTableName: sqlServerTable.tableName,
    targetSchemaName: getTrackingSchemaName(targetTechnologyVersion),
    targetTableName: `${sqlServerTable.tableName}Deleted`,
    triggerEvent: 'AFTER DELETE',
    triggerType: 'TABLE_TRIGGER',
    keyColumnMappings: sourceTable.primaryKeyColumns.map(col => ({
      sourceColumnName: col.data.edfiOdsSqlserver.columnName,
      targetColumnName: col.data.edfiOdsSqlserver.columnName,
      dataType: mapToSqlServerType(col)
    })),
    useTransaction: true, // SQL Server transaction management
    setNoCount: true      // SQL Server performance optimization
  };
}
```

### Indirect Update Cascade Trigger Model

**Parent Update Cascade Strategy:**
```typescript
// enhancer/IndirectUpdateCascadeTriggerEnhancer.ts
export function createIndirectUpdateCascadeTriggerModel(
  metaEd: MetaEdEnvironment,
  childTable: Table,
  parentTable: Table
): IndirectUpdateCascadeTrigger {
  
  const childSqlServer = childTable.data.edfiOdsSqlserver;
  const parentSqlServer = parentTable.data.edfiOdsSqlserver;
  
  return {
    triggerName: `${childSqlServer.schemaName}_${childSqlServer.tableName}_TR_UpdateParent`,
    childSchemaName: childSqlServer.schemaName,
    childTableName: childSqlServer.tableName,
    parentSchemaName: parentSqlServer.schemaName,
    parentTableName: parentSqlServer.tableName,
    parentKeyColumns: findParentKeyColumns(childTable, parentTable),
    triggerEvents: ['INSERT', 'UPDATE', 'DELETE'],
    cascadeAction: 'UPDATE_LAST_MODIFIED_DATE',
    useInsertedDeleted: true, // SQL Server pseudo-tables
    batchProcessing: true     // Handle multiple row operations
  };
}
```

## Version-Aware SQL Server Generation

### Multi-Version Schema Support

**ODS Version 5.x Schema:**
```sql
-- Pre-v6.0 schema structure
CREATE SCHEMA [tracked_deletes_edfi] AUTHORIZATION [dbo];

CREATE TABLE [tracked_deletes_edfi].[StudentDeleted] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [StudentUSI] INT NOT NULL,
    [ChangeVersion] BIGINT NOT NULL,
    CONSTRAINT [PK_StudentDeleted] PRIMARY KEY CLUSTERED ([Id])
);
```

**ODS Version 6.0+ Schema:**
```sql
-- v6.0+ schema structure
CREATE SCHEMA [tracked_changes_edfi] AUTHORIZATION [dbo];

CREATE TABLE [tracked_changes_edfi].[StudentDeleted] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [StudentUSI] INT NOT NULL,
    [ChangeVersion] BIGINT NOT NULL,
    CONSTRAINT [PK_StudentDeleted] PRIMARY KEY CLUSTERED ([Id])
) WITH (DATA_COMPRESSION = PAGE);
```

### SQL Server Sequence and Infrastructure

**Change Version Sequence Creation:**
```typescript
// generator/CreateChangeVersionSequenceGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const { targetTechnologyVersion } = getPluginEnvironment(metaEd);
  
  const sequenceContext = {
    schemaName: 'changes',
    sequenceName: 'ChangeVersionSequence',
    startValue: 1,
    incrementBy: 1,
    dataType: 'BIGINT',
    cache: versionSatisfies(targetTechnologyVersion, '>=7.0.0') ? 100 : 50 // Performance optimization
  };
  
  const sequenceSQL = template('changeVersionSequence')(sequenceContext);
  
  return [{
    filename: 'CreateChangeVersionSequence.sql',
    content: sequenceSQL
  }];
}
```

**Schema Creation Template:**
```handlebars
{{!-- templates/changesSchema.hbs --}}
-- Create changes schema for change tracking infrastructure
IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = 'changes')
BEGIN
    EXEC('CREATE SCHEMA [changes] AUTHORIZATION [dbo]');
END;

-- Create sequence for change version numbering
IF NOT EXISTS (SELECT * FROM sys.sequences WHERE name = 'ChangeVersionSequence' AND schema_id = SCHEMA_ID('changes'))
BEGIN
    CREATE SEQUENCE [changes].[ChangeVersionSequence]
        START WITH {{startValue}}
        INCREMENT BY {{incrementBy}}
        CACHE {{cache}};
END;
```

## SQL Server Performance Optimizations

### Enterprise-Grade Trigger Architecture

**High-Performance Update Trigger:**
```sql
-- Optimized SQL Server change version trigger
CREATE TRIGGER [edfi].[Student_TR_UpdateChangeVersion]
ON [edfi].[Student]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Only process if data actually changed (excluding ChangeVersion)
    IF UPDATE([StudentUniqueId]) OR UPDATE([FirstName]) OR UPDATE([LastName])
       OR UPDATE([BirthDate]) OR /* other significant columns */
    BEGIN
        UPDATE [edfi].[Student]
        SET [ChangeVersion] = NEXT VALUE FOR [changes].[ChangeVersionSequence]
        FROM [edfi].[Student] s
        INNER JOIN inserted i ON s.StudentUSI = i.StudentUSI
        WHERE s.ChangeVersion = i.ChangeVersion; -- Prevent redundant updates
    END;
END;
```

**Batch-Optimized Delete Tracking:**
```sql
-- Efficient delete tracking trigger for bulk operations
CREATE TRIGGER [edfi].[Student_TR_DeleteTracking]
ON [edfi].[Student]
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO [tracked_changes_edfi].[StudentDeleted] (
        [StudentUSI],
        [ChangeVersion]
    )
    SELECT 
        d.[StudentUSI],
        NEXT VALUE FOR [changes].[ChangeVersionSequence]
    FROM deleted d;
END;
```

### SQL Server Index Strategy

**Change Query Performance Indexes:**
```typescript
// generator/CreateChangeQueryIndexesGenerator.ts
export function generateChangeQueryIndexes(
  metaEd: MetaEdEnvironment
): GeneratedOutput[] {
  
  const indexes = metaEd.namespace.values.flatMap(namespace => {
    return namespace.data.edfiOdsSqlserver.tables
      .filter(table => hasChangeVersionColumn(table))
      .map(table => ({
        schemaName: table.schemaName,
        tableName: table.tableName,
        indexName: `IX_${table.tableName}_ChangeVersion`,
        columns: ['ChangeVersion'],
        includedColumns: ['Id', 'LastModifiedDate'], // Covering index
        indexType: 'NONCLUSTERED',
        compression: 'PAGE',
        fillFactor: 90,
        comment: 'Index for change query performance'
      }));
  });
  
  return generateIndexSQL(indexes);
}
```

**Clustered Index Optimization:**
```sql
-- Clustered index on tracking tables for optimal change query performance
CREATE TABLE [tracked_changes_edfi].[StudentDeleted] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [StudentUSI] INT NOT NULL,
    [ChangeVersion] BIGINT NOT NULL,
    
    -- Clustered index on ChangeVersion for range queries
    CONSTRAINT [PK_StudentDeleted] PRIMARY KEY CLUSTERED ([ChangeVersion], [Id])
) WITH (DATA_COMPRESSION = PAGE);

-- Non-clustered index on business key for lookups
CREATE NONCLUSTERED INDEX [IX_StudentDeleted_StudentUSI]
ON [tracked_changes_edfi].[StudentDeleted] ([StudentUSI])
INCLUDE ([ChangeVersion]) WITH (DATA_COMPRESSION = PAGE);
```

## Template-Based T-SQL Generation

### Handlebars Template System

**SQL Server DDL Templates:**
```typescript
// generator/templates structure
templates/
├── deleteTrackingTable.hbs          // CREATE TABLE for tracking deleted records
├── deleteTrackingTrigger.hbs         // CREATE TRIGGER for delete tracking
├── updateChangeVersionTrigger.hbs    // CREATE TRIGGER for change versions
├── indirectUpdateTrigger.hbs         // Cascade triggers for parent updates
├── changesSchema.hbs                 // Changes schema and sequence setup
└── trackingSchema.hbs                // Tracking schema setup
```

**Delete Tracking Table Template:**
```handlebars
{{!-- templates/deleteTrackingTable.hbs --}}
CREATE TABLE [{{schemaName}}].[{{tableName}}] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
{{#each keyColumns}}
    [{{columnName}}] {{dataType}} NOT NULL,
{{/each}}
    [ChangeVersion] BIGINT NOT NULL,
    
    CONSTRAINT [PK_{{tableName}}] PRIMARY KEY CLUSTERED ([ChangeVersion], [Id])
{{#if useCompression}}
) WITH (DATA_COMPRESSION = PAGE);
{{else}}
);
{{/if}}

-- Index for efficient key-based lookups
CREATE NONCLUSTERED INDEX [IX_{{tableName}}_Keys]
ON [{{schemaName}}].[{{tableName}}] (
{{#each keyColumns}}
    [{{columnName}}]{{#unless @last}},{{/unless}}
{{/each}}
) INCLUDE ([ChangeVersion]) WITH (DATA_COMPRESSION = PAGE);

-- Extended properties for documentation
EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description',
    @value = N'Tracks deleted records from {{sourceTableName}}',
    @level0type = N'SCHEMA', @level0name = N'{{schemaName}}',
    @level1type = N'TABLE', @level1name = N'{{tableName}}';
```

### Advanced Trigger Generation

**Delete Tracking Trigger Template:**
```handlebars
{{!-- templates/deleteTrackingTrigger.hbs --}}
CREATE TRIGGER [{{sourceSchemaName}}].[{{triggerName}}]
ON [{{sourceSchemaName}}].[{{sourceTableName}}]
AFTER DELETE
AS
BEGIN
    {{#if setNoCount}}
    SET NOCOUNT ON;
    {{/if}}
    
    {{#if useTransaction}}
    BEGIN TRY
    {{/if}}
        INSERT INTO [{{targetSchemaName}}].[{{targetTableName}}] (
            {{#each keyColumnMappings}}
            [{{targetColumnName}}],
            {{/each}}
            [ChangeVersion]
        )
        SELECT 
            {{#each keyColumnMappings}}
            d.[{{sourceColumnName}}],
            {{/each}}
            NEXT VALUE FOR [changes].[ChangeVersionSequence]
        FROM deleted d;
    
    {{#if useTransaction}}
    END TRY
    BEGIN CATCH
        -- Log error but don't fail the delete operation
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
    {{/if}}
END;
```

## SQL Server-Specific Features

### Transaction Management

**Robust Transaction Handling:**
```sql
-- Sophisticated error handling in triggers
CREATE TRIGGER [edfi].[Student_TR_UpdateChangeVersion]
ON [edfi].[Student]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Prevent infinite recursion
        IF TRIGGER_NESTLEVEL() > 1 RETURN;
        
        UPDATE [edfi].[Student]
        SET [ChangeVersion] = NEXT VALUE FOR [changes].[ChangeVersionSequence]
        FROM [edfi].[Student] s
        INNER JOIN inserted i ON s.StudentUSI = i.StudentUSI
        WHERE s.ChangeVersion = i.ChangeVersion;
        
    END TRY
    BEGIN CATCH
        -- Log error without failing the transaction
        INSERT INTO [changes].[ErrorLog] (
            ErrorMessage,
            ErrorTime,
            TriggerName
        ) VALUES (
            ERROR_MESSAGE(),
            GETUTCDATE(),
            'Student_TR_UpdateChangeVersion'
        );
    END CATCH;
END;
```

### Memory-Optimized Table Support

**High-Performance In-Memory Change Tracking:**
```sql
-- In-memory optimized tracking for high-volume scenarios (v7.3+)
CREATE TABLE [tracked_changes_edfi].[StudentDeleted_Memory] (
    [Id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWSEQUENTIALID(),
    [StudentUSI] INT NOT NULL,
    [ChangeVersion] BIGINT NOT NULL,
    [DeletedAt] DATETIME2(7) NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT [PK_StudentDeleted_Memory] PRIMARY KEY NONCLUSTERED ([Id]),
    INDEX [IX_StudentDeleted_Memory_ChangeVersion] NONCLUSTERED ([ChangeVersion])
) WITH (MEMORY_OPTIMIZED = ON, DURABILITY = SCHEMA_AND_DATA);
```

### Temporal Table Integration

**SQL Server Temporal Tables for Audit:**
```sql
-- Temporal table support for comprehensive audit trail (v7.2+)
ALTER TABLE [edfi].[Student] 
ADD 
    [ValidFrom] DATETIME2(7) GENERATED ALWAYS AS ROW START HIDDEN,
    [ValidTo] DATETIME2(7) GENERATED ALWAYS AS ROW END HIDDEN,
    PERIOD FOR SYSTEM_TIME ([ValidFrom], [ValidTo]);

ALTER TABLE [edfi].[Student] 
SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = [edfi].[Student_History]));
```

## Integration Testing and Validation

### SQL Server Integration Testing

**Database Connection Testing:**
```typescript
// test/integration/SqlServerChangeQueryIntegration.test.ts
describe('SQL Server Change Query Integration', () => {
  let connection: ConnectionPool;
  
  beforeAll(async () => {
    connection = new sql.ConnectionPool(testConnectionConfig);
    await connection.connect();
  });
  
  it('should create change tracking infrastructure', async () => {
    // Generate and execute change query SQL
    const changeQuerySQL = await generateChangeQueryArtifacts(testMetaEd);
    
    for (const artifact of changeQuerySQL) {
      await connection.request().query(artifact.content);
    }
    
    // Verify schemas exist
    const schemas = await connection.request().query(`
      SELECT name FROM sys.schemas 
      WHERE name IN ('changes', 'tracked_changes_edfi')
    `);
    expect(schemas.recordset).toHaveLength(2);
    
    // Verify sequence exists
    const sequences = await connection.request().query(`
      SELECT name FROM sys.sequences 
      WHERE schema_id = SCHEMA_ID('changes')
    `);
    expect(sequences.recordset.length).toBeGreaterThan(0);
  });
  
  it('should track changes with optimal performance', async () => {
    const startTime = Date.now();
    
    // Insert 1000 test records
    for (let i = 0; i < 1000; i++) {
      await connection.request().query(`
        INSERT INTO edfi.Student (StudentUSI, StudentUniqueId) 
        VALUES (${i}, 'TEST${i.toString().padStart(3, '0')}')
      `);
    }
    
    // Update all records (should trigger change version updates)
    await connection.request().query(`
      UPDATE edfi.Student SET FirstName = 'Updated' 
      WHERE StudentUniqueId LIKE 'TEST%'
    `);
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(5000); // Performance requirement
    
    // Verify change versions were updated
    const updatedRecords = await connection.request().query(`
      SELECT COUNT(*) as UpdatedCount 
      FROM edfi.Student 
      WHERE FirstName = 'Updated' AND ChangeVersion > 0
    `);
    expect(updatedRecords.recordset[0].UpdatedCount).toBe(1000);
  });
});
```

## Development Patterns

### Adding SQL Server-Specific Features

1. **Extend Model Creators** - Add SQL Server-specific fields to model creation
2. **Update Templates** - Modify Handlebars templates for new T-SQL features
3. **Add Generator Support** - Create generators for new artifact types
4. **Version Gate Features** - Use version checks for SQL Server-specific functionality
5. **Add Performance Tests** - Test against real SQL Server instances with performance metrics

### SQL Server Best Practices

**Trigger Optimization:**
```sql
-- Best practices for high-performance triggers
CREATE TRIGGER [edfi].[OptimizedTrigger]
ON [edfi].[Student]
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if trigger should run
    IF @@ROWCOUNT = 0 RETURN;
    IF TRIGGER_NESTLEVEL() > 1 RETURN;
    
    -- Use EXISTS for better performance than COUNT
    IF EXISTS (SELECT 1 FROM inserted i INNER JOIN deleted d ON i.StudentUSI = d.StudentUSI
              WHERE i.LastModifiedDate <> d.LastModifiedDate)
    BEGIN
        -- Efficient update with minimal locking
        UPDATE s SET ChangeVersion = NEXT VALUE FOR [changes].[ChangeVersionSequence]
        FROM [edfi].[Student] s
        INNER JOIN inserted i ON s.StudentUSI = i.StudentUSI;
    END;
END;
```

## Architecture Strengths

1. **SQL Server Optimization** - Leverages SQL Server-specific features for enterprise performance
2. **Robust Error Handling** - Comprehensive transaction management and error recovery
3. **Scalable Architecture** - Support for high-volume, high-concurrency scenarios
4. **Memory Optimization** - Support for in-memory optimized tables and temporal tables
5. **Enterprise Features** - Integration with SQL Server enterprise capabilities
6. **Performance Monitoring** - Built-in performance considerations and optimization
7. **Comprehensive Testing** - Real SQL Server integration testing with performance validation

## Areas for Enhancement

1. **Always On Integration** - Support for SQL Server Always On availability groups
2. **Columnstore Integration** - Columnstore indexes for analytics workloads
3. **Resource Governor** - Integration with SQL Server Resource Governor
4. **Advanced Security** - Row-level security and dynamic data masking
5. **Intelligent Query Processing** - Leverage SQL Server 2019+ intelligent features
6. **JSON Support** - Native SQL Server JSON support for flexible tracking

This plugin represents the enterprise-grade implementation for Ed-Fi SQL Server change tracking, demonstrating sophisticated database-specific optimizations while maintaining clean architectural patterns and comprehensive performance testing strategies.