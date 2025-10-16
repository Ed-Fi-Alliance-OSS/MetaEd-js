#!/usr/bin/env node

/**
 * Advisory comparison script for MetaEd flattening metadata vs ODS SQL DDL.
 *
 * This tool reads an ApiSchema JSON file (containing flattening metadata)
 * and a SQL Server DDL script produced by the ODS/API project. It produces
 * a human-readable report summarizing the overlap between tables and data
 * columns (non-identity columns) in both sources. The intent is to guide
 * manual validation; the script never exits with a non-zero status.
 *
 * Usage:
 *   node compare-flattening-metadata-with-ods-sql.js \
 *     --apiSchema path/to/ApiSchema.json \
 *     --sql path/to/0020-Tables-authoritative.sql \
 *     [--output reports/ddl-comparison.md]
 */

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ARG_NAMES = {
  apiSchema: '--apiSchema',
  sql: '--sql',
  output: '--output',
  showExact: '--show-exact-matches',
  help: '--help',
};

const METADATA_COLUMN_NAMES = new Set([
  'id',
  'createdate',
  'lastmodifieddate',
  'changeversion',
  'documentid',
  'documentpartitionkey',
  'discriminator',
]);

function tokenizePascalCase(name) {
  if (!name) return [];
  const tokens = name.match(/[A-Z]+(?=[A-Z][a-z0-9]|[0-9]|$)|[A-Z]?[a-z0-9]+/g);
  return tokens ?? [name];
}

function collapseRepeatedSegments(tokens) {
  const result = [];
  let index = 0;

  while (index < tokens.length) {
    let collapseLength = 0;
    const maxSegment = Math.floor((tokens.length - index) / 2);
    for (let length = maxSegment; length >= 1; length -= 1) {
      let duplicate = true;
      for (let offset = 0; offset < length; offset += 1) {
        if (tokens[index + offset] !== tokens[index + length + offset]) {
          duplicate = false;
          break;
        }
      }
      if (duplicate) {
        collapseLength = length;
        break;
      }
    }

    const segmentLength = collapseLength || 1;
    for (let j = 0; j < segmentLength; j += 1) {
      result.push(tokens[index + j]);
    }
    index += segmentLength;
    if (collapseLength) {
      index += collapseLength;
    }
  }

  return result;
}

function buildComparisonKey(name) {
  const tokens = tokenizePascalCase(name);
  const collapsedTokens = collapseRepeatedSegments(tokens);
  const normalized = collapsedTokens.map((token) => token.toLowerCase()).join('');
  return {
    original: name,
    tokens,
    collapsedTokens,
    normalized,
  };
}

function sharedPrefixLength(tokensA, tokensB) {
  const limit = Math.min(tokensA.length, tokensB.length);
  let length = 0;
  while (length < limit && tokensA[length] === tokensB[length]) {
    length += 1;
  }
  return length;
}

function printUsage() {
  console.log(
    [
      'Advisory DDL comparison script',
      '',
      'Required arguments:',
      `  ${ARG_NAMES.apiSchema} <path>   Path to ApiSchema JSON containing flatteningMetadata`,
      `  ${ARG_NAMES.sql} <path>         Path to ODS SQL DDL script (e.g., 0020-Tables-authoritative.sql)`,
      '',
      'Optional arguments:',
      `  ${ARG_NAMES.output} <path>      Write report to file (directory will be created)`,
      `  ${ARG_NAMES.showExact}         Include tables with identical data columns`,
      '',
      'Defaults:',
      '  ApiSchema: packages/metaed-plugin-edfi-api-schema/test/integration/artifact/v7_3/ds-5.2-api-schema-authoritative.json',
      '  SQL     : packages/metaed-plugin-edfi-ods-sqlserver/test/integration/artifact/v7_3/0020-Tables-authoritative.sql',
      `  ${ARG_NAMES.help}              Show this message`,
    ].join('\n'),
  );
}

