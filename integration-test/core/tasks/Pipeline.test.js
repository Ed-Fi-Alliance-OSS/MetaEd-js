// @flow
import path from 'path';
import normalize from 'normalize-path';
import { asDomainEntity } from '../../../packages/metaed-core/src/model/DomainEntity';
import { startingFromFileLoad, startingFromFileLoadP } from './Pipeline';
import {
  createMetaEdFile,
  getEntity,
  loadCoreBufferedFiles,
  MetaEdTextBuilder,
  newState,
} from '../../../packages/metaed-core/index';
import type { State } from '../../../packages/metaed-core/index';


jest.unmock('final-fs');

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
    state = loadCoreBufferedFiles(newState(), [createMetaEdFile('/fake/dir', 'DomainEntity.metaed', metaEdText)]);
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
    .withBooleanIdentity('IntegerIdentity', 'doc', null, '456')
    .withEndDomainEntity()
    .toString();

  const metaEdText2 = MetaEdTextBuilder.build()
    .withStartDomainEntity('DomainEntity1')
    .withMetaEdId('789')
    .withDocumentation('doc')
    .withBooleanIdentity('IntegerIdentity', 'doc', null, '12')
    .withEndDomainEntity()
    .toString();

  let state: State;

  beforeEach(() => {
    state = loadCoreBufferedFiles(newState(), [
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
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaEdTextDomainEntity1),
      createMetaEdFile('/fake/dir', 'DomainEntity2.metaed', metaEdTextDomainEntity2),
      createMetaEdFile('/fake/dir', 'Association1.metaed', metaEdTextAssociation),
    ]);
  });

  it('Should load the file contents', () => {
    const endState = startingFromFileLoad(state);
    expect(endState.validationFailure).toHaveLength(0);
  });

  it('should return state in promise form', () => {
    const endStateP = startingFromFileLoadP(state);
    return endStateP.then(endState => {
      expect(endState.validationFailure).toHaveLength(0);
    });
  });
});
describe('When plugins are present', () => {
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
    .withCommonProperty('nonExistantCommon', 'doc', false, false)
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
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaEdTextDomainEntity1),
      createMetaEdFile('/fake/dir', 'DomainEntity2.metaed', metaEdTextDomainEntity2),
      createMetaEdFile('/fake/dir', 'Association1.metaed', metaEdTextAssociation),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });

  it('Should load the plugin into pluginManifest', () => {
    expect(state.pluginManifest.length).toBeGreaterThan(0);
  });
  it('Should load the validators from plugin', () => {
    expect(state.pluginManifest.length).toBeGreaterThan(0);
  });
});
describe('when building entity property with context', () => {
  const namespace: string = 'namespace';

  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let state: State = newState();

  beforeAll(() => {
    const metaedText = MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation(entityDocumentation)
      .withAssociationProperty(propertyName, propertyDocumentation, false, false, false)
      .withContext(contextName)
      .withEndDomainEntity()
      .withEndNamespace()
      .toString();
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaedText),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });
  it('should have withContext', () => {
    const entity: any = getEntity(state.metaEd.entity, entityName, 'domainEntity');
    expect(asDomainEntity(entity).properties[0].withContext).toBe(contextName);
  });

  it('should have source map for contextName with line, column, text', () => {
    const entity: any = getEntity(state.metaEd.entity, entityName, 'domainEntity');
    expect(asDomainEntity(entity).properties[0].sourceMap.withContext).toBeDefined();
    expect(asDomainEntity(entity).properties[0].sourceMap.withContext).toMatchSnapshot();
  });
});

