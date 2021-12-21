import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import { Column, ForeignKey, Table } from 'metaed-plugin-edfi-ods-relational';
import { ApiProperty } from '../../model/apiModel/ApiProperty';
import { AssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { PhysicalNames } from '../../model/apiModel/PhysicalNames';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { buildApiProperty } from './BuildApiProperty';
import { allTablesInNamespacesBySchema, foreignKeyFor } from './EnhancerHelper';

const enhancerName = 'AssociationDefinitionPrimaryEntityPropertyEnhancer';
const targetVersions: SemVer = '>=3.3.0';

function columnNamesFor(column: Column): { columnNames: PhysicalNames } {
  return {
    columnNames: {
      sqlServer: column.data.edfiOdsSqlServer.columnName,
      postgreSql: column.data.edfiOdsPostgresql.columnName,
    },
  };
}

// "primary" entity is actually the foreign table, "properties" are columns
function primaryEntityPropertiesFrom(
  foreignKey: ForeignKey,
  schemasTables: Map<string, Map<string, Table>>,
  { isIdentifying }: AssociationDefinition,
): ApiProperty[] {
  const foreignSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.foreignTableSchema);
  if (foreignSchemaTableMap == null)
    throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.foreignTableSchema}'.`);

  const foreignTable: Table | undefined = foreignSchemaTableMap.get(foreignKey.foreignTableId);
  if (foreignTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.foreignTableId}'.`);

  // maintain foreign key column order
  return foreignKey.data.edfiOdsSqlServer.foreignTableColumnNames
    .map((columnName: string) => foreignTable.columns.filter((c) => c.data.edfiOdsSqlServer.columnName === columnName))
    .map((columnArray: Column[]) => columnArray[0])
    .map((column: Column) => ({ ...buildApiProperty(column), isIdentifying, ...columnNamesFor(column) }));
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsRelational') as PluginEnvironment;
  if (!versionSatisfies(targetTechnologyVersion, targetVersions)) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const { associationDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;
    const schemasTables: Map<string, Map<string, Table>> = allTablesInNamespacesBySchema(metaEd);

    associationDefinitions.forEach((associationDefinition: AssociationDefinition) => {
      const foreignKey = foreignKeyFor(metaEd, namespace, associationDefinition.fullName.name);
      if (foreignKey == null) return;

      associationDefinition.primaryEntityProperties.push(
        ...primaryEntityPropertiesFrom(foreignKey, schemasTables, associationDefinition),
      );
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
