import { newMetaEdEnvironment, newDescriptor, newNamespace, newStringProperty } from '@edfi/metaed-core';
import { MetaEdEnvironment, Descriptor, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/DescriptorPropertiesEnhancer';

describe('when DescriptorPropertiesEnhancer enhances descriptor', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const descriptorBaseName = 'DescriptorName';
  const descriptorName = 'DescriptorNameDescriptor';
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    const descriptor: Descriptor = {
      ...newDescriptor(),
      metaEdName: descriptorBaseName,
      namespace,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdDescriptorName assigned', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdDescriptorName).toBe(descriptorName);
  });

  it('should have xsdDescriptorNameWithExtension value same as descriptorName', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdDescriptorNameWithExtension).toBe(descriptorName);
  });

  it('should have xsdIsMapType value assigned', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdIsMapType).toBe(false);
  });

  it('should have xsdHasPropertiesOrMapType value assigned', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdHasPropertiesOrMapType).toBe(false);
  });
});

describe('when DescriptorPropertiesEnhancer enhances descriptor with extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const projectExtension = 'EXTENSION';

  const descriptorBaseName = 'DescriptorName';
  const descriptorName = 'DescriptorNameDescriptor';
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', projectExtension };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);

  beforeAll(() => {
    const descriptor: Descriptor = {
      ...newDescriptor(),
      metaEdName: descriptorBaseName,
      namespace: extensionNamespace,
      data: {
        edfiXsd: {},
      },
    };
    extensionNamespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdDescriptorName assigned', (): void => {
    const descriptor: any = extensionNamespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdDescriptorName).toBe(descriptorName);
  });

  it('should have xsdDescriptorNameWithExtension value with extension', (): void => {
    const descriptor: any = extensionNamespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdDescriptorNameWithExtension).toBe(`${projectExtension}-${descriptorName}`);
  });
});

describe('when DescriptorPropertiesEnhancer enhances descriptor with required map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const descriptorBaseName = 'DescriptorName';

  beforeAll(() => {
    const descriptor: Descriptor = {
      ...newDescriptor(),
      metaEdName: descriptorBaseName,
      namespace,
      isMapTypeRequired: true,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdIsMapType value assigned', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdIsMapType).toBe(true);
  });

  it('should have xsd_hasPropertiesOrMapType value with extension', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdHasPropertiesOrMapType).toBe(true);
  });
});

describe('when DescriptorPropertiesEnhancer enhances descriptor with optional map type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const descriptorBaseName = 'DescriptorName';

  beforeAll(() => {
    const descriptor: Descriptor = {
      ...newDescriptor(),
      metaEdName: descriptorBaseName,
      namespace,
      isMapTypeOptional: true,
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdIsMapType value assigned', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdIsMapType).toBe(true);
  });

  it('should have xsd_hasPropertiesOrMapType value with extension', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdHasPropertiesOrMapType).toBe(true);
  });
});

describe('when DescriptorPropertiesEnhancer enhances descriptor with items', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const descriptorBaseName = 'DescriptorName';

  beforeAll(() => {
    const descriptor: Descriptor = {
      ...newDescriptor(),
      metaEdName: descriptorBaseName,
      namespace,
      properties: [{ ...newStringProperty(), metaEdName: 'Property1', isPartOfIdentity: false }],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should have xsdIsMapType value assigned', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdIsMapType).toBe(false);
  });

  it('should have xsd_hasPropertiesOrMapType value with extension', (): void => {
    const descriptor: any = namespace.entity.descriptor.get(descriptorBaseName);
    expect(descriptor.data.edfiXsd.xsdHasPropertiesOrMapType).toBe(true);
  });
});
