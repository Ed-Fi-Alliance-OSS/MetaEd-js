# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi ODS Change Query Overview

The `metaed-plugin-edfi-ods-changequery` package is the foundational plugin for implementing Ed-Fi Change Query functionality - a critical feature that enables incremental data synchronization by tracking when data was last modified or deleted. This plugin provides the database-agnostic architecture, models, and orchestration logic for change tracking, while database-specific plugins provide concrete implementations. It demonstrates sophisticated template method and strategy patterns for multi-database support.

## Change Query Architecture and Purpose

### Ed-Fi Change Query Concept

**Change Query Functionality:**
Change queries allow Ed-Fi API clients to efficiently synchronize data by requesting only records that have changed since a specific point in time (represented by a `ChangeVersion` number). This enables:

- **Incremental Synchronization** - Clients only download changed data, not entire datasets
- **Distributed System Support** - Multiple systems can stay synchronized with minimal data transfer
- **Audit Trail Capability** - Track when data was modified or deleted
- **Performance Optimization** - Dramatically reduces API response times and network usage

### Two-Component Change Tracking Strategy

**1. Update Tracking via ChangeVersion Column:**
```sql
-- Every aggregate root table gets a ChangeVersion column
ALTER TABLE edfi.Student ADD ChangeVersion BIGINT NOT NULL DEFAULT 0;

-- Database sequence provides monotonic version numbers
CREATE SEQUENCE changes.ChangeVersionSequence START WITH 1;

-- Triggers update ChangeVersion on any row modification
CREATE TRIGGER UpdateChangeVersion ON edfi.Student
AFTER UPDATE AS
UPDATE edfi.Student 
SET ChangeVersion = NEXT VALUE FOR changes.ChangeVersionSequence
WHERE Id IN (SELECT Id FROM inserted);
```

**2. Delete Tracking via Tracking Tables:**
```sql
-- Separate tables track deleted record keys
CREATE TABLE tracked_deletes_edfi.StudentDeleted (
    Id UNIQUEIDENTIFIER NOT NULL,
    StudentUSI INT NOT NULL,
    ChangeVersion BIGINT NOT NULL,
    PRIMARY KEY (Id)
);

-- Triggers capture deleted keys before removal
CREATE TRIGGER DeletedTracker ON edfi.Student
AFTER DELETE AS
INSERT INTO tracked_deletes_edfi.StudentDeleted (Id, StudentUSI, ChangeVersion)
SELECT Id, StudentUSI, NEXT VALUE FOR changes.ChangeVersionSequence
FROM deleted;
```

## Template Method Architecture Pattern

### Core Orchestration Strategy

**Abstract Algorithm Definition:**
```typescript
// Base plugin defines the "what" - abstract algorithm
export function performAssociationChangeQueryEnhancement(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  targetDatabasePluginName: string,
  // Strategy functions provided by database-specific plugins
  createDeleteTrackingTableModel: ModelCreatorFunction,
  createDeleteTrackingTriggerModel: ModelCreatorFunction,
  createIndirectUpdateCascadeTriggerModel: ModelCreatorFunction
): EnhancerResult {
  
  // 1. Identify tables needing change tracking
  const trackingCandidates = findAssociationTables(metaEd);
  
  // 2. Create abstract models using provided strategy functions
  trackingCandidates.forEach(table => {
    const trackingTable = createDeleteTrackingTableModel(metaEd, table);
    const trackingTrigger = createDeleteTrackingTriggerModel(metaEd, table);
    const cascadeTrigger = createIndirectUpdateCascadeTriggerModel(metaEd, table);
    
    // Store models in plugin-specific namespace
    storeChangeQueryModels(metaEd, pluginName, {
      trackingTable,
      trackingTrigger,
      cascadeTrigger
    });
  });
  
  return { success: true };
}
```

**Database Plugin Integration:**
```typescript
// Database-specific plugins implement the "how"
// Example from postgresql plugin:
performAssociationChangeQueryEnhancement(
  metaEd,
  'edfiOdsChangeQueryPostgresql',
  'edfiOdsPostgresql',
  // PostgreSQL-specific model creators
  createPostgreSQLDeleteTrackingTableModel,
  createPostgreSQLDeleteTrackingTriggerModel,
  createPostgreSQLCascadeTriggerModel
);
```

