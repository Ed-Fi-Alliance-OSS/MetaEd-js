// @flow
import type { GeneratedOutput, GeneratorResult, MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { registerPartials, template } from './OdsGeneratorBase';
import type { SchemaContainer } from '../model/database/SchemaContainer';

function fileNameFor(namespaceInfo: NamespaceInfo): string {
  if (namespaceInfo.namespace === 'edfi') return '0004-Tables.sql';

  const prefix: string = `0004-${namespaceInfo.projectExtension !== '' ? `${namespaceInfo.projectExtension}-` : ''}`;
  return `${prefix + namespaceInfo.namespace}.sql`;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  registerPartials();
  const results: Array<GeneratedOutput> = [];
  const namespaces: Array<NamespaceInfo> = metaEd.entity.namespaceInfo;

  namespaces.forEach(namespaceInfo => {
    const schema: SchemaContainer = namespaceInfo.data.edfiOds.ods_Schema;
    const generatedResult: string = [
      template().table({ tables: schema.tables }),
      template().foreignKey({ foreignKeys: schema.foreignKeys }),
      namespaceInfo.namespace === 'edfi' ? template().deleteEventTable() : '',
      template().trigger({ triggers: schema.triggers }),
      template().enumerationRow({ enumerationRows: schema.enumerationRows }),
      template().schoolYearEnumerationRow({ schoolYearEnumerationRows: schema.schoolYearEnumerationRows }),
    ].join('');

    results.push({
      name: 'Core SQL',
      folderName: 'ODS-SQLServer',
      fileName: fileNameFor(namespaceInfo),
      resultString: generatedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiOds.OdsGenerator',
    generatedOutput: results,
  };
}
