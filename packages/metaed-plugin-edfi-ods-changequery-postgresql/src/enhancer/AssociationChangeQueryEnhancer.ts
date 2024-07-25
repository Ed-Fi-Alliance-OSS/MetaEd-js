import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { performAssociationChangeQueryEnhancement } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'AssociationChangeQueryEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performAssociationChangeQueryEnhancement(
    metaEd,
    PLUGIN_NAME,
    TARGET_DATABASE_PLUGIN_NAME,
    createDeleteTrackingTableModel,
    createDeleteTrackingTriggerModel,
  );

  return {
    enhancerName,
    success: true,
  };
}
