// @flow
import {
  newDomainEntity,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespaceInfo,
  newDomainEntitySubclass,
} from 'metaed-core';
import type { NamespaceInfo, DomainEntity, MetaEdEnvironment, DomainEntitySubclass } from 'metaed-core';
import { enhance } from '../../../src/enhancer/educationOrganizationReferenceMetadata/EducationOrganizationReferenceEnhancer';

const educationOrganizationName: string = 'EducationOrganization';
const educationOrganizationIdName: string = 'EducationOrganizationId';

function buildEducationOrganizationEntity(namespaceInfo: NamespaceInfo): DomainEntity {
  const edOrgEntity = Object.assign(newDomainEntity(), {
    metaEdName: educationOrganizationName,
    namespaceInfo,
    isAbstract: true,
  });
  edOrgEntity.identityProperties.push(
    Object.assign(newIntegerProperty(), {
      data: { edfiXsd: { xsd_Name: educationOrganizationIdName } },
      isPartOfIdentity: true,
    }),
  );
  return edOrgEntity;
}

describe('when EducationOrganizationReferenceEnhancer enhances namespace with no EducationOrganization', () => {
  const namespaceName: string = 'edfi';
  const entityName1: string = 'Entity1';
  const entityIdName1: string = 'EntityId1';
  let metaEd: MetaEdEnvironment;

  beforeAll(() => {
    metaEd = newMetaEdEnvironment();
    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const edOrgEntity: DomainEntity = Object.assign(buildEducationOrganizationEntity(coreNamespaceInfo), {
      metaEdName: 'NotEducationOrganization',
    });
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespaceInfo: coreNamespaceInfo,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsd_Name: entityIdName1 } }, isIdentityRename: true }),
    );
    metaEd.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have no education organization reference', () => {
    const namespaceInfo: NamespaceInfo = Array.from(metaEd.entity.namespaceInfo.values())[0];
    expect(namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(0);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances namespace with no EducationOrganization Subclass', () => {
  const namespaceName: string = 'edfi';
  let metaEd: MetaEdEnvironment;

  beforeAll(() => {
    metaEd = newMetaEdEnvironment();

    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespaceInfo);
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    enhance(metaEd);
  });

  it('should have no education organization reference', () => {
    const namespaceInfo: NamespaceInfo = Array.from(metaEd.entity.namespaceInfo.values())[0];
    expect(namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(0);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances namespace with EducationOrganization Subclass', () => {
  const namespaceName: string = 'edfi';
  const entityName1: string = 'Entity1';
  const entityIdName1: string = 'EntityId1';
  let metaEd: MetaEdEnvironment;

  beforeAll(() => {
    metaEd = newMetaEdEnvironment();
    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespaceInfo);
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespaceInfo: coreNamespaceInfo,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsd_Name: entityIdName1 } }, isIdentityRename: true }),
    );
    metaEd.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have education organization reference', () => {
    const namespaceInfo: NamespaceInfo = Array.from(metaEd.entity.namespaceInfo.values())[0];
    expect(namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences[0];
    expect(educationOrganizationReference).toBeDefined();
    expect(educationOrganizationReference.name).toBe(entityName1);
    expect(educationOrganizationReference.identityPropertyName).toBe(entityIdName1);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances extension namespace with EducationOrganization Subclass', () => {
  const namespaceName: string = 'edfi';
  const entityName1: string = 'Entity1';
  const entityIdName1: string = 'EntityId1';
  const extensionNamespaceName: string = 'extension';
  let metaEd: MetaEdEnvironment;

  beforeAll(() => {
    metaEd = newMetaEdEnvironment();

    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespaceName,
      projectExtension: 'EXTENSION',
      isExtension: true,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespaceInfo);
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespaceInfo: extensionNamespaceInfo,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsd_Name: entityIdName1 } }, isIdentityRename: true }),
    );
    metaEd.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have no core education organization reference', () => {
    const namespaceInfo: NamespaceInfo = Array.from(metaEd.entity.namespaceInfo.values()).filter(
      x => x.namespace === namespaceName,
    )[0];
    expect(namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(0);
  });
  it('should have extension education organization reference', () => {
    const namespaceInfo: NamespaceInfo = Array.from(metaEd.entity.namespaceInfo.values()).filter(
      x => x.namespace === extensionNamespaceName,
    )[0];
    expect(namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences[0];
    expect(educationOrganizationReference).toBeDefined();
    expect(educationOrganizationReference.name).toBe(entityName1);
    expect(educationOrganizationReference.identityPropertyName).toBe(entityIdName1);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances namespace with EducationOrganization Subclass with no identity rename', () => {
  const namespaceName: string = 'edfi';
  const entityName1: string = 'Entity1';
  let metaEd: MetaEdEnvironment;

  beforeAll(() => {
    metaEd = newMetaEdEnvironment();

    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespaceInfo);
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespaceInfo: coreNamespaceInfo,
    });
    metaEd.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have extension education organization reference', () => {
    const namespaceInfo: NamespaceInfo = Array.from(metaEd.entity.namespaceInfo.values()).filter(
      x => x.namespace === namespaceName,
    )[0];
    expect(namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences[0];
    expect(educationOrganizationReference).toBeDefined();
    expect(educationOrganizationReference.name).toBe(entityName1);
    expect(educationOrganizationReference.identityPropertyName).toBe(educationOrganizationIdName);
  });
});
