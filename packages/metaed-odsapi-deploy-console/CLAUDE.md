# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd ODS/API Deploy Console Overview

The `metaed-odsapi-deploy-console` package is a command-line interface (CLI) that provides a user-friendly wrapper around the `metaed-odsapi-deploy` core library. It orchestrates the complete two-stage process of MetaEd artifact generation followed by deployment to Ed-Fi ODS/API source repositories. This console application serves as the primary entry point for developers deploying MetaEd-generated artifacts into their Ed-Fi ODS/API implementations.

## CLI Architecture and Design

### Command-Line Interface Design

**Built with yargs for robust CLI features:**
```typescript
// src/metaed-odsapi-deploy-console.ts
const argv = yargs
  .usage('Usage: $0 [options]')
  .option('metaEdSourceDirectory', {
    alias: 'm',
    describe: 'Path to MetaEd source directory',
    type: 'string',
    demandOption: true
  })
  .option('deployDirectory', {
    alias: 'd', 
    describe: 'Path to Ed-Fi ODS/API repository directory',
    type: 'string',
    demandOption: true
  })
  .option('core', {
    describe: 'Deploy core artifacts in addition to extensions',
    type: 'boolean',
    default: false
  })
  .option('suppressDelete', {
    describe: 'Skip deletion of existing artifacts before deployment',
    type: 'boolean', 
    default: false
  })
  .option('accept-license', {
    alias: 'a',
    describe: 'Accept the Ed-Fi license agreement',
    type: 'boolean',
    demandOption: true
  })
  .help()
  .argv;
```

### Two-Stage Process Orchestration

**Stage 1: MetaEd Artifact Generation**
```typescript
// Generate artifacts using metaed-core
const state = newState({
  metaEdConfiguration: loadConfiguration(argv.metaEdSourceDirectory),
  dataStandardVersion: determineDataStandardVersion(configuration),
  metaEdPlugins: defaultPlugins(),
  pipelineOptions: {
    runValidators: true,
    runEnhancers: true,
    runGenerators: true,
    stopOnValidationFailure: true
  }
});

const pipelineResult = await executePipeline(state);
```

**Stage 2: Artifact Deployment**
```typescript
// Deploy generated artifacts to ODS/API repository
if (pipelineResult.success) {
  const copyOptions: CopyOptions = {
    metaEdSourceDirectory: argv.metaEdSourceDirectory,
    deployDirectory: argv.deployDirectory,
    core: argv.core,
    suppressDelete: argv.suppressDelete,
    acceptLicense: argv.acceptLicense
  };
  
  const deployResults = await runDeployTasks(state.metaEdConfiguration, copyOptions);
}
```

## CLI Options and Configuration

### Core Command-Line Arguments

**Required Arguments:**
- **`-m, --metaEdSourceDirectory`** - Path to directory containing MetaEd project files (.metaed)
- **`-d, --deployDirectory`** - Path to Ed-Fi ODS/API source repository root
- **`-a, --accept-license`** - Legal requirement for Ed-Fi license acceptance

**Optional Flags:**
- **`--core`** - Deploy core Ed-Fi data standard artifacts (default: false)
- **`--suppressDelete`** - Skip cleanup of existing artifacts (default: false)

### Usage Examples

**Extension-Only Deployment (most common):**
```bash
metaed-odsapi-deploy-console \
  --metaEdSourceDirectory /path/to/my-extension \
  --deployDirectory /path/to/Ed-Fi-ODS-Implementation \
  --accept-license
```

**Core + Extension Deployment:**
```bash
metaed-odsapi-deploy-console \
  --metaEdSourceDirectory /path/to/ed-fi-model \
  --deployDirectory /path/to/Ed-Fi-ODS-Implementation \
  --core \
  --accept-license
```

**Incremental Deployment (preserving existing artifacts):**
```bash
metaed-odsapi-deploy-console \
  --metaEdSourceDirectory /path/to/my-extension \
  --deployDirectory /path/to/Ed-Fi-ODS-Implementation \
  --suppressDelete \
  --accept-license
```

## Configuration Discovery and Validation

### MetaEd Configuration Loading

