// @flow
import {
  newAssociation,
  newAssociationExtension,
  newAssociationSubclass,
  newDomainEntity,
  newDomainEntityExtension,
  newDomainEntitySubclass,
  newIntegerProperty,
  newMetaEdEnvironment,
} from 'metaed-core';
import type {
  Association,
  AssociationExtension,
  AssociationSubclass,
  DomainEntity,
  DomainEntityExtension,
  DomainEntitySubclass,
  IntegerProperty,
  MetaEdEnvironment,
} from 'metaed-core';
import { enhance } from '../../src/enhancer/TopLevelEntityBaseReferenceEnhancer';

describe('when enhancing domain entity subclass base entity reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  const domainEntityDocumentation: string = 'DomainEntityDocumentation';
  const domainEntitySubclassName: string = 'DomainEntitySubclassName';

  beforeAll(() => {
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      documentation: domainEntityDocumentation,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: domainEntityName,
      documentation: 'DomainEntitySubclassDocumentation',
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntityName, domainEntity);
    metaEd.entity.domainEntitySubclass.set(domainEntitySubclassName, domainEntitySubclass);
    enhance(metaEd);
  });

  it('should create base entity reference property', () => {
    const domainEntity: any = metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).toHaveLength(1);

    const referentialProperty: any = domainEntity.data.edfiOds.ods_IdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(domainEntityName);
    expect(referentialProperty.documentation).toBe(domainEntityDocumentation);
    expect(referentialProperty.isPartOfIdentity).toBe(true);
    expect(referentialProperty.data.edfiOds.ods_DeleteCascadePrimaryKey).toBe(true);
    expect(referentialProperty.parentEntity).toBe(domainEntity);
    expect(referentialProperty.referencedEntity).toBe(domainEntity.baseEntity);
  });
});

describe('when enhancing domain entity subclass base entity reference with identity rename', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  const domainEntityDocumentation: string = 'DomainEntityDocumentation';
  const domainEntitySubclassName: string = 'DomainEntitySubclassName';
  const IntegerPropertyName2: string = 'IntegerPropertyName2';

  beforeAll(() => {
    const integerProperty1: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'IntegerPropertyName1',
      isPartOfIdentity: true,
    });
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      documentation: domainEntityDocumentation,
      data: {
        edfiOds: {
          ods_Properties: [integerProperty1],
          ods_IdentityProperties: [integerProperty1],
        },
      },
    });

    const integerProperty2: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: IntegerPropertyName2,
      isPartOfIdentity: true,
      isIdentityRename: true,
    });
    const domainEntitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: domainEntityName,
      documentation: 'DomainEntitySubclassDocumentation',
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Properties: [integerProperty2],
          ods_IdentityProperties: [integerProperty2],
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntityName, domainEntity);
    metaEd.entity.domainEntitySubclass.set(domainEntitySubclassName, domainEntitySubclass);
    enhance(metaEd);
  });

  it('should not create base entity reference property', () => {
    const domainEntity: any = metaEd.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).toHaveLength(1);

    const referentialProperty: any = domainEntity.data.edfiOds.ods_IdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(IntegerPropertyName2);
  });
});

describe('when enhancing domain entity extension base entity reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  const domainEntityDocumentation: string = 'DomainEntityDocumentation';
  const domainEntityExtensionName: string = 'DomainEntityExtensionName';

  beforeAll(() => {
    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      documentation: domainEntityDocumentation,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const domainEntityExtension: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntityName,
      documentation: 'DomainEntityExtensionDocumentation',
      baseEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntityName, domainEntity);
    metaEd.entity.domainEntityExtension.set(domainEntityExtensionName, domainEntityExtension);
    enhance(metaEd);
  });

  it('should create base entity reference property', () => {
    const domainEntity: any = metaEd.entity.domainEntityExtension.get(domainEntityExtensionName);
    expect(domainEntity.data.edfiOds.ods_IdentityProperties).toHaveLength(1);

    const referentialProperty: any = domainEntity.data.edfiOds.ods_IdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(domainEntityName);
    expect(referentialProperty.documentation).toBe(domainEntityDocumentation);
    expect(referentialProperty.isPartOfIdentity).toBe(true);
    expect(referentialProperty.data.edfiOds.ods_DeleteCascadePrimaryKey).toBe(true);
    expect(referentialProperty.parentEntity).toBe(domainEntity);
    expect(referentialProperty.referencedEntity).toBe(domainEntity.baseEntity);
  });
});

describe('when enhancing association subclass base entity reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName: string = 'AssociationName';
  const associationDocumentation: string = 'AssociationDocumentation';
  const associationSubclassName: string = 'AssociationSubclassName';

  beforeAll(() => {
    const association: Association = Object.assign(newAssociation(), {
      metaEdName: associationName,
      documentation: associationDocumentation,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationSubclass: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: associationName,
      documentation: 'AssociationSubclassDocumentation',
      baseEntity: association,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    metaEd.entity.association.set(associationName, association);
    metaEd.entity.associationSubclass.set(associationSubclassName, associationSubclass);
    enhance(metaEd);
  });

  it('should create base entity reference property', () => {
    const association: any = metaEd.entity.associationSubclass.get(associationSubclassName);
    expect(association.data.edfiOds.ods_IdentityProperties).toHaveLength(1);

    const referentialProperty: any = association.data.edfiOds.ods_IdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(associationName);
    expect(referentialProperty.documentation).toBe(associationDocumentation);
    expect(referentialProperty.isPartOfIdentity).toBe(true);
    expect(referentialProperty.data.edfiOds.ods_DeleteCascadePrimaryKey).toBe(true);
    expect(referentialProperty.parentEntity).toBe(association);
    expect(referentialProperty.referencedEntity).toBe(association.baseEntity);
  });
});

describe('when enhancing association extension base entity reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const associationName: string = 'AssociationName';
  const associationDocumentation: string = 'AssociationDocumentation';
  const associationExtensionName: string = 'AssociationExtensionName';

  beforeAll(() => {
    const association: Association = Object.assign(newAssociation(), {
      metaEdName: associationName,
      documentation: associationDocumentation,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    const associationExtension: AssociationExtension = Object.assign(newAssociationExtension(), {
      metaEdName: associationName,
      documentation: 'AssociationExtensionDocumentation',
      baseEntity: association,
      data: {
        edfiOds: {
          ods_Properties: [],
          ods_IdentityProperties: [],
        },
      },
    });
    metaEd.entity.association.set(associationName, association);
    metaEd.entity.associationExtension.set(associationExtensionName, associationExtension);
    enhance(metaEd);
  });

  it('should create base entity reference property', () => {
    const association: any = metaEd.entity.associationExtension.get(associationExtensionName);
    expect(association.data.edfiOds.ods_IdentityProperties).toHaveLength(1);

    const referentialProperty: any = association.data.edfiOds.ods_IdentityProperties[0];
    expect(referentialProperty).toBeDefined();
    expect(referentialProperty.metaEdName).toBe(associationName);
    expect(referentialProperty.documentation).toBe(associationDocumentation);
    expect(referentialProperty.isPartOfIdentity).toBe(true);
    expect(referentialProperty.data.edfiOds.ods_DeleteCascadePrimaryKey).toBe(true);
    expect(referentialProperty.parentEntity).toBe(association);
    expect(referentialProperty.referencedEntity).toBe(association.baseEntity);
  });
});
