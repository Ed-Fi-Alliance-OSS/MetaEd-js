import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, SemVer } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import { Column, ColumnPair, ForeignKey, Table } from 'metaed-plugin-edfi-ods-relational';
import { ApiProperty } from '../../model/apiModel/ApiProperty';
import { AssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { buildApiProperty } from './BuildApiProperty';
import { allTablesInNamespacesBySchema, foreignKeyFor } from './EnhancerHelper';

const enhancerName = 'AssociationDefinitionSecondaryEntityPropertyEnhancerV3';
const targetVersions: SemVer = '<3.3.0';

// Override the typical isServerAssigned - it's true iff it's from a 1-1 or 1-1 inheritance relation and the matching
// column on the other side of the FK is server assigned.
function buildApiPropertyWithServerAssignedOverride(
  column: Column,
  foreignKey: ForeignKey,
  schemasTables: Map<string, Map<string, Table>>,
  { isIdentifying, cardinality }: AssociationDefinition,
): ApiProperty {
  const result: ApiProperty = { ...buildApiProperty(column), isIdentifying };
  if (cardinality === 'OneToOne' || cardinality === 'OneToOneInheritance' || cardinality === 'OneToOneExtension') {
    const foreignSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.foreignTableSchema);
    if (foreignSchemaTableMap == null)
      throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.foreignTableSchema}'.`);

    const foreignTable: Table | undefined = foreignSchemaTableMap.get(foreignKey.foreignTableId);
    if (foreignTable == null)
      throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.foreignTableId}'.`);

    const columnPair: ColumnPair = foreignKey.columnPairs.filter(
      (cnp: ColumnPair) => cnp.parentTableColumnId === column.columnId,
    )[0];
    const otherColumn: Column = foreignTable.columns.filter(
      (c: Column) => c.columnId === columnPair.foreignTableColumnId,
    )[0];

    return { ...result, isServerAssigned: otherColumn.isIdentityDatabaseType };
  }

  return result;
}

// "secondary" entity is actually the parent table, "properties" are columns
function secondaryEntityPropertiesFrom(
  foreignKey: ForeignKey,
  schemasTables: Map<string, Map<string, Table>>,
  associationDefinition: AssociationDefinition,
): ApiProperty[] {
  const parentSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.parentTable.schema);
  if (parentSchemaTableMap == null)
    throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.parentTable.schema}'.`);

  const parentTable: Table | undefined = parentSchemaTableMap.get(foreignKey.parentTable.tableId);
  if (parentTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTable.tableId}'.`);

  // maintain foreign key column order
  return foreignKey.data.edfiOdsSqlServer.parentTableColumnNames
    .map((columnName: string) => parentTable.columns.filter((c) => c.data.edfiOdsSqlServer.columnName === columnName))
    .map((columnArray: Column[]) => columnArray[0])
    .map((column: Column) =>
      buildApiPropertyWithServerAssignedOverride(column, foreignKey, schemasTables, associationDefinition),
    );
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

      associationDefinition.secondaryEntityProperties.push(
        ...secondaryEntityPropertiesFrom(foreignKey, schemasTables, associationDefinition),
      );
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
