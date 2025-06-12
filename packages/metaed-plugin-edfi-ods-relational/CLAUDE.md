# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Plugin Ed-Fi ODS Relational Overview

The `metaed-plugin-edfi-ods-relational` package is a sophisticated model transformer that converts the abstract Ed-Fi MetaEd model into a database-agnostic, abstract relational model. It defines the logical structure of an Ed-Fi Operational Data Store (ODS), including tables, columns, relationships, and indexes, without committing to a specific SQL dialect. This abstract model serves as the foundation for downstream database-specific plugins that generate concrete DDL and DML.

## Database Schema Generation Architecture

### Core Architectural Principles

**Phased Transformation Pipeline:**
- Sequential enhancer pipeline with strict execution order
- Each enhancer builds upon previous enhancer results
- Clear separation of concerns across transformation phases

**Model Enrichment Strategy:**
- Enriches existing MetaEd model rather than creating new model
- Attaches relational metadata under `entity.data.edfiOdsRelational`
- Preserves original MetaEd structure while adding database context

**Database Agnosticism:**
- Generates abstract relational model (`Table`, `Column`, `ForeignKey`)
- Decouples logical ODS structure from specific database technology
- Enables support for multiple database platforms (SQL Server, PostgreSQL)

### Enhancer Pipeline Architecture

The transformation occurs through six distinct phases orchestrated by `EnhancerList.ts`:

**Phase 1: Initial Setup & Property Cloning**
```typescript
EdFiOdsRelationalEntityRepositorySetupEnhancer,  // Initialize data structures
OdsTopLevelEntitySetupEnhancer                   // Clone properties for transformation
```

**Phase 2: Inheritance & Reference Processing**
```typescript
TopLevelEntityBaseReferenceEnhancer,             // Handle inheritance relationships
CommonSubclassBaseReferenceEnhancer,            // Process subclass property inheritance
UpdateCascadeTopLevelEntityEnhancer             // Pre-calculate cascade behavior
```

**Phase 3: Property-to-Column Logic Setup**
```typescript
EntityPropertySetupEnhancer,                    // Attach ODS metadata to properties
DescriptorPropertySetupEnhancer,               // Handle descriptor-specific logic
CreateUsisFromUniqueIdsEnhancer                // Implement USI pattern
```

**Phase 4: Table & Column Creation**
```typescript
DomainEntityTableEnhancer,                     // Create tables for domain entities
AssociationTableEnhancer,                      // Create association tables
// Uses Strategy Pattern via TableBuilder.ts
```

**Phase 5: Relationship & Constraint Establishment**
```typescript
ForeignKeyCreatingTableEnhancer,               // Create foreign key relationships
ForeignKeyIsIdentifyingEnhancer,              // Mark identifying foreign keys
ForeignKeyReverseIndexEnhancer                 // Add performance indexes
```

**Phase 6: Data & Metadata Population**
```typescript
EnumerationRowEnhancer,                        // Generate enumeration data
TableDeprecationEnhancer,                      // Propagate deprecation metadata
ColumnDeprecationEnhancer                      // Handle column deprecation
```

## Table and Column Mapping Strategies

### Table Mapping Architecture

**Main Tables:**
- Each top-level MetaEd entity maps to a main table
- Domain entities → `edfi.Student`, `edfi.School`
- Associations → `edfi.StudentSchoolAssociation`
- Descriptors → `edfi.GradeLevelDescriptor`

**Join Tables for Collections:**
```typescript
// Collection properties create separate join tables
// Example: Student phone numbers → student.StudentTelephone
if (property.isCollection) {
  createJoinTable(entity, property);
}
```

**Inheritance Strategy - Table per Subclass/Extension:**
```typescript
// Subclasses get separate tables with FK to base
// edfi.School extends edfi.EducationOrganization
// edfi.School.EducationOrganizationId → edfi.EducationOrganization.EducationOrganizationId
```

### Column Mapping Strategies

