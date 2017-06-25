// @flow
import normalize from 'normalize-path';
import MetaEdTextBuilder from '../../../test/core/MetaEdTextBuilder';
import { startingFromFileLoad, startingFromFileLoadP } from '../../../src/core/task/Pipeline';
import type { State } from '../../../src/core/State';
import { defaultStateFactory } from '../../../src/core/State';
import { createMetaEdFile } from '../../../src/core/task/MetaEdFile';
import { loadCoreBufferedFiles } from '../../../src/core/task/BufferFileLoader';

describe('When a single file', () => {
  const metaEdText = MetaEdTextBuilder.build()
    .withStartDomainEntity('DomainEntity1')
    .withMetaEdId('123')
    .withDocumentation('doc1')
    .withStringIdentity('Property1', 'doc2', '100', null, null, '456')
    .withEndDomainEntity()
    .toString();

  let state: State;

  beforeEach(() => {
    state = loadCoreBufferedFiles(defaultStateFactory(), [createMetaEdFile('/fake/dir', 'DomainEntity.metaed', metaEdText)]);
  });

  it('Should parse and validate without errors', () => {
    const endState = startingFromFileLoad(state);
    expect(endState.validationFailure).toHaveLength(0);
  });

  it('Should parse and validate without errors in Promise form', () => {
    const endStateP = startingFromFileLoadP(state);
    endStateP.then(endState => {
      expect(endState.validationFailure).toHaveLength(0);
    });
  });
});

describe('When files have duplicate entity names', () => {
  const metaEdText1 = MetaEdTextBuilder.build()
    .withStartDomainEntity('DomainEntity1')
    .withMetaEdId('123')
    .withDocumentation('doc')
    .withDomainEntityIdentity('DomainEntityIdentity', 'doc', null, '456')
    .withEndDomainEntity()
    .toString();

  const metaEdText2 = MetaEdTextBuilder.build()
    .withStartDomainEntity('DomainEntity1')
    .withMetaEdId('789')
    .withDocumentation('doc')
    .withDomainEntityIdentity('DomainEntityIdentity', 'doc', null, '012')
    .withEndDomainEntity()
    .toString();

  let state: State;

  beforeEach(() => {
    state = loadCoreBufferedFiles(defaultStateFactory(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaEdText1),
      createMetaEdFile('/fake/dir', 'DomainEntity1Also.metaed', metaEdText2),
    ]);
  });

  it('Should return an error in Promise form', () => {
    const endStateP = startingFromFileLoadP(state);
    return endStateP.then(endState => {
      expect(endState.validationFailure).toHaveLength(2);
      // $FlowIgnore - filename could be null
      expect(normalize(endState.validationFailure[0].fileMap.filename)).toBe('/fake/dir/DomainEntity1Also.metaed');
      expect(endState.validationFailure[0].message).toMatchSnapshot('When a single file with a duplicate entity name Should return an error -> message[0]');
      expect(endState.validationFailure[0].sourceMap).toMatchSnapshot('When a single file with a duplicate entity name Should return an error -> sourceMap[0]');

      // $FlowIgnore - filename could be null
      expect(normalize(endState.validationFailure[1].fileMap.filename)).toBe('/fake/dir/DomainEntity1.metaed');
      expect(endState.validationFailure[1].message).toMatchSnapshot('When a single file with a duplicate entity name Should return an error -> message[1]');
      expect(endState.validationFailure[1].sourceMap).toMatchSnapshot('When a single file with a duplicate entity name Should return an error -> sourceMap[1]');
    });
  });

  it('Should return an error', () => {
    const endState = startingFromFileLoad(state);
    expect(endState.validationFailure).toHaveLength(2);
    // $FlowIgnore - filename could be null
    expect(normalize(endState.validationFailure[0].fileMap.filename)).toBe('/fake/dir/DomainEntity1Also.metaed');
    expect(endState.validationFailure[0].message).toMatchSnapshot('When files have duplicate entity names Should return an error -> message[0]');
    expect(endState.validationFailure[0].sourceMap).toMatchSnapshot('When files have duplicate entity names Should return an error -> sourceMap[0]');

    // $FlowIgnore - filename could be null
    expect(normalize(endState.validationFailure[1].fileMap.filename)).toBe('/fake/dir/DomainEntity1.metaed');
    expect(endState.validationFailure[1].message).toMatchSnapshot('When files have duplicate entity names Should return an error -> message[1]');
    expect(endState.validationFailure[1].sourceMap).toMatchSnapshot('When files have duplicate entity names Should return an error -> sourceMap[1]');
  });
});

describe('When multiple files', () => {
  const metaEdTextDomainEntity1 = MetaEdTextBuilder.build()
    .withStartDomainEntity('DomainEntity1')
    .withMetaEdId('123')
    .withDocumentation('doc')
    .withStringIdentity('Property1', 'doc', '100', null, null, '1231')
    .withEndDomainEntity()
    .toString();

  const metaEdTextDomainEntity2 = MetaEdTextBuilder.build()
    .withStartDomainEntity('DomainEntity2')
    .withMetaEdId('234')
    .withDocumentation('doc')
    .withStringIdentity('Property2', 'doc', '100', null, null, '2341')
    .withEndDomainEntity()
    .toString();

  const metaEdTextAssociation = MetaEdTextBuilder.build()
    .withStartAssociation('Association1')
    .withMetaEdId('789')
    .withDocumentation('doc')
    .withAssociationDomainEntityProperty('DomainEntity1', 'doc', null, '7891')
    .withAssociationDomainEntityProperty('DomainEntity2', 'doc', null, '7892')
    .withIntegerIdentity('IntegerProperty', 'doc', '100', null, null, '7893')
    .withEndDomainEntity()
    .toString();

  let state: State;

  beforeEach(() => {
    state = loadCoreBufferedFiles(defaultStateFactory(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaEdTextDomainEntity1),
      createMetaEdFile('/fake/dir', 'DomainEntity2.metaed', metaEdTextDomainEntity2),
      createMetaEdFile('/fake/dir', 'Association1.metaed', metaEdTextAssociation),
    ]);
  });

  it('Should load the file contents', () => {
    const endState = startingFromFileLoad(state);
    expect(endState.validationFailure).toHaveLength(0);
  });

  it('Should load the file contents in Promise form', () => {
    const endStateP = startingFromFileLoadP(state);
    return endStateP.then(endState => {
      expect(endState.validationFailure).toHaveLength(0);
    });
  });
});
