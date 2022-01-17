import { MetaEdEnvironment, ModelBase, EnhancerResult, getAllEntitiesOfType } from '@edfi/metaed-core';
import { Table, ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  changeQueryIndicated,
  tableForModel,
  applyCreateDeleteTrackingTableEnhancement,
  applyCreateDeleteTrackingTriggerEnhancements,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'DomainEntitySubclassChangeQueryEnhancer';

function domainEntitySuperclassForeignKeyFinder(mainTable: Table): ForeignKey | undefined {
  return mainTable.foreignKeys.find((foreignKey: ForeignKey) => foreignKey.sourceReference.isSubclassRelationship);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (changeQueryIndicated(metaEd)) {
    getAllEntitiesOfType(metaEd, 'domainEntitySubclass').forEach((modelBase: ModelBase) => {
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
        domainEntitySuperclassForeignKeyFinder,
      );
    });
  }
  return {
    enhancerName,
    success: true,
  };
}
