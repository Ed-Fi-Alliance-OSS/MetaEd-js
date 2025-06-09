# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi ODS Change Query PostgreSQL Overview

The `metaed-plugin-edfi-ods-changequery-postgresql` package is a PostgreSQL-specific implementation of Ed-Fi Change Query functionality. It provides concrete PostgreSQL models, triggers, and SQL generation for the abstract change tracking system defined in `metaed-plugin-edfi-ods-changequery`. This plugin demonstrates sophisticated PostgreSQL-specific optimizations for change tracking, including PL/pgSQL functions, efficient trigger patterns, and version-aware schema generation.

## PostgreSQL-Specific Change Query Implementation

### PostgreSQL Change Tracking Strategy

**Function-Based Trigger Architecture:**
```sql
-- PostgreSQL uses functions for trigger logic (more efficient than inline triggers)
CREATE OR REPLACE FUNCTION changes.updateChangeVersion()
    RETURNS trigger AS
$BODY$
BEGIN
    NEW.ChangeVersion := nextval('changes.ChangeVersionSequence');
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

-- Triggers call the shared function
CREATE TRIGGER UpdateChangeVersion BEFORE UPDATE ON edfi.Student
    FOR EACH ROW EXECUTE PROCEDURE changes.updateChangeVersion();
```

**PostgreSQL-Specific Features:**
- **PL/pgSQL Functions** - Reusable trigger logic with better performance
- **BEFORE UPDATE Triggers** - More efficient than AFTER UPDATE for version updates
- **Sequence-Based Versioning** - PostgreSQL SEQUENCE for monotonic change versions
- **Schema-Based Organization** - Separate schemas for tracking tables and functions

### Plugin Integration Architecture

**Strategy Pattern Implementation:**
```typescript
// PostgreSQL implements the strategy interface from base plugin
import { performAssociationChangeQueryEnhancement } from '@edfi/metaed-plugin-edfi-ods-changequery';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  return performAssociationChangeQueryEnhancement(
    metaEd,
    PLUGIN_NAME,
    TARGET_DATABASE_PLUGIN_NAME,
    // PostgreSQL-specific strategy implementations
    createDeleteTrackingTableModel,
    createDeleteTrackingTriggerModel,
    createIndirectUpdateCascadeTriggerModel
  );
}
```

## PostgreSQL Model Creation Strategies

### Delete Tracking Table Model

**PostgreSQL-Specific Table Definition:**
```typescript
// enhancer/DeleteTrackingTableCreator.ts
export function createDeleteTrackingTableModel(
  metaEd: MetaEdEnvironment,
  sourceTable: Table
): DeleteTrackingTable {
  
  const { targetTechnologyVersion } = getPluginEnvironment(metaEd);
  const postgresqlTable = sourceTable.data.edfiOdsPostgresql;
  
  // Version-specific schema naming
  const trackingSchemaName = versionSatisfies(targetTechnologyVersion, '<6.0.0')
    ? 'tracked_deletes_edfi'
    : 'tracked_changes_edfi';
  
  return {
    schemaName: trackingSchemaName,
    tableName: `${postgresqlTable.tableName.toLowerCase()}deleted`,
    sourceTableName: postgresqlTable.tableName,
    keyColumns: sourceTable.primaryKeyColumns.map(col => ({
      columnName: col.data.edfiOdsPostgresql.columnName,
      dataType: mapToPostgreSQLType(col),
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
      dataType: 'UUID',
      isNullable: false,
      isPrimaryKey: false,
      defaultValue: 'gen_random_uuid()' // PostgreSQL UUID generation
    }
  };
}
```

### Delete Tracking Trigger Model

