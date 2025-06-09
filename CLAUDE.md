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

This is a **Lerna monorepo** for MetaEd, a domain-specific language (DSL) for data modeling in the Ed-Fi ecosystem. The codebase transforms `.metaed` files into various output artifacts (SQL, XSD, API specs).

### Core Processing Pipeline

The system follows a sequential pipeline pattern:
1. **Initialize** → 2. **Load** → 3. **Parse** → 4. **Build** → 5. **Validate** → 6. **Enhance** → 7. **Generate** → 8. **Write**

### Key Packages

- **metaed-core**: Core pipeline, builders, validators, enhancers, and generators
- **metaed-console**: CLI for building MetaEd projects
- **metaed-plugin-edfi-***: Output format plugins (unified, ods-deploy, etc.)
- **metaed-plugin-edfi-unified**: Core validators and model enhancers

### Important Architectural Patterns

1. **Plugin System**: Plugins export an `initialize` function and can provide validators, enhancers, and generators. Plugins are dependent on other plugins. Plugins maintain ownership of their own data by adding data to the "data" field on a model object. This is grouped by plugin, for example the metaed-plugin-edfi-api-schema plugin puts its data under "data.edfiApiSchema"
2. **Model Representation**: Domain models are plain JavaScript objects (not classes)
3. **Enhancers**: Enhancers enrich data in the model. Enhancers only add data, they MUST NEVER mutate data from enhancers in a different plugin. Each enhancer works on a single aspect of the model, and builds upon the work of previously run enhancers.
4. **Validators**: Validators check the validity of model data and model relationships, and report validation errors in a human-readable format.
5. **Generators**: Generators create and output various artifacts like SQL scripts, API specifications, documentation.
6. **Builder Pattern**: Only Builders can be classes; everything else should be JavaScript modules with functions
7. **Immutability**: Prefer immutable data patterns, never modify existing data, create derived data from existing data and place under the "data" field for your plugin.

### TypeScript Configuration

- Target: ES2017, Module: CommonJS
- Strict null checks enabled
- Path mapping: `~/*` → `packages/*`
- Source maps enabled for debugging

### Testing Approach

- Jest with ts-jest for TypeScript support
- Tests serve as documentation
- Coverage thresholds at 10% minimum
- CI-specific configuration available via `jest.ci-config.js`