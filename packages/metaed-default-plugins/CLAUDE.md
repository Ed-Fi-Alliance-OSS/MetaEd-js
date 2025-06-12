# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Default Plugins Package Overview

The `metaed-default-plugins` package is an **Aggregator/Façade** package that serves as the central distribution mechanism for the standard MetaEd plugin suite. It bundles 17 core Ed-Fi plugins into a single dependency, providing a "batteries-included" setup for standard MetaEd implementations. This package contains no business logic itself; it imports, initializes, and exports the default plugins required for complete Ed-Fi ODS/API generation.

## Aggregator Architecture Pattern

### Core Design Philosophy

**Single Dependency Simplification:**
- Consumers install one package instead of managing 17 separate plugin dependencies
- Provides complete Ed-Fi data standard processing capabilities out-of-the-box
- Eliminates the complexity of plugin discovery and compatibility management

**Façade Pattern Implementation:**
```typescript
// Main API contract
export function defaultPlugins(): MetaEdPlugin[] {
  // Returns complete plugin suite in correct dependency order
}
```

### Package Structure

```
metaed-default-plugins/
├── src/index.ts           // Main aggregator logic
├── index.ts              // Package entry point
└── package.json          // Dependencies and configuration
```

**Minimal Implementation Strategy:**
- Single source file with straightforward plugin aggregation
- No configuration files or complex initialization
- Clean separation between package entry point and implementation

## Plugin Loading and Initialization

### Static Plugin Loading Strategy

**Dependency-First Loading:**
```typescript
// All plugins imported statically at compile time
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';
import { initialize as edfiOdsRelational } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as edfiApiSchema } from '@edfi/metaed-plugin-edfi-api-schema';
// ... 13 more plugins
```

**Factory Pattern with Memoization:**
```typescript
let cachedPlugins: MetaEdPlugin[] = [];

export function defaultPlugins(): MetaEdPlugin[] {
  if (cachedPlugins.length > 0) return cachedPlugins; // Return cached on subsequent calls
  
  // Initialize all plugins on first call
  cachedPlugins = [
    edfiUnified(),
    edfiUnifiedAdvanced(),
    edfiOdsRelational(),
    edfiApiSchema(),
    // ... remaining plugins in dependency order
  ];
  
  return cachedPlugins;
}
```

**Performance Optimizations:**
- **Lazy Initialization** - Plugins only initialized when `defaultPlugins()` is first called
- **Memoization** - Subsequent calls return cached plugin array immediately
- **Static Analysis** - No runtime plugin discovery eliminates startup overhead

### Plugin Dependency Management

**Critical Dependency Ordering:**
```typescript
// Must maintain strict initialization order for plugin dependencies
const pluginOrder = [
  'edfiUnified',           // Foundation - reference resolution, validation
  'edfiUnifiedAdvanced',   // Advanced processing on unified model
  'edfiOdsRelational',     // Abstract database model generation
  'edfiApiSchema',         // API schema generation
  'edfiOdsSqlserver',      // SQL Server specific database generation
  'edfiOdsPostgresql',     // PostgreSQL specific database generation
  'edfiChangeQueryX',      // Change query plugins
  'edfiRecordOwnershipX',  // Record ownership plugins
  'edfiHandbook',          // Documentation generation
  'edfiXmlDictionary',     // XML dictionary generation
  'edfiXsd'                // XSD schema generation
];
```

**Dependency Chain Architecture:**
```
edfiUnified (foundation)
  ↓
edfiUnifiedAdvanced (advanced processing)  
  ↓
edfiOdsRelational (abstract database model)
  ↓
edfiApiSchema (API schemas) + edfiOdsSqlserver + edfiOdsPostgresql (concrete DB implementations)
  ↓
Specialized plugins (change query, record ownership, documentation, etc.)
```

**Manual Dependency Resolution:**
- **Implicit Dependencies** - Plugin order hardcoded based on knowledge of plugin relationships
- **No Automatic Resolution** - Simpler than dynamic dependency graphs for this controlled scenario
- **Comment Documentation** - Code comments indicate critical ordering requirements

## Complete Plugin Suite Composition

### Core Processing Plugins

**Foundation Layer:**
- **`edfiUnified`** - Reference resolution, validation, relationship building
- **`edfiUnifiedAdvanced`** - Advanced model enhancement and preparation

**Model Transformation Layer:**
- **`edfiOdsRelational`** - Abstract relational database model generation
- **`edfiApiSchema`** - JSON Schema and OpenAPI specification generation