### Strategy Pattern Implementation

**Model Creator Strategy Interface:**
```typescript
// Abstract interface for model creation strategies
interface ModelCreatorStrategy {
  createDeleteTrackingTableModel(
    metaEd: MetaEdEnvironment,
    sourceTable: Table
  ): DeleteTrackingTable;
  
  createDeleteTrackingTriggerModel(
    metaEd: MetaEdEnvironment,
    sourceTable: Table
  ): DeleteTrackingTrigger;
  
  createIndirectUpdateCascadeTriggerModel(
    metaEd: MetaEdEnvironment,
    sourceTable: Table
  ): IndirectUpdateCascadeTrigger;
}
```

**Database-Specific Strategy Implementation:**
Each database plugin provides concrete implementations adapted to their platform's capabilities and constraints.

## Change Query Model Abstractions

### Delete Tracking Table Model

**Abstract Delete Tracking Table:**
```typescript
// model/DeleteTrackingTable.ts
interface DeleteTrackingTable {
  schemaName: string;                    // Target schema for tracking table
  tableName: string;                     // Name of tracking table
  sourceTableName: string;               // Original table being tracked
  keyColumns: DeleteTrackingColumn[];    // Primary key columns from source
  changeVersionColumn: DeleteTrackingColumn; // Version tracking column
  uniqueIdColumn: DeleteTrackingColumn;  // Unique identifier for delete event
}

interface DeleteTrackingColumn {
  columnName: string;
  dataType: string;                      // Database-specific type
  isNullable: boolean;
  isPrimaryKey: boolean;
}
```

### Delete Tracking Trigger Model

**Abstract Trigger Definition:**
```typescript
// model/DeleteTrackingTrigger.ts
interface DeleteTrackingTrigger {
  triggerName: string;                   // Database-specific trigger name
  sourceSchemaName: string;              // Schema of table being tracked
  sourceTableName: string;               // Table being tracked
  targetSchemaName: string;              // Schema of tracking table
  targetTableName: string;               // Tracking table name
  triggerEvent: 'AFTER DELETE' | 'BEFORE DELETE';
  keyColumnMappings: TriggerColumnMapping[]; // How to map PK columns
}

interface TriggerColumnMapping {
  sourceColumnName: string;              // Column in original table
  targetColumnName: string;              // Column in tracking table
  dataType: string;                      // Database-specific type
}
```

### Indirect Update Cascade Model

**Cascade Trigger for Nested Collections:**
```typescript
// model/IndirectUpdateCascadeTrigger.ts
interface IndirectUpdateCascadeTrigger {
  triggerName: string;
  childTableName: string;                // Collection table (e.g., StudentAddress)
  parentTableName: string;               // Aggregate root (e.g., Student)
  parentKeyColumns: string[];            // Foreign key to parent
  triggerEvents: ('INSERT' | 'UPDATE' | 'DELETE')[]; // Events that affect parent
  cascadeAction: 'UPDATE_LAST_MODIFIED'; // Action to take on parent
}
```

## Version-Aware Change Tracking

### Multi-Version Schema Support

**ODS Version Detection:**
```typescript
function getChangeTrackingStrategy(targetVersion: string): ChangeTrackingStrategy {
  if (versionSatisfies(targetVersion, '<6.0.0')) {
    return {
      trackingSchemaName: 'tracked_deletes_edfi',
      trackingTableSuffix: 'Deleted',
      useLastModifiedDate: true,
      useChangeVersion: false
    };
  } else {
    return {
      trackingSchemaName: 'tracked_changes_edfi',
      trackingTableSuffix: 'Deleted', 
      useLastModifiedDate: false,
      useChangeVersion: true
    };
  }
}
```

**Version-Specific Model Creation:**
```typescript
// enhancer/DeleteTrackingTableCreator.ts
export function createDeleteTrackingTableModel(
  metaEd: MetaEdEnvironment,
  sourceTable: Table
): DeleteTrackingTable {
  
  const { targetTechnologyVersion } = getPluginEnvironment(metaEd);
  const strategy = getChangeTrackingStrategy(targetTechnologyVersion);
  
  if (versionSatisfies(targetTechnologyVersion, '<6.0.0')) {
    return createV5TrackingTableModel(sourceTable, strategy);
  } else {
    return createV6TrackingTableModel(sourceTable, strategy);
  }
}
```

