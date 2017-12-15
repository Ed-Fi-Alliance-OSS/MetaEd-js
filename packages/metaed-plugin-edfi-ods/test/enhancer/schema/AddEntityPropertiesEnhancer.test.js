// @flow
import { newIntegerProperty, newMetaEdEnvironment } from 'metaed-core';
import type { IntegerProperty, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/property/EntityProperty';

describe('when PropertyEnhancer enhances integer property', () => {
  const integerPropertyName: string = 'IntegerPropertyName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have ods name', () => {
    expect(integerProperty.data.edfiOds.ods_Name).toBe(integerPropertyName);
  });

  it('should have empty ods context prefix', () => {
    expect(integerProperty.data.edfiOds.ods_ContextPrefix).toBe('');
  });

  it('should have false ods is collection', () => {
    expect(integerProperty.data.edfiOds.ods_IsCollection).toBe(false);
  });
});

describe('when PropertyEnhancer enhances property with required collection', () => {
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const integerPropertyName: string = 'IntegerPropertyName';
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      isRequiredCollection: true,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have true ods is collection', () => {
    expect(integerProperty.data.edfiOds.ods_IsCollection).toBe(true);
  });
});

describe('when PropertyEnhancer enhances property with optional collection', () => {
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const integerPropertyName: string = 'IntegerPropertyName';
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      isOptionalCollection: true,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have true ods is collection', () => {
    expect(integerProperty.data.edfiOds.ods_IsCollection).toBe(true);
  });
});

describe('when PropertyEnhancer enhances property with context', () => {
  const integerPropertyName: string = 'IntegerPropertyName';
  const contextName: string = 'ContextName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      withContext: contextName,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have ods name prefixed with context', () => {
    expect(integerProperty.data.edfiOds.ods_Name).toBe(contextName + integerPropertyName);
  });

  it('should have ods context prefix', () => {
    expect(integerProperty.data.edfiOds.ods_ContextPrefix).toBe(contextName);
  });
});

describe('when PropertyEnhancer enhances property with shortened context', () => {
  const integerPropertyName: string = 'IntegerPropertyName';
  const contextName: string = 'ContextName';
  const shortenToName: string = 'shortenToName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      withContext: contextName,
      shortenTo: shortenToName,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have ods name prefixed with context', () => {
    expect(integerProperty.data.edfiOds.ods_Name).toBe(contextName + integerPropertyName);
  });

  it('should have ods context prefix with shortened name', () => {
    expect(integerProperty.data.edfiOds.ods_ContextPrefix).toBe(shortenToName);
  });
});
