import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Table, newTableNameGroup, newTableNameComponent } from '../model/database/Table';

// METAED-77
// Adjusting name to duplicate the word 'Assessment' for GraduationPlanRequiredAssessmentPerformanceLevel
const enhancerName = 'GraduationPlanRequiredAssessmentPerformanceLevelDiminisher';
const targetVersions = '2.x';

const targetTableId = 'GraduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel';
const nameOverride = 'GraduationPlanRequiredAssessmentAssessmentPerformanceLevel';
function renameGraduationPlanRequiredAssessmentPerformanceLevelTable(tablesForCoreNamespace: Map<string, Table>): void {
  const targetTable: Table | undefined = tablesForCoreNamespace.get(targetTableId);
  if (targetTable == null) return;

  targetTable.nameGroup = {
    ...newTableNameGroup(),
    nameElements: [
      {
        ...newTableNameComponent(),
        name: nameOverride,
        isSynthetic: true,
      },
    ],
  };
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  renameGraduationPlanRequiredAssessmentPerformanceLevelTable(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
