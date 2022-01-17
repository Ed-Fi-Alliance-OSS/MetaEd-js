import R from 'ramda';
import { getAllEntitiesOfType, asTopLevelEntity } from '@edfi/metaed-core';
import { MetaEdEnvironment, ModelBase, EnhancerResult, TopLevelEntity, Namespace } from '@edfi/metaed-core';
import { Table, TopLevelEntityEdfiOds } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhanceSingleEntity } from './AggregateEnhancerBase';

const enhancerName = 'DomainEntityExtensionAggregateEnhancer';

function orderedAndUniqueTablesFor(entity: TopLevelEntity, namespace: Namespace): Table[] {
  const tablesForNamespace = (entity.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTables.filter(
    (t: Table) =>
      t.schema === namespace.namespaceName.toLowerCase() &&
      t.tableId !== entity.metaEdName + entity.namespace.extensionEntitySuffix,
  );
  // TODO: why is unique necessary?
  const uniquedTables = R.uniqBy(R.prop('tableId'), tablesForNamespace);
  return R.sortBy(R.path(['data', 'edfiOdsSqlServer', 'tableName']), uniquedTables);
}

const isAggregateExtension = () => true;

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntityExtension').forEach((modelBase: ModelBase) => {
    enhanceSingleEntity(
      metaEd,
      asTopLevelEntity(modelBase),
      metaEd.namespace,
      undefined,
      isAggregateExtension,
      orderedAndUniqueTablesFor,
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