describe('when building a domain entity with a integer property that conflicts with a shared integer', () => {
  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let state: State = newState();

  beforeAll(() => {
    const metaedDEText = MetaEdTextBuilder.build()

      .withStartDomainEntity(entityName, '100')
      .withDocumentation(entityDocumentation)
      .withIntegerIdentity(propertyName, propertyDocumentation, '10', '1', null, '101')
      .withEndDomainEntity()
      .toString();

    const metaedSharedInteger = MetaEdTextBuilder.build()
      .withStartSharedInteger(propertyName, '200')
      .withDocumentation(propertyDocumentation)
      .withMaxValue('10')
      .withMinValue('1')
      .withEndSharedInteger()
      .toString();
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaedDEText),
      createMetaEdFile('/fake/dir', 'SharedInteger1.metaed', metaedSharedInteger),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });
  it('should have built one domain entity', () => {
    expect(state.metaEd.entity.domainEntity.size).toBe(1);
  });
  it('should have built one shared integer', () => {
    expect(state.metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should have one validation error, four warnings', () => {
    expect(state.validationFailure.filter(message => message.category === 'error').length).toBe(1);
    expect(state.validationFailure.filter(message => message.category === 'error')[0].message).toMatchSnapshot();

    expect(state.validationFailure.filter(message => message.category === 'warning').length).toBe(0);
  });
});
describe('when building a valid domain entity with an integer identity', () => {
  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let state: State = newState();

  beforeAll(() => {
    const metaedDEText = MetaEdTextBuilder.build()
      .withStartDomainEntity(entityName, '100')
      .withDocumentation(entityDocumentation)
      .withIntegerIdentity(propertyName, propertyDocumentation, '10', '1', null, '101')
      .withEndDomainEntity()
      .toString();
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaedDEText),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });
  it('should have built one domain entity', () => {
    expect(state.metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation errors or warnings', () => {
    expect(state.validationFailure.filter(message => message.category === 'error').length).toBe(0);
    expect(state.validationFailure.filter(message => message.category === 'warning').length).toBe(0);
  });
});
describe('when building duplicate domain entities', () => {
  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let state: State = newState();

  beforeAll(() => {
    const metaedDE1Text = MetaEdTextBuilder.build()
      .withStartDomainEntity(entityName, '101')
      .withDocumentation(entityDocumentation)
      .withIntegerIdentity(propertyName, propertyDocumentation, '1', '0', null, '102')
      .withEndDomainEntity()
      .toString();
    const metaedDE2Text = MetaEdTextBuilder.build()
      .withStartDomainEntity(entityName, '201')
      .withDocumentation(entityDocumentation)
      .withIntegerIdentity(propertyName, propertyDocumentation, '1', '0', null, '202')
      .withEndDomainEntity()
      .toString();
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaedDE1Text),
      createMetaEdFile('/fake/dir', 'DomainEntity2.metaed', metaedDE2Text),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });
  it('should have built one domain entity', () => {
    expect(state.metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have two validation errors, no warnings', () => {
    expect(state.validationFailure.filter(message => message.category === 'error').length).toBe(2);
    expect(state.validationFailure.filter(message => message.category === 'warning').length).toBe(0);
  });
});
describe('when building a domain entity with an integer property', () => {
  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let state: State = newState();

  beforeAll(() => {
    const metaedDE1Text = MetaEdTextBuilder.build()
      .withStartDomainEntity(entityName, '100')
      .withDocumentation(entityDocumentation)
      .withIntegerIdentity(propertyName, propertyDocumentation, '10', '1', null, '101')
      .withEndDomainEntity()
      .toString();
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaedDE1Text),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });
  it('should have built one domain entity', () => {
    expect(state.metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation errors or warnings', () => {
    expect(state.validationFailure.filter(message => message.category === 'error').length).toBe(0);
    expect(state.validationFailure.filter(message => message.category === 'warning').length).toBe(0);
  });
});

