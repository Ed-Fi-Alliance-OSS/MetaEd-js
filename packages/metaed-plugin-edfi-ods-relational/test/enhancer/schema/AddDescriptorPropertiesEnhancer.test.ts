import { newDescriptorProperty, newMetaEdEnvironment } from '@edfi/metaed-core';
import { DescriptorProperty, MetaEdEnvironment } from '@edfi/metaed-core';
import { enhance } from '../../../src/model/property/DescriptorProperty';

describe('when DescriptorProperty enhances descriptor property', (): void => {
  const descriptorPropertyName = 'DescriptorPropertyName';
  let descriptorProperty: DescriptorProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorPropertyName,
    });
    metaEd.propertyIndex.descriptor.push(descriptorProperty);
    enhance(metaEd);
  });

  it('should have ods name with descriptor suffix', (): void => {
    expect(descriptorProperty.data.edfiOdsRelational.odsName).toBe(`${descriptorPropertyName}Descriptor`);
  });

  it('should have ods descriptorified base name with descriptor suffix', (): void => {
    expect(descriptorProperty.data.edfiOdsRelational.odsDescriptorifiedBaseName).toBe(`${descriptorPropertyName}Descriptor`);
  });
});

describe('when DescriptorProperty enhances descriptor property role name', (): void => {
  const descriptorPropertyName = 'DescriptorPropertyName';
  const contextName = 'ContextName';
  let descriptorProperty: DescriptorProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorPropertyName,
      roleName: contextName,
    });
    metaEd.propertyIndex.descriptor.push(descriptorProperty);
    enhance(metaEd);
  });

  it('should have ods name with descriptor suffix and context prefix', (): void => {
    expect(descriptorProperty.data.edfiOdsRelational.odsName).toBe(`${contextName}${descriptorPropertyName}Descriptor`);
  });

  it('should have ods descriptorified base name with descriptor suffix', (): void => {
    expect(descriptorProperty.data.edfiOdsRelational.odsDescriptorifiedBaseName).toBe(`${descriptorPropertyName}Descriptor`);
  });
});

describe('when DescriptorProperty enhances descriptor property with descriptor suffix', (): void => {
  const descriptorPropertyName = 'DescriptorPropertyName';
  let descriptorProperty: DescriptorProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: `${descriptorPropertyName}Descriptor`,
    });
    metaEd.propertyIndex.descriptor.push(descriptorProperty);
    enhance(metaEd);
  });

  it('should have ods name with normalized descriptor suffix', (): void => {
    expect(descriptorProperty.data.edfiOdsRelational.odsName).toBe(`${descriptorPropertyName}Descriptor`);
  });

  it('should have ods descriptorified base name normalized descriptor suffix', (): void => {
    expect(descriptorProperty.data.edfiOdsRelational.odsDescriptorifiedBaseName).toBe(`${descriptorPropertyName}Descriptor`);
  });
});
