import { EnhancerResult, MetaEdEnvironment, Namespace, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { ForeignKey, Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { AssociationDefinition, AssociationDefinitionCardinality } from '../../model/apiModel/AssociationDefinition';
import { Aggregate } from '../../model/domainMetadata/Aggregate';
import { EntityTable } from '../../model/domainMetadata/EntityTable';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { allTablesInNamespacesBySchema, foreignKeyFor } from './EnhancerHelper';

const enhancerName = 'AssociationDefinitionCardinalityEnhancerV6dot1';

function findAggregateWithEntity(targetTechnologyVersion: string, aggregates: Aggregate[], table: Table): Aggregate | null {
  // Table name in the DomainMetadata EntityTable structure is not the non-db specific tableId, but instead the overlap-collapsed table name
  const tableNameToMatch: string = table.data.edfiOdsSqlServer.tableName;

  const aggregatesWithEntityTable: Aggregate[] = aggregates.reduce((result: Aggregate[], currentAggregate: Aggregate) => {
    const inThisAggregate: boolean = currentAggregate.entityTables.some(
      (e: EntityTable) => e.schema === table.schema && e.table === tableNameToMatch,
    );
    // METAED-948
    if (versionSatisfies(targetTechnologyVersion, '<3.4.0')) {
      return inThisAggregate ? result.concat(currentAggregate) : result;
    }

    // if this is an aggregate extension, it can be a stand-in for an aggregate in a different schema
    const inThisAggregateExtension: boolean = currentAggregate.isExtension && currentAggregate.root === tableNameToMatch;
    return inThisAggregate || inThisAggregateExtension ? result.concat(currentAggregate) : result;
  }, []);
  return aggregatesWithEntityTable.length === 1 ? aggregatesWithEntityTable[0] : null;
}

function childEntitySearch34(rootAggregate: Aggregate, foreignKey: ForeignKey): AssociationDefinitionCardinality {
  const childEntitySearch: EntityTable | undefined = rootAggregate.entityTables.find(
    (et: EntityTable) =>
      et.table === foreignKey.parentTable.data.edfiOdsSqlServer.tableName && et.schema === foreignKey.parentTable.schema,
  );
  if (childEntitySearch == null) return 'OneToZeroOrMore';
  return childEntitySearch.isRequiredCollection ? 'OneToOneOrMore' : 'OneToZeroOrMore';
}

function childEntitySearch33(rootAggregate: Aggregate, foreignKey: ForeignKey): AssociationDefinitionCardinality {
  const childEntitySearch: EntityTable[] = rootAggregate.entityTables.filter(
    (et: EntityTable) =>
      et.table === foreignKey.parentTable.data.edfiOdsSqlServer.tableName && et.schema === foreignKey.parentTable.schema,
  );
  if (childEntitySearch.length !== 1) return 'OneToZeroOrMore';
  if (childEntitySearch[0].isRequiredCollection) return 'OneToOneOrMore';
  return 'OneToZeroOrMore';
}

function cardinalityFrom(
  targetTechnologyVersion: string,
  { isIdentifying }: AssociationDefinition,
  foreignKey: ForeignKey,
  schemasTables: Map<string, Map<string, Table>>,
  domainMetadataAggregatesForNamespace: Aggregate[],
): AssociationDefinitionCardinality {
  if (foreignKey.sourceReference.isSubclassRelationship) return 'OneToOneInheritance';
  if (foreignKey.sourceReference.isExtensionRelationship) return 'OneToOneExtension';

  const parentSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.parentTable.schema);
  if (parentSchemaTableMap == null)
    throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.parentTable.schema}'.`);
  const parentTable: Table | undefined = parentSchemaTableMap.get(foreignKey.parentTable.tableId);
  if (parentTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.parentTable.tableId}'.`);

  const foreignSchemaTableMap: Map<string, Table> | undefined = schemasTables.get(foreignKey.foreignTableSchema);
  if (foreignSchemaTableMap == null)
    throw new Error(`BuildAssociationDefinitions: could not find table schema '${foreignKey.foreignTableSchema}'.`);
  const foreignTable: Table | undefined = foreignSchemaTableMap.get(foreignKey.foreignTableId);
  if (foreignTable == null)
    throw new Error(`BuildAssociationDefinitions: could not find table '${foreignKey.foreignTableId}'.`);

  // this is what the if statement in the C# code had: count of PK columns on both sides are
  // equal -- this feels like too weak a constraint
  if (isIdentifying && parentTable.primaryKeys.length === foreignTable.primaryKeys.length) return 'OneToOne';

  // OneToOneOrMore is based on the "isRequiredCollection" flag in DomainMetadata, when the foreign key is the
  // back reference from an aggregate dependent table to either the root table or an intermediate dependent table
  const rootAggregate: Aggregate | null = findAggregateWithEntity(
    targetTechnologyVersion,
    domainMetadataAggregatesForNamespace,
    foreignTable,
  );

  if (rootAggregate == null) {
    // METAED-1435: Fallback to checking source reference property for cardinality
    if (foreignKey.sourceReference.isRequiredCollection) return 'OneToOneOrMore';
    return 'OneToZeroOrMore';
  }

  // METAED-948
  if (versionSatisfies(targetTechnologyVersion, '<3.4.0')) {
    return childEntitySearch33(rootAggregate, foreignKey);
  }
  return childEntitySearch34(rootAggregate, foreignKey);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const { targetTechnologyVersion } = metaEd.plugin.get('edfiOdsApi') as PluginEnvironment;
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) return { enhancerName, success: true };

  metaEd.namespace.forEach((namespace: Namespace) => {
    const { domainModelDefinition, aggregates } = namespace.data.edfiOdsApi as NamespaceEdfiOdsApi;
    const { associationDefinitions } = domainModelDefinition;
    const schemasTables: Map<string, Map<string, Table>> = allTablesInNamespacesBySchema(metaEd);

    associationDefinitions.forEach((associationDefinition: AssociationDefinition) => {
      const foreignKey: ForeignKey | undefined = foreignKeyFor(metaEd, namespace, associationDefinition.fullName.name);
      if (foreignKey == null) return;

      associationDefinition.cardinality = cardinalityFrom(
        targetTechnologyVersion,
        associationDefinition,
        foreignKey,
        schemasTables,
        aggregates,
      );
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
