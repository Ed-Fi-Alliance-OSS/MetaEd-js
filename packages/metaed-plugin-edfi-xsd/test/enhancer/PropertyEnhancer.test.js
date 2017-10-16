// @flow
import {
  addProperty,
  newMetaEdEnvironment,
  newAssociation,
  newDomainEntity,
  newDescriptor,
  newNamespaceInfo,
  newStringProperty,
  newAssociationProperty,
  newCommonProperty,
  newDescriptorProperty,
  newEnumerationProperty,
} from '../../../metaed-core/index';
import type { MetaEdEnvironment, NamespaceInfo, EntityProperty } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/PropertyEnhancer';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';

const projectExtension = 'EXTENSION';
const coreNamespace = Object.assign(newNamespaceInfo(), {
  namespace: 'edfi',
  isExtension: false,
});

const extensionNamespace = Object.assign(newNamespaceInfo(), {
  namespace: 'extension',
  projectExtension,
  isExtension: true,
});

function createRepositoryEntityWithProperty(metaEd: MetaEdEnvironment, namespaceInfo: NamespaceInfo, property: EntityProperty) {
  const metaEdName = 'DomainEntityName';

  metaEd.entity.domainEntity.set(metaEdName, Object.assign(newDomainEntity(), {
    metaEdName,
    documentation: 'doc',
    namespaceInfo,
    properties: [
      property,
    ],
    data: { edfiXsd: {} },
  }));
  addProperty(metaEd.propertyIndex, property);
}

describe('when enhancing core string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newStringProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(propertyName);
  });
});

describe('when enhancing core string property with a "with context"', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const withContext = 'Context';
  const property = Object.assign(newStringProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    withContext,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(`${withContext}${propertyName}`);
    expect(property.data.edfiXsd.xsd_Type).toBe(propertyName);
  });
});

describe('when enhancing core string property with a "with context" with same name as metaed name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newStringProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    withContext: propertyName,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should ignore with context on xsdName', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(propertyName);
  });
});

describe('when enhancing extension string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newStringProperty(), {
    metaEdName: propertyName,
    namespaceInfo: extensionNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${projectExtension}-${propertyName}`);
  });
});

describe('when enhancing core association property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newAssociationProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(`${propertyName}Reference`);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${propertyName}ReferenceType`);
  });
});

describe('when enhancing extension association property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newAssociationProperty(), {
    metaEdName: propertyName,
    namespaceInfo: extensionNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(`${propertyName}Reference`);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${projectExtension}-${propertyName}ReferenceType`);
  });
});

describe('when enhancing extension association property referring to core entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newAssociationProperty(), {
    metaEdName: propertyName,
    parentEntityName: propertyName,
    namespaceInfo: extensionNamespace,
    referencedEntity: Object.assign(newAssociation(), {
      metaEdName: propertyName,
      documentation: 'doc',
      namespaceInfo: coreNamespace,
      data: {
        edfiXsd: {
        },
      },
    }),
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should use parent to determine xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(`${propertyName}Reference`);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${propertyName}ReferenceType`);
  });
});

describe('when enhancing core descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newDescriptorProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${propertyName}DescriptorReferenceType`);
  });
});

describe('when enhancing extension descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newDescriptorProperty(), {
    metaEdName: propertyName,
    namespaceInfo: extensionNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${projectExtension}-${propertyName}DescriptorReferenceType`);
  });
});

describe('when enhancing extension descriptor property referring to core entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newDescriptorProperty(), {
    metaEdName: propertyName,
    parentEntityName: propertyName,
    namespaceInfo: extensionNamespace,
    referencedEntity: Object.assign(newDescriptor(), {
      metaEdName: propertyName,
      documentation: 'doc',
      namespaceInfo: coreNamespace,
      data: {
        edfiXsd: {
        },
      },
    }),
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, extensionNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should use parent to determine xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${propertyName}DescriptorReferenceType`);
  });
});

describe('when enhancing enumeration property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newEnumerationProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${propertyName}Type`);
  });
});

describe('when enhancing enumeration property with name ending in "Type"', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyNameType';
  const property = Object.assign(newEnumerationProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should not add "Type" suffix', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(propertyName);
  });
});

describe('when enhancing common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newCommonProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(propertyName);
  });
});

describe('when enhancing extension override common property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const propertyName = 'PropertyName';
  const property = Object.assign(newCommonProperty(), {
    metaEdName: propertyName,
    namespaceInfo: coreNamespace,
    isExtensionOverride: true,
    data: { edfiXsd: {} },
  });

  beforeAll(() => {
    createRepositoryEntityWithProperty(metaEd, coreNamespace, property);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have correct xsdName and xsdType', () => {
    expect(property.data.edfiXsd.xsd_Name).toBe(propertyName);
    expect(property.data.edfiXsd.xsd_Type).toBe(`${propertyName}${property.namespaceInfo.extensionEntitySuffix}`);
  });
});
