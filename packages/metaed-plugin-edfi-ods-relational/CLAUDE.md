# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi ODS Relational Overview

This plugin transforms Ed-Fi MetaEd models into abstract relational database structures. It provides database-agnostic table, column, and relationship definitions that database-specific plugins can render into concrete SQL implementations.

## Package Structure

```
src/
├── model/           # Database model definitions (Table, Column, ForeignKey)
├── enhancer/        # Pipeline processors that transform MetaEd to database objects
├── validator/       # Validation rules for database models
└── shared/          # Utilities (naming, SQL escaping, etc.)
```

## Core Processing Pipeline

The plugin uses an **enhancer pipeline** with sequential phases:

### Phase 1: Entity Setup
- **`EdFiOdsRelationalEntityRepository`** - Sets up plugin data repository
- **`TopLevelEntity`** - Processes domain entities and associations

### Phase 2: Inheritance Processing
- **`TopLevelEntityBaseReferenceEnhancer`** - Handles entity inheritance
- **`CommonSubclassBaseReferenceEnhancer`** - Manages common property inheritance
- **`Descriptor`** - Processes descriptor entities

### Phase 3: Property Transformation
- **`EntityProperty`** - Transforms entity properties to columns
- **`DescriptorProperty`** - Handles descriptor properties
- **`EnumerationProperty`** - Processes enumeration properties
- **`ReferenceProperty`** - Creates foreign key relationships

### Phase 4: Table Creation
- **`DomainEntityTableEnhancer`** - Creates tables for domain entities
- **`AssociationTableEnhancer`** - Creates association tables
- **`DescriptorTableEnhancer`** - Creates descriptor tables
- **`EnumerationTableEnhancer`** - Creates enumeration tables

### Phase 5: Relationship Establishment
- **`ForeignKeyCreatingTableEnhancer`** - Establishes foreign key constraints

### Phase 6: Data Population
- **`EnumerationRowEnhancer`** - Populates enumeration data
- **`DescriptorMapTypeRowEnhancer`** - Creates descriptor mappings

## Key Database Models

### Table Structure
```typescript
interface Table {
  nameGroup: TableNameGroup;
  existenceReason: TableExistenceReason;
  columns: Column[];
  primaryKeys: Column[];
  foreignKeys: ForeignKey[];
  alternateKeys: Column[];
  // ... metadata
}
```

### Column Types
- **Primitive**: `boolean`, `integer`, `string`, `date`, `datetime`, `decimal`, `currency`
- **Ed-Fi Specific**: `year`, `percent`, `duration`, `short`

### Foreign Key Features
- Identifying vs non-identifying relationships
- Cascade delete/update rules
- Multi-column foreign keys
- Reverse indexing for performance

## Key Algorithms

### Name Collapsing
```typescript
export function appendOverlapCollapsing(accumulated: string, current: string): string {
  // Finds overlapping suffixes/prefixes to create condensed names
  // Example: "Student" + "StudentSchool" becomes "StudentSchool"
}
```

### Column Conflict Resolution
- Tracks property paths leading to naming conflicts
- Merges columns with identical names but different sources
- Maintains audit trail of merged references

### Table Building Strategy Pattern
Different property types use specialized builders:
- **`SimplePropertyTableBuilder`** - Basic data types
- **`ReferencePropertyTableBuilder`** - Entity references
- **`ChoicePropertyTableBuilder`** - Choice properties
- **`CommonPropertyTableBuilder`** - Common (shared) properties

## Version-Aware Processing

Supports multiple Ed-Fi ODS/API versions:
- **Version 5.x, 6.x, 7.x** compatibility
- Different column ordering strategies by version
- Feature flags for version-specific behaviors

## Testing Patterns

### Test Structure
```typescript
describe('when processing [scenario]', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  
  beforeAll(() => {
    // Build test MetaEd model
    const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      // ... build scenario
      .buildAsString();
      
    // Run required enhancers
    runEnhancers(metaEd);
  });
  
  it('should create expected tables', () => {
    const tables = metaEd.namespace.get('EdFi').data.edfiOdsRelational.tables;
    expect(tables).toHaveLength(expectedCount);
    expect(tables).toMatchSnapshot();
  });
});
```

### Test Categories
- **Unit tests** - Individual enhancer components
- **Integration tests** - Full pipeline processing
- **Snapshot tests** - Output verification for complex scenarios
- **Version-specific tests** - Cross-version compatibility

## Dependencies

### Required Plugins
- **metaed-plugin-edfi-unified** - Base Ed-Fi model processing
- **metaed-plugin-edfi-unified-advanced** - Advanced features (USI handling)

### Database-Specific Plugins
This plugin generates abstract structures. Concrete SQL is handled by:
- **metaed-plugin-edfi-ods-sql-server** - SQL Server implementation
- **metaed-plugin-edfi-ods-postgresql** - PostgreSQL implementation

## Key Utilities

### Naming Functions
- **`tableNameForDomainEntity`** - Generate table names from entities
- **`columnNameFromProperty`** - Convert properties to column names
- **`sqlEscape`** - SQL identifier escaping

### Table Analysis
- **`isTableReferencing`** - Check if table references another
- **`getTableByEntityFullName`** - Find tables by entity name
- **`mergeBySameName`** - Merge columns with identical names

## Development Notes

1. **Database Agnostic** - Generates abstract structures, not concrete SQL
2. **Immutable Data** - Uses deep-freeze for data integrity
3. **Version Awareness** - Consider Ed-Fi version when making changes
4. **Column Ordering** - Different strategies by ODS/API version
5. **Performance** - Efficient conflict detection and relationship establishment

## Common Development Tasks

- **Adding Column Type** - Extend type mappings and table builders
- **New Table Enhancement** - Create enhancer following pipeline phases
- **Naming Strategy Changes** - Update name collapsing algorithms
- **Version-Specific Logic** - Use version checks for feature flags