describe('when building a valid domain entity with duplicate metaedIds', () => {
  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let state: State = newState();

  beforeAll(() => {
    const metaedDEText = MetaEdTextBuilder.build()
      .withStartDomainEntity(entityName, '111')
      .withDocumentation(entityDocumentation)
      .withIntegerIdentity(propertyName, propertyDocumentation, '100', null, null, '111')
      .withEndDomainEntity()
      .toString();
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaedDEText),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });
  it('should have built one domain entity', () => {
    expect(state.metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation errors and two warnings', () => {
    expect(state.validationFailure.filter(message => message.category === 'error').length).toBe(0);
    expect(state.validationFailure.filter(message => message.category === 'warning').length).toBe(2);
    expect(state.validationFailure.filter(message => message.category === 'warning').length).toBe(2);
    expect(state.validationFailure.filter(message => message.category === 'warning').length).toBe(2);
  });
});
describe('when building a DE with a common property but no common declaration', () => {
  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let state: State = newState();

  beforeAll(() => {
    const metaedDEText = MetaEdTextBuilder.build()
      .withStartDomainEntity(entityName, '111')
      .withDocumentation(entityDocumentation)
      .withIntegerIdentity(propertyName, propertyDocumentation, '100', null, null, '112')
      .withCommonProperty('NonExistentCommon', 'This common doesnt have a declaration', true, false, null, '113')
      .withEndDomainEntity()
      .toString();
    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaedDEText),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });
  it('should have built one domain entity', () => {
    expect(state.metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should have one validation error and no warnings', () => {
    expect(state.validationFailure.filter(message => message.category === 'error').length).toBe(1);
    expect(state.validationFailure.filter(message => message.category === 'error')[0].validatorName).toBe('CommonPropertyMustMatchACommon');
    expect(state.validationFailure.filter(message => message.category === 'warning').length).toBe(0);
  });
});
describe('when building a DE with a common property and duplicate common declerations', () => {
  const entityName: string = 'EntityName';
  const entityDocumentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const commonName: string = 'Common1';
  let state: State = newState();

  beforeAll(() => {
    const metaedDEText = MetaEdTextBuilder.build()
      .withStartDomainEntity(entityName, '111')
      .withDocumentation(entityDocumentation)
      .withIntegerIdentity(propertyName, propertyDocumentation, '100', null, null, '112')
      .withCommonProperty(commonName, 'doc', true, false, null, '113')
      .withEndDomainEntity()
      .toString();

    const metaedCommon1Text = MetaEdTextBuilder.build()
    .withStartCommon(commonName, '100')
    .withDocumentation('doc')
    .withIntegerProperty(propertyName, 'This is a common with a duplicate name', true, false, '10', '0', null, '101')
    .withEndCommon()
    .toString();

    const metaedCommon2Text = MetaEdTextBuilder.build()
    .withStartCommon(commonName, '200')
    .withDocumentation('doc')
    .withIntegerProperty(propertyName, 'This is a common with a duplicate name', true, false, '10', '0', null, '201')
    .withEndCommon()
    .toString();

    state = loadCoreBufferedFiles(newState(), [
      createMetaEdFile('/fake/dir', 'DomainEntity1.metaed', metaedDEText),
      createMetaEdFile('/fake/dir', 'Common1.metaed', metaedCommon1Text),
      createMetaEdFile('/fake/dir', 'Common2.metaed', metaedCommon2Text),
    ]);
    state.pluginScanDirectory = path.resolve(__dirname, '../../');
    startingFromFileLoadP(state);
  });
  it('should have built one domain entity and one comon', () => {
    expect(state.metaEd.entity.domainEntity.size).toBe(1);
    expect(state.metaEd.entity.common.size).toBe(1);
  });

  it('should have two validation errors and no warnings', () => {
    expect(state.validationFailure.filter(message => message.category === 'error').length).toBe(2);
    expect(state.validationFailure.filter(message => message.category === 'error')[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(state.validationFailure.filter(message => message.category === 'error')[1].validatorName).toBe('TopLevelEntityBuilder');

    expect(state.validationFailure.filter(message => message.category === 'warqning').length).toBe(0);
  });
});