**Sophisticated Naming Strategy:**
```typescript
// Component-based naming with collapsing logic
interface ColumnNameComponent {
  name: string;
  canCollapse: boolean;
  isRoleName: boolean;
}

// Name collapsing example:
// Student + StudentSchoolAssociation → StudentSchoolAssociation
function appendOverlapCollapsing(baseName: string, appendName: string): string {
  // Ed-Fi ODS table name collapsing logic
}
```

**Column Creation Factory Pattern:**
```typescript
// ColumnCreator.ts acts as factory for specialized creators
function createColumnFor(property: EntityProperty): Column {
  switch (property.propertyType) {
    case 'simpleProperty': return SimplePropertyColumnCreator.create(property);
    case 'referenceProperty': return ReferencePropertyColumnCreator.create(property);
    case 'descriptorProperty': return DescriptorPropertyColumnCreator.create(property);
    // ... other property types
  }
}
```

**Conflict Resolution:**
```typescript
// When multiple properties map to same column name
function columnConstraintMerge(
  existingColumn: Column,
  newColumn: Column
): Column {
  // Take most restrictive constraints
  // If one nullable and one not → result is not nullable
  return {
    ...existingColumn,
    isNullable: existingColumn.isNullable && newColumn.isNullable,
    maxLength: Math.min(existingColumn.maxLength, newColumn.maxLength)
  };
}
```

## Foreign Key Relationship Handling

### Multi-Step Foreign Key Generation

**1. Identification Phase:**
```typescript
// ForeignKeyCreatingTableEnhancer.ts orchestrates the process
function createForeignKeys(table: Table): ForeignKey[] {
  const referenceProperties = getReferencePropertiesAndAssociatedColumns(table);
  
  return referenceProperties.map(refProp => {
    const foreignTable = findReferencedTable(refProp.referencedEntity);
    const columnPairs = matchColumns(table, foreignTable, refProp);
    
    return new ForeignKey({
      columnPairs,
      withDeleteCascade: determineDeleteCascade(refProp),
      withUpdateCascade: determineUpdateCascade(refProp)
    });
  });
}
```

**2. Column Matching Strategy:**
```typescript
function matchColumns(
  parentTable: Table,
  foreignTable: Table,
  referenceProperty: EntityProperty
): ColumnPair[] {
  
  // Direct match based on shared source properties
  let matches = getMatchingColumnFromSourceEntityProperties(parentTable, foreignTable);
  
  // If direct match fails, check merge directives
  if (matches.length === 0) {
    matches = getMergePropertyColumn(parentTable, foreignTable, referenceProperty);
  }
  
  return matches;
}
```

**3. Cascade Behavior:**
```typescript
// UpdateCascadeTopLevelEntityEnhancer pre-calculates cascade safety
function calculateCascadeBehavior(entity: TopLevelEntity): CascadeBehavior {
  // Traverse entity graph to detect cycles
  // Mark entities that can safely support cascading updates
  // Prevent cyclic cascade scenarios that would cause database errors
}
```

## Index Generation and Optimization

### Strategic Index Creation

**Primary Key Indexes:**
```typescript
// Derived from MetaEd entity identity properties
function collectPrimaryKeyColumns(entity: TopLevelEntity): Column[] {
  return PrimaryKeyCollector.collectFrom(entity.identityProperties);
}
```

**USI (Unique Surrogate Integer) Pattern:**
```typescript
// CreateUsisFromUniqueIdsEnhancer.ts implements critical optimization
function transformToUsi(entity: TopLevelEntity): void {
  const uniqueIdProperty = findUniqueIdProperty(entity);
  
  if (uniqueIdProperty) {
    // Create new USI primary key column
    const usiColumn = createUsiColumn(entity);
    
    // Demote original UniqueId to unique index
    const uniqueIndex = createUniqueIndex(uniqueIdProperty);
    
    // Update all references throughout model
    updateReferencesToUseUsi(entity, usiColumn);
  }
}
```

