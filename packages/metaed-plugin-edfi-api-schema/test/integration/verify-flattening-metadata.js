/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

const fs = require('fs');
const path = require('path');

/**
 * Describes a column defined within flattening metadata.
 * @typedef {Object} FlattenColumn
 * @property {string} tableBaseName
 * @property {string} tablePath
 * @property {string} columnName
 * @property {string | undefined} jsonPath
 * @property {string | undefined} fromReferencePath
 */

/**
 * Describes a document path mapping entry.
 * @typedef {Object} DocumentPathEntry
 * @property {string | undefined} path
 * @property {Array<{referenceJsonPath: string}> | undefined} referenceJsonPaths
 */

/**
 * Captures the validation outcome for an individual endpoint.
 * @typedef {Object} EndpointReport
 * @property {string} endpointName
 * @property {Array<MatchRecord>} matches
 * @property {Array<MissingPathRecord>} missingPathRecords
 * @property {Array<MissingReferenceRecord>} missingReferenceRecords
 * @property {Array<ExtraneousColumnRecord>} extraneousColumnRecords
 */

/**
 * Represents a successful match between a document path and a column.
 * @typedef {Object} MatchRecord
 * @property {string} documentPathName
 * @property {string} jsonPathDescription
 * @property {string} columnQualifiedName
 * @property {string} matchType
 * @property {string} tablePath
 */

/**
 * Represents a missing direct JSON path mapping.
 * @typedef {Object} MissingPathRecord
 * @property {string} documentPathName
 * @property {string} jsonPath
 */

/**
 * Represents a missing reference mapping.
 * @typedef {Object} MissingReferenceRecord
 * @property {string} documentPathName
 * @property {string[]} referenceJsonPaths
 */

/**
 * Represents an extraneous flattening metadata column.
 * @typedef {Object} ExtraneousColumnRecord
 * @property {string} columnQualifiedName
 * @property {string} tablePath
 * @property {string | null} jsonPath
 * @property {string | null} fromReferencePath
 */

/**
 * Aggregated summary entry for a missing JSON path mapping.
 * @typedef {Object} MissingPathSummary
 * @property {string} endpointName
 * @property {string} documentPathName
 * @property {string} jsonPath
 */

/**
 * Aggregated summary entry for a missing reference mapping.
 * @typedef {Object} MissingReferenceSummary
 * @property {string} endpointName
 * @property {string} documentPathName
 * @property {string[]} referenceJsonPaths
 */

/**
 * Aggregated summary entry for an extraneous column.
 * @typedef {Object} ExtraneousColumnSummary
 * @property {string} endpointName
 * @property {string} columnQualifiedName
 * @property {string | null} jsonPath
 * @property {string | null} fromReferencePath
 */

/**
 * Recursively collects columns from a flattening metadata table.
 * @param {any} table
 * @param {string[]} ancestors
 * @returns {FlattenColumn[]}
 */
function collectColumns(table, ancestors) {
  const columns = [];
  const currentPathSegments = [...ancestors, table.baseName];
  const tablePath = currentPathSegments.join(' > ');
  const tableColumns = Array.isArray(table.columns) ? table.columns : [];

  for (const column of tableColumns) {
    columns.push({
      tableBaseName: table.baseName,
      tablePath,
      columnName: column.columnName,
      jsonPath: typeof column.jsonPath === 'string' ? column.jsonPath : undefined,
      fromReferencePath: typeof column.fromReferencePath === 'string' ? column.fromReferencePath : undefined,
    });
  }

  const childTables = Array.isArray(table.childTables) ? table.childTables : [];
  for (const childTable of childTables) {
    columns.push(...collectColumns(childTable, currentPathSegments));
  }

  return columns;
}

/**
 * Builds a unique identifier for a column for match bookkeeping.
 * @param {FlattenColumn} column
 * @returns {string}
 */
function columnKey(column) {
  return `${column.tablePath}::${column.columnName}`;
}

/**
 * Validates a single endpoint by comparing document paths and flattening metadata.
 * @param {string} endpointName
 * @param {any} endpointSchema
 * @returns {EndpointReport}
 */
