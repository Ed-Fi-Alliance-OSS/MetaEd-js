// @flow
import type { EnhancerResult, MetaEdEnvironment, PluginEnvironment } from 'metaed-core';
import { getTable } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// METAED-77
// Adjusting name to duplicate the word 'Assessment' for GraduationPlanRequiredAssessmentPerformanceLevel
const enhancerName: string = 'GraduationPlanRequiredAssessmentPerformanceLevelDiminisher';
const targetVersions: string = '2.0.x';

const graduationPlanRequiredAssessmentPerformanceLevel: string = 'GraduationPlanRequiredAssessmentPerformanceLevel';
const graduationPlanRequiredAssessmentAssessmentPerformanceLevel: string = 'GraduationPlanRequiredAssessmentAssessmentPerformanceLevel';

function renameGraduationPlanRequiredAssessmentPerformanceLevelTable(plugin: PluginEnvironment): void {
  const table: ?Table = getTable(plugin.entity, graduationPlanRequiredAssessmentPerformanceLevel);
  const targetTable: ?Table = getTable(plugin.entity, graduationPlanRequiredAssessmentAssessmentPerformanceLevel);
  if (table == null || targetTable != null) return;

  table.name = graduationPlanRequiredAssessmentAssessmentPerformanceLevel;
  plugin.entity.table.set(table.name, table);
  plugin.entity.table.delete(graduationPlanRequiredAssessmentPerformanceLevel);

  table.foreignKeys.forEach((fk: ForeignKey) => {
    fk.parentTableName = table.name;
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  renameGraduationPlanRequiredAssessmentPerformanceLevelTable(pluginEnvironment(metaEd));

  return {
    enhancerName,
    success: true,
  };
}
