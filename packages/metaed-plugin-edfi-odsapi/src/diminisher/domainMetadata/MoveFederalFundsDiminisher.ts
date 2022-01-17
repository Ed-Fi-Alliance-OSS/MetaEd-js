import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';
import { NamespaceEdfiOdsApi } from '../../model/Namespace';
import { Aggregate } from '../../model/domainMetadata/Aggregate';
import { EntityTable } from '../../model/domainMetadata/EntityTable';

const enhancerName = 'MoveFederalFundsDiminisher';
const targetVersions = '2.x';
const affectedTables = ['LocalEducationAgencyFederalFunds', 'StateEducationAgencyFederalFunds'];

function remove(array: EntityTable[], element: EntityTable) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

// Remove the existing entity table records for the affected tables
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const aggregatesToClean = (coreNamespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates.filter((a: Aggregate) =>
    a.entityTables.some((et: EntityTable) => affectedTables.includes(et.table)),
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

      (coreNamespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates.push(newAggregate);
    });
  }

  return {
    enhancerName,
    success: true,
  };
}
