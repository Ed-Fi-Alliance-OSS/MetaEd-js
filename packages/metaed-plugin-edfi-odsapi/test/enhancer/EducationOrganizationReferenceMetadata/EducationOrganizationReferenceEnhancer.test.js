// @flow
import {
  newDomainEntity,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
  newDomainEntitySubclass,
} from 'metaed-core';
import type { Namespace, DomainEntity, MetaEdEnvironment, DomainEntitySubclass } from 'metaed-core';
import { enhance } from '../../../src/enhancer/educationOrganizationReferenceMetadata/EducationOrganizationReferenceEnhancer';

const educationOrganizationName: string = 'EducationOrganization';
const educationOrganizationIdName: string = 'EducationOrganizationId';

function buildEducationOrganizationEntity(namespace: Namespace): DomainEntity {
  const edOrgEntity = Object.assign(newDomainEntity(), {
    metaEdName: educationOrganizationName,
    namespace,
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
    const coreNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespace.set(coreNamespace.namespaceName, coreNamespace);

    const edOrgEntity: DomainEntity = Object.assign(buildEducationOrganizationEntity(coreNamespace), {
      metaEdName: 'NotEducationOrganization',
    });
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespace: coreNamespace,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsd_Name: entityIdName1 } }, isIdentityRename: true }),
    );
    metaEd.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have no education organization reference', () => {
    const namespace: Namespace = Array.from(metaEd.entity.namespace.values())[0];
    expect(namespace.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(0);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances namespace with no EducationOrganization Subclass', () => {
  const namespaceName: string = 'edfi';
  let metaEd: MetaEdEnvironment;

  beforeAll(() => {
    metaEd = newMetaEdEnvironment();

    const coreNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespace.set(coreNamespace.namespaceName, coreNamespace);

    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespace);
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    enhance(metaEd);
  });

  it('should have no education organization reference', () => {
    const namespace: Namespace = Array.from(metaEd.entity.namespace.values())[0];
    expect(namespace.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(0);
  });
});

describe('when EducationOrganizationReferenceEnhancer enhances namespace with EducationOrganization Subclass', () => {
  const namespaceName: string = 'edfi';
  const entityName1: string = 'Entity1';
  const entityIdName1: string = 'EntityId1';
  let metaEd: MetaEdEnvironment;

  beforeAll(() => {
    metaEd = newMetaEdEnvironment();
    const coreNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespace.set(coreNamespace.namespaceName, coreNamespace);

    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespace);
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespace: coreNamespace,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsd_Name: entityIdName1 } }, isIdentityRename: true }),
    );
    metaEd.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have education organization reference', () => {
    const namespace: Namespace = Array.from(metaEd.entity.namespace.values())[0];
    expect(namespace.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = namespace.data.edfiOdsApi.api_EducationOrganizationReferences[0];
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

    const coreNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    const extensionNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName: extensionNamespaceName,
      projectExtension: 'EXTENSION',
      isExtension: true,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespace.set(coreNamespace.namespaceName, coreNamespace);
    metaEd.entity.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespace);
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespace: extensionNamespace,
    });
    edOrgSubclass.identityProperties.push(
      Object.assign(newIntegerProperty(), { data: { edfiXsd: { xsd_Name: entityIdName1 } }, isIdentityRename: true }),
    );
    metaEd.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have no core education organization reference', () => {
    const namespace: Namespace = Array.from(metaEd.entity.namespace.values()).filter(
      x => x.namespaceName === namespaceName,
    )[0];
    expect(namespace.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(0);
  });
  it('should have extension education organization reference', () => {
    const namespace: Namespace = Array.from(metaEd.entity.namespace.values()).filter(
      x => x.namespaceName === extensionNamespaceName,
    )[0];
    expect(namespace.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = namespace.data.edfiOdsApi.api_EducationOrganizationReferences[0];
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

    const coreNamespace: Namespace = Object.assign(newNamespace(), {
      namespaceName,
      data: { edfiOdsApi: { api_EducationOrganizationReferences: [] } },
    });
    metaEd.entity.namespace.set(coreNamespace.namespaceName, coreNamespace);

    const edOrgEntity: DomainEntity = buildEducationOrganizationEntity(coreNamespace);
    metaEd.entity.domainEntity.set(edOrgEntity.metaEdName, edOrgEntity);

    const edOrgSubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entityName1,
      baseEntityName: educationOrganizationName,
      namespace: coreNamespace,
    });
    metaEd.entity.domainEntitySubclass.set(edOrgSubclass.metaEdName, edOrgSubclass);

    enhance(metaEd);
  });

  it('should have extension education organization reference', () => {
    const namespace: Namespace = Array.from(metaEd.entity.namespace.values()).filter(
      x => x.namespaceName === namespaceName,
    )[0];
    expect(namespace.data.edfiOdsApi.api_EducationOrganizationReferences.length).toBe(1);
    const educationOrganizationReference = namespace.data.edfiOdsApi.api_EducationOrganizationReferences[0];
    expect(educationOrganizationReference).toBeDefined();
    expect(educationOrganizationReference.name).toBe(entityName1);
    expect(educationOrganizationReference.identityPropertyName).toBe(educationOrganizationIdName);
  });
});