**Performance Optimization Indexes:**
```typescript
// ForeignKeyReverseIndexEnhancer.ts adds strategic indexes
function createReverseIndexes(foreignKey: ForeignKey): Index[] {
  // Create non-clustered indexes on foreign key columns
  // Skip if FK columns already lead primary key (would be redundant)
  if (!isRedundantWithPrimaryKey(foreignKey)) {
    return [createNonClusteredIndex(foreignKey.parentColumns)];
  }
}

// Specialized performance indexes
EducationOrganizationIdColumnEnhancer,  // Index for authorization queries
UsiColumnEnhancer                       // Index USI columns for joins
```

## Data Type Mapping from MetaEd to SQL

### Abstract Type System

The plugin maps to abstract relational types defined in `ColumnType.ts`:
```typescript
type ColumnType = 
  | 'bigint' | 'boolean' | 'currency' | 'date' | 'datetime' 
  | 'decimal' | 'duration' | 'integer' | 'percent' 
  | 'short' | 'string' | 'time' | 'year' | 'unknown';
```

### Type Mapping Logic

**SimplePropertyColumnCreator.ts Implementation:**
```typescript
function mapMetaEdTypeToColumn(property: SimpleProperty): ColumnType {
  switch (property.propertyType) {
    case 'stringProperty':
      return {
        type: 'string',
        maxLength: property.maxLength,
        minLength: property.minLength
      };
      
    case 'decimalProperty':
      return {
        type: 'decimal',
        precision: property.totalDigits,
        scale: property.decimalPlaces
      };
      
    case 'integerProperty':
      return property.hasBigHint ? 'bigint' : 'integer';
      
    case 'booleanProperty':
      return 'boolean';
      
    // Date/time types
    case 'dateProperty': return 'date';
    case 'dateTimeProperty': return 'datetime';
    case 'timeProperty': return 'time';
    
    default: return 'unknown';
  }
}
```

**Enumeration/Descriptor Handling:**
```typescript
// Enumerations and descriptors reference integer primary keys
function mapDescriptorReference(descriptorProperty: DescriptorProperty): ColumnType {
  // Descriptors always use integer surrogate keys
  return 'integer';
}
```

## Merge Directive Handling in Database Context

### Two-Phase Merge Processing

**1. Column Creation Phase:**
```typescript
// ReferencePropertyTableBuilder.ts handles merge skipping
function buildReferenceProperty(property: ReferentialProperty): BuildResult {
  if (property.mergeDirectives.length > 0) {
    return {
      strategy: 'skipPath',  // Don't create columns for merged-in properties
      reason: 'Property handled via merge directive'
    };
  }
  
  return buildNormalReference(property);
}
```

**2. Foreign Key Resolution Phase:**
```typescript
// ForeignKeyCreatingTableEnhancer.ts resolves merge relationships
function getMergePropertyColumn(
  parentTable: Table,
  foreignTable: Table,
  referenceProperty: EntityProperty
): ColumnPair[] {
  
  const mergeDirective = referenceProperty.mergeDirectives[0];
  
  // Find column in parent table that corresponds to merge target
  const parentColumn = parentTable.columns.find(col =>
    col.sourceProperties.includes(mergeDirective.targetProperty)
  );
  
  // Match with primary key column from foreign table
  const foreignColumn = foreignTable.primaryKeyColumns.find(col =>
    col.sourceProperties.includes(mergeDirective.sourceProperty)
  );
  
  return [{ parentColumn, foreignColumn }];
}
```

## Subclass and Inheritance Table Strategies

### Table per Subclass Architecture

**Structure Pattern:**
```
edfi.EducationOrganization (base table)
  ↓ (1:1 relationship)
edfi.School (subclass table)
  ↓ (1:1 relationship)  
extension.SchoolExtension (extension table)
```

**Property Inheritance Process:**
```typescript
// CommonSubclassBaseReferenceEnhancer.ts
function inheritPropertiesFromBase(subclass: TopLevelEntity): void {
  const baseProperties = subclass.baseEntity.odsProperties;
  
  // Copy base properties to subclass
  subclass.data.edfiOdsRelational.odsProperties = [
    ...subclass.ownProperties,
    ...baseProperties.filter(prop => !isRedefinedInSubclass(prop, subclass))
  ];
}
```

