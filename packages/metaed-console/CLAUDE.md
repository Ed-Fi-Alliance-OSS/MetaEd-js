# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd Console Package Overview

The `metaed-console` package is a command-line interface (CLI) driver for the MetaEd system, serving as a thin but robust wrapper around `metaed-core`. It translates user input from CLI arguments and JSON configuration files into the `State` object that drives the core pipeline, while providing an excellent user experience with clear error messages and proper exit codes for CI/CD integration.

## CLI Architecture and Design

### Command-Line Interface Design

Built using the `yargs` library providing standard CLI features:
- **Help System** - `-h`, `--help` for comprehensive usage information
- **Version Reporting** - `-v`, `--version` displays package version
- **Configuration-First Approach** - Primary control via configuration file with CLI overrides
- **Mandatory License Gate** - `--accept-license` required before execution

### CLI Options

```bash
metaed-console [options]

Options:
  -c, --config <path>                 Configuration file path (required)
  -a, --accept-license               Accept license terms (required)
  --defaultPluginTechVersion <ver>   Override default plugin tech version
  --suppressPrereleaseVersion        Suppress prerelease version formatting
  -h, --help                         Show help
  -v, --version                      Show version
```

**Design Philosophy:**
- **Minimal CLI Surface** - Keep command-line options simple and focused
- **Configuration File Primary** - Complex configuration lives in JSON file
- **Legal Compliance** - Enforced license acceptance for terms compliance
- **Override Pattern** - CLI flags override configuration file values

## Configuration Loading and Management

### Configuration Hierarchy

Configuration merges from multiple sources in priority order:

1. **Base Defaults** - `newMetaEdConfiguration()` from `metaed-core`
2. **Configuration File** - JSON file specified by `--config`
3. **CLI Overrides** - Command-line flags override file values

### Configuration File Structure

Based on `metaed.json.example`:

```json
{
  "metaEdConfiguration": {
    "artifactDirectory": "/path/to/output",
    "deployDirectory": "/path/to/deploy",
    "pluginTechVersion": {},
    "projects": [
      {
        "namespaceName": "EdFi",
        "projectName": "Ed-Fi",
        "projectVersion": "3.3.1-b",
        "projectExtension": "",
        "description": "The Ed-Fi Data Model 3.3b"
      }
    ],
    "projectPaths": [
      "/path/to/metaed/projects"
    ],
    "pluginConfigDirectories": [],
    "defaultPluginTechVersion": "5.3.0",
    "allianceMode": true,
    "suppressPrereleaseVersion": true
  }
}
```

### Key Configuration Options

**Core Settings:**
- **`artifactDirectory`** - Output directory for generated artifacts
- **`deployDirectory`** - Optional deployment target directory
- **`defaultPluginTechVersion`** - Version string for plugin compatibility
- **`allianceMode`** - Ed-Fi Alliance specific processing mode
- **`suppressPrereleaseVersion`** - Controls version string formatting

**Project Management:**
- **`projects`** - Array of project definitions with namespace and version info
- **`projectPaths`** - File system paths to scan for MetaEd projects
- **`pluginConfigDirectories`** - Additional plugin configuration paths

**Plugin Configuration:**
- **`pluginTechVersion`** - Plugin-specific version overrides
- **`pluginConfigDirectories`** - Custom plugin configuration locations

### Configuration Loading Implementation

```typescript
// Configuration merging with yargs
.config('config', 'Configuration file', (configPath) => {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, configPath), 'utf-8'));
})
```

**Security Considerations:**
- Uses `path.resolve(__dirname, configPath)` which resolves relative paths from script directory
- No explicit JSON schema validation (relies on core validation)
- File reading errors handled by yargs automatically

## Project Discovery and Handling

### Data Standard Detection

Critical architectural constraint: **exactly one data standard project** must be found:

```typescript
const dataStandardVersions = findDataStandardVersions(state.metaEdConfiguration.projects);

if (dataStandardVersions.length === 0) {
  Logger.fatal('No data standard project found');
}
if (dataStandardVersions.length > 1) {
  Logger.fatal('Multiple data standard projects found');
}
```

