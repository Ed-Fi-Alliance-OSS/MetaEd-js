import R from 'ramda';
import { MetaEdEnvironment, PluginEnvironment, Namespace } from '@edfi/metaed-core';
import { Table, ForeignKey } from '@edfi/metaed-plugin-edfi-ods-relational';
import { DeleteTrackingTrigger } from '../model/DeleteTrackingTrigger';
import { PairedForeignKeyColumnName } from '../model/PairedForeignKeyColumnName';
import { changeQueryIndicated } from './ChangeQueryIndicator';
import { pluginEnvironment, deleteTrackingTriggerEntities } from './EnhancerHelper';

export type SuperclassForeignKeyFinder = (mainTable: Table) => ForeignKey | undefined;

function defaultSuperclassForeignKeyFinder(_mainTable: Table): ForeignKey | undefined {
  return undefined;
}

function pairUpForeignKeyColumnNames(
  parentTableColumnName: string,
  foreignTableColumnName: string,
): PairedForeignKeyColumnName {
  return { parentTableColumnName, foreignTableColumnName };
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
  if (!changeQueryIndicated(metaEd)) return;
  if (mainTable == null) return;

  const deleteTrackingTriggerModel = createDeleteTrackingTriggerModel(metaEd, mainTable);
  const plugin: PluginEnvironment | undefined = pluginEnvironment(metaEd, pluginName);
  deleteTrackingTriggerEntities(plugin, namespace).push(deleteTrackingTriggerModel);

  const foreignKeyToSuperclass: ForeignKey | undefined = superclassForeignKeyFinder(mainTable);

  if (foreignKeyToSuperclass != null && foreignKeyToSuperclass.data[targetDatabasePluginName] != null) {
    deleteTrackingTriggerModel.targetTableIsSubclass = true;
    deleteTrackingTriggerModel.foreignKeyToSuperclass = foreignKeyToSuperclass;

    if (foreignKeyToSuperclass.data.edfiOdsChangeQuery == null) foreignKeyToSuperclass.data.edfiOdsChangeQuery = {};
    const pairedForeignKeyColumnNames: PairedForeignKeyColumnName[] = R.zipWith(
      pairUpForeignKeyColumnNames,
      foreignKeyToSuperclass.data[targetDatabasePluginName].parentTableColumnNames,
      foreignKeyToSuperclass.data[targetDatabasePluginName].foreignTableColumnNames,
    );
    foreignKeyToSuperclass.data.edfiOdsChangeQuery.columnNames = pairedForeignKeyColumnNames.sort((a, b) =>
      a.parentTableColumnName.localeCompare(b.parentTableColumnName),
    );
  }
}