## Enhancer Pipeline and Orchestration

### Change Query Enhancement Sequence

**1. Repository Setup:**
```typescript
// Initialize change query data structures on each namespace
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.values.forEach(namespace => {
    namespace.data[pluginName] = {
      deleteTrackingTables: [],
      deleteTrackingTriggers: [],
      indirectUpdateTriggers: [],
      changeVersionColumns: []
    };
  });
}
```

**2. Entity-Specific Enhancement:**
```typescript
// Specialized enhancers for different entity types
const enhancerSequence = [
  AssociationChangeQueryEnhancer,           // Handle association tables
  AssociationSubclassChangeQueryEnhancer,   // Handle association subclasses
  DomainEntityChangeQueryEnhancer,          // Handle domain entities
  DomainEntitySubclassChangeQueryEnhancer,  // Handle domain entity subclasses
  BaseDescriptorChangeQueryEnhancer,        // Handle descriptors
  EnumerationChangeQueryEnhancer,           // Handle enumerations
];
```

**3. Indirect Update Cascade Enhancement:**
```typescript
// IndirectUpdateCascadeTriggerEnhancer.ts
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // Find collection tables that don't have their own ChangeVersion
  const collectionTables = findCollectionTablesWithoutChangeVersion(metaEd);
  
  collectionTables.forEach(childTable => {
    const parentTable = findParentAggregateRoot(childTable);
    
    if (parentTable && hasChangeVersionColumn(parentTable)) {
      // Create trigger to update parent LastModifiedDate on child changes
      const cascadeTrigger = createIndirectUpdateCascadeTriggerModel(
        metaEd, 
        childTable, 
        parentTable
      );
      
      storeIndirectUpdateTrigger(metaEd, cascadeTrigger);
    }
  });
}
```

## Integration Patterns with Database Plugins

### Plugin Dependency Chain

**Orchestrated Plugin Execution:**
```
metaed-plugin-edfi-unified (foundation)
  ↓
metaed-plugin-edfi-ods-relational (abstract database model)
  ↓
metaed-plugin-edfi-ods-[database] (concrete database implementation)
  ↓
metaed-plugin-edfi-ods-changequery (abstract change tracking)
  ↓
metaed-plugin-edfi-ods-changequery-[database] (concrete change tracking)
```

**Data Flow Between Plugins:**
```typescript
// Base plugin consumes enhanced table models from database plugins
function findRelevantTables(metaEd: MetaEdEnvironment): Table[] {
  return metaEd.namespace.values.flatMap(namespace => {
    // Access tables enhanced by ods-relational and database-specific plugins
    return namespace.data.edfiOdsRelational.tables.filter(table => {
      // Use database-specific naming from postgresql/sqlserver plugins
      return table.data.edfiOdsPostgresql?.tableName || 
             table.data.edfiOdsSqlserver?.tableName;
    });
  });
}
```

### Strategy Function Contracts

**Model Creator Function Signatures:**
```typescript
// Contract that database plugins must implement
type DeleteTrackingTableCreator = (
  metaEd: MetaEdEnvironment,
  sourceTable: Table
) => DeleteTrackingTable;

type DeleteTrackingTriggerCreator = (
  metaEd: MetaEdEnvironment,
  sourceTable: Table,
  trackingTable: DeleteTrackingTable
) => DeleteTrackingTrigger;

type IndirectUpdateTriggerCreator = (
  metaEd: MetaEdEnvironment,
  childTable: Table,
  parentTable: Table
) => IndirectUpdateCascadeTrigger;
```

## Generator Integration Architecture

### Template-Based Generation