**Relationship Creation:**
```typescript
// TopLevelEntityBaseReferenceEnhancer.ts creates synthetic relationships
function createSubclassToBaseReference(subclass: TopLevelEntity): EntityProperty {
  return {
    propertyType: 'referenceProperty',
    referencedEntity: subclass.baseEntity,
    isPartOfIdentity: true,           // Makes it part of PK
    odsIsReferenceToSuperclass: true, // Special marker for table generation
    // ... other properties
  };
}
```

**Table Generation Result:**
```sql
-- Example generated structure
CREATE TABLE edfi.School (
  SchoolId INT PRIMARY KEY,           -- PK and FK to EducationOrganization
  SchoolSpecificProperty VARCHAR(50),
  FOREIGN KEY (SchoolId) REFERENCES edfi.EducationOrganization(EducationOrganizationId)
    ON DELETE CASCADE ON UPDATE CASCADE
);
```

## Integration with Unified Plugin Data

### Plugin Dependency Chain

```
metaed-plugin-edfi-unified (reference resolution, merge directives)
  ↓
metaed-plugin-edfi-unified-advanced (advanced processing)
  ↓
metaed-plugin-edfi-ods-relational (database schema generation)
```

### Data Consumption Patterns

**USI Generation Example:**
```typescript
// CreateUsisFromUniqueIdsEnhancer.ts consumes unified plugin data
function findUniqueIdProperty(entity: TopLevelEntity): EntityProperty | null {
  // Relies on unified plugin having identified the UniqueId property
  return entity.properties.find(prop => 
    prop.metaEdName === 'UniqueId' && 
    prop.data.edfiUnified.isIdentityProperty
  );
}
```

**Reference Resolution:**
```typescript
// Uses enhanced reference information from unified plugin
function resolveEntityReference(property: ReferentialProperty): TopLevelEntity {
  // property.referencedEntity populated by unified plugin enhancers
  return property.referencedEntity;
}
```

**Test Execution Order:**
```typescript
// test/enhancer/PluginHelper.ts shows correct dependency order
function runAllEnhancers(metaEd: MetaEdEnvironment): void {
  // 1. Run unified plugin enhancers first
  runUnifiedEnhancers(metaEd);
  
  // 2. Run advanced unified enhancers
  runUnifiedAdvancedEnhancers(metaEd);
  
  // 3. Finally run relational enhancers
  runRelationalEnhancers(metaEd);
}
```

## Performance Optimizations for Database Operations

### USI (Unique Surrogate Integer) Pattern

**The Optimization:**
```typescript
// Convert natural string keys to integer surrogate keys
// Before: StudentUniqueId VARCHAR(32) PRIMARY KEY
// After:  StudentUSI INT PRIMARY KEY, StudentUniqueId VARCHAR(32) UNIQUE
```

**Performance Benefits:**
- **Join Performance** - Integer joins 10x+ faster than string joins
- **Storage Efficiency** - Reduce FK storage throughout database
- **Index Performance** - Integer indexes more compact and faster

### Strategic Index Creation

**Authorization Performance:**
```typescript
// EducationOrganizationIdColumnEnhancer.ts
function optimizeAuthorizationQueries(column: Column): void {
  if (column.name.includes('EducationOrganizationId')) {
    column.shouldIndex = true; // Frequently used in WHERE clauses
  }
}
```

**Join Optimization:**
```typescript
// ForeignKeyReverseIndexEnhancer.ts
function optimizeForeignKeyJoins(foreignKey: ForeignKey): Index[] {
  // Create non-clustered indexes on FK columns for reverse lookups
  // Skip if redundant with existing primary key index
}
```

