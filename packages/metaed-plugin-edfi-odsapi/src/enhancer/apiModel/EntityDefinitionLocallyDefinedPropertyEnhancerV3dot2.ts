import R from 'ramda';
import { EnhancerResult, EntityProperty, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from '@edfi/metaed-core';
import { isSharedProperty, versionSatisfies } from '@edfi/metaed-core';
import { Column, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ApiProperty } from '../../model/apiModel/ApiProperty';
import { EntityDefinition } from '../../model/apiModel/EntityDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { buildApiProperty } from './BuildApiProperty';
import { tableFor } from './EnhancerHelper';

const enhancerName = 'EntityDefinitionLocallyDefinedPropertyEnhancerV3';
const targetVersions: SemVer = '<3.3.0';

// heuristic on whether a column is "locally defined" according to the API:
// non-locally defined are typically only columns that exist to be foreign key references, but
// key unification merges put a spin on this because some foreign key reference columns
// may actually be defined by simple properties as well and thus "locally defined",
// for example when they are the target of a merge then a column can be there both because of the foreign key
// and because of the local definition
function includeColumn(column: Column, table: Table, foreignKeyColumnIdsOnTable: string[]): boolean {
  // automatically include if not an FK column
  if (!foreignKeyColumnIdsOnTable.includes(column.columnId)) return true;

  // otherwise, include the FK column if a source property of that column is on the same DE
  // as the table that this FK column is on -- shared simple properties only
  return column.sourceEntityProperties.some(
    (property: EntityProperty) =>
      isSharedProperty(property) &&
      property.mergeTargetedBy.length > 0 &&
      property.parentEntity.data.edfiOdsRelational.odsEntityTable === table,
  );
}

function locallyDefinedPropertiesFrom(table: Table): ApiProperty[] {
  const foreignKeyColumnIdsOnTable: string[] = R.chain(
    (fk) => fk.columnPairs.map((cp) => cp.parentTableColumnId),
    table.foreignKeys,
  );

  const result: ApiProperty[] = table.columns
    .filter((column: Column) => includeColumn(column, table, foreignKeyColumnIdsOnTable))
    .map((column: Column) => buildApiProperty(column, '3.2.0'));

  return result;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const { entityDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;

    entityDefinitions.forEach((entityDefinition: EntityDefinition) => {
      const table = tableFor(metaEd, namespace, entityDefinition.name);
      if (table == null) return;

      entityDefinition.locallyDefinedProperties.push(...locallyDefinedPropertiesFrom(table));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
