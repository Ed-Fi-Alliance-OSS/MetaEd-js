// @flow
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/GraduationPlanRequiredAssessmentPerformanceLevelDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when GraduationPlanRequiredAssessmentPerformanceLevelDiminisher diminishes GraduationPlanRequiredAssessmentPerformanceLevel table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const graduationPlanRequiredAssessmentAssessmentPerformanceLevel: string = 'GraduationPlanRequiredAssessmentAssessmentPerformanceLevel';
  const graduationPlanRequiredAssessmentPerformanceLevel: string = 'GraduationPlanRequiredAssessmentPerformanceLevel';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: graduationPlanRequiredAssessmentPerformanceLevel,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          parentTableName: graduationPlanRequiredAssessmentPerformanceLevel,
        }),
        Object.assign(newForeignKey(), {
          parentTableName: graduationPlanRequiredAssessmentPerformanceLevel,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should rename GraduationPlanRequiredAssessmentPerformanceLevel table', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(graduationPlanRequiredAssessmentPerformanceLevel);
    expect(table).toBeUndefined();

    const targetTable: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(graduationPlanRequiredAssessmentAssessmentPerformanceLevel);
    expect(targetTable).toBeDefined();
    expect(targetTable.name).toBe(graduationPlanRequiredAssessmentAssessmentPerformanceLevel);
  });

  it('should update foreign key parent table name', () => {
    const foreignKeys: Array<ForeignKey> = (metaEd.plugin.get('edfiOds'): any).entity.table
      .get(graduationPlanRequiredAssessmentAssessmentPerformanceLevel).foreignKeys;
    expect(foreignKeys.every(fk => fk.parentTableName === graduationPlanRequiredAssessmentAssessmentPerformanceLevel)).toBe(true);
  });
});
