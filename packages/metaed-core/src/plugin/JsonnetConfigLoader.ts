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
  if (jsonnetInstance != null) {
    return jsonnetInstance;
  }

  try {
    // Load the WebAssembly module
    const jsonnetWasm: Buffer = await fs.promises.readFile(require.resolve('tplfa-jsonnet/libjsonnet.wasm'));

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
 */
export async function loadConfigurationFile(configurationFilepath: string, options: JsonnetLoadOptions = {}): Promise<any> {
  // Check if file exists
  try {
    await fs.promises.access(configurationFilepath, fs.constants.F_OK);
  } catch {
    throw new Error(`Configuration file not found: ${configurationFilepath}`);
  }

  // Read the file content
  const configurationFileContent: string = await fs.promises.readFile(configurationFilepath, 'utf-8');

  // Determine file type based on extension
  const fileExtension: string = path.extname(configurationFilepath).toLowerCase();

  if (fileExtension === '.json') {
    // Parse as JSON directly
    try {
      return JSON.parse(configurationFileContent);
    } catch (error) {
      throw new Error(`Failed to parse JSON configuration: ${error.message}`);
    }
  } else if (fileExtension === '.jsonnet') {
    // Evaluate as Jsonnet
    try {
      const jsonnet: Jsonnet = await initializeJsonnet();

      // Prepare external variables
      const externalVariables = options.externalVariables || {};

      // Prepare library files for imports
      const files: Record<string, string> = {};
      if (options.libraryPaths) {
        // Use Promise.all with map instead of for loop
        await Promise.all(
          options.libraryPaths.map(async (libraryFilePath) => {
            try {
              const libraryContent: string = await fs.promises.readFile(libraryFilePath, 'utf-8');
              const libraryFilename = path.basename(libraryFilePath);
              files[libraryFilename] = libraryContent;
            } catch (error) {
              throw new Error(`Library file for Jsonnet not found: ${error.message}`);
            }
          }),
        );
      }

      // Evaluate the Jsonnet code
      const materializedJsonString: string = await jsonnet.evaluate(configurationFileContent, externalVariables, files);

      // Parse the resulting JSON
      return JSON.parse(materializedJsonString);
    } catch (error) {
      throw new Error(`Failed to evaluate Jsonnet configuration: ${error.message}`);
    }
  } else {
    throw new Error(`Unsupported configuration file extension: ${fileExtension}. Use .json or .jsonnet`);
  }
}

/**
 * Find configuration file with support for both JSON and Jsonnet extensions.
 * If both exist, prefer .jsonnet over .json.
 */
export async function findConfigurationFile(directory: string, pluginName: string): Promise<string | null> {
  // Check for .jsonnet first (preferred)
  const jsonnetPath: string = path.join(directory, `${pluginName}.config.jsonnet`);
  try {
    await fs.promises.access(jsonnetPath, fs.constants.F_OK);
    return jsonnetPath;
  } catch {
    // .jsonnet not found, continue
  }

  // Check for .json
  const jsonPath: string = path.join(directory, `${pluginName}.config.json`);
  try {
    await fs.promises.access(jsonPath, fs.constants.F_OK);
    return jsonPath;
  } catch {
    // .json not found either
  }

  return null;
}
