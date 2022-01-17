import {
  newDomainEntity,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
  newDomainEntitySubclass,
} from '@edfi/metaed-core';
import { Namespace, DomainEntity, MetaEdEnvironment, DomainEntitySubclass } from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/educationOrganizationReferenceMetadata/EducationOrganizationReferenceEnhancer';

const educationOrganizationName = 'EducationOrganization';
const educationOrganizationIdName = 'EducationOrganizationId';

function buildEducationOrganizationEntity(namespace: Namespace): DomainEntity {
  const edOrgEntity = Object.assign(newDomainEntity(), {
    metaEdName: educationOrganizationName,
    namespace,
    isAbstract: true,
  });
  edOrgEntity.identityProperties.push(
    Object.assign(newIntegerProperty(), {
      data: { edfiXsd: { xsdName: educationOrganizationIdName } },
      isPartOfIdentity: true,
    }),
  );
  return edOrgEntity;
}

describe('when EducationOrganizationReferenceEnhancer enhances namespace with no EducationOrganization', (): void => {
  const namespaceName = 'EdFi';
  const entityName1 = 'Entity1';
  const entityIdName1 = 'EntityId1';
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName,
    data: { edfiOdsApi: { apiEducationOrganizationReferences: [] } },
  });
  metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
  beforeAll(() => {
    const edOrgEntity: DomainEntity = Object.assign(buildEducationOrganizationEntity(coreNamespace), {
      metaEdName: 'NotEducationOrganization',
    });
    coreNamespace.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespace: coreNamespace,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsdName: entityIdName1 } }, isIdentityRename: true }),
    );
    coreNamespace.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have no education organization reference', (): void => {
    expect(coreNamespace.data.edfiOdsApi.apiEducationOrganizationReferences.length).toBe(0);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances namespace with no EducationOrganization Subclass', (): void => {
  const namespaceName = 'EdFi';
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName,
    data: { edfiOdsApi: { apiEducationOrganizationReferences: [] } },
  });
  metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);

  beforeAll(() => {
    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespace);
    coreNamespace.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    enhance(metaEd);
  });

  it('should have no education organization reference', (): void => {
    expect(coreNamespace.data.edfiOdsApi.apiEducationOrganizationReferences.length).toBe(0);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances namespace with EducationOrganization Subclass', (): void => {
  const namespaceName = 'EdFi';
  const entityName1 = 'Entity1';
  const entityIdName1 = 'EntityId1';
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName,
    data: { edfiOdsApi: { apiEducationOrganizationReferences: [] } },
  });
  metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);

  beforeAll(() => {
    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespace);
    coreNamespace.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespace: coreNamespace,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsdName: entityIdName1 } }, isIdentityRename: true }),
    );
    coreNamespace.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have education organization reference', (): void => {
    expect(coreNamespace.data.edfiOdsApi.apiEducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = coreNamespace.data.edfiOdsApi.apiEducationOrganizationReferences[0];
    expect(educationOrganizationReference).toBeDefined();
    expect(educationOrganizationReference.name).toBe(entityName1);
    expect(educationOrganizationReference.identityPropertyName).toBe(entityIdName1);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances extension namespace with EducationOrganization Subclass', (): void => {
  const namespaceName = 'EdFi';
  const entityName1 = 'Entity1';
  const entityIdName1 = 'EntityId1';
  const extensionNamespaceName = 'Extension';
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName,
    data: { edfiOdsApi: { apiEducationOrganizationReferences: [] } },
  });
  const extensionNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName: extensionNamespaceName,
    projectExtension: 'EXTENSION',
    isExtension: true,
    data: { edfiOdsApi: { apiEducationOrganizationReferences: [] } },
  });
  metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(coreNamespace);

  beforeAll(() => {
    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespace);
    coreNamespace.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespace: extensionNamespace,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsdName: entityIdName1 } }, isIdentityRename: true }),
    );
    extensionNamespace.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have no core education organization reference', (): void => {
    expect(coreNamespace.data.edfiOdsApi.apiEducationOrganizationReferences.length).toBe(0);
  });

  it('should have extension education organization reference', (): void => {
    expect(extensionNamespace.data.edfiOdsApi.apiEducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = extensionNamespace.data.edfiOdsApi.apiEducationOrganizationReferences[0];
    expect(educationOrganizationReference).toBeDefined();
    expect(educationOrganizationReference.name).toBe(entityName1);
    expect(educationOrganizationReference.identityPropertyName).toBe(entityIdName1);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances namespace with EducationOrganization Subclass with no identity rename', (): void => {
  const namespaceName = 'EdFi';
  const entityName1 = 'Entity1';
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const coreNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName,
    data: { edfiOdsApi: { apiEducationOrganizationReferences: [] } },
  });
  metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);

  beforeAll(() => {
    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespace);
    coreNamespace.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespace: coreNamespace,
    });
    coreNamespace.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have extension education organization reference', (): void => {
    expect(coreNamespace.data.edfiOdsApi.apiEducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = coreNamespace.data.edfiOdsApi.apiEducationOrganizationReferences[0];
    expect(educationOrganizationReference).toBeDefined();
    expect(educationOrganizationReference.name).toBe(entityName1);
    expect(educationOrganizationReference.identityPropertyName).toBe(educationOrganizationIdName);
  });
});
