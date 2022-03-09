import { MetaEdEnvironment, EnhancerResult, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  AddColumnChangeVersionForTable,
  newAddColumnChangeVersionForTable,
  performAddColumnChangeVersionForTableEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { versionSatisfiesForPostgresChangeQuerySupport } from './EnhancerHelper';

const enhancerName = 'AddColumnChangeVersionForTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfiesForPostgresChangeQuerySupport(metaEd)) {
    const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
    const isStyle5dot4 = versionSatisfies(targetTechnologyVersion, '>=5.4.0');

    const createAddColumnModel = (table: Table): AddColumnChangeVersionForTable => ({
      ...newAddColumnChangeVersionForTable(),
      schema: table.schema,
      tableName: table.data.edfiOdsPostgresql.tableName,
      tableNameHash: table.data.edfiOdsPostgresql.truncatedTableNameHash,
      isStyle5dot4,
    });

    performAddColumnChangeVersionForTableEnhancement(metaEd, PLUGIN_NAME, createAddColumnModel);
  }
  return {
    enhancerName,
    success: true,
  };
}