**Generator Helper Functions:**
```typescript
// generator/GeneratorHelper.ts
export function generateChangeTrackingArtifacts(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  templateEngine: TemplateEngine
): GeneratedOutput[] {
  
  const artifacts: GeneratedOutput[] = [];
  
  // Generate delete tracking tables
  const trackingTables = getDeleteTrackingTables(metaEd, pluginName);
  artifacts.push(...generateTrackingTableSQL(trackingTables, templateEngine));
  
  // Generate delete tracking triggers
  const trackingTriggers = getDeleteTrackingTriggers(metaEd, pluginName);
  artifacts.push(...generateTriggerSQL(trackingTriggers, templateEngine));
  
  // Generate indirect update triggers
  const cascadeTriggers = getIndirectUpdateTriggers(metaEd, pluginName);
  artifacts.push(...generateCascadeTriggerSQL(cascadeTriggers, templateEngine));
  
  return artifacts;
}
```

## Validation and Error Handling

### Change Query Validation

**Namespace Validation:**
```typescript
// validator/NamespaceMustNotBeNamedChanges.ts
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  
  metaEd.namespace.values.forEach(namespace => {
    if (namespace.namespaceName.toLowerCase() === 'changes') {
      failures.push({
        validationFailureId: 'CQ001',
        category: 'error',
        message: 'Namespace cannot be named "changes" as it conflicts with change query infrastructure',
        elementName: namespace.namespaceName,
        sourceFileLine: namespace.sourceMap?.sourceFileLine
      });
    }
  });
  
  return failures;
}
```

### Model Validation

**Change Tracking Model Consistency:**
```typescript
function validateChangeTrackingModels(metaEd: MetaEdEnvironment): ValidationResult {
  const issues: string[] = [];
  
  // Ensure every delete tracking table has corresponding trigger
  const trackingTables = getDeleteTrackingTables(metaEd);
  const trackingTriggers = getDeleteTrackingTriggers(metaEd);
  
  trackingTables.forEach(table => {
    const correspondingTrigger = trackingTriggers.find(trigger => 
      trigger.sourceTableName === table.sourceTableName
    );
    
    if (!correspondingTrigger) {
      issues.push(`Delete tracking table ${table.tableName} missing corresponding trigger`);
    }
  });
  
  return { isValid: issues.length === 0, issues };
}
```

## Development Patterns

### Adding New Change Query Features

1. **Define Abstract Model** - Create interface in `model/` directory
2. **Update Base Enhancer** - Add orchestration logic for new feature
3. **Extend Strategy Interface** - Add new creator function to strategy pattern
4. **Update Database Plugins** - Implement concrete strategy in each database plugin
5. **Add Validation** - Ensure model consistency and business rules
6. **Add Tests** - Unit tests for enhancers, integration tests for end-to-end

### Version Compatibility Guidelines

**Supporting New ODS Versions:**
```typescript
// Pattern for adding new version support
function createVersionSpecificModel(
  sourceTable: Table,
  targetVersion: string
): ChangeTrackingModel {
  
  if (versionSatisfies(targetVersion, '>=8.0.0')) {
    return createV8Model(sourceTable);
  } else if (versionSatisfies(targetVersion, '>=7.0.0')) {
    return createV7Model(sourceTable);
  } else if (versionSatisfies(targetVersion, '>=6.0.0')) {
    return createV6Model(sourceTable);
  } else {
    return createV5Model(sourceTable);
  }
}
```

## Architecture Strengths

1. **Template Method Pattern** - Clean separation between orchestration and implementation
2. **Strategy Pattern** - Database-specific implementations without code duplication
3. **Model-Driven Generation** - Abstract models enable multiple output formats
4. **Version Awareness** - Robust support for multiple ODS/API versions
5. **Plugin Ecosystem Integration** - Clean interfaces with database plugins
6. **Validation Framework** - Comprehensive validation of change tracking models
7. **Extensibility** - Easy to add new databases or change tracking features

## Areas for Enhancement

1. **Centralized Version Strategy** - Factory pattern for version-specific logic
2. **Model Validation Framework** - More comprehensive model consistency checking
3. **Performance Optimization** - Lazy loading of change tracking models
4. **Configuration Options** - Configurable change tracking behavior
5. **Advanced Change Tracking** - Support for field-level change tracking
6. **Documentation Generation** - Automated documentation for change query schemas

This plugin exemplifies excellent architectural design for a complex, multi-database feature implementation, providing the foundation for sophisticated change tracking capabilities while maintaining clean separation of concerns and extensible patterns.