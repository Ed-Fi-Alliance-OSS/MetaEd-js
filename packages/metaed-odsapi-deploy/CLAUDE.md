# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MetaEd ODS/API Deploy Package Overview

The `metaed-odsapi-deploy` package is a deployment automation library that handles the integration of MetaEd-generated artifacts into Ed-Fi ODS/API source code repositories. It orchestrates the complex process of copying generated database scripts, API metadata, and other artifacts into the correct locations within the ODS/API solution structure. This package works in tandem with `metaed-odsapi-deploy-console` to provide a complete deployment automation solution.

## Deployment Architecture and Task Orchestration

### Core Deployment Philosophy

**Two-Stage Process:**
```
Stage 1: MetaEd Artifact Generation
  MetaEd DSL Files → metaed-core pipeline → Generated Artifacts

Stage 2: Artifact Deployment  
  Generated Artifacts → Deploy Tasks → ODS/API Source Integration
```

**Task Runner Pattern:**
The deployment uses a sequential task execution model with pre-flight checks, cleanup, deployment, and post-deployment actions.

### Task Execution Pipeline

**Sequential Task Chain:**
```typescript
// src/RunDeployTasks.ts - Core orchestration
export async function runDeployTasks(
  metaEdConfiguration: MetaEdConfiguration,
  copyOptions: CopyOptions
): Promise<DeployResult[]> {
  
  const tasks = [
    // Pre-flight validation
    extensionProjectsExistsTask,
    
    // Cleanup (unless suppressed)
    removeExtensionArtifactsTask,
    removeExtensionArtifactsV2andV3Task,
    
    // Core deployment (if --core specified)
    deployCoreTask,
    deployCoreV6Task,
    
    // Extension deployment (default behavior)
    deployExtensionTask,
    deployExtensionV6Task,
    
    // Post-deployment actions
    refreshProjectTask,
    legacyDirectoryExistsTask
  ];
  
  return executeTasksSequentially(tasks, metaEdConfiguration, copyOptions);
}
```

### Version-Aware Task Execution

**Strategy Pattern for Version Compatibility:**
```typescript
// Version-specific task gating
function shouldExecuteTask(
  taskVersion: string,
  targetVersion: string
): boolean {
  return versionSatisfies(targetVersion, taskVersion);
}

// Example from DeployCoreV6.ts
if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=5.4.0 <7.0.0')) {
  return { success: true, message: 'Skipped - version not applicable' };
}

// Example from DeployCore.ts  
if (!versionSatisfies(metaEdConfiguration.defaultPluginTechVersion, '>=7.0.0')) {
  return { success: true, message: 'Skipped - version not applicable' };
}
```

## Ed-Fi ODS/API Deployment Scenarios

### Core vs Extension Deployment

**Core Deployment (--core flag):**
- Deploys base Ed-Fi data standard artifacts
- Targets `EdFi.Ods.Standard` project in ODS/API solution
- Includes database schemas, API metadata, and validation artifacts
- Required for fresh ODS/API installations

**Extension Deployment (default behavior):**
- Deploys custom extension artifacts on top of core
- Targets `EdFi.Ods.Extensions.{ExtensionName}` projects
- Includes extension-specific database scripts and API components
- Most common deployment scenario for implementers

**Combined Deployment:**
- Deploys both core and extension artifacts in single operation
- Ensures version consistency between core and extensions
- Useful for complete environment setup

### Deployment Target Structure

**ODS/API v5.4-v6.x Directory Structure:**
```
Ed-Fi-ODS/
└── Application/
    └── EdFi.Ods.Standard/
        └── Artifacts/
            ├── MsSql/
            ├── PgSql/
            ├── Metadata/
            └── Schemas/

Ed-Fi-ODS-Implementation/
└── Application/
    └── EdFi.Ods.Extensions.{ProjectName}/
        └── Artifacts/
            ├── MsSql/
            ├── PgSql/
            └── Metadata/
```

**ODS/API v7.0+ Directory Structure:**
```
Ed-Fi-ODS/
└── Application/
    └── EdFi.Ods.Standard/
        └── Standard/
            └── {DataStandardVersion}/
                └── Artifacts/

Ed-Fi-ODS-Implementation/
└── Application/
    └── EdFi.Ods.Extensions.{ProjectName}/
        └── Versions/
            └── {ProjectVersion}/
                └── Standard/
                    └── {DataStandardVersion}/
                        └── Artifacts/
```

