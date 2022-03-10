import { MetaEdEnvironment, EnhancerResult, SemVer, versionSatisfies } from '@edfi/metaed-core';
import { Column, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  CreateTriggerUpdateChangeVersion,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { versionSatisfiesForPostgresChangeQuerySupport, changeDataColumnsFor } from './EnhancerHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function createTriggerModel(table: Table, targetTechnologyVersion: SemVer): CreateTriggerUpdateChangeVersion {
  const isStyle5dot4 = versionSatisfies(targetTechnologyVersion, '>=5.4.0');
  const primaryKeyColumnNames: string[] = table.primaryKeys.map(
    (pkColumn: Column) => pkColumn.data.edfiOdsPostgresql.columnName,
  );
  return {
    schema: table.schema,
    tableName: isStyle5dot4 ? table.data.edfiOdsPostgresql.tableName.toLowerCase() : table.data.edfiOdsPostgresql.tableName,
    triggerName: 'UpdateChangeVersion',
    primaryKeyColumnNames: isStyle5dot4 ? primaryKeyColumnNames.map((p) => p.toLowerCase()) : primaryKeyColumnNames,
    changeDataColumns: changeDataColumnsFor(table),
    includeKeyChanges: isStyle5dot4 && table.parentEntity?.data?.edfiOdsRelational?.odsCascadePrimaryKeyUpdates,
    isStyle5dot4,
    omitDiscriminator: table.schema === 'edfi' && table.tableId === 'SchoolYearType',
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