**Configuration File Discovery:**
```typescript
// Automatic discovery of metaed.json configuration
function loadConfiguration(sourceDirectory: string): MetaEdConfiguration {
  const configPath = path.join(sourceDirectory, 'metaed.json');
  
  if (!fs.existsSync(configPath)) {
    throw new Error(`MetaEd configuration file not found: ${configPath}`);
  }
  
  const configContent = fs.readFileSync(configPath, 'utf-8');
  return JSON.parse(configContent);
}
```

**Data Standard Version Detection:**
```typescript
// Extract data standard version from projects
function determineDataStandardVersion(config: MetaEdConfiguration): string {
  const dataStandardProjects = config.projects.filter(p => !p.isExtensionProject);
  
  if (dataStandardProjects.length === 0) {
    throw new Error('No data standard project found in configuration');
  }
  
  if (dataStandardProjects.length > 1) {
    throw new Error('Multiple data standard projects found');
  }
  
  return dataStandardProjects[0].projectVersion;
}
```

### Input Validation and Error Handling

**Path Validation:**
```typescript
function validatePaths(options: CopyOptions): ValidationResult {
  const errors: string[] = [];
  
  // Validate MetaEd source directory
  if (!fs.existsSync(options.metaEdSourceDirectory)) {
    errors.push(`MetaEd source directory not found: ${options.metaEdSourceDirectory}`);
  }
  
  // Validate deploy directory
  if (!fs.existsSync(options.deployDirectory)) {
    errors.push(`Deploy directory not found: ${options.deployDirectory}`);
  }
  
  // Check for metaed.json configuration
  const configPath = path.join(options.metaEdSourceDirectory, 'metaed.json');
  if (!fs.existsSync(configPath)) {
    errors.push(`MetaEd configuration file not found: ${configPath}`);
  }
  
  return { isValid: errors.length === 0, errors };
}
```

**Pre-flight Configuration Checks:**
```typescript
function validateConfiguration(config: MetaEdConfiguration): ValidationResult {
  const errors: string[] = [];
  
  // Ensure exactly one data standard project
  const coreProjects = config.projects.filter(p => !p.isExtensionProject);
  if (coreProjects.length === 0) {
    errors.push('Configuration must contain exactly one data standard project');
  }
  
  // Validate project paths exist
  config.projectPaths.forEach(projectPath => {
    if (!fs.existsSync(projectPath)) {
      errors.push(`Project path not found: ${projectPath}`);
    }
  });
  
  return { isValid: errors.length === 0, errors };
}
```

## Integration with MetaEd Core

### Pipeline Configuration and Execution

**State Object Preparation:**
```typescript
function prepareMetaEdState(
  sourceDirectory: string,
  configuration: MetaEdConfiguration
): State {
  return newState({
    metaEdConfiguration: {
      ...configuration,
      // Override output directory to temporary location for deployment
      artifactDirectory: path.join(sourceDirectory, 'MetaEdOutput')
    },
    dataStandardVersion: determineDataStandardVersion(configuration),
    metaEdPlugins: defaultPlugins(),
    pipelineOptions: {
      runValidators: true,
      runEnhancers: true,
      runGenerators: true,
      stopOnValidationFailure: true
    }
  });
}
```

**Pipeline Result Handling:**
```typescript
async function executeGenerationPipeline(state: State): Promise<PipelineResult> {
  try {
    Logger.info('Starting MetaEd artifact generation...');
    const startTime = Date.now();
    
    const result = await executePipeline(state);
    
    const duration = Date.now() - startTime;
    Logger.info(`Artifact generation completed in ${duration}ms`);
    
    if (!result.success) {
      Logger.error('MetaEd pipeline failed with validation errors:');
      result.validationFailures?.forEach(failure => {
        Logger.error(`  ${failure.elementName}: ${failure.message}`);
      });
    }
    
    return result;
    
  } catch (error) {
    Logger.error('MetaEd pipeline execution failed:', error);
    return { success: false, error };
  }
}
```

## Deployment Integration and Error Handling

### Deployment Task Orchestration

