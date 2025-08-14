# Volatile Keys and Cascading Updates Analysis

## Executive Summary

This document analyzes the current state of volatile foreign keys and cascading primary key updates in the MetaEd ODS Relational and ODS API plugins, and proposes a solution for tracking and distinguishing between different types of key volatility.

## Current State Analysis

### 1. Direct Primary Key Updates

The system currently handles entities that allow primary key updates through the `allowPrimaryKeyUpdates` flag:

- **Location**: `packages/metaed-plugin-edfi-ods-relational/src/enhancer/UpdateCascadeTopLevelEntityEnhancer.ts`
- **Behavior**: 
  - Entities with `allowPrimaryKeyUpdates: true` get marked with `odsCascadePrimaryKeyUpdates: true`
  - This propagates through the entity graph to dependent entities
  - The flag is exposed in the API model via `Aggregate.allowPrimaryKeyUpdates`

### 2. Cascading Foreign Key Updates

Foreign key cascade behavior is determined in `ForeignKeyCreatingTableEnhancer`:

- **Location**: `packages/metaed-plugin-edfi-ods-relational/src/enhancer/ForeignKeyCreatingTableEnhancer.ts:185-189`
- **Logic**:
  ```typescript
  foreignKey.withUpdateCascade =
    isReference &&
    (parentTablePairs.property as ReferentialProperty).referencedEntity.data.edfiOdsRelational
      .odsCascadePrimaryKeyUpdates &&
    !parentTablePairs.property.data.edfiOdsRelational.odsCausesCyclicUpdateCascade;
  ```
- **Cycle Prevention**: The system tracks cascade paths and prevents cycles via `odsCausesCyclicUpdateCascade`

### 3. Current Data Model

The existing data structures include:

- **Table**: Contains `foreignKeys[]` array with each foreign key having `withUpdateCascade` boolean
- **TopLevelEntity**: Contains `allowPrimaryKeyUpdates` and `data.edfiOdsRelational.odsCascadePrimaryKeyUpdates`
- **ForeignKey**: Contains `withUpdateCascade` and `withDeleteCascade` flags

## Gap Analysis

### Missing Information

The current data model doesn't explicitly track:

1. **Tables with volatile foreign keys** - Tables that have foreign keys with `withUpdateCascade: true`
2. **Volatility source distinction** - Whether a root table's keys are volatile due to:
   - Direct updates (`allowPrimaryKeyUpdates`)
   - Cascading from parent entities
3. **Quick lookup** - No direct flag to check if a table has any volatile foreign keys without iterating

## Proposed Solution

### New Data Model Extension

Add volatility tracking to the Table data model:

```typescript
// New fields for Table.data.edfiOdsRelational
interface TableVolatilityData {
  // True if table has any foreign keys with withUpdateCascade = true
  hasVolatileForeignKeys: boolean;
  
  // For root tables only: true if primary keys are directly updatable
  hasDirectlyUpdatablePrimaryKeys: boolean;
  
  // For root tables only: true if primary keys can change via cascading
  hasCascadeVolatilePrimaryKeys: boolean;
  
  // List of foreign keys that have withUpdateCascade = true
  volatileForeignKeys: ForeignKey[];
}
```

### Implementation: TableVolatilityEnhancer

Create a new enhancer that runs after `ForeignKeyCreatingTableEnhancer`:

