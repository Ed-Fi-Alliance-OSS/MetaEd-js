#!/usr/bin/env node
/* eslint-disable no-console */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as fs from 'fs';
import * as path from 'path';
import { parseApiSchema } from './parsers/ApiSchemaParser';
import { parseOpenApi } from './parsers/OpenApiParser';
import { compareStructures } from './comparator/SchemaComparator';
import { ComparisonResult } from './types/DocumentStructure';
import { ApiSchema } from '../../../src/model/api-schema/ApiSchema';

type CliOptions = {
  apiSchemaPath: string;
  openApiPath: string;
  outputFormat: 'summary' | 'detailed' | 'json';
  filter?: string;
  includeLinkFields?: boolean;
  ignoreTypeMismatches?: boolean;
  ignoreRequiredMismatches?: boolean;
};

function printHelp(): void {
  console.log(`
ODS Comparator - Compare Ed-Fi ApiSchema with OpenAPI specification

Usage: ods-comparator [options] [api-schema-file] [openapi-file]

Options:
  -a, --api-schema <file>       Path to ApiSchema JSON file (default: ds-5.2-api-schema.json)
  -o, --openapi <file>          Path to OpenAPI JSON file (default: ds-5.2-ods-api-openapi.json)
  -f, --format <format>         Output format: summary, detailed, or json (default: summary)
  --filter <endpoint>           Filter results to specific endpoint name
  --include-link-fields         Include missing link.rel and link.href fields on references in comparison (default: ignore)
  --ignore-type-mismatches      Ignore type mismatches between ApiSchema and OpenAPI
  --ignore-required-mismatches  Ignore required field mismatches between ApiSchema and OpenAPI
  -h, --help                   Show this help message

Examples:
  ods-comparator
  ods-comparator --format detailed
  ods-comparator --filter students
  ods-comparator custom-api-schema.json custom-openapi.json
`);
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    apiSchemaPath: '',
    openApiPath: '',
    outputFormat: 'summary',
  };

  for (let i = 0; i < args.length; i += 1) {
    switch (args[i]) {
      case '--api-schema':
      case '-a':
        i += 1;
        options.apiSchemaPath = args[i];
        break;
      case '--openapi':
      case '-o':
        i += 1;
        options.openApiPath = args[i];
        break;
      case '--format':
      case '-f':
        i += 1;
        options.outputFormat = args[i] as CliOptions['outputFormat'];
        break;
      case '--filter':
        i += 1;
        options.filter = args[i];
        break;
      case '--include-link-fields':
        options.includeLinkFields = true;
        break;
      case '--ignore-type-mismatches':
        options.ignoreTypeMismatches = true;
        break;
      case '--ignore-required-mismatches':
        options.ignoreRequiredMismatches = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
      // eslint-disable-next-line no-fallthrough
      default:
        if (!options.apiSchemaPath) {
          options.apiSchemaPath = args[i];
        } else if (!options.openApiPath) {
          options.openApiPath = args[i];
        }
    }
  }

  // Use default file paths if not provided
  if (!options.apiSchemaPath) {
    options.apiSchemaPath = path.join(__dirname, '..', 'ds-5.2-api-schema.json');
  }
  if (!options.openApiPath) {
    options.openApiPath = path.join(__dirname, '..', 'ds-5.2-ods-api-openapi.json');
  }

  return options;
}