function parseArgs(argv) {
  const args = {
    apiSchemaPath: null,
    sqlPath: null,
    outputPath: null,
    showExactMatches: false,
    helpRequested: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const current = argv[i];
    if (current === ARG_NAMES.help) {
      args.helpRequested = true;
      break;
    }
    if (current === ARG_NAMES.apiSchema) {
      args.apiSchemaPath = argv[i + 1];
      i += 1;
    } else if (current === ARG_NAMES.sql) {
      args.sqlPath = argv[i + 1];
      i += 1;
    } else if (current === ARG_NAMES.output) {
      args.outputPath = argv[i + 1];
      i += 1;
    } else if (current === ARG_NAMES.showExact) {
      args.showExactMatches = true;
    } else {
      console.warn(`Unknown argument ignored: ${current}`);
    }
  }

  return args;
}

function readJsonFile(filePath) {
  const jsonText = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(jsonText);
}

function readTextFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function normalizeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function stripSqlSchema(rawName) {
  const cleaned = rawName.replace(/[[\]]/g, '');
  const parts = cleaned.split('.');
  return parts[parts.length - 1];
}

function collectFlatteningTables(apiSchema) {
  const resourceSchemas = apiSchema?.projectSchema?.resourceSchemas ?? {};
  const tables = [];

  const visit = (resourceKey, table, parentKey = null) => {
    if (!table || typeof table !== 'object') return;
    const tablePath = parentKey ? `${parentKey}.${table.baseName}` : `${resourceKey}.${table.baseName}`;
    const resource = resourceSchemas[resourceKey] ?? {};
    if (resource.isDescriptor === true) return;
    const comparisonKey = buildComparisonKey(table.baseName ?? '');

    const columns = (table.columns ?? []).map((column) => ({
      name: column.columnName,
      type: column.columnType,
      isParentReference: column.isParentReference === true,
      isNaturalKey: column.isNaturalKey === true,
      isDiscriminator: column.isDiscriminator === true,
      isRequired: column.isRequired === true,
    }));

    const identityColumns = columns.filter(
      (column) => column.isParentReference || column.isNaturalKey || column.isDiscriminator,
    );
    const identityNames = new Set(identityColumns.map((column) => normalizeName(column.name)));
    const dataColumns = columns.filter((column) => {
      const normalized = normalizeName(column.name);
      if (identityNames.has(normalized)) return false;
      if (METADATA_COLUMN_NAMES.has(normalized)) return false;
      if (column.name.endsWith('_Id')) return false;
      return true;
    });

    tables.push({
      resourceKey,
      baseName: table.baseName,
      fullPath: tablePath,
      isExtension: table.isExtensionTable === true,
      columns,
      identityColumns,
      identityNames,
      dataColumns,
      comparisonKey,
    });

    (table.childTables ?? []).forEach((childTable) => visit(resourceKey, childTable, tablePath));
  };

  Object.entries(resourceSchemas).forEach(([resourceKey, schema]) => {
    if (schema?.isDescriptor === true) return;
    const flattening = schema?.flatteningMetadata;
    if (!flattening || !flattening.table) return;
    visit(resourceKey, flattening.table);
  });

  return tables;
}

