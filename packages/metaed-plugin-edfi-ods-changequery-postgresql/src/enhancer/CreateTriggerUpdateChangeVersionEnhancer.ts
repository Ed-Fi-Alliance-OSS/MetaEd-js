import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  CreateTriggerUpdateChangeVersion,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { versionSatisfiesForPostgresChangeQuerySupport } from './EnhancerHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function createTriggerModel(table: Table): CreateTriggerUpdateChangeVersion {
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsPostgresql.tableName,
    triggerName: 'UpdateChangeVersion',
    primaryKeyColumnNames: [],
    changeDataColumns: [],
    includeKeyChanges: false,
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