// eslint-disable-next-line consistent-return
function loadJsonFile(filePath: string): any {
  try {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error loading file ${filePath}:`, error.message);
    process.exit(1);
  }
}

function printSummary(results: ComparisonResult[]): void {
  const totalEndpoints = results.length;
  const matchingEndpoints = results.filter((r) => r.isMatch).length;
  const mismatchedEndpoints = totalEndpoints - matchingEndpoints;

  console.log('\n=== COMPARISON SUMMARY ===');
  console.log(`Total endpoints compared: ${totalEndpoints}`);
  console.log(`Matching endpoints: ${matchingEndpoints}`);
  console.log(`Mismatched endpoints: ${mismatchedEndpoints}`);

  if (mismatchedEndpoints > 0) {
    console.log('\nEndpoints with mismatches:');
    results
      .filter((r) => !r.isMatch)
      .forEach((r) => {
        console.log(`  - ${r.endpointName}`);
        if (r.missingFromApiSchema) {
          console.log(`    Endpoint missing from ApiSchema`);
        } else if (r.missingFromOpenApi) {
          console.log(`    Endpoint missing from OpenAPI`);
        } else {
          if (r.missingInOpenApi.length > 0) {
            console.log(`    Missing in OpenAPI: ${r.missingInOpenApi.length} fields`);
          }
          if (r.missingInApiSchema.length > 0) {
            console.log(`    Missing in ApiSchema: ${r.missingInApiSchema.length} fields`);
          }
          if (r.typeMismatches.length > 0) {
            console.log(`    Type mismatches: ${r.typeMismatches.length} fields`);
          }
          if (r.requiredMismatches.length > 0) {
            console.log(`    Required mismatches: ${r.requiredMismatches.length} fields`);
          }
        }
      });
  }
}

function printDetailed(results: ComparisonResult[]): void {
  console.log('\n=== DETAILED COMPARISON RESULTS ===');

  results.forEach((result) => {
    console.log(`\nEndpoint: ${result.endpointName}`);
    console.log(`Status: ${result.isMatch ? 'MATCH' : 'MISMATCH'}`);

    if (!result.isMatch) {
      if (result.missingFromApiSchema) {
        console.log('\nEndpoint missing from ApiSchema');
      } else if (result.missingFromOpenApi) {
        console.log('\nEndpoint missing from OpenAPI');
      } else {
        if (result.missingInOpenApi.length > 0) {
          console.log('\nFields missing in OpenAPI:');
          result.missingInOpenApi.forEach((field) => {
            console.log(`  - ${field}`);
          });
        }

        if (result.missingInApiSchema.length > 0) {
          console.log('\nFields missing in ApiSchema:');
          result.missingInApiSchema.forEach((field) => {
            console.log(`  - ${field}`);
          });
        }

        if (result.typeMismatches.length > 0) {
          console.log('\nType mismatches:');
          result.typeMismatches.forEach((mismatch) => {
            console.log(`  - ${mismatch.path}: ApiSchema=${mismatch.apiSchemaType}, OpenAPI=${mismatch.openApiType}`);
          });
        }

        if (result.requiredMismatches.length > 0) {
          console.log('\nRequired field mismatches:');
          result.requiredMismatches.forEach((mismatch) => {
            console.log(
              `  - ${mismatch.path}: ApiSchema=${mismatch.apiSchemaRequired}, OpenAPI=${mismatch.openApiRequired}`,
            );
          });
        }
      }
    }
  });
}

function main(): void {
  const options = parseArgs();

  // Load files
  if (options.outputFormat !== 'json') {
    console.log(`Loading ApiSchema from: ${options.apiSchemaPath}`);
  }
  const apiSchema: ApiSchema = loadJsonFile(options.apiSchemaPath);

  if (options.outputFormat !== 'json') {
    console.log(`Loading OpenAPI from: ${options.openApiPath}`);
  }
  const openApi = loadJsonFile(options.openApiPath);

  // Parse schemas
  if (options.outputFormat !== 'json') {
    console.log('\nParsing schemas...');
  }
  const apiSchemaStructures = parseApiSchema(apiSchema);
  const openApiStructures = parseOpenApi(openApi);

  // Compare structures
  if (options.outputFormat !== 'json') {
    console.log('Comparing structures...');
  }
  let results = compareStructures(apiSchemaStructures, openApiStructures, {
    ignoreLinkFields: !options.includeLinkFields,
    ignoreTypeMismatches: options.ignoreTypeMismatches,
    ignoreRequiredMismatches: options.ignoreRequiredMismatches,
  });

  // Apply filter if specified
  if (options.filter) {
    results = results.filter((r) => r.endpointName.includes(options.filter!));
  }

  // Output results
  switch (options.outputFormat) {
    case 'json':
      console.log(JSON.stringify(results, null, 2));
      break;
    case 'detailed':
      printDetailed(results);
      break;
    case 'summary':
    default:
      printSummary(results);
      break;
  }

  // Exit with error code if mismatches found
  const hasMismatches = results.some((r) => !r.isMatch);
  process.exit(hasMismatches ? 1 : 0);
}

// Run the CLI
main();