function analyzeEndpoint(endpointName, endpointSchema) {
  const documentPathsMapping = endpointSchema.documentPathsMapping || {};
  const { flatteningMetadata } = endpointSchema;
  const matches = [];
  const missingPathRecords = [];
  const missingReferenceRecords = [];
  const extraneousColumnRecords = [];

  if (!flatteningMetadata || typeof flatteningMetadata !== 'object' || !flatteningMetadata.table) {
    console.warn(`Warning: endpoint "${endpointName}" does not have flatteningMetadata.table defined.`);
    for (const [documentPathName, mappingEntry] of Object.entries(documentPathsMapping)) {
      if (mappingEntry && typeof mappingEntry === 'object') {
        if (typeof mappingEntry.path === 'string') {
          missingPathRecords.push({
            documentPathName,
            jsonPath: mappingEntry.path,
          });
        } else if (Array.isArray(mappingEntry.referenceJsonPaths)) {
          missingReferenceRecords.push({
            documentPathName,
            referenceJsonPaths: mappingEntry.referenceJsonPaths.map((entry) => entry.referenceJsonPath),
          });
        }
      }
    }

    return {
      endpointName,
      matches,
      missingPathRecords,
      missingReferenceRecords,
      extraneousColumnRecords,
    };
  }

  const columns = collectColumns(flatteningMetadata.table, []);

  const pathToColumns = new Map();
  const referenceToColumns = new Map();
  const pathToDocumentPathNames = new Map();

  for (const [documentPathName, mappingEntry] of Object.entries(documentPathsMapping)) {
    if (!mappingEntry || typeof mappingEntry !== 'object') {
      continue;
    }

    if (typeof mappingEntry.path === 'string') {
      const docPath = mappingEntry.path;
      if (!pathToDocumentPathNames.has(docPath)) {
        pathToDocumentPathNames.set(docPath, new Set());
      }

      pathToDocumentPathNames.get(docPath).add(documentPathName);
    } else if (Array.isArray(mappingEntry.referenceJsonPaths)) {
      for (const referenceEntry of mappingEntry.referenceJsonPaths) {
        if (!referenceEntry || typeof referenceEntry !== 'object') {
          continue;
        }

        const { referenceJsonPath } = referenceEntry;
        if (typeof referenceJsonPath !== 'string') {
          continue;
        }

        if (!pathToDocumentPathNames.has(referenceJsonPath)) {
          pathToDocumentPathNames.set(referenceJsonPath, new Set());
        }

        pathToDocumentPathNames.get(referenceJsonPath).add(documentPathName);
      }
    }
  }

  for (const column of columns) {
    if (typeof column.jsonPath === 'string') {
      if (!pathToColumns.has(column.jsonPath)) {
        pathToColumns.set(column.jsonPath, []);
      }

      pathToColumns.get(column.jsonPath).push(column);
    }

    if (typeof column.fromReferencePath === 'string') {
      if (!referenceToColumns.has(column.fromReferencePath)) {
        referenceToColumns.set(column.fromReferencePath, []);
      }

      referenceToColumns.get(column.fromReferencePath).push(column);
    }
  }

  const matchedColumnKeys = new Set();
  const sortedDocumentPathNames = Object.keys(documentPathsMapping).sort();

  for (const documentPathName of sortedDocumentPathNames) {
    /** @type {DocumentPathEntry | undefined} */
    const mappingEntry = documentPathsMapping[documentPathName];
    if (!mappingEntry || typeof mappingEntry !== 'object') {
      continue;
    }

    if (typeof mappingEntry.path === 'string') {
      const jsonPath = mappingEntry.path;
      const associatedColumns = pathToColumns.get(jsonPath) || [];

      if (associatedColumns.length === 0) {
        missingPathRecords.push({
          documentPathName,
          jsonPath,
        });
      } else {
        for (const column of associatedColumns) {
          const columnQualifiedName = `${column.tableBaseName}.${column.columnName}`;
          matches.push({
            documentPathName,
            jsonPathDescription: jsonPath,
            columnQualifiedName,
            matchType: 'jsonPath',
            tablePath: column.tablePath,
          });
          matchedColumnKeys.add(columnKey(column));
        }
      }
    } else if (Array.isArray(mappingEntry.referenceJsonPaths)) {
      const expectedReferencePaths = mappingEntry.referenceJsonPaths
        .map((entry) => (entry && typeof entry === 'object' ? entry.referenceJsonPath : undefined))
        .filter((referencePath) => typeof referencePath === 'string');

      const columnsFromReference = referenceToColumns.get(documentPathName) || [];
      const columnsFromJsonPaths = [];

      for (const referencePath of expectedReferencePaths) {
        const candidates = pathToColumns.get(referencePath) || [];
        for (const candidate of candidates) {
          columnsFromJsonPaths.push(candidate);
        }
      }

      const associatedColumns = [];
      const seenColumnKeys = new Set();

      for (const column of [...columnsFromReference, ...columnsFromJsonPaths]) {
        const key = columnKey(column);
        if (seenColumnKeys.has(key)) {
          continue;
        }

        seenColumnKeys.add(key);
        associatedColumns.push(column);
      }

      if (associatedColumns.length === 0) {
        missingReferenceRecords.push({
          documentPathName,
          referenceJsonPaths: expectedReferencePaths,
        });
      } else {
        for (const column of associatedColumns) {
          const columnQualifiedName = `${column.tableBaseName}.${column.columnName}`;
          const jsonPathDescription = column.fromReferencePath
            ? '(via fromReferencePath)'
            : column.jsonPath || '(reference)';

          matches.push({
            documentPathName,
            jsonPathDescription,
            columnQualifiedName,
            matchType: column.fromReferencePath ? 'reference' : 'reference-jsonPath',
            tablePath: column.tablePath,
          });
          matchedColumnKeys.add(columnKey(column));
        }
      }
    }
  }

  for (const column of columns) {
    const key = columnKey(column);
    if (matchedColumnKeys.has(key)) {
      continue;
    }

    if (typeof column.jsonPath === 'string') {
      const documentPathNames = pathToDocumentPathNames.get(column.jsonPath);
      if (!documentPathNames || documentPathNames.size === 0) {
        extraneousColumnRecords.push({
          columnQualifiedName: `${column.tableBaseName}.${column.columnName}`,
          tablePath: column.tablePath,
          jsonPath: column.jsonPath,
          fromReferencePath: null,
        });
      }
    } else if (typeof column.fromReferencePath === 'string') {
      if (!Object.prototype.hasOwnProperty.call(documentPathsMapping, column.fromReferencePath)) {
        extraneousColumnRecords.push({
          columnQualifiedName: `${column.tableBaseName}.${column.columnName}`,
          tablePath: column.tablePath,
          jsonPath: null,
          fromReferencePath: column.fromReferencePath,
        });
      }
    }
  }

  matches.sort((left, right) => {
    if (left.documentPathName === right.documentPathName) {
      return left.columnQualifiedName.localeCompare(right.columnQualifiedName);
    }

    return left.documentPathName.localeCompare(right.documentPathName);
  });

  return {
    endpointName,
    matches,
    missingPathRecords,
    missingReferenceRecords,
    extraneousColumnRecords,
  };
}

