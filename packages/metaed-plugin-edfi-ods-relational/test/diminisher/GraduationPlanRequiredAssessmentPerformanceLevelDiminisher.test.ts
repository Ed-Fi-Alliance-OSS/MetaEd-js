import { newMetaEdEnvironment, newNamespace } from 'metaed-core';
import { MetaEdEnvironment, Namespace } from 'metaed-core';
import { enhance } from '../../src/diminisher/GraduationPlanRequiredAssessmentPerformanceLevelDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable, TableNameComponent } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Table } from '../../src/model/database/Table';

describe('when GraduationPlanRequiredAssessmentPerformanceLevelDiminisher diminishes GraduationPlanRequiredAssessmentPerformanceLevel table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const graduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel =
    'GraduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel';
  const graduationPlanRequiredAssessmentAssessmentPerformanceLevel =
    'GraduationPlanRequiredAssessmentAssessmentPerformanceLevel';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = { ...newTable(), tableId: graduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel };
    table.foreignKeys = [
      { ...newForeignKey(), parentTable: table },
      { ...newForeignKey(), parentTable: table },
    ];
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename GraduationPlanRequiredAssessmentPerformanceLevel table', (): void => {
    const targetTable: Table = tableEntities(metaEd, namespace).get(
      graduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel,
    ) as Table;
    expect(targetTable).toBeDefined();
    expect((targetTable.nameGroup.nameElements[0] as TableNameComponent).name).toBe(
      graduationPlanRequiredAssessmentAssessmentPerformanceLevel,
    );
  });

  it('should update foreign key parent table name', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(
      graduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel,
    ) as Table;
    expect(
      foreignKeys.every(
        (fk) => fk.parentTable.tableId === graduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel,
      ),
    ).toBe(true);
  });
});
