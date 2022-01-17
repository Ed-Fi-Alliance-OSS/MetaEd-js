import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/AddRoleNameFromEducationContentDSLRMUriDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn, StringColumn } from '../../src/model/database/Column';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Column } from '../../src/model/database/Column';
import { Table } from '../../src/model/database/Table';

describe('when AddRoleNameFromEducationContentDSLRMUriDiminisher diminishes EducationContentDerivativeSourceLearningResourceMetadataURI table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const educationContentDerivativeSourceLearningResourceMetadataURI =
    'EducationContentDerivativeSourceLearningResourceMetadataURI';
  const learningResourceMetadataURI = 'LearningResourceMetadataURI';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const derivativeSourceLearningResourceMetadataURI = 'DerivativeSourceLearningResourceMetadataURI';
    const table: Table = {
      ...newTable(),
      tableId: educationContentDerivativeSourceLearningResourceMetadataURI,
      columns: [
        {
          ...newColumn(),
          columnId: derivativeSourceLearningResourceMetadataURI,
          type: 'string',
          length: '123',
        } as StringColumn,
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename DerivativeSourceLearningResourceMetadataURI column to LearningResourceMetadataURI', (): void => {
    const column: Column = (
      tableEntities(metaEd, namespace).get(educationContentDerivativeSourceLearningResourceMetadataURI) as Table
    ).columns[0];
    expect(column.columnId).toBe(learningResourceMetadataURI);
  });

  it('should set column length', (): void => {
    const column: Column = (
      tableEntities(metaEd, namespace).get(educationContentDerivativeSourceLearningResourceMetadataURI) as Table
    ).columns[0];
    expect(column.type).toBe('string');
    expect((column as StringColumn).length).toBe('225');
  });
});

describe('when AddRoleNameFromEducationContentDSLRMUriDiminisher diminishes EducationContentDerivativeSourceURI table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const educationContentDerivativeSourceURI = 'EducationContentDerivativeSourceURI';
  const uri = 'URI';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const derivativeSourceURI = 'DerivativeSourceURI';
    const table: Table = {
      ...newTable(),
      tableId: educationContentDerivativeSourceURI,
      columns: [
        {
          ...newColumn(),
          columnId: derivativeSourceURI,
          length: '123',
        } as StringColumn,
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should rename DerivativeSourceURI column to URI', (): void => {
    const column: Column = (tableEntities(metaEd, namespace).get(educationContentDerivativeSourceURI) as Table).columns[0];
    expect(column.columnId).toBe(uri);
  });

  it('should set column length', (): void => {
    const column: Column = (tableEntities(metaEd, namespace).get(educationContentDerivativeSourceURI) as Table).columns[0];
    expect(column.type).toBe('string');
    expect((column as StringColumn).length).toBe('225');
  });
});