function parseSqlTables(sqlText) {
  const blocks = sqlText.split(/\bGO\b/i);
  const tables = [];

  blocks.forEach((rawBlock) => {
    const block = rawBlock.trim();
    if (!/CREATE\s+TABLE/i.test(block)) return;

    const headerMatch = block.match(/CREATE\s+TABLE\s+([^\s(]+)\s*\(/i);
    if (!headerMatch) return;

    const rawTableName = headerMatch[1];
    const tableName = stripSqlSchema(rawTableName);

    const startIndex = headerMatch.index + headerMatch[0].length - 1;
    const body = block.slice(startIndex);
    const closingIndex = body.lastIndexOf(')');
    if (closingIndex === -1) return;
    const inner = body.slice(1, closingIndex);
    const lines = inner
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const columns = [];
    const primaryKeyColumns = new Set();
    let capturingPrimaryKey = false;

    lines.forEach((line) => {
      const sanitizedLine = line.replace(/,$/, '').trim();

      if (capturingPrimaryKey) {
        if (sanitizedLine.startsWith(')')) {
          capturingPrimaryKey = false;
          return;
        }
        const matches = [...sanitizedLine.matchAll(/\[([^\]]+)\]/g)];
        matches.forEach((match) => primaryKeyColumns.add(match[1]));
        return;
      }

      if (/^CONSTRAINT/i.test(sanitizedLine) && /PRIMARY\s+KEY/i.test(sanitizedLine)) {
        const matches = [...sanitizedLine.matchAll(/\[([^\]]+)\]/g)];
        if (matches.length > 1) {
          matches.slice(1).forEach((match) => primaryKeyColumns.add(match[1]));
        } else {
          capturingPrimaryKey = true;
        }
        return;
      }

      if (!sanitizedLine.startsWith('[')) return;

      const columnMatch = sanitizedLine.match(/^\[([^\]]+)\]\s+(.*)$/);
      if (!columnMatch) return;
      const [, columnName, remainder] = columnMatch;
      const typeMatch = remainder.match(/^\[?([A-Za-z0-9]+)\]?/);
      const dataType = typeMatch ? typeMatch[1].toUpperCase() : 'UNKNOWN';
      const isNullable = !/\bNOT\s+NULL\b/i.test(remainder);
      const isIdentity = /\bIDENTITY\b/i.test(remainder);

      columns.push({
        name: columnName,
        dataType,
        isNullable,
        isIdentity,
      });
    });

    const identityNames = new Set(
      columns
        .filter(
          (column) =>
            primaryKeyColumns.has(column.name) || column.isIdentity || METADATA_COLUMN_NAMES.has(column.name.toLowerCase()),
        )
        .map((column) => normalizeName(column.name)),
    );

    const comparisonKey = buildComparisonKey(tableName);

    tables.push({
      rawName: rawTableName,
      tableName,
      normalizedName: normalizeName(tableName),
      columns,
      primaryKeyColumns,
      identityNames,
      comparisonKey,
      used: false,
    });
  });

  return tables;
}

function selectSqlDataColumns(sqlTable, flatteningIdentityNames) {
  const combinedIdentity = new Set([...sqlTable.identityNames]);
  flatteningIdentityNames.forEach((name) => combinedIdentity.add(name));

  const dataMap = new Map();
  sqlTable.columns.forEach((column) => {
    const normalized = normalizeName(column.name);
    if (combinedIdentity.has(normalized)) return;
    if (METADATA_COLUMN_NAMES.has(normalized)) return;
    dataMap.set(normalized, {
      name: column.name,
      isNullable: column.isNullable,
    });
  });

  return dataMap;
}

function selectFlatteningDataColumns(flatTable) {
  const dataMap = new Map();
  flatTable.dataColumns.forEach((column) => {
    const normalized = normalizeName(column.name);
    if (!dataMap.has(normalized)) {
      dataMap.set(normalized, {
        name: column.name,
        isRequired: column.isRequired === true,
      });
    }
  });
  return dataMap;
}