### Database Implementation Plugins

**SQL Server Support:**
- **`edfiOdsSqlserver`** - SQL Server DDL, stored procedures, and deployment scripts
- **`edfiChangeQuerySqlserver`** - SQL Server change query infrastructure
- **`edfiRecordOwnershipSqlserver`** - SQL Server record ownership implementation

**PostgreSQL Support:**
- **`edfiOdsPostgresql`** - PostgreSQL DDL, functions, and deployment scripts  
- **`edfiChangeQueryPostgresql`** - PostgreSQL change query infrastructure
- **`edfiRecordOwnershipPostgresql`** - PostgreSQL record ownership implementation

**Shared Change Query Foundation:**
- **`edfiChangeQuery`** - Database-agnostic change query model and logic

**Shared Record Ownership Foundation:**
- **`edfiRecordOwnership`** - Database-agnostic record ownership model

### API and Deployment Support

**API Generation:**
- **`edfiOdsapi`** - ODS/API application configuration and setup

**Documentation and Schemas:**
- **`edfiHandbook`** - Data handbook generation (HTML and Excel formats)
- **`edfiXmlDictionary`** - XML data dictionary generation
- **`edfiXsd`** - XML Schema (XSD) generation
- **`edfiSqlDictionary`** - SQL data dictionary generation

## Dependency Version Management

### Lockstep Versioning Strategy

**Monorepo Coordination:**
```json
{
  "dependencies": {
    "@edfi/metaed-plugin-edfi-unified": "4.5.2-dev.55",
    "@edfi/metaed-plugin-edfi-unified-advanced": "4.5.2-dev.55",
    "@edfi/metaed-plugin-edfi-ods-relational": "4.5.2-dev.55",
    "@edfi/metaed-plugin-edfi-api-schema": "4.5.2-dev.55"
    // All plugins pinned to exact same version
  }
}
```

**Benefits of Exact Version Pinning:**
- **Guaranteed Compatibility** - All plugins developed and tested together
- **Consistent Behavior** - Eliminates version mismatch issues across environments
- **Simplified Testing** - Known plugin combination validated as a unit
- **Controlled Releases** - Ed-Fi Alliance controls entire plugin suite versioning

**Monorepo Build Integration:**
- **Lerna/Nx Coordination** - Likely uses monorepo tooling for coordinated releases
- **Shared Build Pipeline** - All plugins built and tested together
- **Version Synchronization** - Single version bump updates entire suite

## Plugin System Integration

### Standard Plugin Interface Contract

**Each Plugin Must Export:**
```typescript
// Standard plugin factory function
export function initialize(): MetaEdPlugin {
  return {
    validator: validatorList(),   // Array of validation functions
    enhancer: enhancerList(),     // Array of enhancement functions  
    generator: generatorList(),   // Array of generation functions
    shortName: 'pluginName'      // Unique identifier for data namespacing
  };
}
```

**Plugin Lifecycle Integration:**
```typescript
// How plugins integrate into core pipeline
const plugins = defaultPlugins();

// Core pipeline execution:
// 1. Run all plugin validators
plugins.forEach(plugin => plugin.validator.forEach(validate));

// 2. Run all plugin enhancers in plugin order
plugins.forEach(plugin => plugin.enhancer.forEach(enhance));

// 3. Run all plugin generators
plugins.forEach(plugin => plugin.generator.forEach(generate));
```

### Data Isolation and Namespacing

**Plugin Data Separation:**
```typescript
// Each plugin stores data under its own namespace
entity.data[plugin.shortName] = pluginSpecificData;

// Examples:
entity.data.edfiUnified = { /* reference resolution data */ };
entity.data.edfiOdsRelational = { /* database table data */ };
entity.data.edfiApiSchema = { /* API schema data */ };
```

**Benefits of Namespacing:**
- **No Data Conflicts** - Plugins cannot overwrite each other's data
- **Clear Ownership** - Easy to identify which plugin owns specific data
- **Debugging Support** - Simplified troubleshooting by plugin boundary
- **Plugin Independence** - Plugins can evolve data structures independently

## Consumer Usage Patterns

### Standard Integration

**Most Common Usage:**
```typescript
// metaed-console and similar tools
import { defaultPlugins } from '@edfi/metaed-default-plugins';
import { executePipeline, newState } from '@edfi/metaed-core';

const state = newState({
  metaEdConfiguration: config,
  dataStandardVersion: version,
  metaEdPlugins: defaultPlugins(), // Complete plugin suite
  pipelineOptions: options
});

await executePipeline(state);
```

