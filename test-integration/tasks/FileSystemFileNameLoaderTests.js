import chai from 'chai';
import mockfs from 'mock-fs';
import MetaEdTextBuilder from '../../test/grammar/MetaEdTextBuilder';
import loadFiles from '../../src/core/tasks/FileSystemFilenameLoader';
import { StateInstance } from '../../src/core/State';
// eslint-disable-next-line no-duplicate-imports
import type { State } from '../../src/core/State';

chai.should();

describe('FileSystemFileNameLoaderTests', () => {
  const state: State = new StateInstance({
    filesToLoad: [],
    inputDirectories: [{
      path: '/fake/dir',
      namespace: 'edfi',
      projectExtension: '',
      isExtension: false,
    }],
  });

  describe('When a single file', () => {
    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc1')
      .withStringIdentity('Property1', 'doc2', 100)
      .withEndDomainEntity()
      .toString();

      mockfs({
        '/fake/dir': {
          'DomainEntity1.metaed': metaEdText,
        },
      });
    });

    after(() => {
      mockfs.restore();
    });

    it('Should load the file contents', () => {
      const newState = loadFiles(state);
      const contents = newState.loadedFileSet.get(0).files[0].get('contents');
      contents.should.include('Domain Entity');
      contents.should.include('DomainEntity1');
      contents.should.include('string');
      contents.should.include('Property1');
    });
  });

  describe('When multiple files', () => {
    before(() => {
      const metaEdTextDomainEntity = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withDocumentation('doc')
      .withStringIdentity('Property1', 'doc', 100)
      .withEndDomainEntity()
      .toString();

      const metaEdTextAssociation = MetaEdTextBuilder.build()
      .withStartAssociation('Association1')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Domain1', 'doc')
      .withAssociationDomainEntityProperty('Domain2', 'doc')
      .withIntegerIdentity('Property2', 'doc', 100)
      .withEndDomainEntity()
      .toString();

      mockfs({
        '/fake/dir': {
          'Domain Entities': {
            'DomainEntity1.metaed': metaEdTextDomainEntity,
          },
          Associations: {
            'Association1.metaed': metaEdTextAssociation,
          },
        },
      });
    });

    after(() => {
      mockfs.restore();
    });

    it('Should load the file contents', () => {
      const newState = loadFiles(state);
      const associationContents = newState.loadedFileSet.get(0).files[0].get('contents');
      associationContents.should.include('Association');
      associationContents.should.include('Domain1');
      associationContents.should.include('Domain2');
      associationContents.should.include('integer');
      associationContents.should.include('Property2');

      const domainEntityContents = newState.loadedFileSet.get(0).files[1].get('contents');
      domainEntityContents.should.include('Domain Entity');
      domainEntityContents.should.include('DomainEntity1');
      domainEntityContents.should.include('string');
      domainEntityContents.should.include('Property1');
    });
  });
});