## Deployment Task Details

### Pre-flight Validation Tasks

**Extension Projects Existence Check:**
```typescript
// ExtensionProjectsExists.ts
export function task(
  metaEdConfiguration: MetaEdConfiguration,
  copyOptions: CopyOptions
): DeployResult {
  
  metaEdConfiguration.projects
    .filter(project => project.isExtensionProject)
    .forEach(extensionProject => {
      const projectPath = path.join(
        copyOptions.deployDirectory,
        'Application',
        `EdFi.Ods.Extensions.${extensionProject.projectName}`
      );
      
      if (!fs.existsSync(projectPath)) {
        return {
          success: false,
          message: `Extension project directory not found: ${projectPath}`
        };
      }
    });
    
  return { success: true };
}
```

**Benefits of Pre-flight Checks:**
- Prevents partial deployments that would fail midway
- Provides clear error messages for missing prerequisites
- Ensures target ODS/API solution is properly prepared

### Cleanup and Artifact Removal

**Legacy Artifact Cleanup:**
```typescript
// RemoveExtensionArtifacts.ts
export function task(
  metaEdConfiguration: MetaEdConfiguration,
  copyOptions: CopyOptions
): DeployResult {
  
  if (copyOptions.suppressDelete) {
    return { success: true, message: 'Delete suppressed by user option' };
  }
  
  // Remove all existing artifacts to prevent stale files
  extensionProjects.forEach(project => {
    const artifactsPath = buildArtifactsPath(project, copyOptions);
    
    if (fs.existsSync(artifactsPath)) {
      fs.removeSync(artifactsPath);
      Logger.info(`Cleaned artifacts directory: ${artifactsPath}`);
    }
  });
  
  return { success: true };
}
```

**Clean Slate Deployment Strategy:**
- Default behavior removes all existing artifacts before deployment
- Prevents stale files from previous deployments
- Ensures consistent state after deployment
- Can be suppressed with `--suppressDelete` for incremental scenarios

### Core and Extension Deployment Tasks

**Version-Specific Path Resolution:**
```typescript
// DeployCore.ts (v7.0+)
function buildCoreArtifactsPath(
  metaEdConfiguration: MetaEdConfiguration,
  copyOptions: CopyOptions
): string {
  const dataStandardVersion = metaEdConfiguration.dataStandardVersion;
  
  return path.join(
    copyOptions.deployDirectory,
    'Application',
    'EdFi.Ods.Standard',
    'Standard',
    dataStandardVersion,
    'Artifacts'
  );
}

// DeployCoreV6.ts (v5.4-v6.x)
function buildCoreArtifactsPathV6(copyOptions: CopyOptions): string {
  return path.join(
    copyOptions.deployDirectory,
    'Application',
    'EdFi.Ods.Standard',
    'Artifacts'
  );
}
```

