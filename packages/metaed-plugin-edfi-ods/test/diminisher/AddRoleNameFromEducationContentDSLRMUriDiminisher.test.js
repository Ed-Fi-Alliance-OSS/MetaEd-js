// @flow
import R from 'ramda';
import type { MetaEdEnvironment } from 'metaed-core';
import { newMetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/AddRoleNameFromEducationContentDSLRMUriDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newStringColumn } from '../../src/model/database/Column';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { Column } from '../../src/model/database/Column';
import type { Table } from '../../src/model/database/Table';

describe('when AddRoleNameFromEducationContentDSLRMUriDiminisher diminishes EducationContentDerivativeSourceLearningResourceMetadataURI table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const educationContentDerivativeSourceLearningResourceMetadataURI: string = 'EducationContentDerivativeSourceLearningResourceMetadataURI';
  const learningResourceMetadataURI: string = 'LearningResourceMetadataURI';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const derivativeSourceLearningResourceMetadataURI: string = 'DerivativeSourceLearningResourceMetadataURI';
    const table: Table = Object.assign(newTable(), {
      name: educationContentDerivativeSourceLearningResourceMetadataURI,
      columns: [
        Object.assign(newStringColumn('123'), {
          name: derivativeSourceLearningResourceMetadataURI,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should rename DerivativeSourceLearningResourceMetadataURI column to LearningResourceMetadataURI', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table
      .get(educationContentDerivativeSourceLearningResourceMetadataURI).columns);
    expect(column.name).toBe(learningResourceMetadataURI);
  });

  it('should set column length', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table
      .get(educationContentDerivativeSourceLearningResourceMetadataURI).columns);
    expect(R.prop('length', column)).toBe('225');
    expect(column.dataType).toBe('[NVARCHAR](225)');
  });
});

describe('when AddRoleNameFromEducationContentDSLRMUriDiminisher diminishes EducationContentDerivativeSourceURI table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const educationContentDerivativeSourceURI: string = 'EducationContentDerivativeSourceURI';
  const uri: string = 'URI';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const derivativeSourceURI: string = 'DerivativeSourceURI';
    const table: Table = Object.assign(newTable(), {
      name: educationContentDerivativeSourceURI,
      columns: [
        Object.assign(newStringColumn('123'), {
          name: derivativeSourceURI,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should rename DerivativeSourceURI column to URI', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table
      .get(educationContentDerivativeSourceURI).columns);
    expect(column.name).toBe(uri);
  });

  it('should set column length', () => {
    const column: Column = R.head((metaEd.plugin.get('edfiOds'): any).entity.table
      .get(educationContentDerivativeSourceURI).columns);
    expect(R.prop('length', column)).toBe('225');
    expect(column.dataType).toBe('[NVARCHAR](225)');
  });
});
