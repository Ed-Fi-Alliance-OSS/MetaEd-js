// @flow
import R from 'ramda';
import type { GeneratedOutput, GeneratorResult, MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { orderByProp } from 'metaed-core';
import { pluginEnvironment } from '../../../metaed-plugin-edfi-ods/src/enhancer/EnhancerHelper';
import { registerPartials, template } from './OdsGeneratorBase';
import type { EnumerationRow } from '../model/database/EnumerationRow';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { SchoolYearEnumerationRow } from '../model/database/SchoolYearEnumerationRow';
import type { Table } from '../model/database/Table';
import type { Trigger } from '../model/database/Trigger';

function fileNameFor(namespaceInfo: NamespaceInfo): string {
  if (namespaceInfo.namespace === 'edfi') return '0004-Tables.sql';

  const prefix: string = `0004${namespaceInfo.projectExtension !== '' ? `${namespaceInfo.projectExtension}-` : ''}`;
  return `${prefix + namespaceInfo.namespace}.sql`;
}

export const orderRows = R.sortBy(R.compose(R.toLower, R.join(''), R.props(['name', 'description'])));

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  registerPartials();
  const results: Array<GeneratedOutput> = [];
  const namespaces: Array<NamespaceInfo> = metaEd.entity.namespaceInfo;

  namespaces.forEach(namespaceInfo => {
    const tables: Array<Table> = orderByProp('name')([...pluginEnvironment(metaEd).entity.table.values()]);
    const foreignKeys: Array<ForeignKey> = R.chain(table => table.foreignKeys)(tables);
    const triggers: Array<Trigger> = orderByProp('name')([...pluginEnvironment(metaEd).entity.trigger.values()]);
    const rows: Array<EnumerationRow | SchoolYearEnumerationRow> = [...pluginEnvironment(metaEd).entity.row.values()];
    const enumerationRows: Array<EnumerationRow | SchoolYearEnumerationRow> = orderRows(rows.filter(
      (row: EnumerationRow | SchoolYearEnumerationRow) => row.type === 'enumerationRow',
    ));
    const schoolYearEnumerationRows: Array<EnumerationRow | SchoolYearEnumerationRow> = orderRows(rows.filter(
      (row: EnumerationRow | SchoolYearEnumerationRow) => row.type === 'schoolYearEnumerationRow',
    ));

    const generatedResult: string = [
      template().table({ tables }),
      template().foreignKey({ foreignKeys }),
      template().deleteEventTable(),
      template().trigger({ triggers }),
      template().enumerationRow({ enumerationRows }),
      template().schoolYearEnumerationRow({ schoolYearEnumerationRows }),
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
    generatorName: 'OdsGenerator',
    generatedOutput: results,
  };
}
