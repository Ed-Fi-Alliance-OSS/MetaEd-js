import * as R from 'ramda';
import { EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { getAllEntitiesOfType, normalizeEnumerationSuffix } from '@edfi/metaed-core';
import { enumerationRowCreator } from './EnumerationRowCreator';
import { rowEntities } from './EnhancerHelper';
import { EnumerationRow } from '../model/database/EnumerationRow';

// Descriptors with map types have enumeration values
const enhancerName = 'DescriptorMapTypeRowEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity: ModelBase) => {
    if (!entity.data.edfiOdsRelational.odsIsMapType) return;

    const rows: EnumerationRow[] = enumerationRowCreator.createRows(
      entity.namespace.namespaceName,
      normalizeEnumerationSuffix(entity.metaEdName),
      R.path(['mapTypeEnumeration', 'enumerationItems'])(entity),
    );

    rows.forEach((row: EnumerationRow) => rowEntities(metaEd, entity.namespace).set(row.name + row.description, row));
  });

  return {
    enhancerName,
    success: true,
  };
}
