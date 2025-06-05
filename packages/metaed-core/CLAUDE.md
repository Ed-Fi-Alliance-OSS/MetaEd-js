# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Core Package Overview

This is the core package of the MetaEd system, providing the compilation pipeline, entity models, and plugin infrastructure for transforming MetaEd DSL files into various output formats.

## Essential Commands

**Testing:**
- `npm test` - Run all tests for this package
- `npx jest path/to/test.ts` - Run specific test file
- `npm run test:coverage` - Run with coverage report

**Development:**
- `npm run build` - Build the package
- `npm run antlr-gen` - Regenerate ANTLR parser from grammar

## Architecture Overview

### Pipeline Flow

The `Pipeline.ts` orchestrates these sequential stages:
1. **Initialize** - Set up environment and plugins
2. **Load Files** - Read .metaed files from filesystem
3. **Validate Syntax** - Parse with ANTLR grammar
4. **Build Parse Tree** - Create ANTLR parse trees
5. **Walk Builders** - Convert parse trees to entity models
6. **Run Plugins** - Execute validators → enhancers → generators
7. **Write Output** - Save generated artifacts

### Core Components

**State Management:**
- `State.ts` - Central pipeline state containing configuration, files, entities, and results
- `MetaEdEnvironment.ts` - Runtime environment with namespaces, entities, and plugin data

**Entity System:**
- `model/` - Entity definitions (Association, DomainEntity, Common, etc.)
- `model/property/` - Property types (String, Integer, Boolean, Association, etc.)
- All entities extend `ModelBase` → `TopLevelEntity`

**Builder Pattern:**
- `builder/` - ANTLR listeners that construct entities from parse trees
- One builder per entity type (e.g., `DomainEntityBuilder`, `AssociationBuilder`)
- Two-phase processing: enter/exit methods for tree walking

**Plugin Architecture:**
- **Validators**: `(metaEd: MetaEdEnvironment) => ValidationFailure[]`
- **Enhancers**: `(metaEd: MetaEdEnvironment) => EnhancerResult`
- **Generators**: `(metaEd: MetaEdEnvironment) => Promise<GeneratorResult>`
- Plugins run in dependency order
- Validators and enhancers in each plugin run in an explicit order provided by the plugin `initialize()` function 

### Key Patterns

1. **Entity Repository**: Typed maps within namespaces for entity storage/retrieval
2. **Immutable Updates**: Never modify existing entities, create new versions
3. **Plugin Data Isolation**: Each plugin stores data under `data[pluginName]`
4. **Validation Failures**: Include source location for error reporting

### Testing Approach

Use `MetaEdTextBuilder` to construct test MetaEd code:
```typescript
MetaEdTextBuilder.build()
  .withBeginNamespace('TestNamespace')
  .withStartDomainEntity('TestEntity')
  .withStringProperty('TestProperty')
  .withEndDomainEntity()
  .sendToListener(builder);
```

### Important Files

- `index.ts` - Main exports (extensive public API)
- `Pipeline.ts` - Pipeline orchestration
- `MetaEdGrammar.g4` - ANTLR grammar definition
- `WalkBuilders.ts` - Builder orchestration logic
- `EntityRepository.ts` - Entity storage/retrieval

### Development Notes

- Grammar changes require running `npm run antlr-gen`
- New entity types need: model class, builder, and tests
- Validators should return descriptive error messages with source locations
- Enhancers must only add data, never mutate existing properties.
- Generators are async and return file content/metadata