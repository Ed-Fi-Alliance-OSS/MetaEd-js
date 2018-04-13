// @flow
import R from 'ramda';
import type { MetaEdEnvironment, NamespaceInfo, EnhancerResult } from 'metaed-core';
import type { Aggregate } from '../../model/domainMetadata/Aggregate';
import type { NamespaceInfoEdfiOdsApi } from '../../model/NamespaceInfo';

const enhancerName: string = 'BaseDescriptorAggregateEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespaceInfo: NamespaceInfo = R.head(
    Array.from(metaEd.entity.namespaceInfo.values()).filter(n => !n.isExtension),
  );
  if (!coreNamespaceInfo) return { enhancerName, success: false };

  const aggregate: Aggregate = {
    root: 'Descriptor',
    schema: 'edfi',
    allowPrimaryKeyUpdates: false,
    isExtension: false,
    entityTables: [
      {
        table: 'Descriptor',
        isA: null,
        isAbstract: true,
        isRequiredCollection: false,
        schema: coreNamespaceInfo.namespace,
        hasIsA: false,
        requiresSchema: false,
      },
    ],
  };

  ((coreNamespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates.push(aggregate);
  return {
    enhancerName,
    success: true,
  };
}
