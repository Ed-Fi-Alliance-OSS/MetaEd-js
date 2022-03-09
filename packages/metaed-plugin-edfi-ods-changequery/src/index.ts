import { MetaEdPlugin, newMetaEdPlugin } from '@edfi/metaed-core';
import { validate as NamespaceMustNotBeNamedChanges } from './validator/NamespaceMustNotBeNamedChanges';

export { changeQueryIndicated } from './enhancer/ChangeQueryIndicator';
export { AddColumnChangeVersionForTable } from './model/AddColumnChangeVersionForTable';
export { CreateTriggerUpdateChangeVersion } from './model/CreateTriggerUpdateChangeVersion';
export { ChangeDataColumn, newChangeDataColumn } from './model/ChangeDataColumn';
export { DeleteTrackingTable, newDeleteTrackingTable } from './model/DeleteTrackingTable';
export { DeleteTrackingTrigger, newDeleteTrackingTrigger } from './model/DeleteTrackingTrigger';
export { PairedForeignKeyColumnName } from './model/PairedForeignKeyColumnName';
export {
  pluginEnvironment,
  getPrimaryKeys,
  edfiOdsChangeQueryRepositoryForNamespace,
  deleteTrackingTableEntities,
  deleteTrackingTriggerEntities,
  addColumnChangeVersionForTableEntities,
  createTriggerUpdateChangeVersionEntities,
  performAddColumnChangeVersionForTableEnhancement,
  applyCreateDeleteTrackingTableEnhancement,
  tableForModel,
  performAssociationChangeQueryEnhancement,
  performCreateTriggerUpdateChangeVersionEnhancement,
  performEnumerationChangeQueryEnhancement,
} from './enhancer/EnhancerHelper';
export {
  SuperclassForeignKeyFinder,
  applyCreateDeleteTrackingTriggerEnhancements,
} from './enhancer/DeleteTrackingTriggerCreator';
export {
  ChangeQueryTemplates,
  generateAddColumnChangeVersionForTable,
  generateCreateTrackedDeleteSchemas5dot3,
  generateCreateTrackedDeleteTables,
  generateAddIndexChangeVersionForTable,
  generateCreateChangesSchema,
  generateCreateChangeVersionSequence,
  generateCreateDeletedForTrackingTrigger,
  generateCreateTriggerUpdateChangeVersion,
} from './generator/GeneratorHelper';
export {
  EdFiOdsChangeQueryEntityRepository,
  newEdFiOdsChangeQueryEntityRepository,
  addEdFiOdsChangeQueryEntityRepositoryTo,
} from './model/EdFiOdsChangeQueryEntityRepository';

export function initialize(): MetaEdPlugin {
  return {
    ...newMetaEdPlugin(),
    validator: [NamespaceMustNotBeNamedChanges],
    enhancer: [],
    generator: [],
  };
}
