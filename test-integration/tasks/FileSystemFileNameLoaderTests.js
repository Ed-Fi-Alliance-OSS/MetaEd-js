import { List } from 'immutable';
import chai from 'chai';
import mockfs from 'mock-fs';
import MetaEdTextBuilder from '../../test/grammar/MetaEdTextBuilder';
import MetaEdFileIndex from '../../src/core/tasks/MetaEdFileIndex';
import SymbolTable from '../../src/core/validators/SymbolTable';
import load from '../../src/core/tasks/FileSystemFilenameLoader';
import type { State } from '../../src/core/State';

chai.should();

describe('FileSystemFileNameLoaderTests', () => {
  const state: State = {
    warningMessageCollection: new List(),
    errorMessageCollection: new List(),
    symbolTable: new SymbolTable(),
    metaEdFileIndex: new MetaEdFileIndex(),
    filesToLoad: [],
    inputDirectories: [{
      path: '/fake/dir',
      namespace: 'edfi',
      projectExtension: '',
      isExtension: false,
    }],
  };

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
      const newState = load(state);
      const contents = newState.filesToLoad[0].files[0].getContents();
      contents.should.include('Domain Entity');
      contents.should.include('DomainEntity1');
      contents.should.include('string');
      contents.should.include('Property1');
    });
  });
});
