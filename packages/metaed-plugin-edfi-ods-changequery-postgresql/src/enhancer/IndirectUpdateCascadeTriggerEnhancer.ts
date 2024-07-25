import {
  MetaEdEnvironment,
  EnhancerResult,
  PluginEnvironment,
  versionSatisfies,
  getEntitiesOfTypeForNamespaces,
  Namespace,
} from '@edfi/metaed-core';
import { ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  IndirectUpdateCascadeTrigger,
  indirectUpdateCascadeTriggerEntities,
  pairedForeignKeyColumnNamesFrom,
  pluginEnvironment,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { DATABASE_PLUGIN_NAME, PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'IndirectUpdateCascadeTriggerEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (versionSatisfies(targetTechnologyVersion, '>=7.3.0')) {
    metaEd.namespace.forEach((namespace: Namespace) => {
      const result: IndirectUpdateCascadeTrigger[] = indirectUpdateCascadeTriggerEntities(
        pluginEnvironment(metaEd, PLUGIN_NAME),
        namespace,
      );

      getEntitiesOfTypeForNamespaces(
        [namespace],
        'association',
        'associationSubclass',
        'domainEntity',
        'domainEntitySubclass',
      ).forEach((entity) => {
        const mainTable: Table = entity.data.edfiOdsRelational.odsEntityTable;

        const subtables: Table[] = entity.data.edfiOdsRelational.odsTables.filter((table: Table) => table !== mainTable);

        subtables.forEach((subtable) => {
          const fksWithUpdateCascade: ForeignKey[] = subtable.foreignKeys.filter((fk) => fk.withUpdateCascade);
          if (fksWithUpdateCascade.length === 0) return;

          const indirectUpdateCascadeFks: ForeignKey[] = fksWithUpdateCascade.filter((fk) => fk.foreignTable !== mainTable);
          if (indirectUpdateCascadeFks.length === 0) return;

          const fkToMainTable: ForeignKey | undefined = subtable.foreignKeys.find((fk) => fk.foreignTable === mainTable);
          if (fkToMainTable == null) return;

          const checkForUpdateColumnNames: string[] = indirectUpdateCascadeFks.flatMap(
            (fk) => fk.data.edfiOdsPostgresql.parentTableColumnNames,
          );

          result.push({
            mainTableSchema: fkToMainTable.foreignTable.schema,
            mainTableName: fkToMainTable.foreignTable.data.edfiOdsPostgresql.tableName,
            subTableSchema: fkToMainTable.parentTable.schema,
            subTableName: fkToMainTable.parentTable.data.edfiOdsPostgresql.tableName,
            checkForUpdateColumnNames,
            fkToMainTableColumnNames: pairedForeignKeyColumnNamesFrom(fkToMainTable, DATABASE_PLUGIN_NAME),
          });
        });
      });
    });
  }

  return {
    enhancerName,
    success: true,
  };
}
