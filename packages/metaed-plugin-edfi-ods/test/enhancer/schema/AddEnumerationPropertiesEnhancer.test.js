// @flow
import { newEnumerationProperty, newMetaEdEnvironment } from 'metaed-core';
import type { EnumerationProperty, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/property/EnumerationProperty';

describe('when EnumerationProperty enhances enumeration property', () => {
  const enumerationPropertyName: string = 'EnumerationPropertyName';
  let enumerationProperty: EnumerationProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    enumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: enumerationPropertyName,
    });
    metaEd.propertyIndex.enumeration.push(enumerationProperty);
    enhance(metaEd);
  });

  it('should have ods name with type suffix', () => {
    expect(enumerationProperty.data.edfiOds.ods_Name).toBe(`${enumerationPropertyName}Type`);
  });

  it('should have ods typeified base name with type suffix', () => {
    expect(enumerationProperty.data.edfiOds.ods_TypeifiedBaseName).toBe(`${enumerationPropertyName}Type`);
  });
});

describe('when EnumerationProperty enhances enumeration property with context', () => {
  const enumerationPropertyName: string = 'EnumerationPropertyName';
  const contextName: string = 'ContextName';
  let enumerationProperty: EnumerationProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    enumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: enumerationPropertyName,
      withContext: contextName,
    });
    metaEd.propertyIndex.enumeration.push(enumerationProperty);
    enhance(metaEd);
  });

  it('should have ods name with type suffix and context prefix', () => {
    expect(enumerationProperty.data.edfiOds.ods_Name).toBe(`${contextName}${enumerationPropertyName}Type`);
  });

  it('should have ods typeified base name with type suffix', () => {
    expect(enumerationProperty.data.edfiOds.ods_TypeifiedBaseName).toBe(`${enumerationPropertyName}Type`);
  });
});

describe('when EnumerationProperty enhances enumeration property with type suffix', () => {
  const enumerationPropertyName: string = 'EnumerationPropertyName';
  let enumerationProperty: EnumerationProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    enumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: `${enumerationPropertyName}Type`,
    });
    metaEd.propertyIndex.enumeration.push(enumerationProperty);
    enhance(metaEd);
  });

  it('should have ods name with normalized type suffix', () => {
    expect(enumerationProperty.data.edfiOds.ods_Name).toBe(`${enumerationPropertyName}Type`);
  });

  it('should have ods typeified base name normalized type suffix', () => {
    expect(enumerationProperty.data.edfiOds.ods_TypeifiedBaseName).toBe(`${enumerationPropertyName}Type`);
  });
});