function matchTables(flatteningTables, sqlTables) {
  const sqlBuckets = new Map();
  sqlTables.forEach((table) => {
    const key = table.comparisonKey.normalized;
    const bucket = sqlBuckets.get(key) ?? [];
    bucket.push(table);
    sqlBuckets.set(key, bucket);
  });

  const matches = [];
  const unmatched = [];

  flatteningTables.forEach((flatTable) => {
    const key = flatTable.comparisonKey.normalized;
    const candidates = (sqlBuckets.get(key) ?? []).filter((candidate) => !candidate.used);
    let chosen = null;

    if (candidates.length === 1) {
      [chosen] = candidates;
    } else if (candidates.length > 1) {
      chosen = candidates.find((candidate) => candidate.tableName === flatTable.baseName) ?? candidates[0];
    }

    if (chosen) {
      chosen.used = true;
      matches.push({
        flattening: flatTable,
        sql: chosen,
        matchType: flatTable.baseName === chosen.tableName ? 'exact' : 'collapsed',
      });
      return;
    }

    let suggestion = null;
    let bestPrefix = 0;
    sqlTables.forEach((sqlTable) => {
      const shared = sharedPrefixLength(flatTable.comparisonKey.collapsedTokens, sqlTable.comparisonKey.collapsedTokens);
      if (shared > bestPrefix) {
        bestPrefix = shared;
        suggestion = { table: sqlTable, sharedPrefix: shared };
      }
    });

    unmatched.push({
      table: flatTable,
      suggestion: suggestion && bestPrefix > 0 ? suggestion : null,
    });
  });

  const unmatchedSql = sqlTables.filter((table) => !table.used);

  return { matches, unmatched, unmatchedSql };
}

function buildReport({
  apiSchemaPath,
  sqlPath,
  flatteningTables,
  sqlTables,
  matches,
  unmatchedFlattening,
  unmatchedSql,
  showExactMatches,
}) {
  const lines = [];
  lines.push('Advisory DDL Comparison Report');
  lines.push('================================');
  lines.push(`Input ApiSchema: ${apiSchemaPath}`);
  lines.push(`Input ODS SQL : ${sqlPath}`);
  lines.push('');

  const matchedCount = matches.length;
  const matchPercentage = flatteningTables.length === 0 ? 0 : Math.round((matchedCount / flatteningTables.length) * 100);

  lines.push('Summary');
  lines.push('-------');
  lines.push(`- Flattening tables: ${flatteningTables.length}`);
  lines.push(`- ODS tables       : ${sqlTables.length}`);
  lines.push(`- Matched tables   : ${matchedCount} (${matchPercentage}%)`);
  lines.push('');

  lines.push('Table Matches');
  lines.push('-------------');
  if (matches.length === 0) {
    lines.push('None');
  } else {
    let printedAny = false;
    matches
      .sort((a, b) => a.flattening.baseName.localeCompare(b.flattening.baseName))
      .forEach((match) => {
        const flatteningData = selectFlatteningDataColumns(match.flattening);
        const sqlData = selectSqlDataColumns(match.sql, match.flattening.identityNames);

        const flatteningKeys = [...flatteningData.keys()];
        const sqlKeys = [...sqlData.keys()];

        const flatteningOnly = flatteningKeys
          .filter((key) => !sqlData.has(key))
          .filter((key) => !flatteningData.get(key)?.name.endsWith('_Id'));
        const sqlOnly = sqlKeys.filter((key) => !flatteningData.has(key));
        const sharedKeys = flatteningKeys.filter((key) => sqlData.has(key));
        const optionalityDifferences = sharedKeys
          .map((key) => {
            const flatteningColumn = flatteningData.get(key);
            const sqlColumn = sqlData.get(key);
            const flatteningRequired = flatteningColumn?.isRequired === true;
            const sqlRequired = sqlColumn ? !sqlColumn.isNullable : false;
            if (flatteningRequired === sqlRequired) return null;
            const descriptor = `${flatteningColumn?.name ?? key} (flattening ${
              flatteningRequired ? 'required' : 'optional'
            }, ODS ${sqlRequired ? 'required' : 'optional'})`;
            return descriptor;
          })
          .filter((value) => value != null);

        const exactMatch =
          match.matchType === 'exact' &&
          flatteningData.size === sqlData.size &&
          flatteningOnly.length === 0 &&
          sqlOnly.length === 0;

        if (!showExactMatches && exactMatch) {
          return;
        }

        printedAny = true;
        const matchNote = match.matchType === 'exact' ? '' : ' (after collapsing repeated segments)';
        lines.push(`Table: ${match.flattening.baseName} ⇔ ${match.sql.tableName}${matchNote}`);
        lines.push(`- Data columns (flattening / ODS): ${flatteningData.size} / ${sqlData.size}`);
        if (flatteningOnly.length > 0) {
          const columnNames = flatteningOnly.map((key) => flatteningData.get(key).name).join(', ');
          lines.push(`- Present only in flattening metadata: ${columnNames}`);
        }
        if (sqlOnly.length > 0) {
          const columnNames = sqlOnly.map((key) => sqlData.get(key).name).join(', ');
          lines.push(`- Present only in ODS SQL: ${columnNames}`);
        }
        if (optionalityDifferences.length > 0) {
          lines.push(`- Optionality differences: ${optionalityDifferences.join(', ')}`);
        }
        lines.push('');
      });

    if (!printedAny) {
      lines.push('None (all matches identical; use --show-exact-matches to display)');
    }
  }

  lines.push('');
  lines.push('Unmatched Flattening Tables');
  lines.push('----------------------------');
  if (unmatchedFlattening.length === 0) {
    lines.push('None');
  } else {
    unmatchedFlattening
      .sort((a, b) => a.table.baseName.localeCompare(b.table.baseName))
      .forEach((entry) => {
        if (entry.suggestion) {
          lines.push(
            `- ${entry.table.baseName} (closest ODS: ${entry.suggestion.table.tableName}, shared prefix tokens: ${entry.suggestion.sharedPrefix})`,
          );
        } else {
          lines.push(`- ${entry.table.baseName}`);
        }
      });
  }

  lines.push('');
  lines.push('Unmatched ODS Tables');
  lines.push('---------------------');
  if (unmatchedSql.length === 0) {
    lines.push('None');
  } else {
    unmatchedSql
      .sort((a, b) => a.tableName.localeCompare(b.tableName))
      .forEach((table) => {
        lines.push(`- ${table.tableName}`);
      });
  }

  lines.push('');
  lines.push('Notes');
  lines.push('-----');
  lines.push('- This report is advisory only; inspect discrepancies manually before taking action.');
  lines.push('- Data column comparisons ignore primary key, parent reference, and known audit columns.');
  lines.push(`- Use ${ARG_NAMES.showExact} to include tables whose data columns already match exactly.`);
  lines.push('');

  return `${lines.join('\n')}\n`;
}

