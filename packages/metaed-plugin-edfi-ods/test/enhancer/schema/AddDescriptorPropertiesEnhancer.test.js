// @flow
import { newDescriptorProperty, newMetaEdEnvironment } from 'metaed-core';
import type { DescriptorProperty, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/property/DescriptorProperty';

describe('when DescriptorProperty enhances descriptor property', () => {
  const descriptorPropertyName: string = 'DescriptorPropertyName';
  let descriptorProperty: DescriptorProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorPropertyName,
    });
    metaEd.propertyIndex.descriptor.push(descriptorProperty);
    enhance(metaEd);
  });

  it('should have ods name with descriptor suffix', () => {
    expect(descriptorProperty.data.edfiOds.ods_Name).toBe(`${descriptorPropertyName}Descriptor`);
  });

  it('should have ods descriptorified base name with descriptor suffix', () => {
    expect(descriptorProperty.data.edfiOds.ods_DescriptorifiedBaseName).toBe(`${descriptorPropertyName}Descriptor`);
  });
});

describe('when DescriptorProperty enhances descriptor property with context', () => {
  const descriptorPropertyName: string = 'DescriptorPropertyName';
  const contextName: string = 'ContextName';
  let descriptorProperty: DescriptorProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorPropertyName,
      withContext: contextName,
    });
    metaEd.propertyIndex.descriptor.push(descriptorProperty);
    enhance(metaEd);
  });

  it('should have ods name with descriptor suffix and context prefix', () => {
    expect(descriptorProperty.data.edfiOds.ods_Name).toBe(`${contextName}${descriptorPropertyName}Descriptor`);
  });

  it('should have ods descriptorified base name with descriptor suffix', () => {
    expect(descriptorProperty.data.edfiOds.ods_DescriptorifiedBaseName).toBe(`${descriptorPropertyName}Descriptor`);
  });
});

describe('when DescriptorProperty enhances descriptor property with descriptor suffix', () => {
  const descriptorPropertyName: string = 'DescriptorPropertyName';
  let descriptorProperty: DescriptorProperty;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: `${descriptorPropertyName}Descriptor`,
    });
    metaEd.propertyIndex.descriptor.push(descriptorProperty);
    enhance(metaEd);
  });

  it('should have ods name with normalized descriptor suffix', () => {
    expect(descriptorProperty.data.edfiOds.ods_Name).toBe(`${descriptorPropertyName}Descriptor`);
  });

  it('should have ods descriptorified base name normalized descriptor suffix', () => {
    expect(descriptorProperty.data.edfiOds.ods_DescriptorifiedBaseName).toBe(`${descriptorPropertyName}Descriptor`);
  });
});