```typescript
// packages/metaed-plugin-edfi-ods-relational/src/enhancer/TableVolatilityEnhancer.ts

import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { Table, ForeignKey } from '../model/database';
import { tableEntities } from './EnhancerHelper';

const enhancerName = 'TableVolatilityEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);
    
    tables.forEach((table: Table) => {
      // Initialize volatility data
      if (!table.data.edfiOdsRelational) {
        table.data.edfiOdsRelational = {};
      }
      
      // Find volatile foreign keys (those with withUpdateCascade = true)
      const volatileForeignKeys = table.foreignKeys.filter(
        (fk: ForeignKey) => fk.withUpdateCascade
      );
      
      // Mark table if it has volatile foreign keys
      table.data.edfiOdsRelational.hasVolatileForeignKeys = volatileForeignKeys.length > 0;
      table.data.edfiOdsRelational.volatileForeignKeys = volatileForeignKeys;
      
      // For root/aggregate tables, determine volatility source
      if (table.isAggregateRootTable && table.parentEntity) {
        // Directly updatable if entity has allowPrimaryKeyUpdates
        table.data.edfiOdsRelational.hasDirectlyUpdatablePrimaryKeys = 
          table.parentEntity.allowPrimaryKeyUpdates === true;
        
        // Cascade-volatile if entity has odsCascadePrimaryKeyUpdates 
        // but NOT allowPrimaryKeyUpdates
        table.data.edfiOdsRelational.hasCascadeVolatilePrimaryKeys = 
          table.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates === true &&
          table.parentEntity.allowPrimaryKeyUpdates !== true;
      } else {
        // Non-root tables don't have these flags
        table.data.edfiOdsRelational.hasDirectlyUpdatablePrimaryKeys = false;
        table.data.edfiOdsRelational.hasCascadeVolatilePrimaryKeys = false;
      }
    });
  });
  
  return {
    enhancerName,
    success: true,
  };
}
```

### Integration Steps

1. **Add the enhancer to the enhancer list**:
   - File: `packages/metaed-plugin-edfi-ods-relational/src/enhancer/EnhancerList.ts`
   - Position: After `ForeignKeyCreatingTableEnhancer` (dependency on foreign keys being created)
   - Before any enhancers that might consume volatility information

2. **Export from index**:
   - Add export in `packages/metaed-plugin-edfi-ods-relational/src/index.ts`

## Usage Examples

### Checking if a Table Has Volatile Foreign Keys

```typescript
if (table.data.edfiOdsRelational.hasVolatileForeignKeys) {
  console.log(`Table ${table.tableId} has ${table.data.edfiOdsRelational.volatileForeignKeys.length} volatile foreign keys`);
}
```

### Distinguishing Root Table Volatility

```typescript
if (table.isAggregateRootTable) {
  if (table.data.edfiOdsRelational.hasDirectlyUpdatablePrimaryKeys) {
    console.log(`Table ${table.tableId} has directly updatable primary keys`);
  }
  
  if (table.data.edfiOdsRelational.hasCascadeVolatilePrimaryKeys) {
    console.log(`Table ${table.tableId} has cascade-volatile primary keys`);
  }
}
```

### Finding All Tables Affected by Cascading Updates

```typescript
const tablesWithVolatileFKs = Array.from(tables.values()).filter(
  table => table.data.edfiOdsRelational.hasVolatileForeignKeys
);
```

## Benefits

1. **Performance**: Quick boolean checks instead of iterating foreign keys
2. **Clarity**: Clear distinction between direct updates vs cascading volatility
3. **Maintainability**: Centralized volatility logic in one enhancer
4. **Extensibility**: Easy to add more volatility-related metadata in the future

## Testing Considerations

1. **Unit Tests**: Test the enhancer with various table configurations:
   - Tables with no foreign keys
   - Tables with non-volatile foreign keys
   - Tables with mixed volatile/non-volatile foreign keys
   - Root tables with `allowPrimaryKeyUpdates`
   - Root tables with cascading updates only

2. **Integration Tests**: Verify the enhancer works correctly in the full pipeline:
   - Runs after foreign keys are created
   - Data is available to downstream enhancers and generators

## Alternative Approaches Considered

1. **Computed Properties**: Instead of storing flags, compute them on-demand
   - Rejected: Performance impact of repeated iterations

2. **Separate Volatility Model**: Create a separate data structure for volatility
   - Rejected: Adds complexity without clear benefits

3. **Modify Existing Enhancers**: Add logic to existing enhancers
   - Rejected: Violates single responsibility principle

## Conclusion

The proposed `TableVolatilityEnhancer` provides a clean, efficient way to track and distinguish between different types of key volatility in the MetaEd ODS relational model. It integrates seamlessly with the existing enhancer pipeline and provides clear, performant access to volatility information for downstream consumers.