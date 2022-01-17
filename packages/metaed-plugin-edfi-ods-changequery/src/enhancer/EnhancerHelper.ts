import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  ModelBase,
  Namespace,
  orderByPath,
  PluginEnvironment,
} from '@edfi/metaed-core';
import { Column, Table, tableEntities, TopLevelEntityEdfiOds } from '@edfi/metaed-plugin-edfi-ods-relational';
import { DeleteTrackingTable } from '../model/DeleteTrackingTable';
import { DeleteTrackingTrigger } from '../model/DeleteTrackingTrigger';
import { AddColumnChangeVersionForTable } from '../model/AddColumnChangeVersionForTable';
import { CreateTriggerUpdateChangeVersion } from '../model/CreateTriggerUpdateChangeVersion';
import { EdFiOdsChangeQueryEntityRepository } from '../model/EdFiOdsChangeQueryEntityRepository';
import { changeQueryIndicated } from './ChangeQueryIndicator';
import { applyCreateDeleteTrackingTriggerEnhancements } from './DeleteTrackingTriggerCreator';

export function pluginEnvironment(metaEd: MetaEdEnvironment, pluginName: string): PluginEnvironment | undefined {
  return metaEd.plugin.get(pluginName) as PluginEnvironment | undefined;
}

export function getPrimaryKeys(table: Table, targetDatabasePluginName: string): Column[] {
  return orderByPath(['data', targetDatabasePluginName, 'columnName'])(table.columns.filter((x) => x.isPartOfPrimaryKey));
}

export function edfiOdsChangeQueryRepositoryForNamespace(
  plugin: PluginEnvironment | undefined,
  namespace: Namespace,
): EdFiOdsChangeQueryEntityRepository | null {
  // if plugin not there, something's very wrong
  if (plugin === undefined) return null;
  const edfiOdsChangeQueryRepository: EdFiOdsChangeQueryEntityRepository | null = plugin.namespace.get(namespace);
  // if repository for namespace not there, something's very wrong
  return edfiOdsChangeQueryRepository;
}

export function deleteTrackingTableEntities(
  plugin: PluginEnvironment | undefined,
  namespace: Namespace,
): DeleteTrackingTable[] {
  const repository: EdFiOdsChangeQueryEntityRepository | null = edfiOdsChangeQueryRepositoryForNamespace(plugin, namespace);
  return repository == null ? [] : repository.deleteTrackingTable;
}

export function deleteTrackingTriggerEntities(
  plugin: PluginEnvironment | undefined,
  namespace: Namespace,
): DeleteTrackingTrigger[] {
  const repository: EdFiOdsChangeQueryEntityRepository | null = edfiOdsChangeQueryRepositoryForNamespace(plugin, namespace);
  return repository == null ? [] : repository.deleteTrackingTrigger;
}

export function addColumnChangeVersionForTableEntities(
  plugin: PluginEnvironment | undefined,
  namespace: Namespace,
): AddColumnChangeVersionForTable[] {
  const repository: EdFiOdsChangeQueryEntityRepository | null = edfiOdsChangeQueryRepositoryForNamespace(plugin, namespace);
  return repository == null ? [] : repository.addColumnChangeVersionForTable;
}

export function createTriggerUpdateChangeVersionEntities(
  plugin: PluginEnvironment | undefined,
  namespace: Namespace,
): CreateTriggerUpdateChangeVersion[] {
  const repository: EdFiOdsChangeQueryEntityRepository | null = edfiOdsChangeQueryRepositoryForNamespace(plugin, namespace);
  return repository == null ? [] : repository.createTriggerUpdateChangeVersion;
}

export function performAddColumnChangeVersionForTableEnhancement(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  createModel: (table: Table) => AddColumnChangeVersionForTable,
) {
  if (changeQueryIndicated(metaEd)) {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);

    metaEd.namespace.forEach((namespace: Namespace) => {
      tableEntities(metaEd, namespace).forEach((table: Table) => {
        if (table.isAggregateRootTable) {
          const addColumnChangeVersionForTable: AddColumnChangeVersionForTable = createModel(table);
          addColumnChangeVersionForTableEntities(plugin, namespace).push(addColumnChangeVersionForTable);
        }
      });
    });
  }
}

export function applyCreateDeleteTrackingTableEnhancement(
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  pluginName: string,
  mainTable: Table,
  createDeleteTrackingTableModel: (me: MetaEdEnvironment, table: Table) => DeleteTrackingTable,
) {
  if (!changeQueryIndicated(metaEd)) return;
  if (mainTable == null) return;

  const deleteTrackingTable: DeleteTrackingTable = createDeleteTrackingTableModel(metaEd, mainTable);

  const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);
  deleteTrackingTableEntities(plugin, namespace).push(deleteTrackingTable);
}

export function tableForModel(modelBase: ModelBase): Table {
  return (modelBase.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsEntityTable;
}

export function performAssociationChangeQueryEnhancement(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  targetDatabasePluginName: string,
  createDeleteTrackingTableModel: (me: MetaEdEnvironment, table: Table) => DeleteTrackingTable,
  createDeleteTrackingTriggerModel: (me: MetaEdEnvironment, table: Table) => DeleteTrackingTrigger,
) {
  if (changeQueryIndicated(metaEd)) {
    getAllEntitiesOfType(metaEd, 'association').forEach((modelBase: ModelBase) => {
      applyCreateDeleteTrackingTableEnhancement(
        metaEd,
        modelBase.namespace,
        pluginName,
        tableForModel(modelBase),
        createDeleteTrackingTableModel,
      );
      applyCreateDeleteTrackingTriggerEnhancements(
        metaEd,
        modelBase.namespace,
        pluginName,
        tableForModel(modelBase),
        createDeleteTrackingTriggerModel,
        targetDatabasePluginName,
      );
    });
  }
}

export function performCreateTriggerUpdateChangeVersionEnhancement(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  createModel: (table: Table) => CreateTriggerUpdateChangeVersion,
) {
  if (changeQueryIndicated(metaEd)) {
    const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);
    metaEd.namespace.forEach((namespace: Namespace) => {
      tableEntities(metaEd, namespace).forEach((table: Table) => {
        if (table.isAggregateRootTable) {
          const createTriggerUpdateChangeVersion: CreateTriggerUpdateChangeVersion = createModel(table);
          createTriggerUpdateChangeVersionEntities(plugin, namespace).push(createTriggerUpdateChangeVersion);
        }
      });
    });
  }
}

export function performEnumerationChangeQueryEnhancement(
  metaEd: MetaEdEnvironment,
  pluginName: string,
  targetDatabasePluginName: string,
  createDeleteTrackingTableModel: (me: MetaEdEnvironment, table: Table) => DeleteTrackingTable,
  createDeleteTrackingTriggerModel: (me: MetaEdEnvironment, table: Table) => DeleteTrackingTrigger,
) {
  if (changeQueryIndicated(metaEd)) {
    getAllEntitiesOfType(metaEd, 'enumeration').forEach((modelBase: ModelBase) => {
      applyCreateDeleteTrackingTableEnhancement(
        metaEd,
        modelBase.namespace,
        pluginName,
        tableForModel(modelBase),
        createDeleteTrackingTableModel,
      );
      applyCreateDeleteTrackingTriggerEnhancements(
        metaEd,
        modelBase.namespace,
        pluginName,
        tableForModel(modelBase),
        createDeleteTrackingTriggerModel,
        targetDatabasePluginName,
      );
    });
  }
}