**Deploy Task Execution:**
```typescript
async function executeDeployment(
  configuration: MetaEdConfiguration,
  copyOptions: CopyOptions
): Promise<boolean> {
  
  try {
    Logger.info('Starting artifact deployment...');
    
    const deployResults = await runDeployTasks(configuration, copyOptions);
    
    // Analyze deployment results
    const failedTasks = deployResults.filter(result => !result.success);
    const successfulTasks = deployResults.filter(result => result.success);
    
    Logger.info(`Deployment completed: ${successfulTasks.length} successful, ${failedTasks.length} failed`);
    
    if (failedTasks.length > 0) {
      Logger.error('Deployment failures:');
      failedTasks.forEach(failure => {
        Logger.error(`  ${failure.taskName}: ${failure.message}`);
      });
      return false;
    }
    
    return true;
    
  } catch (error) {
    Logger.error('Deployment execution failed:', error);
    return false;
  }
}
```

### Comprehensive Error Recovery

**Error Categorization and Response:**
```typescript
function handleExecutionError(error: Error, stage: 'generation' | 'deployment'): void {
  if (stage === 'generation') {
    Logger.error('MetaEd artifact generation failed:');
    Logger.error('  Check your MetaEd model files for syntax errors');
    Logger.error('  Verify all referenced entities and properties exist');
    Logger.error('  Review validation failure messages above');
  } else {
    Logger.error('Artifact deployment failed:');
    Logger.error('  Verify deploy directory points to valid Ed-Fi ODS/API repository');
    Logger.error('  Check that extension project directories exist');
    Logger.error('  Ensure sufficient file system permissions');
  }
  
  Logger.error(`\nFull error details: ${error.message}`);
  process.exitCode = 1;
}
```

## User Experience and Feedback

### Progress Reporting and Logging

**Detailed Progress Updates:**
```typescript
function reportProgress(stage: string, detail: string): void {
  const timestamp = new Date().toISOString();
  Logger.info(`[${timestamp}] ${stage}: ${detail}`);
}

// Usage throughout pipeline
reportProgress('GENERATION', 'Loading MetaEd configuration...');
reportProgress('GENERATION', 'Running validation pipeline...');
reportProgress('GENERATION', 'Generating database artifacts...');
reportProgress('DEPLOYMENT', 'Validating target directories...');
reportProgress('DEPLOYMENT', 'Copying core artifacts...');
reportProgress('DEPLOYMENT', 'Refreshing Visual Studio projects...');
```

**Visual Feedback with Colors:**
```typescript
import chalk from 'chalk';

function logSuccess(message: string): void {
  console.log(chalk.green(`✓ ${message}`));
}

function logError(message: string): void {
  console.log(chalk.red(`✗ ${message}`));
}

function logWarning(message: string): void {
  console.log(chalk.yellow(`⚠ ${message}`));
}

function logInfo(message: string): void {
  console.log(chalk.blue(`ℹ ${message}`));
}
```

### Help and Documentation

**Comprehensive Help System:**
```typescript
// Built-in help via yargs
const argv = yargs
  .usage('Deploy MetaEd artifacts to Ed-Fi ODS/API repository')
  .example(
    '$0 -m ./MyExtension -d ./Ed-Fi-ODS-Implementation -a',
    'Deploy extension artifacts'
  )
  .example(
    '$0 -m ./EdFiModel -d ./Ed-Fi-ODS-Implementation --core -a',
    'Deploy core and extension artifacts'
  )
  .epilogue('For more information, visit: https://github.com/Ed-Fi-Alliance/MetaEd-js')
  .help()
  .argv;
```

## Performance Considerations

### Efficient Processing Strategy

**Pipeline Optimization:**
```typescript
// Optimized artifact generation
const pipelineOptions: PipelineOptions = {
  runValidators: true,      // Essential for correctness
  runEnhancers: true,       // Required for artifact generation
  runGenerators: true,      // Generate all necessary artifacts
  stopOnValidationFailure: true,  // Fail fast on validation errors
  parallelGeneration: true  // Enable parallel generator execution
};
```

**Deployment Performance:**
```typescript
// Efficient file operations
const copyOptions: CopyOptions = {
  // ... other options
  useParallelCopy: true,    // Enable parallel file copying
  preserveTimestamps: true, // Maintain file timestamps
  overwrite: true          // Overwrite existing files efficiently
};
```

