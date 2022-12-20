import * as R from 'ramda';
import { EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { enumerationRowCreator } from './EnumerationRowCreator';
import { rowEntities } from './EnhancerHelper';
import { EnumerationRow } from '../model/database/EnumerationRow';

// Build EnumerationRow objects to support generating data inserts for the sql
const enhancerName = 'EnumerationRowEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'enumeration').forEach((entity: ModelBase) => {
    const rows: EnumerationRow[] = enumerationRowCreator.createRows(
      entity.namespace.namespaceName,
      entity.data.edfiOdsRelational.odsTableId,
      R.prop('enumerationItems')(entity),
    );

    rows.forEach((row: EnumerationRow) => rowEntities(metaEd, entity.namespace).set(row.name + row.description, row));
  });

  return {
    enhancerName,
    success: true,
  };
}