**PostgreSQL Trigger Strategy:**
```typescript
// enhancer/DeleteTrackingTriggerCreator.ts
export function createDeleteTrackingTriggerModel(
  metaEd: MetaEdEnvironment,
  sourceTable: Table
): DeleteTrackingTrigger {
  
  const postgresqlTable = sourceTable.data.edfiOdsPostgresql;
  const { targetTechnologyVersion } = getPluginEnvironment(metaEd);
  
  return {
    triggerName: postgresqlTriggerName(sourceTable, 'deleted').toLowerCase(),
    sourceSchemaName: postgresqlTable.schemaName.toLowerCase(),
    sourceTableName: postgresqlTable.tableName.toLowerCase(),
    targetSchemaName: getTrackingSchemaName(targetTechnologyVersion),
    targetTableName: `${postgresqlTable.tableName.toLowerCase()}deleted`,
    triggerEvent: 'AFTER DELETE',
    triggerFunction: getTrackingFunctionName(targetTechnologyVersion),
    keyColumnMappings: sourceTable.primaryKeyColumns.map(col => ({
      sourceColumnName: col.data.edfiOdsPostgresql.columnName,
      targetColumnName: col.data.edfiOdsPostgresql.columnName,
      dataType: mapToPostgreSQLType(col)
    }))
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
  
  const childPostgresql = childTable.data.edfiOdsPostgresql;
  const parentPostgresql = parentTable.data.edfiOdsPostgresql;
  
  return {
    triggerName: `${childPostgresql.tableName.toLowerCase()}_updateparent`,
    childSchemaName: childPostgresql.schemaName.toLowerCase(),
    childTableName: childPostgresql.tableName.toLowerCase(),
    parentSchemaName: parentPostgresql.schemaName.toLowerCase(),
    parentTableName: parentPostgresql.tableName.toLowerCase(),
    parentKeyColumns: findParentKeyColumns(childTable, parentTable),
    triggerEvents: ['INSERT', 'UPDATE', 'DELETE'],
    cascadeAction: 'UPDATE_LAST_MODIFIED_DATE',
    triggerFunction: 'changes.updateparentlastmodifieddate'
  };
}
```

## Version-Aware PostgreSQL Generation

### Multi-Version Schema Support

**ODS Version 5.x Schema:**
```sql
-- Pre-v6.0 schema structure
CREATE SCHEMA IF NOT EXISTS tracked_deletes_edfi AUTHORIZATION postgres;

CREATE TABLE tracked_deletes_edfi.studentdeleted (
    Id UUID NOT NULL DEFAULT gen_random_uuid(),
    StudentUSI INTEGER NOT NULL,
    ChangeVersion BIGINT NOT NULL,
    CONSTRAINT PK_studentdeleted PRIMARY KEY (Id)
);
```

**ODS Version 6.0+ Schema:**
```sql
-- v6.0+ schema structure
CREATE SCHEMA IF NOT EXISTS tracked_changes_edfi AUTHORIZATION postgres;

CREATE TABLE tracked_changes_edfi.studentdeleted (
    Id UUID NOT NULL DEFAULT gen_random_uuid(),
    StudentUSI INTEGER NOT NULL,
    ChangeVersion BIGINT NOT NULL,
    CONSTRAINT PK_studentdeleted PRIMARY KEY (Id)
);
```

### PostgreSQL Function Generation

**Change Version Update Function:**
```typescript
// generator/CreateTriggerUpdateChangeVersionGenerator.ts
export function generate(metaEd: MetaEdEnvironment): GeneratedOutput[] {
  const { targetTechnologyVersion } = getPluginEnvironment(metaEd);
  
  const functionContext = {
    functionName: 'updateChangeVersion',
    schemaName: 'changes',
    sequenceName: 'ChangeVersionSequence',
    useBeforeTrigger: true // PostgreSQL optimization
  };
  
  const functionSQL = template('updateChangeVersionFunction')(functionContext);
  
  return [{
    filename: 'UpdateChangeVersionFunction.sql',
    content: functionSQL
  }];
}
```

**Delete Tracking Function Template:**
```handlebars
{{!-- templates/deleteTrackingFunction.hbs --}}
CREATE OR REPLACE FUNCTION {{schemaName}}.{{functionName}}()
    RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO {{trackingSchemaName}}.{{trackingTableName}} (
        {{#each keyColumns}}
        {{columnName}},
        {{/each}}
        ChangeVersion
    ) VALUES (
        {{#each keyColumns}}
        OLD.{{columnName}},
        {{/each}}
        nextval('{{sequenceName}}')
    );
    RETURN OLD;
END;
$BODY$ LANGUAGE plpgsql;
```

## PostgreSQL-Specific Optimizations

### Efficient Trigger Architecture

**Shared Function Pattern:**
```sql
-- Single shared function for all update change version triggers
CREATE OR REPLACE FUNCTION changes.updateChangeVersion()
    RETURNS trigger AS
$BODY$
BEGIN
    -- Only update if ChangeVersion is not already being set
    IF NEW.ChangeVersion = OLD.ChangeVersion THEN
        NEW.ChangeVersion := nextval('changes.ChangeVersionSequence');
    END IF;
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;

-- Multiple triggers reference same function (efficient)
CREATE TRIGGER UpdateChangeVersion BEFORE UPDATE ON edfi.Student
    FOR EACH ROW EXECUTE PROCEDURE changes.updateChangeVersion();

CREATE TRIGGER UpdateChangeVersion BEFORE UPDATE ON edfi.School  
    FOR EACH ROW EXECUTE PROCEDURE changes.updateChangeVersion();
```