/**
 * Prints a detailed report for an endpoint.
 * @param {EndpointReport} report
 */
function printEndpointReport(report) {
  console.log(`Endpoint: ${report.endpointName}`);

  if (report.matches.length === 0) {
    console.log('  No document path mappings found.');
  } else {
    for (const match of report.matches) {
      console.log(
        `  ✓ DocumentPath=${match.documentPathName} | JsonPath=${match.jsonPathDescription} | Column=${match.columnQualifiedName}`,
      );
    }
  }

  if (report.missingPathRecords.length > 0) {
    console.log('  Missing document path mappings:');
    for (const missing of report.missingPathRecords) {
      console.log(`    - DocumentPath=${missing.documentPathName} | JsonPath=${missing.jsonPath}`);
    }
  }

  if (report.missingReferenceRecords.length > 0) {
    console.log('  Missing reference path mappings:');
    for (const missing of report.missingReferenceRecords) {
      console.log(
        `    - DocumentPath=${missing.documentPathName} | ReferenceJsonPaths=${missing.referenceJsonPaths.join(', ')}`,
      );
    }
  }

  if (report.extraneousColumnRecords.length > 0) {
    console.log('  Extraneous flattening metadata columns:');
    for (const extra of report.extraneousColumnRecords) {
      if (extra.jsonPath) {
        console.log(`    - Column=${extra.columnQualifiedName} | JsonPath=${extra.jsonPath} | TablePath=${extra.tablePath}`);
      } else if (extra.fromReferencePath) {
        console.log(
          `    - Column=${extra.columnQualifiedName} | FromReferencePath=${extra.fromReferencePath} | TablePath=${extra.tablePath}`,
        );
      }
    }
  }

  console.log('');
}

/**
 * Prints an aggregate summary across all endpoints.
 * @param {MissingPathSummary[]} missingPaths
 * @param {MissingReferenceSummary[]} missingReferences
 * @param {ExtraneousColumnSummary[]} extraneousColumns
 * @param {string[]} endpointsWithIssues
 */
