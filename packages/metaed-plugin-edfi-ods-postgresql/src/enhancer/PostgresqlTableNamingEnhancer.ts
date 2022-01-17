import hash from 'hash.js';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  tableEntities,
  Table,
  TableNameGroup,
  flattenNameComponentsFromGroup,
  constructCollapsedNameFrom,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { TableEdfiOdsPostgresql } from '../model/Table';

const enhancerName = 'PostgresqlTableNamingEnhancer';

type TableNaming = {
  tableName: string;
  primaryKeyName: string;
  truncatedTableNameHash: string;
};

export function postgresqlPrimaryKeyName(collapsedName: string, truncatedTableNameHash: string): string {
  const overallMaxLength = 63;
  const untruncatedName = `${collapsedName}_PK`;
  if (untruncatedName.length <= overallMaxLength) return untruncatedName;

  const maxLengthBeforeHash = 50;
  return `${untruncatedName.substr(0, maxLengthBeforeHash)}_${truncatedTableNameHash}_PK`;
}

function tableNameHash(nameGroup: TableNameGroup): string {
  const untruncatedName = flattenNameComponentsFromGroup(nameGroup)
    .map((nameComponent) => nameComponent.name)
    .join('');
  return hash.sha256().update(untruncatedName).digest('hex');
}

export function constructNameFrom(nameGroup: TableNameGroup): TableNaming {
  const overallMaxLength = 63;
  const truncatedTableNameHash = tableNameHash(nameGroup).substring(0, 6);

  const collapsedName = constructCollapsedNameFrom(nameGroup);
  const primaryKeyName = postgresqlPrimaryKeyName(collapsedName, truncatedTableNameHash);

  if (collapsedName.length <= overallMaxLength) {
    return { tableName: collapsedName, primaryKeyName, truncatedTableNameHash };
  }

  const maxLengthBeforeHash = 56;
  const tableNameBeforeHash = collapsedName.substring(0, maxLengthBeforeHash);

  return {
    tableName: `${tableNameBeforeHash}_${truncatedTableNameHash}`,
    primaryKeyName,
    truncatedTableNameHash,
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const tables: Map<string, Table> = tableEntities(metaEd, namespace);

    tables.forEach((table: Table) => {
      if (table.data.edfiOdsPostgresql == null) table.data.edfiOdsPostgresql = {};
      Object.assign(table.data.edfiOdsPostgresql as TableEdfiOdsPostgresql, constructNameFrom(table.nameGroup));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