**Design Rationale:**
- **Unambiguous Context** - Ensures clear base model for extensions
- **Simplified Pipeline** - Eliminates complex multi-standard processing
- **Fail-Fast Validation** - Catches configuration errors early

### Project Structure Requirements

Projects must contain:
- **Namespace Definition** - Unique namespace identifier
- **Version Information** - Semantic version for compatibility
- **Project Metadata** - Name, description, extension type
- **File System Location** - Discoverable via `projectPaths`

## Plugin Loading and Management

### Static Plugin Architecture

**Current Implementation:**
```typescript
metaEdPlugins: defaultPlugins()  // From @edfi/metaed-default-plugins
```

**Characteristics:**
- **Static Loading** - Plugins hardcoded at build time
- **Predictable Environment** - Consistent behavior across installations  
- **No Dynamic Discovery** - Cannot load user-provided plugins
- **Security Benefits** - No risk of malicious plugin injection

### Plugin System Limitations

**Missing Capabilities:**
- Dynamic plugin loading from configuration
- User-provided custom plugins
- Plugin version compatibility checking
- Plugin dependency resolution

**Potential Enhancement:**
```json
{
  "plugins": [
    "@edfi/metaed-default-plugins",
    "my-custom-metaed-generator",
    "./local-plugins/custom-validator"
  ]
}
```

## Pipeline Orchestration and Execution

### State Object Preparation

The console meticulously assembles the `State` object for `metaed-core`:

```typescript
const state = newState({
  metaEdConfiguration: args.metaEdConfiguration,
  dataStandardVersion: dataStandardVersions[0],
  metaEdPlugins: defaultPlugins(),
  pipelineOptions: {
    runValidators: true,
    runEnhancers: true, 
    runGenerators: true,
    stopOnValidationFailure: true,
  },
});
```

### Pipeline Execution

**Single Entry Point:**
```typescript
const pipelineResult = await executePipeline(state);
```

**Execution Characteristics:**
- **All Stages Enabled** - Runs complete validation → enhancement → generation pipeline
- **Fail-Fast Mode** - Stops on first validation failure
- **Hardcoded Options** - No user control over pipeline stages

### Results Processing

```typescript
process.exitCode = pipelineResult.success ? 0 : 1;
```

**CI/CD Integration:**
- Standard exit codes (0 = success, 1 = failure)
- Proper async/await handling
- Exception catching with graceful degradation

## Error Handling and User Experience

### Pre-flight Validation

**Configuration Validation:**
- Data standard project count enforcement
- Required parameter checking via yargs `demandOption`
- Early failure with descriptive error messages

**Error Message Quality:**
```typescript
Logger.fatal(`No data standard project found. Check that your configuration specifies exactly one project with a data standard version.`);
Logger.fatal(`Multiple data standard projects found: ${dataStandardVersions.join(', ')}`);
```

### Exception Handling

```typescript
try {
  const pipelineResult = await executePipeline(state);
  // ... success handling
} catch (error) {
  Logger.error('MetaEd execution failed', error);
  process.exitCode = 1;
}
```

**Robust Error Recovery:**
- Graceful handling of unexpected exceptions
- Proper exit code setting for automation
- Error logging with context

### User Experience Enhancements

**Visual Feedback:**
- Colored terminal output via `chalk`
- Execution timing with start/end timestamps
- "Done in X seconds" completion message

**Debugging Support:**
- Comprehensive help text
- Clear option descriptions
- Example configuration file included

## Performance Considerations

### Lightweight Wrapper Design

**Minimal Overhead:**
- Simple argument parsing and validation
- Direct delegation to core pipeline
- No heavy processing in console layer

**Performance Monitoring:**
```typescript
const startTime = Date.now();
// ... pipeline execution
Logger.info(`Done in ${Date.now() - startTime}ms`);
```

**Async Operations:**
- Proper async/await throughout
- Non-blocking I/O operations
- Event loop friendly execution

## Integration with MetaEd Core

