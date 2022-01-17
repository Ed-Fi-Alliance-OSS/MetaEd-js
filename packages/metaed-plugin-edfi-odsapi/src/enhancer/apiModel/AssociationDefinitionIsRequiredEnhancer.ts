import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { Column, ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { AssociationDefinition, AssociationDefinitionCardinality } from '../../model/apiModel/AssociationDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { allTablesInNamespacesBySchema, foreignKeyFor } from './EnhancerHelper';

const enhancerName = 'AssociationDefinitionIsRequiredEnhancer';

function isRequiredFrom(
  cardinality: AssociationDefinitionCardinality,
  foreignKey: ForeignKey,
  schemasTables: Map<string, Map<string, Table>>,
): boolean {
  if (cardinality === 'OneToOneInheritance' || cardinality === 'OneToOneExtension' || cardinality === 'OneToOne')
    return true;

  const parentSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.parentTable.schema);
  if (parentSchemaTableMap == null)
    throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.parentTable.schema}'.`);

  const parentTable: Table | undefined = parentSchemaTableMap.get(foreignKey.parentTable.tableId);
  if (parentTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTable.tableId}'.`);

  const parentTableForeignKeyColumns: Column[] = parentTable.columns.filter((c: Column) =>
    foreignKey.data.edfiOdsSqlServer.parentTableColumnNames.includes(c.data.edfiOdsSqlServer.columnName),
  );
  return parentTableForeignKeyColumns.every((c: Column) => !c.isNullable);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const { associationDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;
    const schemasTables: Map<string, Map<string, Table>> = allTablesInNamespacesBySchema(metaEd);

    associationDefinitions.forEach((associationDefinition: AssociationDefinition) => {
      const foreignKey = foreignKeyFor(metaEd, namespace, associationDefinition.fullName.name);
      if (foreignKey == null) return;

      associationDefinition.isRequired = isRequiredFrom(associationDefinition.cardinality, foreignKey, schemasTables);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
