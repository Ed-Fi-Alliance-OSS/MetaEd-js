// @flow
import R from 'ramda';
import type { EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { getEntitiesOfType } from 'metaed-core';
import { enumerationRowCreator } from './EnumerationRowCreator';
import { pluginEnvironment } from './EnhancerHelper';
import { normalizeEnumerationSuffix } from '../shared/Utility';
import type { EnumerationRow } from '../model/database/EnumerationRow';

// Descriptors with map types have enumeration values
const enhancerName: string = 'DescriptorMapTypeRowEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'descriptor').forEach((entity: ModelBase) => {
    if (!entity.data.edfiOds.ods_IsMapType) return;

    const rows: Array<EnumerationRow> = enumerationRowCreator.createRows(
      entity.namespaceInfo.namespace,
      normalizeEnumerationSuffix(entity.metaEdName),
      R.path(['mapTypeEnumeration', 'enumerationItems'])(entity),
    );

    rows.forEach((row: EnumerationRow) => pluginEnvironment(metaEd).entity.row.set(row.name + row.description, row));
  });

  return {
    enhancerName,
    success: true,
  };
}
