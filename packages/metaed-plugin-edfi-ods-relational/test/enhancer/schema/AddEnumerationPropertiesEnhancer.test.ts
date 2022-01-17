import { newEnumerationProperty, newMetaEdEnvironment } from '@edfi/metaed-core';
import { EnumerationProperty, MetaEdEnvironment } from '@edfi/metaed-core';
import { enhance } from '../../../src/model/property/EnumerationProperty';

describe('when EnumerationProperty enhances enumeration property', (): void => {
  const enumerationPropertyName = 'EnumerationPropertyName';
  let enumerationProperty: EnumerationProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    enumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: enumerationPropertyName,
    });
    metaEd.propertyIndex.enumeration.push(enumerationProperty);
    enhance(metaEd);
  });

  it('should have ods name with type suffix', (): void => {
    expect(enumerationProperty.data.edfiOdsRelational.odsName).toBe(`${enumerationPropertyName}Type`);
  });

  it('should have ods typeified base name with type suffix', (): void => {
    expect(enumerationProperty.data.edfiOdsRelational.odsTypeifiedBaseName).toBe(`${enumerationPropertyName}Type`);
  });
});

describe('when EnumerationProperty enhances enumeration property role name', (): void => {
  const enumerationPropertyName = 'EnumerationPropertyName';
  const contextName = 'ContextName';
  let enumerationProperty: EnumerationProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    enumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: enumerationPropertyName,
      roleName: contextName,
    });
    metaEd.propertyIndex.enumeration.push(enumerationProperty);
    enhance(metaEd);
  });

  it('should have ods name with type suffix and context prefix', (): void => {
    expect(enumerationProperty.data.edfiOdsRelational.odsName).toBe(`${contextName}${enumerationPropertyName}Type`);
  });

  it('should have ods typeified base name with type suffix', (): void => {
    expect(enumerationProperty.data.edfiOdsRelational.odsTypeifiedBaseName).toBe(`${enumerationPropertyName}Type`);
  });
});

describe('when EnumerationProperty enhances enumeration property with type suffix', (): void => {
  const enumerationPropertyName = 'EnumerationPropertyName';
  let enumerationProperty: EnumerationProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    enumerationProperty = Object.assign(newEnumerationProperty(), {
      metaEdName: `${enumerationPropertyName}Type`,
    });
    metaEd.propertyIndex.enumeration.push(enumerationProperty);
    enhance(metaEd);
  });

  it('should have ods name with normalized type suffix', (): void => {
    expect(enumerationProperty.data.edfiOdsRelational.odsName).toBe(`${enumerationPropertyName}Type`);
  });

  it('should have ods typeified base name normalized type suffix', (): void => {
    expect(enumerationProperty.data.edfiOdsRelational.odsTypeifiedBaseName).toBe(`${enumerationPropertyName}Type`);
  });
});