### Resource Management

**Memory Optimization:**
- Stream large file operations to minimize memory usage
- Clean up temporary artifacts after successful deployment
- Efficient data structure usage throughout pipeline

**Disk Space Management:**
- Remove old artifacts before deploying new ones (unless suppressed)
- Use temporary directories for intermediate artifacts
- Clean up on both success and failure scenarios

## Security and Safety Features

### License Compliance

**Mandatory License Acceptance:**
```typescript
function validateLicenseAcceptance(acceptLicense: boolean): void {
  if (!acceptLicense) {
    Logger.error('Ed-Fi license acceptance is required');
    Logger.error('Use --accept-license flag to acknowledge license terms');
    Logger.error('View license at: https://www.ed-fi.org/getting-started/license-ed-fi-technology/');
    process.exit(1);
  }
}
```

### Path Security

**Safe Path Handling:**
```typescript
function validateAndResolvePaths(
  metaEdSourceDirectory: string,
  deployDirectory: string
): ResolvedPaths {
  
  // Resolve to absolute paths to prevent ambiguity
  const resolvedSource = path.resolve(metaEdSourceDirectory);
  const resolvedDeploy = path.resolve(deployDirectory);
  
  // Validate paths are within expected boundaries
  if (!isValidSourceDirectory(resolvedSource)) {
    throw new Error('Invalid MetaEd source directory');
  }
  
  if (!isValidDeployDirectory(resolvedDeploy)) {
    throw new Error('Invalid deployment directory');
  }
  
  return { source: resolvedSource, deploy: resolvedDeploy };
}
```

## Development and Testing Patterns

### CLI Testing Strategy

**Integration Testing:**
```typescript
// test/integration/console-integration.test.ts
describe('MetaEd Deploy Console Integration', () => {
  it('should successfully deploy extension artifacts', async () => {
    const testArgs = [
      '--metaEdSourceDirectory', './test/fixtures/sample-extension',
      '--deployDirectory', './test/fixtures/sample-ods-repo',
      '--accept-license'
    ];
    
    const result = await executeConsole(testArgs);
    
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('Deployment completed successfully');
  });
});
```

**Error Scenario Testing:**
```typescript
describe('Error Handling', () => {
  it('should fail gracefully with missing configuration', async () => {
    const testArgs = [
      '--metaEdSourceDirectory', './test/fixtures/no-config',
      '--deployDirectory', './test/fixtures/sample-ods-repo',
      '--accept-license'
    ];
    
    const result = await executeConsole(testArgs);
    
    expect(result.exitCode).toBe(1);
    expect(result.stderr).toContain('MetaEd configuration file not found');
  });
});
```

### Development Workflow

**Local Development Setup:**
```bash
# Build and test console application
npm run build
npm test

# Test with sample data
npm run test:integration

# Manual testing with realistic data
./dist/index.js \
  --metaEdSourceDirectory ../sample-extension \
  --deployDirectory ../Ed-Fi-ODS-Implementation \
  --accept-license
```

## Architecture Strengths

1. **Clean CLI Design** - Well-structured command-line interface with comprehensive help
2. **Two-Stage Process** - Clear separation between generation and deployment
3. **Robust Validation** - Multiple layers of input and configuration validation
4. **Excellent Error Handling** - Detailed error messages with actionable guidance
5. **User Experience Focus** - Progress reporting, colored output, and helpful feedback
6. **License Compliance** - Built-in legal compliance with mandatory license acceptance
7. **Integration Testing** - Comprehensive testing with realistic scenarios

## Areas for Enhancement

1. **Interactive Mode** - Guided prompts for configuration options
2. **Configuration Templates** - Pre-built templates for common deployment scenarios
3. **Rollback Capability** - Ability to undo deployments in case of issues
4. **Batch Operations** - Support for deploying multiple extensions simultaneously
5. **Configuration Validation** - More sophisticated validation of MetaEd configurations
6. **Performance Monitoring** - Built-in timing and performance metrics reporting

This console application provides an excellent user interface for the MetaEd deployment process, combining robust error handling, clear feedback, and comprehensive validation to create a reliable and user-friendly deployment automation tool.