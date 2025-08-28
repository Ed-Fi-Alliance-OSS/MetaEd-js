#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

// File paths
const SWAGGER_FILE = path.join(__dirname, 'swagger-7.3-with-sample.json');
const DS52_FILE = path.join(__dirname, '../artifact/v7_3/ds-5.2-api-schema-generated.json');

// Parameters to ignore in comparison
const IGNORED_PARAMETERS = new Set([
  'offset',
  'limit',
  'pageToken',
  'pageSize',
  'minChangeVersion',
  'maxChangeVersion',
  'MinChangeVersion',
  'MaxChangeVersion',
  'totalCount',
  'Use-Snapshot',
]);

// Load JSON files
function loadJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`${colors.red}Error loading ${filePath}: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

// Resolve $ref references in parameters
function resolveParameterRefs(parameters, components) {
  if (!parameters) return [];

  return parameters.map((param) => {
    if (param.$ref) {
      const refPath = param.$ref.replace('#/components/parameters/', '');
      // Try exact match first
      let resolved = components?.parameters?.[refPath];

      // If not found, try with different case variations (e.g., MinChangeVersion vs minChangeVersion)
      if (!resolved && components?.parameters) {
        // Try lowercase first letter
        const lowerCaseFirst = refPath.charAt(0).toLowerCase() + refPath.slice(1);
        resolved = components.parameters[lowerCaseFirst];

        // Try exact lowercase
        if (!resolved) {
          const lowerCase = refPath.toLowerCase();
          resolved = components.parameters[lowerCase];
        }
      }

      if (resolved) {
        return { ...resolved, _refName: refPath };
      }
      // Don't warn for ignored parameters
      if (!IGNORED_PARAMETERS.has(refPath) && !IGNORED_PARAMETERS.has(refPath.charAt(0).toLowerCase() + refPath.slice(1))) {
        console.warn(`${colors.yellow}Warning: Could not resolve $ref: ${param.$ref}${colors.reset}`);
      }
      return { name: refPath, _unresolved: true };
    }
    return param;
  });
}

// Extract parameter names and create a map for easy comparison
function createParameterMap(parameters) {
  const map = new Map();
  parameters.forEach((param) => {
    if (param.name) {
      map.set(param.name, param);
    }
  });
  return map;
}

// Deep sort object keys for consistent comparison (ignores property order)
function sortObjectDeep(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(sortObjectDeep);
  }

  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sorted[key] = sortObjectDeep(obj[key]);
    });
  return sorted;
}

// Compare objects ignoring property order
function areObjectsEqual(obj1, obj2) {
  return JSON.stringify(sortObjectDeep(obj1)) === JSON.stringify(sortObjectDeep(obj2));
}

// Compare two parameter objects
function compareParameters(param1, param2, paramName, options = {}) {
  const differences = [];

  // Compare description (unless suppressed)
  if (!options.suppressMinorDiffs && param1.description !== param2.description) {
    differences.push({
      field: 'description',
      swagger: param1.description || '(none)',
      ds52: param2.description || '(none)',
    });
  }

  // Compare schema (ignoring property order, unless suppressed)
  if (!options.suppressMinorDiffs && !areObjectsEqual(param1.schema, param2.schema)) {
    differences.push({
      field: 'schema',
      swagger: param1.schema,
      ds52: param2.schema,
    });
  }

  // Compare x-Ed-Fi-isIdentity (unless suppressed)
  if (!options.suppressMinorDiffs && param1['x-Ed-Fi-isIdentity'] !== param2['x-Ed-Fi-isIdentity']) {
    differences.push({
      field: 'x-Ed-Fi-isIdentity',
      swagger: param1['x-Ed-Fi-isIdentity'],
      ds52: param2['x-Ed-Fi-isIdentity'],
    });
  }

  // Compare in field
  if (param1.in !== param2.in) {
    differences.push({
      field: 'in',
      swagger: param1.in,
      ds52: param2.in,
    });
  }

  return differences;
}

// Filter out ignored parameters
function filterIgnoredParameters(parameters) {
  return parameters.filter((param) => !IGNORED_PARAMETERS.has(param.name));
}

// Check if a resource is a descriptor endpoint
function isDescriptorEndpoint(resourceName) {
  return resourceName.toLowerCase().endsWith('descriptors') || resourceName.toLowerCase().includes('descriptor');
}

// Check if a parameter name is a known DS 5.2 IdentificationCode array element
function containsIdentificationCode(paramName) {
  const lowerName = paramName.toLowerCase();
  return (
    lowerName.includes('identificationcode') ||
    paramName.endsWith('IdentificationSystemDescriptor') ||
    paramName === 'courseCatalogURL' ||
    paramName === 'contentStandardName'
  );
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    suppressMinorDiffs: false,
    noIdCodes: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--suppress-minor-diffs' || args[i] === '-s') {
      options.suppressMinorDiffs = true;
    } else if (args[i] === '--no-id-codes') {
      options.noIdCodes = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log(`${colors.bright}Usage:${colors.reset} node compare-openapi-parameters.js [options]`);
      console.log('\nOptions:');
      console.log(
        '  --suppress-minor-diffs, -s  Suppress warnings for x-Ed-Fi-isIdentity, description, and schema differences',
      );
      console.log(
        '  --no-id-codes               Ignore differences with "identificationCode" or parameters ending with "IdentificationSystemDescriptor"',
      );
      console.log('  --help, -h                  Show this help message');
      process.exit(0);
    }
  }

  return options;
}

// Main comparison function
function compareOpenApiParameters() {
  const options = parseArgs();

  console.log(`${colors.bright}${colors.blue}OpenAPI Parameters Comparison Tool${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(50)}${colors.reset}\n`);

  // Load files
  console.log(`${colors.cyan}Loading files...${colors.reset}`);
  const swaggerData = loadJsonFile(SWAGGER_FILE);
  const ds52Data = loadJsonFile(DS52_FILE);

  // Extract resources from ds-5.2 file
  const resourceSchemas = ds52Data.projectSchema.resourceSchemas;
  const resourceNames = Object.keys(resourceSchemas);

  // Filter out descriptor endpoints
  const nonDescriptorResources = resourceNames.filter((name) => !isDescriptorEndpoint(name));
  const descriptorCount = resourceNames.length - nonDescriptorResources.length;

  console.log(`${colors.green}Found ${resourceNames.length} resources in ds-5.2 file${colors.reset}`);
  console.log(`${colors.yellow}Ignoring ${descriptorCount} descriptor endpoints${colors.reset}`);
  console.log(
    `${colors.yellow}Ignoring parameters: ${Array.from(IGNORED_PARAMETERS)
      .filter((p) => p !== 'minChangeVersion' && p !== 'maxChangeVersion')
      .join(', ')}${colors.reset}`,
  );
  console.log(`${colors.yellow}Note: Property order differences in schemas are ignored${colors.reset}`);
  if (options.suppressMinorDiffs) {
    console.log(`${colors.yellow}Suppressing: x-Ed-Fi-isIdentity, description, and schema differences${colors.reset}`);
  }
  if (options.noIdCodes) {
    console.log(
      `${colors.yellow}Ignoring: differences with "identificationCode" or parameters ending with "IdentificationSystemDescriptor"${colors.reset}`,
    );
  }
  console.log();

  // Prepare comparison results
  const comparisonResults = [];
  let totalDifferences = 0;
  let resourcesWithDifferences = 0;

  // Compare each resource (skipping descriptors)
  nonDescriptorResources.forEach((resourceName) => {
    const resourcePath = `/ed-fi/${resourceName}`;

    // Get parameters from swagger file
    const swaggerEndpoint = swaggerData.paths?.[resourcePath];
    const swaggerGetOperation = swaggerEndpoint?.get;
    const swaggerParameters = swaggerGetOperation?.parameters;

    // Get parameters from ds-5.2 file
    const ds52Resource = resourceSchemas[resourceName];
    const ds52Fragment = ds52Resource.openApiFragments?.resources;
    const ds52Path = ds52Fragment?.paths?.[resourcePath];
    const ds52GetOperation = ds52Path?.get;
    const ds52Parameters = ds52GetOperation?.parameters;

    // Get queryFieldMapping from ds-5.2 file
    const queryFieldMapping = ds52Resource.queryFieldMapping;

    // Skip if either endpoint doesn't exist
    if (!swaggerGetOperation || !ds52GetOperation) {
      if (swaggerGetOperation && !ds52GetOperation) {
        comparisonResults.push({
          resource: resourceName,
          path: resourcePath,
          status: 'missing_in_ds52',
          message: 'Endpoint exists in swagger but not in ds-5.2',
        });
        totalDifferences++;
      } else if (!swaggerGetOperation && ds52GetOperation) {
        comparisonResults.push({
          resource: resourceName,
          path: resourcePath,
          status: 'missing_in_swagger',
          message: 'Endpoint exists in ds-5.2 but not in swagger',
        });
        totalDifferences++;
      }
      return;
    }

    // Resolve $ref parameters
    const resolvedSwaggerParams = resolveParameterRefs(swaggerParameters, swaggerData.components);
    const resolvedDs52Params = resolveParameterRefs(ds52Parameters, ds52Fragment.components);

    // Filter out ignored parameters
    const filteredSwaggerParams = filterIgnoredParameters(resolvedSwaggerParams);
    const filteredDs52Params = filterIgnoredParameters(resolvedDs52Params);

    // Create parameter maps
    const swaggerParamMap = createParameterMap(filteredSwaggerParams);
    const ds52ParamMap = createParameterMap(filteredDs52Params);

    // Find differences
    const differences = {
      resource: resourceName,
      path: resourcePath,
      onlyInSwagger: [],
      onlyInDs52: [],
      parameterDifferences: [],
      queryFieldsOnlyInSwagger: [],
      queryFieldsOnlyInDs52: [],
    };

    // Check parameters only in swagger
    swaggerParamMap.forEach((param, name) => {
      if (!ds52ParamMap.has(name)) {
        // Skip if --no-id-codes flag is set and name contains "identificationcode"
        if (options.noIdCodes && containsIdentificationCode(name)) {
          return;
        }
        differences.onlyInSwagger.push({
          name,
          description: param.description,
          schema: param.schema,
          isRef: param._refName ? true : false,
          refName: param._refName,
        });
      }
    });

    // Check parameters only in ds-5.2
    ds52ParamMap.forEach((param, name) => {
      if (!swaggerParamMap.has(name)) {
        // Skip if --no-id-codes flag is set and name contains "identificationcode"
        if (options.noIdCodes && containsIdentificationCode(name)) {
          return;
        }
        differences.onlyInDs52.push({
          name,
          description: param.description,
          schema: param.schema,
          isRef: param._refName ? true : false,
          refName: param._refName,
        });
      }
    });

    // Compare common parameters
    swaggerParamMap.forEach((swaggerParam, name) => {
      if (ds52ParamMap.has(name)) {
        // Skip if --no-id-codes flag is set and name contains "identificationcode"
        if (options.noIdCodes && containsIdentificationCode(name)) {
          return;
        }
        const ds52Param = ds52ParamMap.get(name);
        const paramDiffs = compareParameters(swaggerParam, ds52Param, name, options);
        if (paramDiffs.length > 0) {
          differences.parameterDifferences.push({
            name,
            differences: paramDiffs,
          });
        }
      }
    });

    // Compare queryFieldMapping if it exists
    if (queryFieldMapping) {
      const queryFieldProperties = Object.keys(queryFieldMapping);
      const swaggerParamNames = new Set(filteredSwaggerParams.map((p) => p.name));

      // Find query fields only in ds-5.2 (not in swagger parameters)
      queryFieldProperties.forEach((field) => {
        if (!swaggerParamNames.has(field)) {
          // Skip if --no-id-codes flag is set and field contains "identificationcode"
          if (options.noIdCodes && containsIdentificationCode(field)) {
            return;
          }
          differences.queryFieldsOnlyInDs52.push(field);
        }
      });

      // Find swagger parameters not in query fields
      swaggerParamNames.forEach((paramName) => {
        if (!queryFieldMapping[paramName]) {
          // Skip if --no-id-codes flag is set and paramName contains "identificationcode"
          if (options.noIdCodes && containsIdentificationCode(paramName)) {
            return;
          }
          differences.queryFieldsOnlyInSwagger.push(paramName);
        }
      });
    }

    // Only add to results if there are differences
    if (
      differences.onlyInSwagger.length > 0 ||
      differences.onlyInDs52.length > 0 ||
      differences.parameterDifferences.length > 0 ||
      differences.queryFieldsOnlyInSwagger.length > 0 ||
      differences.queryFieldsOnlyInDs52.length > 0
    ) {
      comparisonResults.push(differences);
      resourcesWithDifferences++;
      totalDifferences +=
        differences.onlyInSwagger.length +
        differences.onlyInDs52.length +
        differences.parameterDifferences.length +
        differences.queryFieldsOnlyInSwagger.length +
        differences.queryFieldsOnlyInDs52.length;
    }
  });

  // Print results
  console.log(`${colors.bright}Comparison Results${colors.reset}`);
  console.log(`${colors.gray}${'='.repeat(50)}${colors.reset}\n`);

  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`  Total resources compared: ${nonDescriptorResources.length} (excluded ${descriptorCount} descriptors)`);
  console.log(`  Resources with differences: ${resourcesWithDifferences}`);
  console.log(`  Total differences found: ${totalDifferences}\n`);

  // Print detailed differences
  if (comparisonResults.length > 0) {
    console.log(`${colors.cyan}Detailed Differences:${colors.reset}\n`);

    comparisonResults.forEach((result) => {
      if (result.status === 'missing_in_ds52' || result.status === 'missing_in_swagger') {
        console.log(`${colors.yellow}${result.resource}${colors.reset}`);
        console.log(`  ${colors.red}${result.message}${colors.reset}\n`);
        return;
      }

      console.log(`${colors.bright}${colors.yellow}${result.resource}${colors.reset} (${result.path})`);

      if (result.onlyInSwagger.length > 0) {
        console.log(`  ${colors.red}Parameters only in swagger:${colors.reset}`);
        result.onlyInSwagger.forEach((param) => {
          const refInfo = param.isRef ? ` ${colors.gray}(ref: ${param.refName})${colors.reset}` : '';
          console.log(`    - ${param.name}${refInfo}`);
          if (param.description) {
            console.log(`      ${colors.gray}${param.description.substring(0, 60)}...${colors.reset}`);
          }
        });
      }

      if (result.onlyInDs52.length > 0) {
        console.log(`  ${colors.green}Parameters only in ds-5.2:${colors.reset}`);
        result.onlyInDs52.forEach((param) => {
          const refInfo = param.isRef ? ` ${colors.gray}(ref: ${param.refName})${colors.reset}` : '';
          console.log(`    - ${param.name}${refInfo}`);
          if (param.description) {
            console.log(`      ${colors.gray}${param.description.substring(0, 60)}...${colors.reset}`);
          }
        });
      }

      if (result.parameterDifferences.length > 0) {
        console.log(`  ${colors.blue}Parameters with differences:${colors.reset}`);
        result.parameterDifferences.forEach((paramDiff) => {
          console.log(`    - ${paramDiff.name}:`);
          paramDiff.differences.forEach((diff) => {
            console.log(`      ${colors.gray}${diff.field}:${colors.reset}`);
            const swaggerStr = JSON.stringify(diff.swagger) || '';
            const ds52Str = JSON.stringify(diff.ds52) || '';
            console.log(`        swagger: ${swaggerStr.substring(0, 50)}`);
            console.log(`        ds-5.2:  ${ds52Str.substring(0, 50)}`);
          });
        });
      }

      if (result.queryFieldsOnlyInSwagger && result.queryFieldsOnlyInSwagger.length > 0) {
        console.log(`  ${colors.cyan}Query fields only in swagger:${colors.reset}`);
        result.queryFieldsOnlyInSwagger.forEach((field) => {
          console.log(`    - ${field}`);
        });
      }

      if (result.queryFieldsOnlyInDs52 && result.queryFieldsOnlyInDs52.length > 0) {
        console.log(`  ${colors.cyan}Query fields only in ds-5.2:${colors.reset}`);
        result.queryFieldsOnlyInDs52.forEach((field) => {
          console.log(`    - ${field}`);
        });
      }

      console.log();
    });
  } else {
    console.log(`${colors.green}No differences found! The parameters and query fields match perfectly.${colors.reset}`);
  }

  // Save results to file
  const outputFile = 'openapi-comparison-results.json';
  fs.writeFileSync(outputFile, JSON.stringify(comparisonResults, null, 2));
  console.log(`${colors.cyan}Full results saved to: ${outputFile}${colors.reset}`);
}

// Run the comparison
compareOpenApiParameters();
