// @flow
import { newMetaEdEnvironment, newDescriptor, newNamespaceInfo, newStringProperty } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Descriptor } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/DescriptorPropertiesEnhancer';

describe('when DescriptorPropertiesEnhancer enhances descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const descriptorBaseName: string = 'DescriptorName';
  const descriptorName: string = 'DescriptorNameDescriptor';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorBaseName,
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_DescriptorName assigned', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_DescriptorName).toBe(descriptorName);
  });

  it('should have xsd_DescriptorNameWithExtension value same as descriptorName', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_DescriptorNameWithExtension).toBe(descriptorName);
  });

  it('should have xsd_IsMapType value assigned', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_IsMapType).toBe(false);
  });

  it('should have xsd_HasPropertiesOrMapType value assigned', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_HasPropertiesOrMapType).toBe(false);
  });
});

describe('when DescriptorPropertiesEnhancer enhances descriptor with extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const projectExtension: string = 'EXTENSION';

  const descriptorBaseName: string = 'DescriptorName';
  const descriptorName: string = 'DescriptorNameDescriptor';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorBaseName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
        projectExtension,
      }),
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_DescriptorName assigned', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_DescriptorName).toBe(descriptorName);
  });

  it('should have xsd_DescriptorNameWithExtension value with extension', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_DescriptorNameWithExtension).toBe(`${projectExtension}-${descriptorName}`);
  });
});

describe('when DescriptorPropertiesEnhancer enhances descriptor with required map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const descriptorBaseName: string = 'DescriptorName';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorBaseName,
      isMapTypeRequired: true,
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_IsMapType value assigned', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_IsMapType).toBe(true);
  });

  it('should have xsd_hasPropertiesOrMapType value with extension', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_HasPropertiesOrMapType).toBe(true);
  });
});

describe('when DescriptorPropertiesEnhancer enhances descriptor with optional map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const descriptorBaseName: string = 'DescriptorName';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorBaseName,
      isMapTypeOptional: true,
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_IsMapType value assigned', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_IsMapType).toBe(true);
  });

  it('should have xsd_hasPropertiesOrMapType value with extension', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_HasPropertiesOrMapType).toBe(true);
  });
});

describe('when DescriptorPropertiesEnhancer enhances descriptor with items', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const descriptorBaseName: string = 'DescriptorName';

  beforeAll(() => {
    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorBaseName,
      properties: [
        Object.assign(newStringProperty(), {
          metaEdName: 'Property1',
          isPartOfIdentity: false,
        }),
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsd_IsMapType value assigned', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_IsMapType).toBe(false);
  });

  it('should have xsd_hasPropertiesOrMapType value with extension', () => {
    const descriptor: any = metaEd.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsd_HasPropertiesOrMapType).toBe(true);
  });
});