**Conditional Change Version Updates:**
```sql
-- Prevent unnecessary sequence calls
CREATE OR REPLACE FUNCTION changes.updateChangeVersionConditional()
    RETURNS trigger AS
$BODY$
BEGIN
    -- Only increment if data actually changed (excluding ChangeVersion itself)
    IF ROW(OLD.*) IS DISTINCT FROM ROW(NEW.*) AND 
       OLD.ChangeVersion = NEW.ChangeVersion THEN
        NEW.ChangeVersion := nextval('changes.ChangeVersionSequence');
    END IF;
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;
```

### PostgreSQL Performance Features

**Index Strategy for Change Queries:**
```typescript
// generator/CreateChangeQueryIndexesGenerator.ts
export function generateChangeQueryIndexes(
  metaEd: MetaEdEnvironment
): GeneratedOutput[] {
  
  const indexes = metaEd.namespace.values.flatMap(namespace => {
    return namespace.data.edfiOdsPostgresql.tables
      .filter(table => hasChangeVersionColumn(table))
      .map(table => ({
        schemaName: table.schemaName,
        tableName: table.tableName,
        indexName: `IX_${table.tableName}_ChangeVersion`,
        columns: ['ChangeVersion'],
        indexType: 'BTREE',
        comment: 'Index for change query performance'
      }));
  });
  
  return generateIndexSQL(indexes);
}
```

**Partial Indexes for Active Records:**
```sql
-- PostgreSQL partial indexes for soft-deleted records
CREATE INDEX IX_Student_Active_ChangeVersion 
ON edfi.Student (ChangeVersion) 
WHERE DeletedAt IS NULL;
```

## Template-Based SQL Generation

### Handlebars Template System

**PostgreSQL DDL Templates:**
```typescript
// generator/templates structure
templates/
├── deleteTrackingTable.hbs          // CREATE TABLE for tracking deleted records
├── deleteTrackingTrigger.hbs         // CREATE TRIGGER for delete tracking
├── updateChangeVersionFunction.hbs   // PL/pgSQL function for change versions
├── indirectUpdateTrigger.hbs         // Cascade triggers for parent updates
├── createChangesSchema.hbs           // Changes schema setup
└── createTrackingSchema.hbs          // Tracking schema setup
```

**Delete Tracking Table Template:**
```handlebars
{{!-- templates/deleteTrackingTable.hbs --}}
CREATE TABLE {{schemaName}}.{{tableName}} (
    Id UUID NOT NULL DEFAULT gen_random_uuid(),
{{#each keyColumns}}
    {{columnName}} {{dataType}} NOT NULL,
{{/each}}
    ChangeVersion BIGINT NOT NULL,
    CONSTRAINT PK_{{tableName}} PRIMARY KEY (Id)
);

-- Index for efficient change query lookups
CREATE INDEX IX_{{tableName}}_ChangeVersion 
ON {{schemaName}}.{{tableName}} (ChangeVersion);

-- Comments for documentation
COMMENT ON TABLE {{schemaName}}.{{tableName}} IS 'Tracks deleted records from {{sourceTableName}}';
```

### Trigger Generation Strategy

**Delete Tracking Trigger Template:**
```handlebars
{{!-- templates/deleteTrackingTrigger.hbs --}}
CREATE OR REPLACE FUNCTION {{triggerFunction}}()
    RETURNS trigger AS
$BODY$
BEGIN
    INSERT INTO {{targetSchemaName}}.{{targetTableName}} (
        {{#each keyColumnMappings}}
        {{targetColumnName}},
        {{/each}}
        ChangeVersion
    ) VALUES (
        {{#each keyColumnMappings}}
        OLD.{{sourceColumnName}},
        {{/each}}
        nextval('changes.ChangeVersionSequence')
    );
    RETURN OLD;
END;
$BODY$ LANGUAGE plpgsql;

CREATE TRIGGER {{triggerName}} 
AFTER DELETE ON {{sourceSchemaName}}.{{sourceTableName}}
    FOR EACH ROW EXECUTE PROCEDURE {{triggerFunction}}();
```

## Integration Testing and Validation

### PostgreSQL-Specific Testing

