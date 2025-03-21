// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';
import { validate as NamespaceMustNotBeNamedChanges } from './validator/NamespaceMustNotBeNamedChanges';

export { AddColumnChangeVersionForTable, newAddColumnChangeVersionForTable } from './model/AddColumnChangeVersionForTable';
export {
  CreateTriggerUpdateChangeVersion,
  newCreateTriggerUpdateChangeVersion,
} from './model/CreateTriggerUpdateChangeVersion';
export { ChangeDataColumn, newChangeDataColumn } from './model/ChangeDataColumn';
export { DeleteTrackingTable, newDeleteTrackingTable } from './model/DeleteTrackingTable';
export { DeleteTrackingTrigger, newDeleteTrackingTrigger } from './model/DeleteTrackingTrigger';
export { PairedForeignKeyColumnName } from './model/PairedForeignKeyColumnName';
export { IndirectUpdateCascadeTrigger } from './model/IndirectUpdateCascadeTrigger';
export {
  pairedForeignKeyColumnNamesFrom,
  pluginEnvironment,
  getPrimaryKeys,
  edfiOdsChangeQueryRepositoryForNamespace,
  indirectUpdateCascadeTriggerEntities,
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
  hasRequiredNonIdentityNamespaceColumn,
  isUsiTable,
  disciplineActionWithResponsibilitySchoolColumn,
} from './enhancer/EnhancerHelper';
export {
  SuperclassForeignKeyFinder,
  applyCreateDeleteTrackingTriggerEnhancements,
} from './enhancer/DeleteTrackingTriggerCreator';
export { enhance as indirectUpdateCascadeTriggerEnhancer } from './enhancer/IndirectUpdateCascadeTriggerEnhancer';
export {
  generateAddColumnChangeVersionForTable,
  generateCreateTrackedDeleteSchemas5dot3,
  generateCreateTrackedDeleteTables,
  generateAddIndexChangeVersionForTable,
  generateCreateChangesSchema,
  generateCreateChangeVersionSequence,
  generateCreateDeletedForTrackingTrigger,
  generateCreateTriggerUpdateChangeVersion,
  changeQueryPath,
} from './generator/GeneratorHelper';
export { ChangeQueryTemplates } from './generator/ChangeQueryTemplates';
export { generateIndirectUpdateCascadeTrigger } from './generator/CreateIndirectUpdateCascadeTriggerGenerator';
export {
  EdFiOdsChangeQueryEntityRepository,
  newEdFiOdsChangeQueryEntityRepository,
  addEdFiOdsChangeQueryEntityRepositoryTo,
} from './model/EdFiOdsChangeQueryEntityRepository';

export function initialize(): MetaEdPlugin {
  return {
    validator: [NamespaceMustNotBeNamedChanges],
    enhancer: [],
    generator: [],
    shortName: 'edfiOdsChangeQuery',
  };
}
