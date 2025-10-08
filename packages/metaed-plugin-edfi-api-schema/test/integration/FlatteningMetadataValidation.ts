// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ExecException, execFile } from 'child_process';
import { promises as fs } from 'node:fs';
import path from 'path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export type ExecExceptionWithOutput = ExecException & { stdout: string; stderr: string };

export const isExecExceptionWithOutput = (error: unknown): error is ExecExceptionWithOutput =>
  typeof error === 'object' &&
  error !== null &&
  'stdout' in error &&
  'stderr' in error &&
  typeof (error as { stdout: unknown }).stdout === 'string' &&
  typeof (error as { stderr: unknown }).stderr === 'string';

export const combineProcessOutput = (stdout: string, stderr: string): string => {
  const segments: string[] = [];
  if (stdout.length > 0) {
    segments.push(stdout);
  }
  if (stderr.length > 0) {
    segments.push(stderr);
  }

  return `${segments.join('\n')}\n`;
};

export const createFlatteningReportPath = (artifactPath: string, generatedFilename: string): string =>
  path.resolve(artifactPath, `${generatedFilename.replace(/\.json$/u, '')}-flattening-report.txt`);

export const runFlatteningValidator = async (inputFile: string, reportFile: string): Promise<void> => {
  const validatorScriptPath = path.resolve(__dirname, './verify-flattening-metadata.js');

  try {
    const { stdout, stderr } = await execFileAsync('node', [validatorScriptPath, inputFile]);
    await fs.writeFile(reportFile, combineProcessOutput(stdout, stderr));
  } catch (error: unknown) {
    if (isExecExceptionWithOutput(error)) {
      await fs.writeFile(reportFile, combineProcessOutput(error.stdout, error.stderr));
      throw new Error(
        `Flattening metadata validation failed for ${path.basename(inputFile)}. See ${reportFile} for details.`,
      );
    }

    throw error;
  }
};
