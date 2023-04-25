/* eslint-disable global-require */
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { State } from '../../src/State';
import { newState } from '../../src/State';
import { loadFiles } from '../../src/file/FileSystemFilenameLoader';
import { newMetaEdConfiguration } from '../../src/MetaEdConfiguration';

// TODO these are skipped because they relied on Jest manual mocks that interfered with other tests.
// The __mocks__ directory was deleted. Look for a mocking solution that can be better isolated from other
// filesystem-using tests.
describe.skip('When a single file', (): void => {
  beforeAll(() => {
    jest.mock('node:fs');
    const metaEdText = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc1')
      .withStringIdentity('Property1', 'doc2', '100')
      .withEndDomainEntity()
      .toString();

    const domainEntity1 = {
      path: '/fake/dir/Domain Entities/DomainEntity1.metaed',
      content: metaEdText,
    };
    require('node:fs').clearMockFiles();
    require('node:fs').addMockFile(domainEntity1);
  });

  afterAll(() => {
    jest.resetAllMocks();
    require('node:fs').clearMockFiles();
  });

  it('Should load the file contents', (): void => {
    const state: State = {
      ...newState(),
      metaEdConfiguration: {
        ...newMetaEdConfiguration(),
        projectPaths: ['/fake/dir'],
        projects: [
          {
            projectName: 'Ed-Fi',
            namespaceName: 'EdFi',
            projectVersion: '3.0.0',
            description: '',
          },
        ],
      },
    };

    loadFiles(state);

    expect(state.loadedFileSet).toHaveLength(1);
    expect(state.loadedFileSet[0].files).toHaveLength(1);

    const { contents } = state.loadedFileSet[0].files[0];
    expect(contents).toMatch(/Domain Entity/);
    expect(contents).toMatch(/DomainEntity1/);
    expect(contents).toMatch(/string/);
    expect(contents).toMatch(/Property1/);
  });
});

describe.skip('When an empty project', (): void => {
  beforeAll(() => {
    jest.mock('node:fs');
    const metaEdText = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc1')
      .withStringIdentity('Property1', 'doc2', '100')
      .withEndDomainEntity()
      .toString();

    const domainEntity1 = {
      path: '/fake/dir/Domain Entities/DomainEntity1.metaed',
      content: metaEdText,
    };
    require('node:fs').clearMockFiles();
    require('node:fs').addMockFile(domainEntity1);
  });

  afterAll(() => {
    jest.resetAllMocks();
    require('node:fs').clearMockFiles();
  });

  it('Should load the file contents', (): void => {
    const state: State = {
      ...newState(),
      metaEdConfiguration: {
        ...newMetaEdConfiguration(),
        projectPaths: ['/fake/dir'],
        projects: [
          {
            projectName: 'Ed-Fi',
            namespaceName: 'EdFi',
            projectVersion: '3.0.0',
            description: '',
          },
        ],
      },
    };

    loadFiles(state);

    expect(state.loadedFileSet).toHaveLength(1);
    expect(state.loadedFileSet[0].files).toHaveLength(1);

    const { contents } = state.loadedFileSet[0].files[0];
    expect(contents).toMatch(/Domain Entity/);
    expect(contents).toMatch(/DomainEntity1/);
    expect(contents).toMatch(/string/);
    expect(contents).toMatch(/Property1/);
  });
});

describe.skip('When multiple files', (): void => {
  beforeAll(() => {
    jest.mock('node:fs');
    const metaEdTextDomainEntity = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc')
      .withStringIdentity('Property1', 'doc', '100')
      .withEndDomainEntity()
      .toString();

    const metaEdTextAssociation = MetaEdTextBuilder.build()
      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Domain1', 'doc')
      .withAssociationDomainEntityProperty('Domain2', 'doc')
      .withIntegerIdentity('Property2', 'doc', '100')
      .withEndDomainEntity()
      .toString();

    const association1 = {
      path: '/fake/dir/Associations/Association1.metaed',
      content: metaEdTextAssociation,
    };
    const domainEntity1 = {
      path: '/fake/dir/Domain Entities/DomainEntity1.metaed',
      content: metaEdTextDomainEntity,
    };
    require('node:fs').clearMockFiles();
    require('node:fs').addMockFile(association1);
    require('node:fs').addMockFile(domainEntity1);
  });

  afterAll(() => {
    jest.resetAllMocks();
    require('node:fs').clearMockFiles();
  });

  it('Should load the file contents', (): void => {
    const state: State = {
      ...newState(),
      metaEdConfiguration: {
        ...newMetaEdConfiguration(),
        projectPaths: ['/fake'],
        projects: [
          {
            projectName: 'Ed-Fi',
            namespaceName: 'EdFi',
            projectVersion: '3.0.0',
            description: '',
          },
        ],
      },
    };

    loadFiles(state);

    expect(state.loadedFileSet).toHaveLength(1);
    expect(state.loadedFileSet[0].files).toHaveLength(2);

    const associationContents = state.loadedFileSet[0].files[0].contents;
    expect(associationContents).toMatch(/Association/);
    expect(associationContents).toMatch(/Domain1/);
    expect(associationContents).toMatch(/Domain2/);
    expect(associationContents).toMatch(/integer/);
    expect(associationContents).toMatch(/Property2/);
    expect(associationContents).toMatchSnapshot();

    const domainEntityContents = state.loadedFileSet[0].files[1].contents;
    expect(domainEntityContents).toMatch(/Domain Entity/);
    expect(domainEntityContents).toMatch(/DomainEntity1/);
    expect(domainEntityContents).toMatch(/string/);
    expect(domainEntityContents).toMatch(/Property1/);
    expect(associationContents).toMatchSnapshot();
  });
});
