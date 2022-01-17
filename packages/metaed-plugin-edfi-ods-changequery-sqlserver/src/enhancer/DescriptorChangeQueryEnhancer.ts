import { MetaEdEnvironment, ModelBase, EnhancerResult } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { Table, ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  changeQueryIndicated,
  applyCreateDeleteTrackingTableEnhancement,
  tableForModel,
  applyCreateDeleteTrackingTriggerEnhancements,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'DescriptorChangeQueryEnhancer';

function descriptorBaseDescriptorForeignKeyFinder(mainTable: Table): ForeignKey | undefined {
  return mainTable.foreignKeys.find((foreignKey: ForeignKey) => foreignKey.sourceReference.isSubclassRelationship);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (changeQueryIndicated(metaEd)) {
    getAllEntitiesOfType(metaEd, 'descriptor').forEach((modelBase: ModelBase) => {
      applyCreateDeleteTrackingTableEnhancement(
        metaEd,
        modelBase.namespace,
        PLUGIN_NAME,
        tableForModel(modelBase),
        createDeleteTrackingTableModel,
      );
      applyCreateDeleteTrackingTriggerEnhancements(
        metaEd,
        modelBase.namespace,
        PLUGIN_NAME,
        tableForModel(modelBase),
        createDeleteTrackingTriggerModel,
        TARGET_DATABASE_PLUGIN_NAME,
        descriptorBaseDescriptorForeignKeyFinder,
      );
    });
  }
  return {
    enhancerName,
    success: true,
  };
}