**Artifact Copying Strategy:**
```typescript
// File copying with error handling
function copyArtifacts(
  sourcePath: string,
  targetPath: string
): DeployResult {
  try {
    // Ensure target directory exists
    fs.ensureDirSync(targetPath);
    
    // Copy all artifacts recursively
    fs.copySync(sourcePath, targetPath, {
      overwrite: true,
      recursive: true
    });
    
    Logger.info(`Deployed artifacts: ${sourcePath} → ${targetPath}`);
    return { success: true };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to copy artifacts: ${error.message}`
    };
  }
}
```

### Post-Deployment Actions

**Project Refresh for MSBuild Integration:**
```typescript
// RefreshProject.ts
export function task(
  metaEdConfiguration: MetaEdConfiguration,
  copyOptions: CopyOptions
): DeployResult {
  
  extensionProjects.forEach(project => {
    const projectFilePath = path.join(
      copyOptions.deployDirectory,
      'Application',
      `EdFi.Ods.Extensions.${project.projectName}`,
      `EdFi.Ods.Extensions.${project.projectName}.csproj`
    );
    
    // "Touch" the project file to trigger MSBuild reload
    if (fs.existsSync(projectFilePath)) {
      const currentTime = new Date();
      fs.utimesSync(projectFilePath, currentTime, currentTime);
      Logger.info(`Refreshed project file: ${projectFilePath}`);
    }
  });
  
  return { success: true };
}
```

**Benefits of Project Refresh:**
- Forces Visual Studio and MSBuild to recognize new artifacts
- Ensures proper inclusion in compilation and packaging
- Simplifies developer workflow by eliminating manual project reload

## Version Management and Legacy Support

### Multi-Version Compatibility Strategy

**Version Range Targeting:**
```typescript
// Version-specific task execution
const versionStrategies = {
  'v5.4-v6.x': {
    coreTask: 'deployCoreV6Task',
    extensionTask: 'deployExtensionV6Task',
    versionCheck: '>=5.4.0 <7.0.0',
    pathStrategy: 'legacy'
  },
  'v7.0+': {
    coreTask: 'deployCoreTask', 
    extensionTask: 'deployExtensionTask',
    versionCheck: '>=7.0.0',
    pathStrategy: 'versioned'
  }
};
```

**Legacy Directory Migration:**
```typescript
// LegacyDirectoryExists.ts
export function task(
  metaEdConfiguration: MetaEdConfiguration,
  copyOptions: CopyOptions
): DeployResult {
  
  // Check for outdated SupportingArtifacts directories
  const legacyPath = path.join(
    copyOptions.deployDirectory,
    'Application',
    'EdFi.Ods.Extensions.*',
    'SupportingArtifacts'
  );
  
  if (fs.existsSync(legacyPath)) {
    return {
      success: true,
      message: `Warning: Legacy SupportingArtifacts directory found. Please migrate to Artifacts structure.`
    };
  }
  
  return { success: true };
}
```

### Evolution Management Benefits

**Clean Version Transitions:**
- New ODS/API versions get dedicated task implementations
- Legacy versions continue to work without modification
- Clear migration paths with helpful warnings
- Isolated version-specific logic prevents cross-contamination

**Future Extensibility:**
- Easy to add support for future ODS/API versions
- Version detection enables automatic behavior adaptation
- Minimal impact on existing deployments when adding new versions

## Configuration and Options Management

### CopyOptions Interface

**Deployment Configuration:**
```typescript
// src/CopyOptions.ts
interface CopyOptions {
  metaEdSourceDirectory: string;    // Source MetaEd project directory
  deployDirectory: string;         // Target ODS/API repository directory
  suppressDelete: boolean;         // Skip artifact cleanup
  core: boolean;                   // Deploy core artifacts
  acceptLicense: boolean;          // License acceptance flag
}
```

**Option Validation and Defaults:**
```typescript
function validateCopyOptions(options: CopyOptions): ValidationResult {
  const errors: string[] = [];
  
  if (!fs.existsSync(options.metaEdSourceDirectory)) {
    errors.push(`MetaEd source directory not found: ${options.metaEdSourceDirectory}`);
  }
  
  if (!fs.existsSync(options.deployDirectory)) {
    errors.push(`Deploy directory not found: ${options.deployDirectory}`);
  }
  
  if (!options.acceptLicense) {
    errors.push('License acceptance required (--accept-license)');
  }
  
  return { isValid: errors.length === 0, errors };
}
```

## Error Handling and Recovery

### Robust Error Management

**Task-Level Error Isolation:**
```typescript
// Individual task error handling
function executeTask(task: DeployTask): DeployResult {
  try {
    return task.execute();
  } catch (error) {
    return {
      success: false,
      message: `Task failed: ${task.name} - ${error.message}`,
      error: error
    };
  }
}

