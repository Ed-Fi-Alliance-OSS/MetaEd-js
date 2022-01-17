import { MetaEdPlugin, newMetaEdPlugin } from '@edfi/metaed-core';
import { validate as NamespaceMustNotBeNamedChanges } from './validator/NamespaceMustNotBeNamedChanges';

export { changeQueryIndicated } from './enhancer/ChangeQueryIndicator';
export { AddColumnChangeVersionForTable } from './model/AddColumnChangeVersionForTable';
export { CreateTriggerUpdateChangeVersion } from './model/CreateTriggerUpdateChangeVersion';
export { DeleteTrackingTable } from './model/DeleteTrackingTable';
export { DeleteTrackingTrigger } from './model/DeleteTrackingTrigger';
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
  changeQueryPath,
  performColumnChangeVersionForTableGeneration,
  performCreateTrackedDeleteSchemasGeneration,
  performCreateTrackedDeleteTablesGeneration,
  performAddIndexChangeVersionForTableGeneration,
  performCreateChangesSchemaGeneration,
  performCreateChangeVersionSequenceGeneration,
  performCreateDeletedForTrackingTriggerGeneration,
  performCreateTriggerUpdateChangeVersionGeneration,
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
