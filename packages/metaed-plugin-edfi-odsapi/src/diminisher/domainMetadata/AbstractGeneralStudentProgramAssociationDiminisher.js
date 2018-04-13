// @flow
import R from 'ramda';
import type { MetaEdEnvironment, EnhancerResult, NamespaceInfo } from 'metaed-core';
import { versionSatisfies } from 'metaed-core';
import type { NamespaceInfoEdfiOdsApi } from '../../model/NamespaceInfo';
import type { Aggregate } from '../../model/domainMetadata/Aggregate';
import type { EntityTable } from '../../model/domainMetadata/EntityTable';

const enhancerName: string = 'AbstractGeneralStudentProgramAssociationDiminisher';
const targetVersions: string = 'v3.x';
const generalStudentProgramAssociation: string = 'GeneralStudentProgramAssociation';

// Forces GeneralStudentProgramAssociation to be abstract
// Pending fix in METAED-766 to add language support for abstract associations.
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  const coreNamespaceInfo: NamespaceInfo = R.head(
    Array.from(metaEd.entity.namespaceInfo.values()).filter(n => !n.isExtension),
  );

  const generalStudentProgramAssociationTable = ((coreNamespaceInfo.data
    .edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates
    .map((aggregate: Aggregate) => aggregate.entityTables)
    .reduce((accumulator: Array<EntityTable>, entityTables: Array<EntityTable>) => accumulator.concat(entityTables))
    .find((entityTable: EntityTable) => entityTable.table === generalStudentProgramAssociation);

  if (generalStudentProgramAssociationTable !== undefined) {
    generalStudentProgramAssociationTable.isAbstract = true;
  }

  return {
    enhancerName,
    success: true,
  };
}
