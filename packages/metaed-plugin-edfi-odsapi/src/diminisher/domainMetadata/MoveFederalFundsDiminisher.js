// @flow
import R from 'ramda';
import type { MetaEdEnvironment, EnhancerResult } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import type { NamespaceInfoEdfiOdsApi } from '../../model/NamespaceInfo';
import type { Aggregate } from '../../model/domainMetadata/Aggregate';
import type { EntityTable } from '../../model/domainMetadata/EntityTable';

const enhancerName: string = 'MoveFederalFundsDiminisher';
const targetVersions: string = '2.x';
const affectedTables = ['LocalEducationAgencyFederalFunds', 'StateEducationAgencyFederalFunds'];

function remove(array: Array<EntityTable>, element: EntityTable) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

// Remove the existing entity table records for the affected tables
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  const coreNamespaceInfo = R.head(Array.from(metaEd.entity.namespaceInfo.values()).filter(n => !n.isExtension));

  const aggregatesToClean = ((coreNamespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates.filter(
    (a: Aggregate) => a.entityTables.some((et: EntityTable) => affectedTables.includes(et.table)),
  );

  // Only if this is DS 2.0
  if (aggregatesToClean.length !== 0) {
    aggregatesToClean.forEach((aggregate: Aggregate) => {
      aggregate.entityTables
        .filter((et: EntityTable) => affectedTables.includes(et.table))
        .forEach((et: EntityTable) => remove(aggregate.entityTables, et));
    });

    affectedTables.forEach((affectedTable: string) => {
      const newAggregate: Aggregate = {
        root: affectedTable,
        schema: 'edfi',
        allowPrimaryKeyUpdates: false,
        isExtension: false,
        entityTables: [
          {
            table: affectedTable,
            isA: null,
            isAbstract: false,
            isRequiredCollection: false,
            schema: 'edfi',
            hasIsA: false,
            requiresSchema: false,
          },
        ],
      };

      ((coreNamespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates.push(newAggregate);
    });
  }

  return {
    enhancerName,
    success: true,
  };
}
