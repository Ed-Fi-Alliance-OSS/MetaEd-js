// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { promises as fs } from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration interfaces
interface TestConfiguration {
  testFile: string;
  artifactDir: string;
  description: string;
}

interface Colors {
  [key: string]: string;
}

// Configuration for the three test scenarios
const testConfigurations: TestConfiguration[] = [
  {
    testFile: 'ApiSchemaAuthoritativeCompare_v7_1.test.ts',
    artifactDir: 'v7_1',
    description: 'Data Standard 5.0 for ODS/API 7.1',
  },
  {
    testFile: 'ApiSchemaAuthoritativeCompare_v7_2.test.ts',
    artifactDir: 'v7_2',
    description: 'Data Standard 5.1 and TPDM 1.1 for ODS/API 7.2',
  },
  {
    testFile: 'ApiSchemaAuthoritativeCompare_v7_3.test.ts',
    artifactDir: 'v7_3',
    description: 'Data Standard 5.2 and TPDM 1.1 for ODS/API 7.3',
  },
];

// Parse command line arguments
const args: string[] = process.argv.slice(2);
const isDryRun: boolean = args.includes('--dry-run') || args.includes('-n');
const isVerbose: boolean = args.includes('--verbose') || args.includes('-v');
const showHelp: boolean = args.includes('--help') || args.includes('-h');

if (showHelp) {
  // eslint-disable-next-line no-console
  console.log(`
MetaEd API Schema Authoritative File Updater
=============================================

This script automates the workflow for updating authoritative API schema files.
It can optionally run all AuthoritativeCompare tests before copying the newly 
generated JSON files to their corresponding authoritative files.

Usage:
  npx ts-node test/integration/update-authoritative-files.ts [options]
  npm run update-authoritative [-- options]

Options:
  --run-tests      Run AuthoritativeCompare tests before copying files
  --dry-run, -n    Show what would be done without actually doing it
  --verbose, -v    Show detailed output
  --help, -h       Show this help message

Examples:
  npx ts-node test/integration/update-authoritative-files.ts --run-tests
  npx ts-node test/integration/update-authoritative-files.ts --dry-run
  npx ts-node test/integration/update-authoritative-files.ts --verbose
  npm run update-authoritative
  npm run update-authoritative:dry-run

Note: Without --run-tests, the script assumes generated files already exist
and will only copy them to their authoritative locations.
`);
  process.exit(0);
}

// Utility functions
function log(message: string, color: string = ''): void {
  const colors: Colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    reset: '\x1b[0m',
  };

  const colorCode = colors[color] || '';
  const resetCode = color ? colors.reset : '';
  // eslint-disable-next-line no-console
  console.log(`${colorCode}${message}${resetCode}`);
}

function logEmpty(): void {
  // eslint-disable-next-line no-console
  console.log();
}

function logVerbose(message: string): void {
  if (isVerbose) {
    log(message, 'gray');
  }
}

// Run a single test
async function runAuthoritativeTest(testFile: string, description: string): Promise<boolean> {
  log(`Running test: ${description}`, 'green');
  logVerbose(`Test file: ${testFile}`);

  try {
    const testPath = `packages/metaed-plugin-edfi-api-schema/test/integration/${testFile}`;
    const testCommand = `npx jest --testPathPattern="${testPath}" --verbose`;
    logVerbose(`Executing: ${testCommand}`);

    // Change to workspace root directory for Jest to work properly
    const workspaceRoot = path.join(__dirname, '..', '..', '..', '..');
    const originalCwd = process.cwd();
    process.chdir(workspaceRoot);

    const { stdout } = await execAsync(testCommand);

    // Change back to original directory
    process.chdir(originalCwd);

    if (isVerbose && stdout) {
      log('Test output:', 'gray');
      log(stdout, 'gray');
    }

    log('✓ Test completed successfully', 'green');
    return true;
  } catch (error) {
    log('⚠ Test may have failed, but continuing to copy generated files...', 'yellow');
    if (isVerbose) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log(`Error: ${errorMessage}`, 'gray');

      // Type guard for exec error with stdout/stderr
      if (error && typeof error === 'object' && 'stdout' in error) {
        const execError = error as { stdout?: string; stderr?: string };
        if (execError.stdout) log(`Stdout: ${execError.stdout}`, 'gray');
        if (execError.stderr) log(`Stderr: ${execError.stderr}`, 'gray');
      }
    }
    return false;
  }
}

