// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'node:fs';
import path from 'path';
import 'tplfa-jsonnet/wasm_exec.js';
import { Jsonnet, getJsonnet } from 'tplfa-jsonnet/jsonnet';

let jsonnetInstance: Jsonnet | null = null;

/**
 * Initialize the Jsonnet interpreter.
 * This function loads the WebAssembly module and creates a Jsonnet instance.
 * The instance is cached for reuse across multiple evaluations.
 */
async function initializeJsonnet(): Promise<Jsonnet> {
  if (jsonnetInstance) {
    return jsonnetInstance;
  }

  try {
    // Load the WebAssembly module
    const jsonnetWasm = await fs.promises.readFile(require.resolve('tplfa-jsonnet/libjsonnet.wasm'));

    // Initialize the Jsonnet interpreter
    jsonnetInstance = await getJsonnet(jsonnetWasm);
    return jsonnetInstance;
  } catch (error) {
    throw new Error(`Failed to initialize Jsonnet interpreter: ${error.message}`);
  }
}

/**
 * Configuration options for loading Jsonnet files.
 */
export interface JsonnetLoadOptions {
  /** External variables to pass to the Jsonnet evaluation */
  externalVariables?: Record<string, string>;
  /** Library paths for Jsonnet imports */
  libraryPaths?: string[];
}

/**
 * Load and evaluate a configuration file.
 * Supports both JSON (.config.json) and Jsonnet (.config.jsonnet) files.
 *
 * @param filepath - The path to the configuration file
 * @param options - Optional configuration for Jsonnet evaluation
 * @returns The evaluated configuration object
 */
export async function loadConfigurationFile(filepath: string, options: JsonnetLoadOptions = {}): Promise<any> {
  // Check if file exists
  try {
    await fs.promises.access(filepath, fs.constants.F_OK);
  } catch {
    throw new Error(`Configuration file not found: ${filepath}`);
  }

  // Read the file content
  const content = await fs.promises.readFile(filepath, 'utf-8');

  // Determine file type based on extension
  const ext = path.extname(filepath).toLowerCase();

  if (ext === '.json') {
    // Parse as JSON directly
    try {
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to parse JSON configuration: ${error.message}`);
    }
  } else if (ext === '.jsonnet') {
    // Evaluate as Jsonnet
    try {
      const jsonnet = await initializeJsonnet();

      // Prepare external variables
      const extrStrs = options.externalVariables || {};

      // Prepare library files for imports
      const files: Record<string, string> = {};
      if (options.libraryPaths) {
        // Use Promise.all with map instead of for loop
        await Promise.all(
          options.libraryPaths.map(async (libPath) => {
            try {
              const libContent = await fs.promises.readFile(libPath, 'utf-8');
              const libName = path.basename(libPath);
              files[libName] = libContent;
            } catch {
              // Library file not found, continue
            }
          }),
        );
      }

      // Evaluate the Jsonnet code
      const resultStr = await jsonnet.evaluate(content, extrStrs, files);

      // Parse the resulting JSON
      return JSON.parse(resultStr);
    } catch (error) {
      throw new Error(`Failed to evaluate Jsonnet configuration: ${error.message}`);
    }
  } else {
    throw new Error(`Unsupported configuration file extension: ${ext}. Use .json or .jsonnet`);
  }
}

/**
 * Find configuration file with support for both JSON and Jsonnet extensions.
 * If both exist, prefer .jsonnet over .json.
 *
 * @param directory - The directory to search in
 * @param pluginName - The plugin name to look for
 * @returns The path to the configuration file, or null if not found
 */
export async function findConfigurationFile(directory: string, pluginName: string): Promise<string | null> {
  // Check for .jsonnet first (preferred)
  const jsonnetPath = path.join(directory, `${pluginName}.config.jsonnet`);
  try {
    await fs.promises.access(jsonnetPath, fs.constants.F_OK);
    return jsonnetPath;
  } catch {
    // .jsonnet not found, continue
  }

  // Check for .json
  const jsonPath = path.join(directory, `${pluginName}.config.json`);
  try {
    await fs.promises.access(jsonPath, fs.constants.F_OK);
    return jsonPath;
  } catch {
    // .json not found either
  }

  return null;
}
