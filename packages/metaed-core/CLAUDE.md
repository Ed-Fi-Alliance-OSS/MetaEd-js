# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Core Package Overview

The `metaed-core` package is the foundational component of the MetaEd system, implementing a sophisticated **multi-stage compilation pipeline** that transforms MetaEd DSL source files into various output artifacts. It serves as the orchestration engine and provides the base infrastructure for the entire plugin ecosystem.

## Core Pipeline Architecture

The system follows a **classic 8-stage compilation pipeline** pattern orchestrated by `src/pipeline/Pipeline.ts`:

### Pipeline Stages

1. **Initialize** (`initializeMetaEdEnvironment`, `setupPlugins`) - Create State object and MetaEdEnvironment, initialize plugin environments
2. **Load Files** (`loadFiles`) - Read all `.metaed` files from configured project directories using `klaw-sync`  
3. **Syntax Validation** (`validateSyntax`) - Quick parallel syntax check on individual files
4. **File Indexing** (`loadFileIndex`) - Concatenate all files and create FileIndex for error mapping
5. **Parse** (`buildParseTree`) - Generate single AST using ANTLR parser from concatenated source
6. **Build Model** (`walkBuilders`) - Transform AST to object model using Builder pattern with ANTLR Listeners
7. **Initialize Namespaces** (`initializeNamespaces`) - Establish namespace dependencies and relationships
8. **Plugin Execution** - Run validators → enhancers → generators for each plugin in dependency order
9. **Write Output** (`writeOutput`) - Write generated artifacts to filesystem
10. **Error Mapping** (`fileMapForValidationFailure`) - Map validation failures back to original source files

### Central Data Structures

**`State` Object (`src/State.ts`)**
The pipeline's central context object that threads through all stages:
```typescript
export type State = {
  metaEdConfiguration: MetaEdConfiguration;
  pipelineFailure: PipelineFailure[];
  validationFailure: ValidationFailure[];
  parseTree: MetaEdGrammar | null;
  metaEd: MetaEdEnvironment;
  fileIndex: FileIndex;
  loadedFileSet: MetaEdFile[];
  generatorResults: GeneratorResult[];
};
```

**`MetaEdEnvironment` (`src/MetaEdEnvironment.ts`)**
Complete in-memory representation of the parsed model with plugin data isolation:
```typescript
export type MetaEdEnvironment = {
  namespace: Map<string, Namespace>;
  plugin: Map<string, PluginEnvironment>; // Isolated plugin data spaces
  metaEdVersion: string;
  // ... configuration and metadata
};
```

## Builder Pattern Implementation with ANTLR

The transformation from AST to object model uses a sophisticated **Builder pattern** with ANTLR Listeners:

### Architecture

- **ANTLR Listeners as Builders** - Uses ANTLR's `ParseTreeWalker` and listener mechanism instead of manual AST traversal
- **Abstract Builder Base** - `TopLevelEntityBuilder` provides common functionality for all entity builders
- **Concrete Builders** - Specific builders for each entity type (DomainEntity, Association, etc.)

### Key Builder Classes

**`TopLevelEntityBuilder` (`src/builder/TopLevelEntityBuilder.ts`)**
Abstract base class providing:
- Current entity and property management
- Common language constructs (documentation, properties, identity)
- Entity registration in correct Namespace repository  
- Property name collision detection

**Concrete Builders:**
- `DomainEntityBuilder` - Primary business entities
- `AssociationBuilder` - Entity relationships
- `CommonBuilder` - Reusable property collections
- `DescriptorBuilder` - Controlled vocabularies
- `NamespaceBuilder` - Project containers (runs first)

### Builder Orchestration

`src/builder/WalkBuilders.ts` coordinates builder execution:
1. Creates instances of all builder classes
2. Walks the concatenated parse tree for each builder
3. NamespaceBuilder runs first to populate namespace containers
4. Other builders populate their respective entity repositories

## Model System and Entity Types

The in-memory model uses a **Repository pattern** with hierarchical, composable entities:

### Core Architecture

**Repository Pattern:**
- `MetaEdEnvironment` contains namespace map
- Each `Namespace` contains an `EntityRepository`  
- `EntityRepository` contains typed maps for each `ModelType`
- Helper functions provide convenient query API