function printSummary(missingPaths, missingReferences, extraneousColumns, endpointsWithIssues) {
  if (missingPaths.length === 0 && missingReferences.length === 0 && extraneousColumns.length === 0) {
    console.log('Validation successful: all document paths are represented within flattening metadata columns.');
  } else {
    console.log('Validation issues detected:');
    console.log(`  Missing document path mappings: ${missingPaths.length}`);
    for (const missing of missingPaths) {
      console.log(
        `    - Endpoint=${missing.endpointName} | DocumentPath=${missing.documentPathName} | JsonPath=${missing.jsonPath}`,
      );
    }
    console.log(`  Missing reference path mappings: ${missingReferences.length}`);
    for (const missing of missingReferences) {
      console.log(
        `    - Endpoint=${missing.endpointName} | DocumentPath=${
          missing.documentPathName
        } | ReferenceJsonPaths=${missing.referenceJsonPaths.join(', ')}`,
      );
    }
    console.log(`  Extraneous flattening metadata columns: ${extraneousColumns.length}`);
    for (const extra of extraneousColumns) {
      let detail;
      if (extra.jsonPath) {
        detail = `JsonPath=${extra.jsonPath}`;
      } else if (extra.fromReferencePath) {
        detail = `FromReferencePath=${extra.fromReferencePath}`;
      } else {
        detail = 'No source path';
      }
      console.log(`    - Endpoint=${extra.endpointName} | Column=${extra.columnQualifiedName} | ${detail}`);
    }
    console.log(`  Endpoints with issues: ${endpointsWithIssues.length}`);
    if (endpointsWithIssues.length > 0) {
      console.log(`    - ${endpointsWithIssues.join(', ')}`);
    }
  }
}

/**
 * Prints usage help for the script.
 */
function printUsage() {
  console.log('Usage: node verify-flattening-metadata.js <path-to-ApiSchema.json>');
}

/**
 * Entry point that orchestrates validation and reporting.
 */
function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const filePath = path.resolve(args[0]);
  if (!fs.existsSync(filePath)) {
    console.error(`Input file not found: ${filePath}`);
    process.exitCode = 1;
    return;
  }

  /** @type {any} */
  const schema = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const resourceSchemas = schema?.projectSchema?.resourceSchemas;
  if (!resourceSchemas || typeof resourceSchemas !== 'object') {
    console.error('Unable to locate projectSchema.resourceSchemas in the provided file.');
    process.exitCode = 1;
    return;
  }

  /** @type {Record<string, string>} */
  const endpointNameMapping = schema?.projectSchema?.caseInsensitiveEndpointNameMapping;
  if (!endpointNameMapping || typeof endpointNameMapping !== 'object') {
    console.error('Unable to locate caseInsensitiveEndpointNameMapping in the provided file.');
    process.exitCode = 1;
    return;
  }

  const endpointNames = Array.from(new Set(Object.values(endpointNameMapping))).sort();

  /** @type {MissingPathSummary[]} */
  const missingPathSummaries = [];
  /** @type {MissingReferenceSummary[]} */
  const missingReferenceSummaries = [];
  /** @type {ExtraneousColumnSummary[]} */
  const extraneousColumnSummaries = [];
  const endpointsWithIssues = new Set();

  for (const endpointName of endpointNames) {
    /** @type {any} */
    const endpointSchema = resourceSchemas[endpointName];
    if (!endpointSchema) {
      console.warn(
        `Warning: endpoint "${endpointName}" is referenced in caseInsensitiveEndpointNameMapping but missing from resourceSchemas.`,
      );
      continue;
    }

    if (endpointSchema.isDescriptor === true || endpointSchema.isSchoolYearEnumeration === true) {
      continue;
    }

    const report = analyzeEndpoint(endpointName, endpointSchema);
    if (
      report.missingPathRecords.length > 0 ||
      report.missingReferenceRecords.length > 0 ||
      report.extraneousColumnRecords.length > 0
    ) {
      endpointsWithIssues.add(endpointName);
    }

    for (const missing of report.missingPathRecords) {
      missingPathSummaries.push({
        endpointName,
        documentPathName: missing.documentPathName,
        jsonPath: missing.jsonPath,
      });
    }

    for (const missing of report.missingReferenceRecords) {
      missingReferenceSummaries.push({
        endpointName,
        documentPathName: missing.documentPathName,
        referenceJsonPaths: missing.referenceJsonPaths,
      });
    }

    for (const extra of report.extraneousColumnRecords) {
      extraneousColumnSummaries.push({
        endpointName,
        columnQualifiedName: extra.columnQualifiedName,
        jsonPath: extra.jsonPath,
        fromReferencePath: extra.fromReferencePath,
      });
    }

    printEndpointReport(report);
  }

  printSummary(
    missingPathSummaries,
    missingReferenceSummaries,
    extraneousColumnSummaries,
    Array.from(endpointsWithIssues).sort(),
  );
  if (missingPathSummaries.length > 0 || missingReferenceSummaries.length > 0 || extraneousColumnSummaries.length > 0) {
    process.exitCode = 1;
  }
}

module.exports = {
  analyzeEndpoint,
};

if (require.main === module) {
  main();
}