**Database Integration Tests:**
```typescript
// test/integration/PostgreSQLChangeQueryIntegration.test.ts
describe('PostgreSQL Change Query Integration', () => {
  let connection: Client;
  
  beforeAll(async () => {
    connection = new Client(testConnectionConfig);
    await connection.connect();
  });
  
  it('should create change tracking infrastructure', async () => {
    // Generate and execute change query SQL
    const changeQuerySQL = await generateChangeQueryArtifacts(testMetaEd);
    
    for (const artifact of changeQuerySQL) {
      await connection.query(artifact.content);
    }
    
    // Verify schemas exist
    const schemas = await connection.query(`
      SELECT schema_name FROM information_schema.schemata 
      WHERE schema_name IN ('changes', 'tracked_changes_edfi')
    `);
    expect(schemas.rows).toHaveLength(2);
    
    // Verify functions exist
    const functions = await connection.query(`
      SELECT routine_name FROM information_schema.routines 
      WHERE routine_schema = 'changes' 
      AND routine_type = 'FUNCTION'
    `);
    expect(functions.rows.length).toBeGreaterThan(0);
  });
  
  it('should track deletes correctly', async () => {
    // Insert test record
    await connection.query(`
      INSERT INTO edfi.Student (StudentUSI, StudentUniqueId) 
      VALUES (1, 'TEST001')
    `);
    
    // Delete record (should trigger delete tracking)
    await connection.query(`
      DELETE FROM edfi.Student WHERE StudentUSI = 1
    `);
    
    // Verify delete was tracked
    const trackedDeletes = await connection.query(`
      SELECT * FROM tracked_changes_edfi.studentdeleted 
      WHERE StudentUSI = 1
    `);
    expect(trackedDeletes.rows).toHaveLength(1);
    expect(trackedDeletes.rows[0].ChangeVersion).toBeGreaterThan(0);
  });
});
```

### Authoritative Comparison Testing

**SQL Output Validation:**
```typescript
// test/integration/ChangeQueryAuthoritativeCompare.test.ts
describe('Change Query Authoritative Comparison', () => {
  it('should generate identical PostgreSQL change query SQL', async () => {
    const metaEd = await loadEdFiDataStandard('5.1');
    const generatedSQL = await generateChangeQuerySQL(metaEd);
    
    generatedSQL.forEach(generated => {
      const authoritative = loadAuthoritativeSQL(generated.filename);
      expect(normalizePostgreSQLSQL(generated.content))
        .toBe(normalizePostgreSQLSQL(authoritative));
    });
  });
});
```

## Development Patterns

### Adding PostgreSQL-Specific Features

1. **Extend Model Creators** - Add PostgreSQL-specific fields to model creation
2. **Update Templates** - Modify Handlebars templates for new SQL features
3. **Add Generator Support** - Create generators for new artifact types
4. **Version Gate Features** - Use version checks for ODS-specific functionality
5. **Add Integration Tests** - Test against real PostgreSQL instances

### PostgreSQL Best Practices

**Function Optimization:**
```sql
-- Use STABLE functions for better performance
CREATE OR REPLACE FUNCTION changes.updateChangeVersion()
    RETURNS trigger AS
$BODY$
BEGIN
    NEW.ChangeVersion := nextval('changes.ChangeVersionSequence');
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql STABLE;
```

**Error Handling:**
```sql
-- Robust error handling in triggers
CREATE OR REPLACE FUNCTION changes.safeUpdateChangeVersion()
    RETURNS trigger AS
$BODY$
BEGIN
    BEGIN
        NEW.ChangeVersion := nextval('changes.ChangeVersionSequence');
    EXCEPTION
        WHEN OTHERS THEN
            RAISE WARNING 'Failed to update ChangeVersion: %', SQLERRM;
            RETURN NEW; -- Continue without failing the transaction
    END;
    RETURN NEW;
END;
$BODY$ LANGUAGE plpgsql;
```

## Architecture Strengths

1. **PostgreSQL Optimization** - Leverages PostgreSQL-specific features for performance
2. **Function-Based Triggers** - Efficient reusable trigger logic
3. **Version Awareness** - Support for multiple ODS/API versions
4. **Template-Based Generation** - Maintainable SQL generation with Handlebars
5. **Comprehensive Testing** - Database integration testing with real PostgreSQL
6. **Schema Organization** - Clean separation of tracking and operational schemas
7. **Performance Indexing** - Strategic indexes for change query performance

## Areas for Enhancement

1. **Concurrent Change Handling** - Better handling of high-concurrency scenarios
2. **Partitioning Support** - Table partitioning for very large change tracking tables
3. **Compression** - PostgreSQL table compression for tracking tables
4. **Advanced Indexing** - Partial and expression indexes for complex queries
5. **Monitoring Integration** - Built-in monitoring of change query performance
6. **Batch Processing** - Optimized batch change tracking for bulk operations

This plugin demonstrates excellent PostgreSQL-specific implementation of change tracking, providing production-ready functionality while maintaining clean architectural patterns and comprehensive testing strategies.