// Copy generated files to authoritative files
async function copyGeneratedToAuthoritative(artifactDir: string, description: string): Promise<boolean> {
  log(`Updating authoritative files for: ${description}`, 'yellow');

  const artifactDirPath = path.join(__dirname, 'artifact', artifactDir);

  try {
    await fs.access(artifactDirPath);
  } catch (error) {
    log(`Error: Artifact directory not found: ${artifactDirPath}`, 'red');
    return false;
  }

  try {
    // Get all files in the artifact directory
    const files = await fs.readdir(artifactDirPath);
    const generatedFiles = files.filter((file) => file.endsWith('-generated.json'));

    if (generatedFiles.length === 0) {
      log(`Warning: No generated files found in ${artifactDirPath}`, 'yellow');
    }

    let copiedCount = 0;

    const copyPromises = generatedFiles.map(async (generatedFile) => {
      const authoritativeFileName = generatedFile.replace('-generated.json', '-authoritative.json');
      const generatedFilePath = path.join(artifactDirPath, generatedFile);
      const authoritativeFilePath = path.join(artifactDirPath, authoritativeFileName);

      if (isDryRun) {
        log('  [DRY RUN] Would copy:', 'yellow');
        log(`    From: ${generatedFilePath}`, 'gray');
        log(`    To:   ${authoritativeFilePath}`, 'gray');
        return false;
      }

      try {
        await fs.copyFile(generatedFilePath, authoritativeFilePath);
        log(`  ✓ Copied: ${generatedFile} → ${authoritativeFileName}`, 'green');
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log(`  Error copying ${generatedFile}: ${errorMessage}`, 'red');
        return false;
      }
    });

    const copyResults = await Promise.all(copyPromises);
    copiedCount = copyResults.filter(Boolean).length;

    if (!isDryRun) {
      log(`  Copied ${copiedCount} file(s)`, 'green');
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Error processing artifact directory: ${errorMessage}`, 'red');
    return false;
  }
}

// Main execution
async function main(): Promise<void> {
  log('MetaEd API Schema Authoritative File Updater', 'cyan');
  log('=============================================', 'cyan');
  logEmpty();

  if (isDryRun) {
    log('DRY RUN MODE - No files will be modified', 'yellow');
    logEmpty();
  }

  try {
    // Step 1: Run tests (optional - can be skipped for copy-only mode)
    const runTests = args.includes('--run-tests');

    if (runTests) {
      log('Step 1: Running AuthoritativeCompare tests...', 'magenta');
      logEmpty();

      const testPromises = testConfigurations.map(async (config) => {
        const testResult = await runAuthoritativeTest(config.testFile, config.description);
        logEmpty();
        return testResult;
      });

      const testResults = await Promise.all(testPromises);

      // Check for test failures
      const failedTests = testResults.filter((result) => !result);
      if (failedTests.length > 0) {
        log(`Warning: ${failedTests.length} test(s) may have failed, but continuing with file copying...`, 'yellow');
        logEmpty();
      }
    }

    // Step 2: Copy files
    const stepLabel = runTests ? 'Step 2: Copying' : 'Copying';
    log(`${stepLabel} generated files to authoritative files...`, 'magenta');
    logEmpty();

    const copyPromises = testConfigurations.map(async (config) => {
      const copyResult = await copyGeneratedToAuthoritative(config.artifactDir, config.description);
      logEmpty();
      return copyResult;
    });

    const copyResults = await Promise.all(copyPromises);

    // Summary
    log('Summary:', 'magenta');
    log('========', 'magenta');

    const successfulCopies = copyResults.filter((result) => result);

    if (isDryRun) {
      log('✓ Dry run completed - no files were modified', 'yellow');
    } else {
      log(
        `✓ ${successfulCopies.length} of ${testConfigurations.length} artifact directories processed successfully`,
        'green',
      );
    }

    const failedCopies = copyResults.filter((result) => !result);
    if (failedCopies.length > 0) {
      log(`⚠ ${failedCopies.length} artifact directories had issues`, 'yellow');
      process.exit(1);
    }

    if (!isDryRun) {
      logEmpty();
      log('All authoritative files have been updated!', 'green');
      log('You can now run the tests again to verify they pass.', 'gray');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log(`Script execution failed: ${errorMessage}`, 'red');
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  // eslint-disable-next-line no-console
  console.error(`Unhandled error: ${errorMessage}`);
  process.exit(1);
});
