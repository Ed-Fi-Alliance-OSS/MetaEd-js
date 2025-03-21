// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { GeneratedOutput, GeneratorResult, MetaEdEnvironment, orderByPath } from '@edfi/metaed-core';
import { shouldApplyLicenseHeader } from '@edfi/metaed-plugin-edfi-ods-relational';
import { tableEntities, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { TableEdfiOdsRecordOwnership, recordOwnershipIndicated } from '@edfi/metaed-plugin-edfi-ods-recordownership';

const generatorName = 'edfiOdsRecordOwnershipPostgresql.AddCreatedByOwnershipColumnForTableGenerator';

function hasOwnershipTokenColumn(table: Table): boolean {
  if (table.data.edfiOdsRecordOwnership == null) return false;
  return (table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership).hasOwnershipTokenColumn;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const useLicenseHeader = shouldApplyLicenseHeader(metaEd);

  const templateFile = fs.readFileSync(path.join(__dirname, 'templates', `addCreatedByOwnershipColumn.hbs`)).toString();
  const template = handlebars.create().compile(templateFile);

  if (recordOwnershipIndicated(metaEd)) {
    metaEd.namespace.forEach((namespace) => {
      const tables: Table[] = orderByPath(['data', 'edfiOdsPostgresql', 'tableName'])(
        Array.from(tableEntities(metaEd, namespace).values()).filter(hasOwnershipTokenColumn),
      );
      if (tables.length > 0) {
        const generatedResult: string = template({
          tables,
          useLicenseHeader,
        });

        results.push({
          name: 'ODS Record Ownership PostgreSQL: AddCreatedByOwnershipColumnForTableGenerator',
          namespace: namespace.namespaceName,
          folderName: '/Database/PostgreSQL/ODS/Structure/RecordOwnership/',
          fileName: '0010-AddColumnOwnershipTokenForTable.sql',
          resultString: generatedResult,
          resultStream: null,
        });
      }
    });
  }

  return {
    generatorName,
    generatedOutput: results,
  };
}
