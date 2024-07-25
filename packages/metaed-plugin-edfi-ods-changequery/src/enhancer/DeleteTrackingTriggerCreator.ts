import { MetaEdEnvironment, PluginEnvironment, Namespace } from '@edfi/metaed-core';
import { Table, ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import { DeleteTrackingTrigger } from '../model/DeleteTrackingTrigger';
import { PairedForeignKeyColumnName } from '../model/PairedForeignKeyColumnName';
import { pluginEnvironment, deleteTrackingTriggerEntities, pairedForeignKeyColumnNamesFrom } from './EnhancerHelper';

export type SuperclassForeignKeyFinder = (mainTable: Table) => ForeignKey | undefined;

function defaultSuperclassForeignKeyFinder(_mainTable: Table): ForeignKey | undefined {
  return undefined;
}

export function applyCreateDeleteTrackingTriggerEnhancements(
  metaEd: MetaEdEnvironment,
  namespace: Namespace,
  pluginName: string,
  mainTable: Table,
  createDeleteTrackingTriggerModel: (me: MetaEdEnvironment, table: Table) => DeleteTrackingTrigger,
  targetDatabasePluginName: string,
  superclassForeignKeyFinder: SuperclassForeignKeyFinder = defaultSuperclassForeignKeyFinder,
) {
  if (mainTable == null) return;

  const deleteTrackingTriggerModel: DeleteTrackingTrigger = createDeleteTrackingTriggerModel(metaEd, mainTable);
  const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);
  deleteTrackingTriggerEntities(plugin, namespace).push(deleteTrackingTriggerModel);

  const foreignKeyToSuperclass: ForeignKey | undefined = superclassForeignKeyFinder(mainTable);

  if (foreignKeyToSuperclass != null && foreignKeyToSuperclass.data[targetDatabasePluginName] != null) {
    deleteTrackingTriggerModel.targetTableIsSubclass = true;
    deleteTrackingTriggerModel.foreignKeyToSuperclass = foreignKeyToSuperclass;

    if (foreignKeyToSuperclass.data.edfiOdsChangeQuery == null) foreignKeyToSuperclass.data.edfiOdsChangeQuery = {};
    const pairedForeignKeyColumnNames: PairedForeignKeyColumnName[] = pairedForeignKeyColumnNamesFrom(
      foreignKeyToSuperclass,
      targetDatabasePluginName,
    );
    foreignKeyToSuperclass.data.edfiOdsChangeQuery.columnNames = pairedForeignKeyColumnNames.sort((a, b) =>
      a.parentTableColumnName.localeCompare(b.parentTableColumnName),
    );
  }
}
