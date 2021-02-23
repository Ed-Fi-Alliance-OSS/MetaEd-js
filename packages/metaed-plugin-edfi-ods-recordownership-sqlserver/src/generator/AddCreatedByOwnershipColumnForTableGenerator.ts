import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { GeneratedOutput, GeneratorResult, MetaEdEnvironment, versionSatisfies, PluginEnvironment } from 'metaed-core';
import { tableEntities, Table } from 'metaed-plugin-edfi-ods-relational';
import { TableEdfiOdsRecordOwnership, recordOwnershipIndicated } from 'metaed-plugin-edfi-ods-recordownership';

const generatorName = 'edfiOdsRecordOwnershipSqlServer.AddCreatedByOwnershipColumnForTableGenerator';

function hasOwnershipTokenColumn(table: Table): boolean {
  if (table.data.edfiOdsRecordOwnership == null) return false;
  return (table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership).hasOwnershipTokenColumn;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRecordOwnershipSqlServer') as PluginEnvironment;
  const useLicenseHeader = metaEd.allianceMode && versionSatisfies(targetTechnologyVersion, '>=5.0.0');

  const templateFile = fs.readFileSync(path.join(__dirname, 'templates', `addCreatedByOwnershipColumn.hbs`)).toString();
  const template = handlebars.create().compile(templateFile);

  if (recordOwnershipIndicated(metaEd)) {
    metaEd.namespace.forEach(namespace => {
      const tables: Table[] = Array.from(tableEntities(metaEd, namespace).values()).filter(hasOwnershipTokenColumn);
      if (tables.length > 0) {
        const generatedResult: string = template({
          tables,
          useLicenseHeader,
        });

        results.push({
          name: 'ODS Record Ownership SQL Server: AddCreatedByOwnershipColumnForTableGenerator',
          namespace: namespace.namespaceName,
          folderName: '/Database/SQLServer/ODS/Structure/RecordOwnership/',
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
