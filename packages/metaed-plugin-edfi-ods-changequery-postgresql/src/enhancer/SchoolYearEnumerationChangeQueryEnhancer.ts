import { MetaEdEnvironment, EnhancerResult, Namespace, versionSatisfies, PluginEnvironment } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { tableEntities } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  changeQueryIndicated,
  applyCreateDeleteTrackingTableEnhancement,
  applyCreateDeleteTrackingTriggerEnhancements,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'SchoolYearEnumerationEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (changeQueryIndicated(metaEd) && versionSatisfies(targetTechnologyVersion, '>=6.0.0')) {
    const edfiNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (edfiNamespace == null) return { enhancerName, success: false };

    const schoolYearTypeTable: Table | undefined = tableEntities(metaEd, edfiNamespace).get('SchoolYearType');
    if (schoolYearTypeTable == null) return { enhancerName, success: false };

    applyCreateDeleteTrackingTableEnhancement(
      metaEd,
      edfiNamespace,
      PLUGIN_NAME,
      schoolYearTypeTable,
      createDeleteTrackingTableModel,
    );
    applyCreateDeleteTrackingTriggerEnhancements(
      metaEd,
      edfiNamespace,
      PLUGIN_NAME,
      schoolYearTypeTable,
      createDeleteTrackingTriggerModel,
      TARGET_DATABASE_PLUGIN_NAME,
    );
  }
  return {
    enhancerName,
    success: true,
  };
}
