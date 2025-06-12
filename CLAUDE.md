# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

**Build & Development:**
- `npm run test:lint` - Run TypeScript and ESLint checks
- `npm run metaed:build` - Build MetaEd artifacts
- `npm run antlr-gen` - Generate ANTLR grammar files

**Running Single Tests:**
- `npx jest path/to/test.ts` - Run a specific test file
- `npx jest -t "test name"` - Run tests matching a pattern

## Tests

ALWAYS use `npx jest path/to/test.ts` from the project root to run a specific test file. NEVER use `npm run` to run a single test file.

## Architecture Overview

This is a **Lerna monorepo** for MetaEd, a domain-specific language (DSL) for data modeling in the Ed-Fi ecosystem. The codebase transforms `.metaed` files into various output artifacts (SQL, XSD, API specs, documentation, etc.).

At-sign prefixed CLAUDE.md files in packages are loaded for detailed architecture information on them.

packages/metaed-core/CLAUDE.md
packages/metaed-plugin-edfi-unified/CLAUDE.md
@packages/metaed-plugin-edfi-api-schema/CLAUDE.md

### Core Processing Pipeline

The system follows a **sequential 8-stage pipeline pattern** orchestrated by `metaed-core/src/pipeline/Pipeline.ts`:

1. **Initialize** - Create `MetaEdEnvironment` and setup plugins with isolated data spaces
2. **Load** - Read all `.metaed` files from project directories using `klaw-sync`
3. **Parse** - Build single AST from concatenated files using ANTLR-generated parser
4. **Build** - Transform AST to object model using Builder pattern (ANTLR Listeners)
5. **Validate** - Run plugin validators to check semantic rules and relationships
6. **Enhance** - Run plugin enhancers to add computed properties and relationships
7. **Generate** - Run plugin generators to create output artifacts
8. **Write** - Write generated artifacts to filesystem

### Key Data Structures

- **`State`** (`metaed-core/src/State.ts`) - Central pipeline context object
- **`MetaEdEnvironment`** - Complete in-memory model representation with plugin data spaces
- **`Namespace`** - Container for entities within a MetaEd project (e.g., 'EdFi', 'TPDM')
- **`EntityRepository`** - Repository pattern for querying parsed entities by type
- **`TopLevelEntity`** - Abstract base for all major MetaEd constructs (entities, associations, etc.)

### Key Packages by Category

**Core Infrastructure:**
- **metaed-core** - Pipeline orchestration, builders, base validators/enhancers/generators
- **metaed-console** - CLI for building MetaEd projects
- **metaed-default-plugins** - Default plugin configurations

**Foundation Plugins:**
- **metaed-plugin-edfi-unified** - Core Ed-Fi validators and reference enhancers (80+ validators, 20+ enhancers)
- **metaed-plugin-edfi-unified-advanced** - Advanced unified processing features

**Database/ODS Plugins:**
- **metaed-plugin-edfi-ods-relational** - Database schema generation and table mappings
- **metaed-plugin-edfi-ods-postgresql** - PostgreSQL-specific ODS generation
- **metaed-plugin-edfi-ods-sqlserver** - SQL Server-specific ODS generation
- **metaed-plugin-edfi-ods-changequery** - Change query support for data synchronization
- **metaed-plugin-edfi-ods-recordownership** - Record-level security and ownership

**API/Schema Plugins:**
- **metaed-plugin-edfi-api-schema** - JSON Schema and OpenAPI 3.0 specification generation
- **metaed-plugin-edfi-odsapi** - ODS/API specific configurations and mappings

**Documentation/Exchange Plugins:**
- **metaed-plugin-edfi-xsd** - XML Schema (XSD) generation for data exchange
- **metaed-plugin-edfi-handbook** - Documentation generation
- **metaed-plugin-edfi-xml-dictionary** - XML data dictionary generation
- **metaed-plugin-edfi-sql-dictionary** - SQL data dictionary generation

**Deployment:**
- **metaed-odsapi-deploy** - ODS/API deployment utilities
- **metaed-odsapi-deploy-console** - CLI for ODS/API deployment

### Plugin Architecture Deep Dive

**Plugin Contract:**
All plugins export an `initialize()` function returning a `MetaEdPlugin` object with:
- `validator: Validator[]` - Functions that return `ValidationFailure[]`
- `enhancer: Enhancer[]` - Functions that add computed properties to entities
- `generator: Generator[]` - Async functions that produce output artifacts
- `shortName: string` - Unique identifier for data isolation

**Plugin Data Isolation:**
Each plugin gets its own data namespace: `entity.data[pluginShortName]`
- `entity.data.edfiUnified` - Unified plugin data (references, base classes, etc.)
- `entity.data.edfiApiSchema` - API schema plugin data (JSON schemas, OpenAPI specs)
- `entity.data.edfiOdsRelational` - Relational plugin data (table mappings, columns)

**Plugin Dependencies:**
Plugins have explicit dependencies enforced by execution order:
1. **edfi-unified** - Base reference resolution and merge directives
2. **edfi-ods-relational** - Database mappings (depends on unified)
3. **edfi-api-schema** - API schemas (depends on unified + relational)
4. **edfi-ods-postgresql/sqlserver** - Database-specific generation

