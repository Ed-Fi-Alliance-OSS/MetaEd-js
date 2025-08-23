# OpenAPI Parameters Comparison Analysis

## Overview

The `compare-openapi-parameters.js` script performs a comprehensive comparison between two OpenAPI specification sources in the Ed-Fi ecosystem:

1. **Swagger File** (`swagger-7.3-with-sample.json`): The reference OpenAPI specification
2. **DS-5.2 Generated File** (`packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-generated.json`): MetaEd-generated API schema containing OpenAPI fragments and query field mappings

## Purpose

This comparison tool was created to identify and analyze discrepancies between the expected API specification (swagger) and what MetaEd generates, helping developers:
- Identify missing parameters in either specification
- Find schema definition inconsistencies
- Validate query field mappings
- Ensure API compatibility between systems

## How the Script Works

### 1. Data Loading and Filtering

The script loads both JSON files and extracts resource definitions. It automatically:
- **Excludes descriptor endpoints** (212 resources ending with "descriptors" or containing "descriptor")
- **Focuses on data resources** (137 non-descriptor resources)
- **Ignores common parameters**: offset, limit, pageToken, pageSize, minChangeVersion, maxChangeVersion, MinChangeVersion, MaxChangeVersion, totalCount, Use-Snapshot

### 2. Two-Layer Comparison

For each resource endpoint, the script performs two distinct comparisons:

#### A. OpenAPI Parameter Comparison
Compares parameters between:
- Swagger: `.paths["/ed-fi/{resource}"].get.parameters`
- DS-5.2: `.projectSchema.resourceSchemas.{resource}.openApiFragments.resources.paths["/ed-fi/{resource}"].get.parameters`

The comparison identifies:
- **Parameters only in swagger**: Parameters defined in swagger but not in DS-5.2
- **Parameters only in DS-5.2**: Parameters defined in DS-5.2 but not in swagger
- **Parameter differences**: Same parameter name but different schema/properties

#### B. Query Field Mapping Comparison
Compares swagger parameters against DS-5.2 query field mappings:
- DS-5.2 QueryFieldMapping: `.projectSchema.resourceSchemas.{resource}.queryFieldMapping`
- Identifies which query fields don't have corresponding swagger parameters and vice versa

### 3. Schema Comparison Logic

The script uses **order-agnostic comparison** for schema objects:
- Objects with properties in different orders are considered equal
- Example: `{"type": "string", "format": "date"}` equals `{"format": "date", "type": "string"}`

### 4. Output

Results are saved to `openapi-comparison-results.json` with the following structure for each resource:

```json
{
  "resource": "resourceName",
  "path": "/ed-fi/resourceName",
  "onlyInSwagger": [...],
  "onlyInDs52": [...],
  "parameterDifferences": [...],
  "queryFieldsOnlyInSwagger": [...],
  "queryFieldsOnlyInDs52": [...]
}
```

## Key Findings

### Overall Statistics (Generated File)
- **137 resources analyzed** (212 descriptors excluded)
- **1,383 total differences** found
- **All 137 resources** have at least one type of difference

### Difference Categories

| Category | Count | Description |
|----------|-------|-------------|
| Parameters only in swagger | 39 resources | Swagger defines parameters not in DS-5.2 |
| Parameters only in DS-5.2 | 30 resources | DS-5.2 defines parameters not in swagger |
| Parameter schema differences | 136 resources | Same parameter, different schema definitions |
| Query fields only in swagger | 137 resources | All resources (mainly 'id' parameter) |
| Query fields only in DS-5.2 | 31 resources | Query fields without swagger parameters |

### Common Issues Identified

#### 1. Universal 'id' Parameter Issue
- **Problem**: All 137 resources have 'id' parameter in swagger but not in DS-5.2 query fields
- **Impact**: Query field mapping incomplete for resource identification

#### 2. Schema Constraint Differences
The generated file commonly lacks:
- **maxLength** constraints on string fields
- **minLength** constraints on string fields
- Specific numeric type definitions (uses `number/double` instead of `integer/int32/int64`)

#### 3. Description Mismatches
Many parameters have different or missing descriptions between specifications

### Example: disciplineActions Resource

```
Parameter Differences:
- Parameters only in swagger: (none)
- Parameters only in DS-5.2: (none)
- Parameters with schema differences: 
  - disciplineActionIdentifier (missing maxLength: 36)
  - studentUniqueId (missing maxLength: 32)
  - responsibilitySchoolId (type mismatch: integer/int64 vs number/double)
  - assignmentSchoolId (type mismatch: integer/int64 vs number/double)
  - disciplineActionLengthDifferenceReasonDescriptor (missing maxLength: 306)

Query Field Differences:
- Query fields only in swagger: id
- Query fields only in DS-5.2: (none)
```

## Root Causes and Solutions

### 1. Missing Schema Constraints in Generated File

**Likely Cause**: The MetaEd generation process may not be preserving validation constraints from the source models.

**Solution**: 
- Review MetaEd enhancers that generate OpenAPI schemas
- Ensure maxLength, minLength, and other constraints are transferred from MetaEd models to OpenAPI fragments
- Check `packages/metaed-plugin-edfi-api-schema/src/enhancers/openApiResourceFragmentEnhancer.ts`

### 2. Type System Mismatches

**Likely Cause**: Different type mapping strategies between systems.

**Solution**:
- Standardize numeric type mappings (integer vs number, int32/int64 vs double)
- Create consistent type conversion rules in MetaEd generators

### 3. Missing 'id' in Query Field Mappings

**Likely Cause**: The 'id' parameter may be handled separately as a system field.

**Solution**:
- Determine if 'id' should be in queryFieldMapping
- If yes, add it during the enhancement phase
- If no, document why it's excluded and ensure consistent handling

### 4. Parameters Not in Query Fields

**Likely Cause**: Some parameters may be for filtering/pagination rather than data fields.

**Solution**:
- Review each missing parameter to determine if it should be queryable
- Update queryFieldMapping generation to include all relevant parameters

## Recommendations for Resolution

1. **Immediate Actions**:
   - Add missing validation constraints to the MetaEd schema generation
   - Standardize type mappings between integer and number types
   - Review and fix the 'id' parameter handling

2. **Code Investigation Areas**:
   - `packages/metaed-plugin-edfi-api-schema/src/enhancers/` - Schema generation logic
   - `packages/metaed-plugin-edfi-api-schema/src/helpers/` - Type mapping utilities
   - MetaEd model definitions that source the constraints

3. **Testing Improvements**:
   - Add automated tests comparing generated vs expected schemas
   - Validate that all constraints from source models appear in generated OpenAPI
   - Create snapshot tests for OpenAPI fragment generation

4. **Documentation Needs**:
   - Document the expected mapping between MetaEd types and OpenAPI types
   - Clarify which parameters should appear in queryFieldMapping
   - Explain the role and handling of system fields like 'id'

## Script Usage

```bash
# Run the comparison
node compare-openapi-parameters.js

# Output files:
# - openapi-comparison-results.json: Full comparison results
# - Console output: Summary and examples
```

## Configuration

The script can be modified to:
- Change source files (line 19-20)
- Add/remove ignored parameters (line 23-34)
- Include/exclude descriptor endpoints (line 163-166)

## Conclusion

The comparison reveals systematic differences between the swagger specification and MetaEd-generated schemas, primarily around:
- Missing validation constraints
- Type system inconsistencies
- Incomplete query field mappings

These issues appear to be in the generation/enhancement phase of MetaEd rather than the source data, suggesting fixes should focus on the MetaEd plugin code that generates OpenAPI fragments.