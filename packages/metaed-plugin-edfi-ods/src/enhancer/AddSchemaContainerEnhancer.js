// @flow
import R from 'ramda';
import { orderByProp } from 'metaed-core';
import type { MetaEdEnvironment, EnhancerResult, NamespaceInfo } from 'metaed-core';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { EnumerationRow } from '../model/database/EnumerationRow';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { SchoolYearEnumerationRow } from '../model/database/SchoolYearEnumerationRow';
import type { Table } from '../model/database/Table';
import type { Trigger } from '../model/database/Trigger';

const enhancerName: string = 'AddSchemaContainerEnhancer';

const inNamespace = (namespaceInfo: NamespaceInfo) => R.filter(x => x.namespace === namespaceInfo.namespace);

export const orderRows = R.sortBy(R.compose(R.toLower, R.join(''), R.props(['name', 'description'])));

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.entity.namespaceInfo.forEach((namespaceInfo: NamespaceInfo) => {
    const repository: EdFiOdsEntityRepository = pluginEnvironment(metaEd).entity;
    const rows: Array<EnumerationRow | SchoolYearEnumerationRow> = inNamespace(namespaceInfo)([
      ...repository.row.values(),
    ]);
    const tables: Array<Table> = orderByProp('name')(
      [...repository.table.values()].filter((table: Table) => table.schema === namespaceInfo.namespace),
    );
    const foreignKeys: Array<ForeignKey> = R.chain(table => table.foreignKeys)(tables);
    const triggers: Array<Trigger> = namespaceInfo.namespace === 'edfi'
      ? orderByProp('name')(inNamespace(namespaceInfo)([...repository.trigger.values()]))
      : [];
    const enumerationRows: Array<EnumerationRow> = orderRows(
      rows.filter((row: EnumerationRow | SchoolYearEnumerationRow) => row.type === 'enumerationRow'),
    );
    const schoolYearEnumerationRows: Array<EnumerationRow> = orderByProp('name')(
      rows.filter((row: EnumerationRow | SchoolYearEnumerationRow) => row.type === 'schoolYearEnumerationRow'),
    );

    Object.assign(namespaceInfo.data.edfiOds.ods_Schema, {
      tables,
      foreignKeys,
      triggers,
      enumerationRows,
      schoolYearEnumerationRows,
    });
  });

  return {
    enhancerName,
    success: true,
  };
}