// Pipeline error aggregation
function executeTaskPipeline(tasks: DeployTask[]): DeployResult[] {
  const results: DeployResult[] = [];
  
  for (const task of tasks) {
    const result = executeTask(task);
    results.push(result);
    
    // Stop on first failure unless task is marked as non-critical
    if (!result.success && task.critical !== false) {
      break;
    }
  }
  
  return results;
}
```

**Recovery and Rollback Considerations:**
- Clean artifact removal enables easy retry after fixing issues
- Pre-flight validation catches most problems before any changes
- Atomic task design minimizes partial deployment scenarios
- Clear error messages guide users toward resolution

## Performance and Efficiency

### Optimized File Operations

**Efficient Copying Strategy:**
```typescript
// Bulk file operations for performance
function copyArtifactsEfficiently(
  source: string,
  target: string
): DeployResult {
  
  // Use fs-extra for optimized copying
  fs.copySync(source, target, {
    overwrite: true,
    errorOnExist: false,
    recursive: true,
    preserveTimestamps: true
  });
  
  return { success: true };
}
```

**Parallel Task Execution Potential:**
- Current implementation uses sequential execution for safety
- Independent tasks could be parallelized for better performance
- File I/O operations are the primary bottleneck

### Resource Management

**Memory Efficiency:**
- Streaming file operations where possible
- Minimal memory footprint for large artifact sets
- No unnecessary file buffering during copy operations

**Disk Space Optimization:**
- Clean removal of old artifacts prevents accumulation
- Efficient copying without temporary intermediate files
- Clear separation of source and target to prevent conflicts

## Security Considerations

### Path Safety and Validation

**Path Traversal Prevention:**
```typescript
// Path sanitization example
function sanitizePath(userPath: string, basePath: string): string {
  const resolved = path.resolve(basePath, userPath);
  
  // Ensure resolved path is within base directory
  if (!resolved.startsWith(path.resolve(basePath))) {
    throw new Error(`Invalid path: ${userPath} escapes base directory`);
  }
  
  return resolved;
}
```

**File System Security:**
- Validate all path inputs to prevent directory traversal
- Ensure operations stay within expected directory boundaries
- Use absolute paths to avoid ambiguity

### Dependency and Supply Chain Security

**Regular Security Auditing:**
```bash
# Regular security checks
npm audit
yarn audit

# Automated vulnerability scanning
npm audit --audit-level high --production
```

**Dependency Management:**
- Pin dependency versions for consistent behavior
- Regular updates with security patch prioritization
- Minimal dependency footprint to reduce attack surface

## Development Patterns

### Adding New Deployment Tasks

1. **Create Task File** - `src/task/[TaskName].ts`
2. **Implement Task Interface** - Follow DeployTask pattern
3. **Add Version Gating** - Use versionSatisfies for applicability
4. **Register in Pipeline** - Add to task sequence in RunDeployTasks.ts
5. **Add Integration Tests** - Validate task behavior in realistic scenarios

### Supporting New ODS/API Versions

1. **Analyze Directory Changes** - Understand new ODS/API structure
2. **Create Version-Specific Tasks** - Implement new path strategies
3. **Update Version Detection** - Add new version ranges to checks
4. **Maintain Legacy Support** - Ensure existing versions still work
5. **Add Migration Guidance** - Help users transition between versions

### Testing Deployment Scenarios

**Integration Testing Strategy:**
```typescript
// test/integration/DeployCore.test.ts
describe('Core Deployment', () => {
  it('should deploy core artifacts to correct v7.0 structure', async () => {
    const testConfig = createTestConfiguration('7.0.0');
    const testOptions = createTestCopyOptions();
    
    const results = await runDeployTasks(testConfig, testOptions);
    
    expect(results.every(r => r.success)).toBe(true);
    expect(fs.existsSync(expectedArtifactsPath)).toBe(true);
  });
});
```

## Architecture Strengths

1. **Clean Separation** - Clear boundary between task orchestration and individual task logic
2. **Version Flexibility** - Robust support for multiple ODS/API versions simultaneously
3. **Task Modularity** - Independent, testable deployment tasks
4. **Error Isolation** - Individual task failures don't corrupt entire deployment
5. **Pre-flight Validation** - Catches configuration issues before making changes
6. **Clean Slate Strategy** - Eliminates stale artifact problems through systematic cleanup
7. **MSBuild Integration** - Seamless integration with Visual Studio and build processes

## Areas for Enhancement

1. **Parallel Task Execution** - Independent tasks could run concurrently for better performance
2. **Rollback Capability** - Automated rollback on deployment failure
3. **Incremental Deployment** - Smart detection of changed artifacts for faster updates
4. **Validation Enhancement** - More comprehensive pre-flight checks and warnings
5. **Progress Reporting** - Better user feedback during long deployment operations
6. **Configuration Templates** - Pre-built configuration templates for common scenarios

This package demonstrates excellent architectural design for deployment automation, providing robust, version-aware artifact deployment with strong error handling and maintainable task separation patterns.