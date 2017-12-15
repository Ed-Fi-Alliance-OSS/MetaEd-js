// @flow
import { newDescriptor, newMetaEdEnvironment } from 'metaed-core';
import type { Descriptor, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/Descriptor';

describe('when Descriptor enhances descriptor entity', () => {
  const descriptorName: string = 'DescriptorName';
  let descriptor: Descriptor;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
    });

    metaEd.entity.descriptor.set(descriptorName, descriptor);
    enhance(metaEd);
  });

  it('should have ods descriptor name with descriptor suffix', () => {
    expect(descriptor.data.edfiOds.ods_DescriptorName).toBe(`${descriptorName}Descriptor`);
  });

  it('should have false ods is map type', () => {
    expect(descriptor.data.edfiOds.ods_IsMapType).toBe(false);
  });
});

describe('when Descriptor enhances descriptor entity with descriptor suffix', () => {
  const descriptorName: string = 'DescriptorName';
  let descriptor: Descriptor;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptor = Object.assign(newDescriptor(), {
      metaEdName: `${descriptorName}Descriptor`,
    });

    metaEd.entity.descriptor.set(descriptorName, descriptor);
    enhance(metaEd);
  });

  it('should have ods descriptor name with normalized suffix', () => {
    expect(descriptor.data.edfiOds.ods_DescriptorName).toBe(`${descriptorName}Descriptor`);
  });

  it('should have false ods is map type', () => {
    expect(descriptor.data.edfiOds.ods_IsMapType).toBe(false);
  });
});

describe('when Descriptor enhances descriptor entity with is map type required', () => {
  let descriptor: Descriptor;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptor = Object.assign(newDescriptor(), {
      isMapTypeRequired: true,
    });

    metaEd.entity.descriptor.set('DescriptorName', descriptor);
    enhance(metaEd);
  });

  it('should have true ods is map type', () => {
    expect(descriptor.data.edfiOds.ods_IsMapType).toBe(true);
  });
});

describe('when Descriptor enhances descriptor entity with is amp type optional', () => {
  let descriptor: Descriptor;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    descriptor = Object.assign(newDescriptor(), {
      isMapTypeOptional: true,
    });

    metaEd.entity.descriptor.set('DescriptorName', descriptor);
    enhance(metaEd);
  });

  it('should have true ods is map type', () => {
    expect(descriptor.data.edfiOds.ods_IsMapType).toBe(true);
  });
});
