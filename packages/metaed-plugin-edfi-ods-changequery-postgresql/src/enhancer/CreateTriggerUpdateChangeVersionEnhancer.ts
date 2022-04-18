import { MetaEdEnvironment, EnhancerResult, SemVer, versionSatisfies } from '@edfi/metaed-core';
import { Column, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  CreateTriggerUpdateChangeVersion,
  hasRequiredNonIdentityNamespaceColumn,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { versionSatisfiesForPostgresChangeQuerySupport, changeDataColumnsFor } from './EnhancerHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function createTriggerModel(table: Table, targetTechnologyVersion: SemVer): CreateTriggerUpdateChangeVersion {
  const isStyle6dot0 = versionSatisfies(targetTechnologyVersion, '>=6.0.0');
  const primaryKeyColumnNames: string[] = table.primaryKeys.map(
    (pkColumn: Column) => pkColumn.data.edfiOdsPostgresql.columnName,
  );
  return {
    schema: table.schema,
    tableName: isStyle6dot0 ? table.data.edfiOdsPostgresql.tableName.toLowerCase() : table.data.edfiOdsPostgresql.tableName,
    triggerName: 'UpdateChangeVersion',
    primaryKeyColumnNames: isStyle6dot0 ? primaryKeyColumnNames.map((p) => p.toLowerCase()) : primaryKeyColumnNames,
    changeDataColumns: changeDataColumnsFor(table),
    includeKeyChanges: isStyle6dot0 && table.parentEntity?.data?.edfiOdsRelational?.odsCascadePrimaryKeyUpdates,
    isStyle6dot0,
    omitDiscriminator: table.schema === 'edfi' && table.tableId === 'SchoolYearType',
    includeNamespace: hasRequiredNonIdentityNamespaceColumn(table),
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfiesForPostgresChangeQuerySupport(metaEd)) {
    performCreateTriggerUpdateChangeVersionEnhancement(metaEd, PLUGIN_NAME, createTriggerModel);
  }
  return {
    enhancerName,
    success: true,
  };
}