### Entity Hierarchy

**Base Classes:**
- **`ModelBase`** - Root of all model objects (metaEdName, documentation, data object)
- **`TopLevelEntity`** - Base for user-defined constructs (properties, identity, inheritance)
- **`EntityProperty`** - Base for all property types with rich type hierarchy

**Top-Level Entity Types:**
- **`DomainEntity`** - Primary business entities (Student, School, etc.)
- **`Association`** - Relationships between entities (StudentSchoolAssociation)
- **`Common`** - Reusable property collections (Address, Name)
- **`Descriptor`** - Controlled vocabularies (GradeLevelDescriptor)
- **`Choice`** - Union types for polymorphic properties
- **`Enumeration`** - Fixed value lists (StateAbbreviation)
- **`InlineCommon`** - Embedded common structures

**Extension Types:**
- **`DomainEntityExtension`** - Cross-namespace entity extensions
- **`AssociationExtension`** - Cross-namespace association extensions  
- **`CommonExtension`** - Cross-namespace common extensions

**Subclass Types:**
- **`DomainEntitySubclass`** - Entity inheritance (School extends EducationOrganization)
- **`AssociationSubclass`** - Association inheritance

### Property System

**Property Types:**
- **`SimpleProperty`** - Primitive types (string, integer, decimal, boolean)
- **`ReferentialProperty`** - References to other TopLevelEntity objects
- **Specialized Properties** - AssociationProperty, DomainEntityProperty, DescriptorProperty, etc.

## Plugin System Architecture

Implements a **Microkernel pattern** where core handles parsing/building and plugins handle all domain logic:

### Plugin Contract

All plugins export an `initialize()` function returning a `MetaEdPlugin`:
```typescript
export type MetaEdPlugin = {
  validator: Validator[];  // (metaEd) => ValidationFailure[]
  enhancer: Enhancer[];   // (metaEd) => EnhancerResult  
  generator: Generator[]; // async (metaEd) => GeneratorResult
  shortName: string;      // Unique identifier for data isolation
};
```

### Plugin Data Isolation

Critical architectural principle: Each plugin gets isolated data namespace:
- `entity.data[pluginShortName]` - Plugin-specific entity data
- `metaEd.plugin[pluginName]` - Plugin environment container
- Prevents cross-plugin interference and ensures stability

### Plugin Execution Order

Plugins execute in dependency order with fixed hook sequence:
1. **Validators** - Check semantic rules on base model (read-only)
2. **Enhancers** - Add computed properties to isolated data spaces
3. **Generators** - Produce output artifacts from enriched model

## File Processing and Grammar Handling

### File Discovery and Processing

- **Discovery** - `FileSystemFilenameLoader` uses `klaw-sync` for recursive `.metaed` file discovery
- **Concatenation Strategy** - All files concatenated into single string before parsing
- **Error Mapping** - `FileIndex` maps parse errors back to original files and line numbers

### ANTLR Grammar Integration

- **Grammar Files** - Uses ANTLR v4 with generated parser files in `src/grammar/gen/`
- **Custom Error Handling** - `MetaEdErrorListener` collects syntax errors into pipeline ValidationFailure array
- **Parse Tree Building** - `ParseTreeBuilder` provides functions to invoke ANTLR parser

## Key Utilities and Infrastructure

### Core Utilities (`src/Utility.ts`)

- **String Manipulation** - `uppercaseThenAlphanumericOnly`, `decapitalize`
- **Array Operations** - `orderByProp` for consistent sorting
- **Version Management** - `versionSatisfies` using semver for robust version checking

### Logging Infrastructure (`src/Logger.ts`)

Well-designed winston wrapper providing:
- Leveled logging (debug, info, warn, error)
- Fatal method that exits process (appropriate for CLI)
- Abstracted interface for easy implementation swapping

### Testing Infrastructure

**MetaEdTextBuilder (`src/grammar/MetaEdTextBuilder.ts`)**
Fluent API for programmatic DSL construction:
```typescript
MetaEdTextBuilder.build()
  .withBeginNamespace('EdFi')
  .withStartDomainEntity('Student')
  .withDocumentation('Student entity')
  .withIntegerProperty('StudentId', 'doc', true, false)
  .withEndDomainEntity()
  .withEndNamespace()
  .sendToListener(new DomainEntityBuilder(metaEd, []));
```

