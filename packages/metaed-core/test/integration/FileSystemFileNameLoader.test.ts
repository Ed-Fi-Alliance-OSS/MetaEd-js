import ffs from 'final-fs';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { State } from '../../src/State';
import { newState } from '../../src/State';
import { loadFiles } from '../../src/file/FileSystemFilenameLoader';
import { newMetaEdConfiguration } from '../../src/MetaEdConfiguration';

describe('When a single file', () => {
  beforeAll(() => {
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
    ffs.clearMockFiles();
    ffs.addMockFile(domainEntity1);
  });

  it('Should load the file contents', () => {
    const state: State = {
      ...newState(),
      metaEdConfiguration: {
        ...newMetaEdConfiguration(),
        projectPaths: ['/fake/dir'],
        projects: [
          {
            projectName: 'Ed-Fi',
            namespaceName: 'EdFi',
            projectVersion: '2.0.0',
          },
        ],
      },
    };

    loadFiles(state);

    expect(state.loadedFileSet).toHaveLength(1);
    expect(state.loadedFileSet[0].files).toHaveLength(1);

    const { contents } = state.loadedFileSet[0].files[0];
    expect(contents).toMatch(new RegExp('Domain Entity'));
    expect(contents).toMatch(new RegExp('DomainEntity1'));
    expect(contents).toMatch(new RegExp('string'));
    expect(contents).toMatch(new RegExp('Property1'));
  });
});

describe('When an empty project', () => {
  beforeAll(() => {
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
    ffs.clearMockFiles();
    ffs.addMockFile(domainEntity1);
  });

  it('Should load the file contents', () => {
    const state: State = {
      ...newState(),
      metaEdConfiguration: {
        ...newMetaEdConfiguration(),
        projectPaths: ['/fake/dir'],
        projects: [
          {
            projectName: 'Ed-Fi',
            namespaceName: 'EdFi',
            projectVersion: '2.0.0',
          },
        ],
      },
    };

    loadFiles(state);

    expect(state.loadedFileSet).toHaveLength(1);
    expect(state.loadedFileSet[0].files).toHaveLength(1);

    const { contents } = state.loadedFileSet[0].files[0];
    expect(contents).toMatch(new RegExp('Domain Entity'));
    expect(contents).toMatch(new RegExp('DomainEntity1'));
    expect(contents).toMatch(new RegExp('string'));
    expect(contents).toMatch(new RegExp('Property1'));
  });
});

describe('When multiple files', () => {
  beforeAll(() => {
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
    ffs.clearMockFiles();
    ffs.addMockFile(association1);
    ffs.addMockFile(domainEntity1);
  });

  it('Should load the file contents', () => {
    const state: State = {
      ...newState(),
      metaEdConfiguration: {
        ...newMetaEdConfiguration(),
        projectPaths: ['/fake'],
        projects: [
          {
            projectName: 'Ed-Fi',
            namespaceName: 'EdFi',
            projectVersion: '2.0.0',
          },
        ],
      },
    };

    loadFiles(state);

    expect(state.loadedFileSet).toHaveLength(1);
    expect(state.loadedFileSet[0].files).toHaveLength(2);

    const associationContents = state.loadedFileSet[0].files[0].contents;
    expect(associationContents).toMatch(new RegExp('Association'));
    expect(associationContents).toMatch(new RegExp('Domain1'));
    expect(associationContents).toMatch(new RegExp('Domain2'));
    expect(associationContents).toMatch(new RegExp('integer'));
    expect(associationContents).toMatch(new RegExp('Property2'));
    expect(associationContents).toMatchSnapshot();

    const domainEntityContents = state.loadedFileSet[0].files[1].contents;
    expect(domainEntityContents).toMatch(new RegExp('Domain Entity'));
    expect(domainEntityContents).toMatch(new RegExp('DomainEntity1'));
    expect(domainEntityContents).toMatch(new RegExp('string'));
    expect(domainEntityContents).toMatch(new RegExp('Property1'));
    expect(associationContents).toMatchSnapshot();
  });
});