function main() {
  const args = parseArgs(process.argv);

  const defaultApiSchema = path.resolve(__dirname, 'artifact/v7_3/ds-5.2-api-schema-authoritative.json');
  const defaultSql = path.resolve(
    __dirname,
    '../../../metaed-plugin-edfi-ods-sqlserver/test/integration/artifact/v7_3/0020-Tables-authoritative.sql',
  );

  if (args.helpRequested) {
    printUsage();
    return;
  }

  const apiSchemaPath = path.resolve(args.apiSchemaPath ?? defaultApiSchema);
  const sqlPath = path.resolve(args.sqlPath ?? defaultSql);

  if (!fs.existsSync(apiSchemaPath)) {
    console.error(`ApiSchema file not found: ${apiSchemaPath}`);
    return;
  }

  if (!fs.existsSync(sqlPath)) {
    console.error(`SQL file not found: ${sqlPath}`);
    return;
  }

  const apiSchema = readJsonFile(apiSchemaPath);
  const sqlText = readTextFile(sqlPath);

  const flatteningTables = collectFlatteningTables(apiSchema);
  const sqlTables = parseSqlTables(sqlText).filter((table) => !table.tableName.toLowerCase().endsWith('descriptor'));
  const { matches, unmatched, unmatchedSql } = matchTables(flatteningTables, sqlTables);

  const report = buildReport({
    apiSchemaPath,
    sqlPath,
    flatteningTables,
    sqlTables,
    matches,
    unmatchedFlattening: unmatched,
    unmatchedSql,
    showExactMatches: args.showExactMatches,
  });

  console.log(report);

  if (args.outputPath) {
    const outputPath = path.resolve(args.outputPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, report, 'utf8');
  }
}

main();
