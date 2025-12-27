## Essential Commands

**NEVER** run `npm run build`, it transpiles which is only needed for package publishing.

**Build & Development:**
- `npx eslint --max-warnings 0 --ext .js,.ts <directory>` - Run ESLint check on a directory
- `npx tsc -p <directory> --noEmit` - Run TypeScript check on a directory
- `npm run metaed:build` - Build MetaEd artifacts
- `npm run antlr-gen` - Generate ANTLR grammar files
- `npm run test:lint` - Run TypeScript and ESLint checks on entire repository

- Fix formatting issues from ESLint: `npx prettier --write <files>`

**Running Single Tests:**
- `npx jest path/to/test.ts` - Run a specific test file
- `npx jest -t "test name"` - Run tests matching a pattern

## Code Style and Standards

Follow the coding standards enforced these tools:
  - ESLint with Airbnb presets
  - Prettier
  - EditorConfig

## Lint

ALWAYS use directory-level `eslint` and `tsc` when working in a single package/plugin directory

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
2. **Model Representation**: Domain models are plain JavaScript objects (not classes). DomainEntity and Association model objects are almost identical, the only difference is that Association objects require two references. Consider that typically any operation on a DomainEntity, DomainEntitySubclass or DomainEntityExtension will also apply to an Association, AssociationSubclass or AssociationExtension respectively.
3. **Enhancers**: Enhancers enrich data in the model. Enhancers only add data, they MUST NEVER mutate data from enhancers in a different plugin. Each enhancer works on a single aspect of the model, and builds upon the work of previously run enhancers.
4. **Validators**: Validators check the validity of model data and model relationships, and report validation errors in a human-readable format.
5. **Generators**: Generators create and output various artifacts like SQL scripts, API specifications, documentation.
6. **Builder Pattern**: Only Builders can be classes; everything else should be JavaScript modules with functions
7. **Immutability**: Prefer immutable data patterns, never modify existing data, create derived data from existing data and place under the "data" field for your plugin.
8. **Semantic data**: Remember that in MetaEd we only ever use data that we have derived semantically. We do this iteratively using enhancers that enrich data from that which was previously created. We avoid doing string splitting to determine semantics.

### TypeScript Configuration

- Target: ES2017, Module: CommonJS
- Strict null checks enabled
- Path mapping: `~/*` → `packages/*`
- Source maps enabled for debugging

### Testing Approach

- Jest with ts-jest for TypeScript support
- Tests serve as documentation
- Plugin authoritative tests run the entire plugin against MetaEd projects for data standards and extensions. The plugin generated artifact is compared against a known good artifact for a MetaEd project. The tests will break when a new feature is added to the plugin. This allows us to review and confirm a plugin change is correct across a wide variety of modelling patterns. When a test fails, refer to the diffs. Match with the MetaEd projects configured for the test and use to confirm patterns are correct for the new feature. Many subtle bugs are caught this way.

## Important
- Prefer simplifying logic by creating multiple enhancers, where upstream enhancers create intermediate objects. This is a pattern used throughout the codebase where the "data" field of an object is the place for an enhancer to add new data.
- Treat all existing objects from other enhancers as immutable, meaning always create new objects based on other data, never modifying
data an enhancer did not create.
- Never use the null suppression operator in source code
- Model naming is deceptively complex with dozens of edge cases. Never try to infer information from a string representation instead of using model data. NEVER USE STRING COMPARISONS OR STRING MANIPULATION AS PART OF YOUR SOLUTION WHEN MODEL DATA IS AVAILABLE!

## Coding Standards
- ALWAYS use type-annotations in code. NEVER use the type 'any'
- Always include summary JSDoc comments at the type and function level
- When dealing with strings, use the branded type pattern when you can assign semantic meaning. See 'packages/metaed-plugin-edfi-api-schema/src/model/api-schema/JsonPath.ts' and 'packages/metaed-plugin-edfi-api-schema/src/model/api-schema/EndpointName.ts' as examples. Branded types are still the base type. For example, there is no need to do toString() on a branded string type. It's already a string.
- Don't encapsulate casts of branded types into their own function.
- Strongly prefer 'type' over 'interface'
- Do not use TypeScript-only syntax like 'readonly' or 'enum'. Use string literal types for enumerations.
- Do not use classes unless there is no other reasonable way to implement a concept e.g. fluent interfaces.
- Do not create 'options'-style types as a single function parameter. Use branded types instead to distinguish multiple parameters.
- Types should almost never be nullable. Use null objects following the newXYZ() factory pattern, for example newTopLevelEntity() and the frozen NoTopLevelEntity singleton in packages/metaed-core/src/model/TopLevelEntity.ts
- Prefer simple object literal declarations over factory functions. Use the spread operator on a newXYZ() object to simplify creation with defaults, again like in newTopLevelEntity() 
- As a corollary, parameters should almost never have null or undefined as a option. 
- MetaEd runs continuously in an IDE environment. Crashes are devastating to the user experience. Exceptions should almost never be thrown.
- Do not create barrel files except at the root of a package
- For unit testing, strongly prefer using the Jest toMatchInlineSnapshot() matcher to test a full object rather than testing individual properties.


