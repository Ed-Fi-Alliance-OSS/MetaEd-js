import { getEntitiesOfTypeForNamespaces, Enumeration } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { addTables } from './TableCreatingEntityEnhancerBase';
import { enumerationTableCreator } from './EnumerationTableCreator';
import { Table } from '../../model/database/Table';

const enhancerName = 'EnumerationTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'enumeration').forEach((entity: ModelBase) => {
    const table: Table = enumerationTableCreator.build(metaEd, entity as Enumeration, entity.documentation);
    entity.data.edfiOdsRelational.odsTables = [table];
    entity.data.edfiOdsRelational.odsEntityTable = table;
    addTables(metaEd, [table]);
  });

  return {
    enhancerName,
    success: true,
  };
}
