import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  CreateTriggerUpdateChangeVersion,
  performCreateTriggerUpdateChangeVersionEnhancement,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { versionSatisfiesForPostgresChangeQuerySupport } from './EnhancerHelper';

const enhancerName = 'CreateTriggerUpdateChangeVersionEnhancer';

function createModel(table: Table): CreateTriggerUpdateChangeVersion {
  return {
    schema: table.schema,
    tableName: table.data.edfiOdsPostgresql.tableName,
    triggerName: 'UpdateChangeVersion',
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfiesForPostgresChangeQuerySupport(metaEd)) {
    performCreateTriggerUpdateChangeVersionEnhancement(metaEd, PLUGIN_NAME, createModel);
  }
  return {
    enhancerName,
    success: true,
  };
}
