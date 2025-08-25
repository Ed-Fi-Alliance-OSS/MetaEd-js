# OpenAPI Parameters Comparison Tool

## Overview

The `compare-openapi-parameters.js` script is a command-line tool that compares query parameters between two OpenAPI specification files:
- A reference Swagger file (typically from Ed-Fi ODS/API v7.3)
- A generated DS 5.2 API schema file from MetaEd

This tool helps identify discrepancies in query parameter definitions between the official Ed-Fi API specification and MetaEd-generated schemas.

## Purpose

- Validate that MetaEd-generated OpenAPI schemas match the expected Ed-Fi API specification
- Identify missing, extra, or differing query parameters
- Check for consistency in parameter properties (schema, description, x-Ed-Fi-isIdentity)
- Verify queryFieldMapping completeness

## Usage

```bash
node compare-openapi-parameters.js [options]
```

### Options

- `--suppress-minor-diffs, -s` - Suppress warnings for x-Ed-Fi-isIdentity, description, and schema differences
- `--no-id-codes` - Ignore differences with "identificationCode" or parameters ending with "IdentificationSystemDescriptor"
- `--help, -h` - Show help message

## Input Files

The script expects two JSON files in the same directory:

1. **swagger-7.3-with-sample.json** - Reference Swagger/OpenAPI specification
2. **../artifact/v7_3/ds-5.2-api-schema-generated.json** - MetaEd-generated DS 5.2 API schema

## Features

### Parameter Comparison
- Resolves `$ref` references in both specifications
- Compares GET operation parameters for each resource endpoint
- Ignores descriptor endpoints by default
- Filters out pagination and change tracking parameters (offset, limit, pageToken, pageSize, minChangeVersion, maxChangeVersion, totalCount, Use-Snapshot)

### Difference Detection
The tool identifies:
- Parameters only in Swagger
- Parameters only in DS 5.2
- Parameters present in both but with differences in:
  - `in` field (query, path, header)
  - `schema` (ignoring property order)
  - `description`
  - `x-Ed-Fi-isIdentity`
- Query field mapping discrepancies

### Output

#### Console Output
- Color-coded results for easy reading
- Summary statistics (total resources, differences found)
- Detailed breakdown of differences per resource
- Truncated descriptions for readability

#### JSON Output
Full comparison results are saved to `openapi-comparison-results.json` with complete details of all differences found.

## Implementation Details

### Key Functions

- **loadJsonFile()** - Loads and parses JSON specification files
- **resolveParameterRefs()** - Resolves `$ref` references to actual parameter definitions
- **filterIgnoredParameters()** - Removes pagination and system parameters from comparison
- **compareParameters()** - Deep comparison of parameter properties
- **areObjectsEqual()** - Order-independent object comparison
- **isDescriptorEndpoint()** - Identifies descriptor resources to exclude
- **containsIdentificationCode()** - Detects identification-related parameters

### Ignored Parameters
The tool automatically ignores common system parameters that are not part of the domain model:
- Pagination: offset, limit, pageToken, pageSize, totalCount
- Change tracking: minChangeVersion, maxChangeVersion
- System headers: Use-Snapshot

## Example Output

```
OpenAPI Parameters Comparison Tool
==================================================

Loading files...
Found 150 resources in ds-5.2 file
Ignoring 25 descriptor endpoints
Ignoring parameters: offset, limit, pageToken, pageSize, totalCount, Use-Snapshot

Summary:
  Total resources compared: 125 (excluded 25 descriptors)
  Resources with differences: 3
  Total differences found: 7

Detailed Differences:

students (/ed-fi/students)
  Parameters only in swagger:
    - studentUniqueId
      Unique identifier for the student...
  Parameters only in ds-5.2:
    - uniqueId
      System-generated identifier...
```