### Clean Separation of Concerns

**Console Responsibilities:**
- CLI argument parsing and validation
- Configuration file loading and merging
- Process exit code management
- User interface and error messaging

**Core Responsibilities:**
- MetaEd DSL parsing and validation
- Plugin execution orchestration
- Artifact generation and output
- Business logic implementation

### API Contract

**State Object Interface:**
```typescript
const state = newState({
  metaEdConfiguration: MetaEdConfiguration,
  dataStandardVersion: string,
  metaEdPlugins: MetaEdPlugin[],
  pipelineOptions: PipelineOptions,
});
```

**Clear Dependencies:**
- Uses only public APIs from `metaed-core`
- Well-defined data contracts
- No internal implementation coupling

## Build Process and Artifact Management

### TypeScript Compilation

**Build Scripts:**
```json
{
  "build": "npm run build:clean && npm run build:dist && npm run build:copy-non-ts",
  "build:clean": "rimraf dist",
  "build:dist": "tsc",
  "build:copy-non-ts": "copyfiles -u 1 \"src/**/*.{json,example*}\" dist"
}
```

**Asset Management:**
- TypeScript compilation to `dist/`
- Non-TS file copying (examples, configs)
- Clean builds with `rimraf`

### Package Distribution

**NPM Package Configuration:**
```json
{
  "files": ["/dist", "LICENSE.md", "package.json"],
  "main": "dist/index.js",
  "bin": {
    "metaed-console": "dist/index.js"
  }
}
```

**Distribution Characteristics:**
- Minimal package size with selective file inclusion
- Executable binary configuration
- Proper main entry point

## Development Patterns

### Adding CLI Options

1. **Define in yargs configuration:**
```typescript
.option('newOption', {
  describe: 'Description of new option',
  type: 'string',
  default: 'defaultValue'
})
```

2. **Handle in configuration merging**
3. **Update help documentation**
4. **Add to TypeScript interfaces**

### Configuration Validation

**Current Pattern:**
- Minimal validation in console
- Delegate to core for comprehensive validation
- Fail-fast on critical misconfigurations

**Enhancement Opportunities:**
- JSON Schema validation at console level
- Earlier, more specific error messages
- Configuration file syntax checking

### Plugin Extension

**Current Limitation:**
- Static plugin loading only
- No user-provided plugin support

**Potential Architecture:**
```typescript
const plugins = await loadPlugins(args.metaEdConfiguration.plugins);
```

## Error Handling Patterns

### Graceful Degradation

```typescript
try {
  const result = await executePipeline(state);
  process.exitCode = result.success ? 0 : 1;
} catch (error) {
  Logger.error('Pipeline execution failed', error);
  process.exitCode = 1;
}
```

### User-Friendly Messages

- Clear, actionable error descriptions
- Context-specific help suggestions
- Proper error categorization (fatal vs warning)

## Security Considerations

### File System Access

- Configuration file reading with path resolution
- No direct write operations (delegated to core)
- Limited to configured directory scope

### Input Validation

- CLI argument validation via yargs
- Configuration structure validation
- No code execution from configuration

### Dependency Management

- Minimal dependency footprint
- Well-maintained libraries (yargs, chalk)
- Regular security audit recommendations

## Architecture Strengths

1. **Clear Separation** - Clean boundary between CLI and core logic
2. **User Experience** - Excellent error handling and feedback
3. **CI/CD Ready** - Proper exit codes and automation support
4. **Configuration Driven** - Flexible project and plugin configuration
5. **Robust Error Handling** - Graceful failure with meaningful messages

## Areas for Enhancement

1. **Dynamic Plugin Loading** - Support for user-provided plugins
2. **Pipeline Stage Control** - Allow selective stage execution
3. **Configuration Validation** - JSON Schema validation at console level
4. **Advanced CLI Features** - Interactive mode, verbose logging options
5. **Configuration Templates** - Built-in project templates and examples

The metaed-console package provides a solid, user-friendly CLI interface that effectively bridges user needs with the powerful metaed-core engine while maintaining clean architectural boundaries.