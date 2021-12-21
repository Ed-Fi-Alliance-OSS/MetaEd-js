import { EnhancerResult, MetaEdEnvironment, Namespace } from 'metaed-core';
import { Column, ForeignKey, Table } from 'metaed-plugin-edfi-ods-relational';
import { AssociationDefinition } from '../../model/apiModel/AssociationDefinition';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { allTablesInNamespacesBySchema, foreignKeyFor } from './EnhancerHelper';

const enhancerName = 'AssociationDefinitionIsIdentifyingEnhancer';

// For some reason, this is where all of the source columns in the foreign key are part of the PK
function isIdentifyingForeignKey(foreignKey: ForeignKey, schemasTables: Map<string, Map<string, Table>>): boolean {
  const parentSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.parentTable.schema);
  if (parentSchemaTableMap == null)
    throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.parentTable.schema}'.`);

  const parentTable: Table | undefined = parentSchemaTableMap.get(foreignKey.parentTable.tableId);
  if (parentTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTable.tableId}'.`);

  const primaryKeyColumnNames: string[] = parentTable.primaryKeys.map((c: Column) => c.data.edfiOdsSqlServer.columnName);
  return foreignKey.data.edfiOdsSqlServer.parentTableColumnNames.every((foreignKeyColumnName) =>
    primaryKeyColumnNames.includes(foreignKeyColumnName),
  );
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const { associationDefinitions } = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).domainModelDefinition;
    const schemasTables: Map<string, Map<string, Table>> = allTablesInNamespacesBySchema(metaEd);

    associationDefinitions.forEach((associationDefinition: AssociationDefinition) => {
      const foreignKey = foreignKeyFor(metaEd, namespace, associationDefinition.fullName.name);
      if (foreignKey == null) return;

      associationDefinition.isIdentifying = isIdentifyingForeignKey(foreignKey, schemasTables);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
