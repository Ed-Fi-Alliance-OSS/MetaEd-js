import * as R from 'ramda';
import {
  newDomainEntity,
  newDomainEntitySubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { DomainEntity, DomainEntitySubclass, IntegerProperty, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/ModifyIdentityForEducationOrganizationAndSubTypesDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';

describe('when ModifyIdentityForEducationOrganizationAndSubTypesDiminisher diminishes with no EducationOrganization entity', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      namespace,
    });
    namespace.entity.domainEntity.set(entity.metaEdName, entity);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not fail', (): void => {
    expect(namespace.entity.domainEntity.get(domainEntityName)).toBeDefined();
  });
});

describe('when ModifyIdentityForEducationOrganizationAndSubTypesDiminisher diminishes EducationOrganization with no EducationOrganizationIdentifier', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const educationOrganization = 'EducationOrganization';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: educationOrganization,
      namespace,
      isAbstract: true,
      data: {
        edfiOdsRelational: {
          odsIdentityProperties: [],
          odsProperties: [],
        },
      },
    });
    namespace.entity.domainEntity.set(entity.metaEdName, entity);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not fail', (): void => {
    expect(namespace.entity.domainEntity.get(educationOrganization)).toBeDefined();
    expect(
      (namespace.entity.domainEntity.get(educationOrganization) as any).data.edfiOdsRelational.odsProperties,
    ).toHaveLength(0);
  });
});

describe('when ModifyIdentityForEducationOrganizationAndSubTypesDiminisher diminishes EducationOrganization with School subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const educationOrganization = 'EducationOrganization';
  const educationOrganizationId = 'EducationOrganizationId';
  const educationOrganizationIdentifier = 'EducationOrganizationIdentifier';
  const educationOrganizationIdentifierDocumentation = 'EducationOrganizationIdentifierDocumentation';
  const school = 'School';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: educationOrganization,
      namespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: educationOrganizationIdentifier,
      documentation: educationOrganizationIdentifierDocumentation,
      namespace,
      isPartOfIdentity: true,
      parentEntity: entity,
      parentEntityName: entity.metaEdName,
      data: {
        edfiOdsRelational: {
          odsIsUniqueIndex: false,
        },
      },
    });
    entity.data.edfiOdsRelational.odsProperties.push(property);
    entity.data.edfiOdsRelational.odsIdentityProperties.push(property);
    namespace.entity.domainEntity.set(entity.metaEdName, entity);

    const entitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: school,
      namespace,
      baseEntityName: educationOrganization,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    entitySubclass.data.edfiOdsRelational.odsProperties.push(property);
    entitySubclass.data.edfiOdsRelational.odsIdentityProperties.push(property);
    namespace.entity.domainEntitySubclass.set(entitySubclass.metaEdName, entitySubclass);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have two ods properties on EducationOrganization', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(educationOrganization) as any;
    expect(entity).toBeDefined();
    expect(entity.data.edfiOdsRelational.odsProperties).toHaveLength(2);
  });

  it('should modify EducationOrganizationIdentifier property on EducationOrganization', (): void => {
    const property: IntegerProperty = R.head(
      (namespace.entity.domainEntity.get(educationOrganization) as any).data.edfiOdsRelational.odsProperties,
    );
    expect(property.metaEdName).toBe(educationOrganizationIdentifier);
    expect(property.data.edfiOdsRelational.odsIsUniqueIndex).toBe(true);
    expect(property.isPartOfIdentity).toBe(false);
  });

  it('should remove EducationOrganizationIdentifier from identity properties on EducationOrganization', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(educationOrganization) as any;
    expect(entity.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);
    expect(R.head(entity.data.edfiOdsRelational.odsIdentityProperties).metaEdName).not.toBe(educationOrganizationIdentifier);
  });

  it('should add EducationOrganizationId property to EducationOrganization', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(educationOrganization) as any;
    const property: IntegerProperty = R.last(entity.data.edfiOdsRelational.odsProperties);
    expect(property.metaEdName).toBe(educationOrganizationId);
    expect(property.documentation).toBe(educationOrganizationIdentifierDocumentation);
    expect(property.isPartOfIdentity).toBe(true);
    expect(property.namespace.namespaceName).toBe('EdFi');
    expect(property.parentEntity).toBe(entity);
    expect(property.parentEntityName).toBe(educationOrganization);
    expect(property.data.edfiOdsRelational.odsIsIdentityDatabaseType).toBe(false);
    expect(property).toBe(R.head(entity.data.edfiOdsRelational.odsIdentityProperties));
  });

  it('should remove EducationOrganizationIdentifier from identity properties on School', (): void => {
    const entitySubclass: DomainEntity = namespace.entity.domainEntitySubclass.get(school) as any;
    expect(entitySubclass.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);
    expect(R.head(entitySubclass.data.edfiOdsRelational.odsIdentityProperties).metaEdName).not.toBe(
      educationOrganizationIdentifier,
    );
    expect(entitySubclass.data.edfiOdsRelational.odsProperties.map((x) => x.metaEdName)).not.toContain(
      educationOrganizationIdentifier,
    );
  });

  it('should add EducationOrganizationId property to School', (): void => {
    const entitySubclass: DomainEntitySubclass = namespace.entity.domainEntitySubclass.get(school) as any;
    expect(entitySubclass).toBeDefined();
    expect(entitySubclass.data.edfiOdsRelational.odsProperties).toHaveLength(1);

    const property: IntegerProperty = R.last(entitySubclass.data.edfiOdsRelational.odsProperties);
    expect(property.metaEdName).toBe(`${school}Id`);
    expect(property.documentation).toBe(`The identifier assigned to a ${entitySubclass.typeHumanizedName}.`);
    expect(property.isPartOfIdentity).toBe(true);
    expect(property.namespace.namespaceName).toBe('EdFi');
    expect(property.parentEntity).toBe(entitySubclass);
    expect(property.parentEntityName).toBe(school);
    expect(property.isIdentityRename).toBe(true);
    expect(property.baseKeyName).toBe(educationOrganizationId);
    expect(property).toBe(R.head(entitySubclass.data.edfiOdsRelational.odsIdentityProperties));
  });
});