**Test Patterns:**
- In-memory testing with MetaEdEnvironment
- Focused builder testing with MetaEdTextBuilder
- Custom assertion helpers in `TestHelper.ts`
- Comprehensive failure scenario coverage

## Configuration and Project Management

### Project Discovery

- **Convention-based** - Projects defined via `metaEdProject` property in package.json
- **Recursive Scanning** - `ProjectLoader.scanForProjects()` finds projects in directory tree
- **Dependency Management** - Ensures EdFi core processes first, establishes namespace dependencies

### Configuration Loading

- **Flexible Config** - Uses `cosmiconfig` for multiple config source support
- **Type Safety** - Strong TypeScript types for all configuration structures
- **Validation** - Comprehensive validation of project structure and dependencies

## Development Patterns

### Adding New Entity Types

1. Create model class extending `TopLevelEntity` in `src/model/`
2. Add to `ModelType` enum and `EntityRepository` structure
3. Create builder class extending `TopLevelEntityBuilder`
4. Add grammar rules and update ANTLR generation
5. Add builder to `WalkBuilders.ts` execution sequence

### Plugin Development Guidelines

**Data Isolation Rules:**
- Validators: Read-only access to MetaEdEnvironment
- Enhancers: Only write to `entity.data[yourPluginShortName]`
- Generators: Read from fully enhanced model, produce GeneratorResult

**Execution Order:**
- Declare plugin dependencies explicitly
- Understand your position in dependency chain
- Build upon previous enhancer results

### Testing Best Practices

- Use MetaEdTextBuilder for readable test data creation
- Test both positive and negative scenarios
- Use TestHelper functions for type-safe entity retrieval
- Focus on single-responsibility testing for builders

## Performance Considerations

### Memory Management

- Pipeline designed for streaming processing where possible
- `nextMacroTask()` yields to event loop between major stages
- FileIndex optimizes memory usage for large concatenated files

### Error Handling Strategy

- Accumulate failures rather than fail-fast approach
- Allows reporting multiple errors in single run
- Robust error mapping preserves source location accuracy

## Security Considerations

### File System Safety

- WriteOutput includes safety checks for MetaEdOutput directory detection
- Prevents accidental deletion of non-output directories
- Validates source files not in output directory before writing

### Input Validation

- ANTLR provides robust parsing protection against malformed input
- Dedicated validation stage prevents invalid models from propagation
- DSL constructs designed to avoid code execution risks

### Dependency Management

- Regular security audits recommended for npm dependencies
- No direct network activity limits attack surface
- File system operations scoped to configured directories

## Important Files

- **`index.ts`** - Main exports providing extensive public API
- **`src/pipeline/Pipeline.ts`** - Pipeline orchestration and execution
- **`src/grammar/language/MetaEdGrammar.g4`** - ANTLR grammar definition
- **`src/builder/WalkBuilders.ts`** - Builder orchestration logic
- **`src/model/EntityRepository.ts`** - Entity storage and retrieval patterns
- **`src/grammar/MetaEdTextBuilder.ts`** - Test infrastructure for DSL construction

## Development Notes

- **Grammar Changes** - Require running `npm run antlr-gen` to regenerate parser
- **New Entity Types** - Need model class, builder, grammar rules, and comprehensive tests
- **Validators** - Should return descriptive error messages with accurate source locations
- **Enhancers** - Must only add data to isolated namespaces, never mutate existing properties
- **Generators** - Are async functions that return file content and metadata for writing

## Architecture Strengths

1. **Separation of Concerns** - Clean separation between parsing, validation, enhancement, and generation
2. **Plugin Extensibility** - Microkernel pattern enables rich ecosystem without core complexity
3. **Data Isolation** - Plugin data spaces prevent interference and ensure stability
4. **Error Handling** - Robust accumulation and mapping of errors with source location
5. **Testing Infrastructure** - Excellent testing utilities enable comprehensive test coverage
6. **Performance** - Streaming processing and event loop yielding for large models

The metaed-core package exemplifies excellent software architecture with its use of proven patterns, clear contracts, comprehensive testing, and robust error handling. It provides a solid foundation for the entire MetaEd ecosystem.