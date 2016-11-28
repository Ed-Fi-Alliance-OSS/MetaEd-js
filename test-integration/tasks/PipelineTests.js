import { List } from 'immutable';
import chai from 'chai';
import mockfs from 'mock-fs';
import MetaEdTextBuilder from '../../test/grammar/MetaEdTextBuilder';
import MetaEdFileIndex from '../../src/core/tasks/MetaEdFileIndex';
import SymbolTable from '../../src/core/validators/SymbolTable';
import start from '../../src/core/tasks/Pipeline';
import type { State } from '../../src/core/State';

chai.should();

describe('PipelineTests', () => {
  describe('When a single file', () => {
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

    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withMetaEdId('123')
      .withDocumentation('doc1')
      .withStringIdentity('Property1', 'doc2', 100, null, null, '456')
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

    it('Should parse and validate without errors', () => {
      const endState = start(state);
      endState.errorMessageCollection.size.should.equal(0);
      endState.warningMessageCollection.size.should.equal(0);
    });
  });

  describe('When multiple files', () => {
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

    before(() => {
      const metaEdTextDomainEntity = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withMetaEdId('123')
      .withDocumentation('doc')
      .withStringIdentity('Property1', 'doc2', 100, null, null, '456')
      .withEndDomainEntity()
      .toString();

      const metaEdTextAssociation = MetaEdTextBuilder.build()
      .withStartAssociation('Association1')
      .withMetaEdId('789')
      .withDocumentation('doc')
      .withDomainEntityProperty('Domain1', 'doc', null, '1000')
      .withDomainEntityProperty('Domain2', 'doc', null, '2000')
      .withIntegerIdentity('Property2', 'doc', 100, null, null, '3000')
      .withEndDomainEntity()
      .toString();

      mockfs({
        '/fake/dir': {
          'Domain Entities': {
            'DomainEntity1.metaed': metaEdTextDomainEntity,
          },
          'Associations': {
            'Association1.metaed': metaEdTextAssociation,
          },
        },
      });
    });

    after(() => {
      mockfs.restore();
    });

    it('Should load the file contents', () => {
      const endState = start(state);
      endState.errorMessageCollection.size.should.equal(0);
      endState.warningMessageCollection.size.should.equal(0);
    });
  });
});
