import {
  addProperty,
  newMetaEdEnvironment,
  newAssociation,
  newDomainEntity,
  newDescriptor,
  newNamespace,
  newStringProperty,
  newAssociationProperty,
  newCommonProperty,
  newDescriptorProperty,
  newEnumerationProperty,
  newIntegerProperty,
  IntegerProperty,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace, EntityProperty } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/PropertyEnhancer';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';

function createRepositoryEntityWithProperty(metaEd: MetaEdEnvironment, namespace: Namespace, property: EntityProperty) {
  const metaEdName = 'DomainEntityName';

  namespace.entity.domainEntity.set(metaEdName, {
    ...newDomainEntity(),
    metaEdName,
    documentation: 'doc',
    namespace,
    properties: [property],
    data: { edfiXsd: {} },
  });
  addProperty(metaEd.propertyIndex, property);
}

describe('when enhancing core string property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property = { ...newStringProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} as any } };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(propertyName);
  });
});

describe('when enhancing core integer property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property: IntegerProperty = {
    ...newIntegerProperty(),
    metaEdName: propertyName,
    namespace,
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe('xs:int');
  });
});

describe('when enhancing core integer property with big hint', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property: IntegerProperty = {
    ...newIntegerProperty(),
    metaEdName: propertyName,
    namespace,
    hasRestriction: true,
    hasBigHint: true,
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe('xs:long');
  });
});

describe('when enhancing core string property with a "role name"', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const roleName = 'Context';
  const property = { ...newStringProperty(), metaEdName: propertyName, namespace, roleName, data: { edfiXsd: {} as any } };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(`${roleName}${propertyName}`);
    expect(property.data.edfiXsd.xsdType).toBe(propertyName);
  });
});

describe('when enhancing core string property with a "role name" with same name as metaed name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property = {
    ...newStringProperty(),
    metaEdName: propertyName,
    namespace,
    roleName: propertyName,
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should ignore role name on xsdName', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(propertyName);
  });
});

describe('when enhancing extension string property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  const propertyName = 'PropertyName';
  const property = {
    ...newStringProperty(),
    metaEdName: propertyName,
    namespace: extensionNamespace,
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(`EXTENSION-${propertyName}`);
  });
});

describe('when enhancing core association property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property = { ...newAssociationProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} as any } };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(`${propertyName}Reference`);
    expect(property.data.edfiXsd.xsdType).toBe(`${propertyName}ReferenceType`);
  });
});

describe('when enhancing extension association property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  const propertyName = 'PropertyName';
  const property = {
    ...newAssociationProperty(),
    metaEdName: propertyName,
    namespace: extensionNamespace,
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(`${propertyName}Reference`);
    expect(property.data.edfiXsd.xsdType).toBe(`EXTENSION-${propertyName}ReferenceType`);
  });
});

describe('when enhancing extension association property referring to core entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  const propertyName = 'PropertyName';
  const property = {
    ...newAssociationProperty(),
    metaEdName: propertyName,
    parentEntityName: propertyName,
    namespace: extensionNamespace,
    referencedEntity: {
      ...newAssociation(),
      metaEdName: propertyName,
      documentation: 'doc',
      namespace,
      data: {
        edfiXsd: {},
      },
    },
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should use parent to determine xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(`${propertyName}Reference`);
    expect(property.data.edfiXsd.xsdType).toBe(`${propertyName}ReferenceType`);
  });
});

describe('when enhancing core descriptor property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property = { ...newDescriptorProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} as any } };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(`${propertyName}DescriptorReferenceType`);
  });
});

describe('when enhancing extension descriptor property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  const propertyName = 'PropertyName';
  const property = {
    ...newDescriptorProperty(),
    metaEdName: propertyName,
    namespace: extensionNamespace,
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(`EXTENSION-${propertyName}DescriptorReferenceType`);
  });
});

describe('when enhancing extension descriptor property referring to core entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  const propertyName = 'PropertyName';
  const property = {
    ...newDescriptorProperty(),
    metaEdName: propertyName,
    parentEntityName: propertyName,
    namespace: extensionNamespace,
    referencedEntity: {
      ...newDescriptor(),
      metaEdName: propertyName,
      documentation: 'doc',
      namespace,
      data: {
        edfiXsd: {},
      },
    },
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should use parent to determine xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(`${propertyName}DescriptorReferenceType`);
  });
});

describe('when enhancing enumeration property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property = { ...newEnumerationProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} as any } };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(`${propertyName}Type`);
  });
});

describe('when enhancing enumeration property with name ending in "Type"', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyNameType';
  const property = { ...newEnumerationProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} as any } };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should not add "Type" suffix', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(propertyName);
  });
});

describe('when enhancing common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property = { ...newCommonProperty(), metaEdName: propertyName, namespace, data: { edfiXsd: {} as any } };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(propertyName);
  });
});

describe('when enhancing extension override common property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const propertyName = 'PropertyName';
  const property = {
    ...newCommonProperty(),
    metaEdName: propertyName,
    namespace,
    isExtensionOverride: true,
    data: { edfiXsd: {} as any },
  };

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, namespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', (): void => {
    expect(property.data.edfiXsd.xsdName).toBe(propertyName);
    expect(property.data.edfiXsd.xsdType).toBe(`${propertyName}${property.namespace.extensionEntitySuffix}`);
  });
});
