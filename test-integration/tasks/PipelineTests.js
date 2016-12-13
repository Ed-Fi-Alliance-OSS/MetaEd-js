import chai from 'chai';
import mockfs from 'mock-fs';
import MetaEdTextBuilder from '../../test/grammar/MetaEdTextBuilder';
import { startingFromFileLoad } from '../../src/core/tasks/Pipeline';
import { StateInstance } from '../../src/core/State';
// eslint-disable-next-line no-duplicate-imports
import type { State } from '../../src/core/State';

chai.should();

describe('PipelineTests', () => {
  describe('When a single file', () => {
    const state: State = new StateInstance({
      inputDirectories: [{
        path: '/fake/dir',
        namespace: 'edfi',
        projectExtension: '',
        isExtension: false,
      }],
    });

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
      const endState = startingFromFileLoad(state);
      endState.errorMessageCollection.size.should.equal(0);
      endState.warningMessageCollection.size.should.equal(0);
    });
  });

  describe('When a single file with a bad reference', () => {
    const state: State = new StateInstance({
      inputDirectories: [{
        path: '/fake/dir',
        namespace: 'edfi',
        projectExtension: '',
        isExtension: false,
      }],
    });

    before(() => {
      const metaEdText = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withMetaEdId('123')
      .withDocumentation('doc')
      .withReferenceIdentity('NoMatchingEntity', 'doc', null, '456')
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

    it('Should return an error', () => {
      const endState = startingFromFileLoad(state);
      endState.errorMessageCollection.size.should.equal(1);
      endState.warningMessageCollection.size.should.equal(0);
    });
  });

  describe('When multiple files', () => {
    const state: State = new StateInstance({
      inputDirectories: [{
        path: '/fake/dir',
        namespace: 'edfi',
        projectExtension: '',
        isExtension: false,
      }],
    });

    before(() => {
      const metaEdTextDomainEntity1 = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity1')
      .withMetaEdId('123')
      .withDocumentation('doc')
      .withStringIdentity('Property1', 'doc', 100, null, null, '1231')
      .withEndDomainEntity()
      .toString();

      const metaEdTextDomainEntity2 = MetaEdTextBuilder.build()
      .withStartDomainEntity('DomainEntity2')
      .withMetaEdId('234')
      .withDocumentation('doc')
      .withStringIdentity('Property2', 'doc', 100, null, null, '2341')
      .withEndDomainEntity()
      .toString();

      const metaEdTextAssociation = MetaEdTextBuilder.build()
      .withStartAssociation('Association1')
      .withMetaEdId('789')
      .withDocumentation('doc')
      .withDomainEntityProperty('DomainEntity1', 'doc', null, '7891')
      .withDomainEntityProperty('DomainEntity2', 'doc', null, '7892')
      .withIntegerIdentity('IntegerProperty', 'doc', 100, null, null, '7893')
      .withEndDomainEntity()
      .toString();

      mockfs({
        '/fake/dir': {
          'Domain Entities': {
            'DomainEntity1.metaed': metaEdTextDomainEntity1,
            'DomainEntity2.metaed': metaEdTextDomainEntity2,
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
      const endState = startingFromFileLoad(state);
      endState.errorMessageCollection.size.should.equal(0);
      endState.warningMessageCollection.size.should.equal(0);
    });
  });
});
