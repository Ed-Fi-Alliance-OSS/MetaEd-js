import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { tableEntities } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  changeQueryIndicated,
  applyCreateDeleteTrackingTableEnhancement,
  applyCreateDeleteTrackingTriggerEnhancements,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { TARGET_DATABASE_PLUGIN_NAME, versionSatisfiesForPostgresChangeQuerySupport } from './EnhancerHelper';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'BaseDescriptorChangeQueryEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfiesForPostgresChangeQuerySupport(metaEd) && changeQueryIndicated(metaEd)) {
    const edfiNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
    if (edfiNamespace == null) return { enhancerName, success: false };

    const baseDescriptorTable: Table | undefined = tableEntities(metaEd, edfiNamespace).get('Descriptor');
    if (baseDescriptorTable == null) return { enhancerName, success: false };

    applyCreateDeleteTrackingTableEnhancement(
      metaEd,
      edfiNamespace,
      PLUGIN_NAME,
      baseDescriptorTable,
      createDeleteTrackingTableModel,
    );
    applyCreateDeleteTrackingTriggerEnhancements(
      metaEd,
      edfiNamespace,
      PLUGIN_NAME,
      baseDescriptorTable,
      createDeleteTrackingTriggerModel,
      TARGET_DATABASE_PLUGIN_NAME,
    );
  }
  return {
    enhancerName,
    success: true,
  };
}