**Benefits for Consumers:**
- **One Dependency** - Single `npm install` for complete functionality
- **No Plugin Management** - No need to research, select, or configure individual plugins
- **Guaranteed Compatibility** - Pre-tested plugin combination
- **Standard Setup** - Consistent across projects and teams

### Custom Plugin Extensions

**Extending Default Plugins:**
```typescript
// For users who need custom plugins in addition to defaults
import { defaultPlugins } from '@edfi/metaed-default-plugins';
import { customPlugin } from './my-custom-plugin';

const allPlugins = [
  ...defaultPlugins(),
  customPlugin()
];
```

**Selective Plugin Usage:**
```typescript
// Advanced users can import specific plugins if needed
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiApiSchema } from '@edfi/metaed-plugin-edfi-api-schema';

const minimalPlugins = [edfiUnified(), edfiApiSchema()];
```

## Security and Supply Chain Considerations

### Security Posture

**Supply Chain Risk Management:**
- **17 Plugin Dependencies** - Security exposure multiplied by dependency count
- **Exact Version Pinning** - Prevents unexpected dependency updates
- **Ed-Fi Alliance Control** - Trusted source for all included plugins
- **Monorepo Benefits** - All plugins under same security governance

**Security Best Practices:**
```bash
# Regular security auditing
npm audit
# or
yarn audit

# Automated vulnerability scanning in CI/CD
npm audit --audit-level high
```

**Vulnerability Response:**
- **Coordinated Updates** - Single plugin vulnerability requires entire suite update
- **Rapid Response** - Monorepo enables quick security patches across all plugins
- **Version Transparency** - Clear tracking of which plugin versions are included

### Build and Distribution Security

**Package Integrity:**
- **Signed Packages** - NPM package signing for authenticity verification
- **Build Reproducibility** - Consistent builds from source control
- **Minimal Package Size** - Only essential files included in distribution

**Dependency Trust:**
- **Internal Dependencies Only** - All plugins controlled by Ed-Fi Alliance
- **No Third-Party Plugin Dependencies** - Reduces external security surface
- **Controlled Release Process** - Coordinated testing and validation

## Development and Maintenance Patterns

### Adding New Default Plugins

1. **Create New Plugin Package** - Follow standard plugin architecture
2. **Add to package.json** - Include as dependency with exact version
3. **Import in src/index.ts** - Add import statement for initialize function
4. **Insert in Correct Order** - Place in dependency-appropriate position in array
5. **Update Documentation** - Document any new dependencies or requirements

### Removing Plugins

1. **Assess Impact** - Determine if other plugins depend on the plugin being removed
2. **Update Consumer Documentation** - Notify users of breaking changes
3. **Remove from Array** - Remove initialization call from defaultPlugins()
4. **Remove Import** - Clean up import statement
5. **Update package.json** - Remove dependency entry

### Plugin Order Maintenance

**Critical Guidelines:**
- **Foundation First** - `edfiUnified` and `edfiUnifiedAdvanced` must be first
- **Abstract Before Concrete** - `edfiOdsRelational` before database-specific plugins
- **Dependencies Before Dependents** - Ensure plugins run after their dependencies
- **Test Order Changes** - Run full integration tests when modifying order

## Architecture Strengths

1. **Simplified Distribution** - Single package provides complete Ed-Fi functionality
2. **Version Consistency** - Lockstep versioning eliminates compatibility issues
3. **Controlled Environment** - Curated plugin set with known compatibility
4. **Performance Optimization** - Memoization and static loading for efficiency
5. **Clear Dependency Management** - Explicit ordering with documented reasoning
6. **Minimal Complexity** - Simple aggregation without unnecessary abstraction
7. **Security Benefits** - Controlled supply chain with trusted dependencies

## Areas for Enhancement

1. **Dynamic Dependency Resolution** - Automatic plugin ordering based on declared dependencies
2. **Plugin Configuration** - Allow configuration of individual plugins through aggregator
3. **Selective Plugin Loading** - Enable consumers to exclude specific plugins
4. **Plugin Metadata** - Richer plugin information and capability discovery
5. **Documentation Integration** - Automated documentation generation for included plugins

This package exemplifies excellent architecture for a plugin aggregation system, providing the perfect balance of simplicity, performance, and maintainability while serving as the foundation for the entire MetaEd ecosystem.