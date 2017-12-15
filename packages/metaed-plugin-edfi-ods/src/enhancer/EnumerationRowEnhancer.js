// @flow
import R from 'ramda';
import type { EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { getEntitiesOfType } from 'metaed-core';
import { enumerationRowCreator } from './EnumerationRowCreator';
import { pluginEnvironment } from './EnhancerHelper';
import type { EnumerationRow } from '../model/database/EnumerationRow';

// Build EnumerationRow objects to support generating data inserts for the sql
const enhancerName: string = 'EnumerationRowEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'enumeration').forEach((entity: ModelBase) => {
    const rows: Array<EnumerationRow> = enumerationRowCreator.createRows(
      entity.namespaceInfo.namespace,
      entity.data.edfiOds.ods_TableName,
      R.prop('enumerationItems')(entity),
    );

    rows.forEach((row: EnumerationRow) => pluginEnvironment(metaEd).entity.row.set(row.name + row.description, row));
  });


  return {
    enhancerName,
    success: true,
  };
}
