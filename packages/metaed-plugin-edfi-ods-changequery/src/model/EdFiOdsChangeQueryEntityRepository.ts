import { newPluginEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { DeleteTrackingTable } from './DeleteTrackingTable';
import { DeleteTrackingTrigger } from './DeleteTrackingTrigger';
import { AddColumnChangeVersionForTable } from './AddColumnChangeVersionForTable';
import { CreateTriggerUpdateChangeVersion } from './CreateTriggerUpdateChangeVersion';
import { IndirectUpdateCascadeTrigger } from './IndirectUpdateCascadeTrigger';

export interface EdFiOdsChangeQueryEntityRepository {
  deleteTrackingTable: DeleteTrackingTable[];
  deleteTrackingTrigger: DeleteTrackingTrigger[];
  addColumnChangeVersionForTable: AddColumnChangeVersionForTable[];
  createTriggerUpdateChangeVersion: CreateTriggerUpdateChangeVersion[];
  indirectUpdateCascadeTrigger: IndirectUpdateCascadeTrigger[];
}

export function newEdFiOdsChangeQueryEntityRepository(): EdFiOdsChangeQueryEntityRepository {
  return {
    deleteTrackingTable: [],
    deleteTrackingTrigger: [],
    addColumnChangeVersionForTable: [],
    createTriggerUpdateChangeVersion: [],
    indirectUpdateCascadeTrigger: [],
  };
}

export function addEdFiOdsChangeQueryEntityRepositoryTo(metaEd: MetaEdEnvironment, pluginName: string) {
  const namespaces: Map<Namespace, EdFiOdsChangeQueryEntityRepository> = new Map();
  metaEd.namespace.forEach((namespace: Namespace) => {
    namespaces.set(namespace, newEdFiOdsChangeQueryEntityRepository());
  });

  const edfiOdsChangeQueryPlugin = metaEd.plugin.get(pluginName);
  if (edfiOdsChangeQueryPlugin == null) {
    metaEd.plugin.set(pluginName, {
      ...newPluginEnvironment(),
      shortName: pluginName,
      namespace: namespaces,
    });
  } else {
    edfiOdsChangeQueryPlugin.namespace = namespaces;
  }
}
