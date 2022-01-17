import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { EdFiOdsRelationalEntityRepository, ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { edfiOdsRepositoryForNamespace, tableEntities } from '@edfi/metaed-plugin-edfi-ods-relational';

export function tablesFor(metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, Table> {
  const repository: EdFiOdsRelationalEntityRepository | null = edfiOdsRepositoryForNamespace(metaEd, namespace);
  if (repository == null) return new Map();

  const tables: Map<string, Table> = new Map();
  repository.table.forEach((table: Table) => {
    tables.set(table.data.edfiOdsSqlServer.tableName, table);
  });

  return tables;
}

export function tableFor(metaEd: MetaEdEnvironment, namespace: Namespace, tableName: string): Table | undefined {
  return tablesFor(metaEd, namespace).get(tableName);
}

export function foreignKeysFor(metaEd: MetaEdEnvironment, namespace: Namespace): Map<string, ForeignKey> {
  const repository: EdFiOdsRelationalEntityRepository | null = edfiOdsRepositoryForNamespace(metaEd, namespace);
  if (repository == null) return new Map();

  const foreignKeys: Map<string, ForeignKey> = new Map();
  repository.table.forEach((table: Table) => {
    table.foreignKeys.forEach((foreignKey: ForeignKey) => {
      foreignKeys.set(foreignKey.data.edfiOdsSqlServer.foreignKeyName, foreignKey);
    });
  });

  return foreignKeys;
}

export function foreignKeyFor(metaEd: MetaEdEnvironment, namespace: Namespace, name: string): ForeignKey | undefined {
  return foreignKeysFor(metaEd, namespace).get(name);
}

export function allTablesInNamespacesBySchema(metaEd: MetaEdEnvironment): Map<string, Map<string, Table>> {
  const schemaTableMaps: Map<string, Map<string, Table>> = new Map();
  metaEd.namespace.forEach((namespace: Namespace) => {
    schemaTableMaps.set(namespace.namespaceName.toLowerCase(), tableEntities(metaEd, namespace));
  });
  return schemaTableMaps;
}