### Critical Architectural Patterns

1. **Pipeline Pattern** - Linear execution stages with `State` object threading
2. **Builder Pattern** - ANTLR Listeners construct object model from AST
3. **Repository Pattern** - `EntityRepository` provides typed entity access
4. **Plugin/Microkernel** - Core system + extensible plugins for specific outputs
5. **Data Isolation** - Plugin-specific data spaces prevent interference
6. **Immutability** - Enhancers only add data, never mutate existing data

### Entity Type Hierarchy

**Top-Level Entities:**
- **DomainEntity** - Primary business entities (Student, School, etc.)
- **Association** - Relationships between entities (StudentSchoolAssociation)
- **Common** - Reusable entity components (Address, Name)
- **Descriptor** - Controlled vocabularies (GradeLevelDescriptor)
- **Choice** - Union types for polymorphic properties
- **Enumeration** - Fixed value lists (e.g., StateAbbreviation)
- **InlineCommon** - Embedded common structures

**Extension Types:**
- **DomainEntityExtension** - Extend entities in different namespaces
- **AssociationExtension** - Extend associations
- **CommonExtension** - Extend common types

**Subclass Types:**
- **DomainEntitySubclass** - Entity inheritance (School extends EducationOrganization)
- **AssociationSubclass** - Association inheritance

### Property System

**Property Types:**
- **SimpleProperty** - Primitive types (string, integer, decimal, boolean, etc.)
- **ReferentialProperty** - References to other TopLevelEntity objects
- **EntityProperty** - Base class for all property types

**Reference Resolution:**
The unified plugin resolves all references using `getEntityFromNamespaceChain()` which:
- Searches current namespace first
- Falls back to dependency namespaces in order
- Handles cross-namespace references correctly

### Testing Patterns

**Common Test Structure:**
```typescript
describe('when [scenario]', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  
  beforeAll(() => {
    // Build test model using MetaEdTextBuilder
    const metaEdText = MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      // build scenario
      .withStartDomainEntity('Student')
      .withDocumentation('doc)
      // ...
      .withEndDomainEntity()
      // ...
      .withEndNamespace()

          
    // Send to appropriate builders
    .sendToListener(new NamespaceBuilder(metaEd, []))
    .sendToListener(new DomainEntityBuilder(metaEd, []));
    
    // Run required enhancers in dependency order
    runUnifiedEnhancers(metaEd);
    runApiSchemaEnhancers(metaEd);
  });
  
  it('should [expected behavior]', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Student');
    expect(entity?.data.edfiUnified.someEnhancedProperty).toBe(expectedValue);
  });
});
```

**Integration Testing:**
- Full pipeline testing with sample MetaEd projects
- Authoritative comparison against known good outputs
- Multi-version data standard testing (DS 5.0, 5.1, 5.2)
- Cross-plugin integration validation

### Key Algorithms

**Property Flattening** (API Schema plugin):
Recursively flattens nested entity references while preserving:
- Property chains and paths (Student.Address.Street)
- Role-based naming conventions
- Merge directive effects
- Identity property relationships

**Reference Path Building** (Unified plugin):
Builds navigational paths through entity relationships:
- Tracks property chains for queries
- Handles circular references
- Maintains referential integrity

**Naming Collision Resolution**:
- Superclass/subclass property conflicts
- Role-based prefixing for disambiguation
- "shortenTo" property name overrides

### TypeScript Configuration

- Target: ES2017, Module: CommonJS
- Strict null checks enabled
- Path mapping: `~/*` → `packages/*`
- Source maps enabled for debugging

### Development Guidelines

**Adding New Plugins:**
1. Export `initialize()` function with validators/enhancers/generators
2. Use unique `shortName` for data isolation
3. Declare plugin dependencies explicitly
4. Follow immutability patterns for data enhancement

**Enhancer Development:**
1. Only add data to `entity.data[yourPluginName]`
2. Never mutate data from other plugins
3. Build upon previous enhancer results
4. Execute in correct dependency order

**Validator Development:**
1. Return `ValidationFailure[]` with unique MEV### IDs
2. Provide human-readable error messages
3. Include source location information
4. Check semantic rules and relationships

**Testing Requirements:**
- Unit tests for individual enhancers/validators
- Integration tests for full pipeline scenarios
- Use `MetaEdTextBuilder` for test model construction
- Verify both positive and negative cases

### Common Development Tasks

- **Adding Enhancer** - Create in appropriate plugin, add to `enhancerList()`, ensure execution order
- **Adding Validator** - Create with unique MEV### ID, add to `validatorList()`
- **Property Analysis** - Use `entity.data.edfiUnified` for resolved references
- **Cross-Plugin Data** - Access via `entity.data[pluginShortName]`
- **Debugging** - Check intermediate pipeline state and enhanced entity data

### Code Style
Avoid the use of classes where simple functions in a module suffice. Use export to control visibility instead of private.