describe('when ModifyIdentityForEducationOrganizationAndSubTypesDiminisher diminishes EducationOrganization with School subclass with identity rename property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const educationOrganization = 'EducationOrganization';
  const educationOrganizationId = 'EducationOrganizationId';
  const educationOrganizationIdentifier = 'EducationOrganizationIdentifier';
  const educationOrganizationIdentifierDocumentation = 'EducationOrganizationIdentifierDocumentation';
  const school = 'School';
  const schoolIdentityRename = 'SchoolIdentityRename';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: educationOrganization,
      namespace,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: educationOrganizationIdentifier,
      documentation: educationOrganizationIdentifierDocumentation,
      namespace,
      isPartOfIdentity: true,
      parentEntity: entity,
      parentEntityName: entity.metaEdName,
      data: {
        edfiOdsRelational: {
          odsIsUniqueIndex: false,
        },
      },
    });
    entity.data.edfiOdsRelational.odsProperties.push(property);
    entity.data.edfiOdsRelational.odsIdentityProperties.push(property);
    namespace.entity.domainEntity.set(entity.metaEdName, entity);

    const entitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: school,
      namespace,
      baseEntityName: educationOrganization,
      data: {
        edfiOdsRelational: {
          odsProperties: [],
          odsIdentityProperties: [],
        },
      },
    });
    const identityRename: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: schoolIdentityRename,
      namespace,
      isPartOfIdentity: true,
      isIdentityRename: true,
    });
    entitySubclass.data.edfiOdsRelational.odsProperties.push(identityRename);
    entitySubclass.data.edfiOdsRelational.odsIdentityProperties.push(identityRename);
    entitySubclass.data.edfiOdsRelational.odsProperties.push(property);
    entitySubclass.data.edfiOdsRelational.odsIdentityProperties.push(property);
    namespace.entity.domainEntitySubclass.set(entitySubclass.metaEdName, entitySubclass);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have two ods properties on EducationOrganization', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(educationOrganization) as any;
    expect(entity).toBeDefined();
    expect(entity.data.edfiOdsRelational.odsProperties).toHaveLength(2);
  });

  it('should modify EducationOrganizationIdentifier property on EducationOrganization', (): void => {
    const property: IntegerProperty = R.head(
      (namespace.entity.domainEntity.get(educationOrganization) as any).data.edfiOdsRelational.odsProperties,
    );
    expect(property.metaEdName).toBe(educationOrganizationIdentifier);
    expect(property.data.edfiOdsRelational.odsIsUniqueIndex).toBe(true);
    expect(property.isPartOfIdentity).toBe(false);
  });

  it('should remove EducationOrganizationIdentifier from identity properties on EducationOrganization', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(educationOrganization) as any;
    expect(entity.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);
    expect(R.head(entity.data.edfiOdsRelational.odsIdentityProperties).metaEdName).not.toBe(educationOrganizationIdentifier);
  });

  it('should add EducationOrganizationId property to EducationOrganization', (): void => {
    const entity: DomainEntity = namespace.entity.domainEntity.get(educationOrganization) as any;
    const property: IntegerProperty = R.last(entity.data.edfiOdsRelational.odsProperties);
    expect(property.metaEdName).toBe(educationOrganizationId);
    expect(property.documentation).toBe(educationOrganizationIdentifierDocumentation);
    expect(property.isPartOfIdentity).toBe(true);
    expect(property.namespace.namespaceName).toBe('EdFi');
    expect(property.parentEntity).toBe(entity);
    expect(property.parentEntityName).toBe(educationOrganization);
    expect(property.data.edfiOdsRelational.odsIsIdentityDatabaseType).toBe(false);
    expect(property).toBe(R.head(entity.data.edfiOdsRelational.odsIdentityProperties));
  });

  it('should remove EducationOrganizationIdentifier from identity properties on School', (): void => {
    const entitySubclass: DomainEntity = namespace.entity.domainEntitySubclass.get(school) as any;
    expect(entitySubclass.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);
    expect(R.head(entitySubclass.data.edfiOdsRelational.odsIdentityProperties).metaEdName).not.toBe(
      educationOrganizationIdentifier,
    );
    expect(entitySubclass.data.edfiOdsRelational.odsProperties.map((x) => x.metaEdName)).not.toContain(
      educationOrganizationIdentifier,
    );
  });

  it('should add EducationOrganizationId property to School', (): void => {
    const entitySubclass: DomainEntitySubclass = namespace.entity.domainEntitySubclass.get(school) as any;
    expect(entitySubclass).toBeDefined();
    expect(entitySubclass.data.edfiOdsRelational.odsProperties).toHaveLength(1);

    const property: IntegerProperty = R.last(entitySubclass.data.edfiOdsRelational.odsProperties);
    expect(property.metaEdName).toBe(`${school}Id`);
    expect(property.documentation).toBe(`The identifier assigned to a ${entitySubclass.typeHumanizedName}.`);
    expect(property.isPartOfIdentity).toBe(true);
    expect(property.namespace.namespaceName).toBe('EdFi');
    expect(property.parentEntity).toBe(entitySubclass);
    expect(property.parentEntityName).toBe(school);
    expect(property.isIdentityRename).toBe(true);
    expect(property.baseKeyName).toBe(educationOrganizationId);
    expect(property).toBe(R.head(entitySubclass.data.edfiOdsRelational.odsIdentityProperties));
  });

  it('should remove identity rename properties on School', (): void => {
    const entitySubclass: DomainEntity = namespace.entity.domainEntitySubclass.get(school) as any;
    expect(entitySubclass.data.edfiOdsRelational.odsProperties).toHaveLength(1);
    expect(entitySubclass.data.edfiOdsRelational.odsIdentityProperties).toHaveLength(1);
    expect(R.head(entitySubclass.data.edfiOdsRelational.odsProperties).metaEdName).not.toBe(schoolIdentityRename);
    expect(R.head(entitySubclass.data.edfiOdsRelational.odsIdentityProperties).metaEdName).not.toBe(schoolIdentityRename);
  });
});
