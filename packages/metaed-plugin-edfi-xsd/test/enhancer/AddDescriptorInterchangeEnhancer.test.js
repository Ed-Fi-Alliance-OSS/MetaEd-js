// @flow
import { newMetaEdEnvironment, newPluginEnvironment, newNamespaceInfo, newDescriptor } from 'metaed-core';
import type { MetaEdEnvironment, NamespaceInfo, Descriptor } from 'metaed-core';
import { enhance, descriptorInterchangeName } from '../../src/enhancer/AddDescriptorInterchangeEnhancer';
import { newEdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { MergedInterchange } from '../../src/model/MergedInterchange';

describe('when running with one descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiXsd',
    Object.assign(newPluginEnvironment(), {
      entity: newEdFiXsdEntityRepository(),
    }),
  );
  const namespace: string = 'edfi';
  const descriptorBaseName: string = 'DescriptorBaseName';
  const descriptorName: string = 'DescriptorName';

  beforeAll(() => {
    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_MetaEdNameWithExtension: descriptorBaseName,
          xsd_DescriptorName: descriptorName,
          xsd_DescriptorNameWithExtension: 'XsdDescriptorNameExtension',
          xsd_IsMapType: false,
          xsd_HasPropertiesOrMapType: true,
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    enhance(metaEd);
  });

  it('should create only the one descriptor interchange element', () => {
    const entity: MergedInterchange = pluginEnvironment(metaEd).entity.mergedInterchange.get(descriptorInterchangeName);
    expect(entity.elements.length).toBe(1);
    expect(entity.elements[0].metaEdName).toBe(descriptorName);
  });

  it('should not create extension descriptor interchange element', () => {
    expect(pluginEnvironment(metaEd).entity.mergedInterchange.size).toBe(1);
  });
});

describe('when running with one extension descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiXsd',
    Object.assign(newPluginEnvironment(), {
      entity: newEdFiXsdEntityRepository(),
    }),
  );
  const namespace: string = 'edfi';
  const descriptorBaseName: string = 'DescriptorBaseName';
  const descriptorName: string = 'DescriptorName';
  const extensionDescriptorBaseName: string = 'ExtensionDescriptorBaseName';
  const extensionDescriptorName: string = 'ExtensionDescriptorName';
  const extensionNamespace: string = 'namespace';
  const projectExtension: string = 'EXTENSION';

  beforeAll(() => {
    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespace,
      projectExtension,
      isExtension: true,
    });
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorBaseName,
      namespaceInfo: coreNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_MetaEdNameWithExtension: descriptorBaseName,
          xsd_DescriptorName: descriptorName,
          xsd_DescriptorNameWithExtension: 'XsdDescriptorNameExtension',
          xsd_IsMapType: false,
          xsd_HasPropertiesOrMapType: false,
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    const extensionDescriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: extensionDescriptorBaseName,
      namespaceInfo: extensionNamespaceInfo,
      data: {
        edfiXsd: {
          xsd_MetaEdNameWithExtension: `${projectExtension}-${descriptorBaseName}`,
          xsd_DescriptorName: extensionDescriptorName,
          xsd_DescriptorNameWithExtension: 'XsdDescriptorNameExtension',
          xsd_IsMapType: false,
          xsd_HasPropertiesOrMapType: false,
        },
      },
    });
    metaEd.entity.descriptor.set(extensionDescriptor.metaEdName, extensionDescriptor);

    enhance(metaEd);
  });

  it('should create two interchanges', () => {
    expect(pluginEnvironment(metaEd).entity.mergedInterchange.size).toBe(2);
  });

  it('should create one core descriptor interchange element', () => {
    const entity: MergedInterchange = pluginEnvironment(metaEd).entity.mergedInterchange.get(descriptorInterchangeName);
    expect(entity.elements.length).toBe(1);
    expect(entity.elements[0].metaEdName).toBe(descriptorName);
  });

  it('should create one extension descriptor interchange element', () => {
    const entity: MergedInterchange = pluginEnvironment(metaEd).entity.mergedInterchange.get(
      `${projectExtension}-${descriptorInterchangeName}`,
    );
    expect(entity.namespaceInfo.isExtension).toBe(true);
    expect(entity.elements.length).toBe(2);
    expect(entity.elements[0].metaEdName).toBe(descriptorName);
    expect(entity.elements[1].metaEdName).toBe(extensionDescriptorName);
  });
});

describe('when running with no descriptors', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set(
    'edfiXsd',
    Object.assign(newPluginEnvironment(), {
      entity: newEdFiXsdEntityRepository(),
    }),
  );
  const namespace: string = 'edfi';

  beforeAll(() => {
    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    enhance(metaEd);
  });

  it('should not create descriptor interchange element', () => {
    expect(pluginEnvironment(metaEd).entity.mergedInterchange.size).toBe(0);
  });
});