**Cascade Operations:**
```typescript
// Offload data integrity to database engine
function setCascadeBehavior(foreignKey: ForeignKey): void {
  foreignKey.withDeleteCascade = isIdentifyingRelationship(foreignKey);
  foreignKey.withUpdateCascade = allowsPrimaryKeyUpdates(foreignKey);
  // Database handles cascades more efficiently than application code
}
```

## Testing Patterns for Database Generation

### Comprehensive Testing Strategy

**In-Memory Model Building:**
```typescript
// Tests use MetaEdTextBuilder for isolated test scenarios
describe('when generating tables for domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  
  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('Student')
      .withIntegerIdentity('StudentUSI', 'Student unique identifier')
      .withStringProperty('FirstName', 'First name', true, false, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new DomainEntityBuilder(metaEd, []));
      
    runRelationalEnhancers(metaEd);
  });
  
  it('should create correct table structure', () => {
    const studentTable = getTable(metaEd, 'edfi', 'Student');
    expect(studentTable.columns).toHaveLength(2);
    expect(studentTable.primaryKeyColumns).toHaveLength(1);
  });
});
```

**Snapshot Testing for Complex Outputs:**
```typescript
// Capture complete table/column structures
it('should generate correct column ordering', () => {
  const tableStructure = generateTableStructure(metaEd);
  expect(tableStructure).toMatchSnapshot();
});
```

**Version-Aware Testing:**
```typescript
// Separate tests for different ODS/API versions
describe('Column Ordering V6', () => { /* ... */ });
describe('Column Ordering V7', () => { /* ... */ });
describe('Reverse Indexes V6', () => { /* ... */ });
describe('Reverse Indexes V7', () => { /* ... */ });
```

**Integration Testing:**
```typescript
// test/integration/ contains end-to-end pipeline tests
describe('Full Pipeline Integration', () => {
  it('should handle complex multi-entity scenarios', () => {
    // Build complex model with inheritance, associations, extensions
    // Run complete enhancer pipeline
    // Verify end-to-end table generation
  });
});
```

**Unit Testing for Individual Enhancers:**
```typescript
// Each enhancer has dedicated test file
describe('ColumnDeprecationEnhancer', () => {
  it('should propagate deprecation from MetaEd to columns', () => {
    // Test specific enhancer logic in isolation
  });
});
```

## Development Patterns

### Adding New Enhancers

1. **Determine Pipeline Position** - Review `EnhancerList.ts` for correct execution order
2. **Create Enhancer File** - Follow naming convention `[Purpose]Enhancer.ts`
3. **Implement Enhancement Logic** - Modify `entity.data.edfiOdsRelational` appropriately
4. **Add to Pipeline** - Insert in correct position in enhancer list
5. **Write Tests** - Unit and integration tests for the enhancement

### Table/Column Builder Extensions

1. **Identify Property Type** - Determine what MetaEd property type needs new handling
2. **Create Builder Class** - Extend `TableBuilder` pattern in `enhancer/table/`
3. **Update Factory** - Modify `ColumnCreator.ts` to route to new builder
4. **Test Builder** - Isolated tests for the new table/column creation logic

### Database Optimization Changes

1. **Identify Performance Issue** - Profile or analyze generated schema
2. **Modify Index Strategy** - Update relevant index-creating enhancers
3. **Test Performance Impact** - Verify optimization doesn't break functionality
4. **Version Compatibility** - Ensure changes work across supported ODS versions

## Architecture Strengths

1. **Phased Transformation** - Clear separation of concerns across pipeline phases
2. **Database Agnosticism** - Abstract model supports multiple database platforms
3. **Performance Focus** - USI pattern and strategic indexing optimize database operations
4. **Inheritance Support** - Robust table-per-subclass strategy for Ed-Fi model
5. **Merge Directive Handling** - Sophisticated support for MetaEd merge directives
6. **Comprehensive Testing** - Multi-level testing strategy ensures reliability
7. **Version Awareness** - Explicit support for multiple ODS/API versions

This plugin successfully bridges the gap between the abstract MetaEd domain model and concrete relational database implementations, providing the essential foundation for all Ed-Fi database generation while maintaining performance and extensibility.