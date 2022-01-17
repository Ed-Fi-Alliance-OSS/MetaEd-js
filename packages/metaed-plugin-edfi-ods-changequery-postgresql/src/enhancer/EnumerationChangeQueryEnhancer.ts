import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { performEnumerationChangeQueryEnhancement } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { PLUGIN_NAME } from '../PluginHelper';
import { TARGET_DATABASE_PLUGIN_NAME, versionSatisfiesForPostgresChangeQuerySupport } from './EnhancerHelper';

const enhancerName = 'EnumerationChangeQueryEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfiesForPostgresChangeQuerySupport(metaEd)) {
    performEnumerationChangeQueryEnhancement(
      metaEd,
      PLUGIN_NAME,
      TARGET_DATABASE_PLUGIN_NAME,
      createDeleteTrackingTableModel,
      createDeleteTrackingTriggerModel,
    );
  }
  return {
    enhancerName,
    success: true,
  };
}
