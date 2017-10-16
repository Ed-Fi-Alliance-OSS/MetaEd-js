// @flow
import { newMetaEdEnvironment, newAssociation, newAssociationProperty, newAssociationSubclass } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Association, AssociationSubclass, AssociationProperty } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance as copyPropertiesEnhance } from '../../src/enhancer/CopyPropertiesEnhancer';
import { enhance } from '../../src/enhancer/SubclassIdentityEnhancer';

describe('when enhancing association subclass without identity renames', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseAssociationName: string = 'BaseName';
  const subclassAssociationName: string = 'SubclassName';
  let baseIdentityProperty: AssociationProperty;
  let subclassIdentityProperty: AssociationProperty;

  beforeAll(() => {
    baseIdentityProperty = Object.assign(newAssociationProperty(), {
      metaEdName: 'BaseIdentityProperty',
      isPartOfIdentity: true,
    });

    const baseAssociation: Association = Object.assign(newAssociation(), {
      metaEdName: baseAssociationName,
      properties: [
        baseIdentityProperty,
      ],
      identityProperties: [
        baseIdentityProperty,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.association.set(baseAssociation.metaEdName, baseAssociation);


    subclassIdentityProperty = Object.assign(newAssociationProperty(), {
      metaEdName: 'SubclassIdentityProperty',
      isPartOfIdentity: true,
    });

    const subclassAssociation: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: subclassAssociationName,
      baseEntityName: baseAssociationName,
      baseEntity: baseAssociation,
      properties: [
        subclassIdentityProperty,
      ],
      identityProperties: [
        subclassIdentityProperty,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.associationSubclass.set(subclassAssociation.metaEdName, subclassAssociation);

    initializeTopLevelEntities(metaEd);
    copyPropertiesEnhance(metaEd);
    enhance(metaEd);
  });

  it('should add base identity property to subclass primary key list', () => {
    const associationSubclass: any = metaEd.entity.associationSubclass.get(subclassAssociationName);
    expect(associationSubclass.data.edfiXsd.xsd_IdentityProperties).toContain(baseIdentityProperty);
  });

  it('should still have original identity', () => {
    const associationSubclass: any = metaEd.entity.associationSubclass.get(subclassAssociationName);
    expect(associationSubclass.data.edfiXsd.xsd_IdentityProperties).toContain(subclassIdentityProperty);
  });

  it('should not have base identity in properties', () => {
    const associationSubclass: any = metaEd.entity.associationSubclass.get(subclassAssociationName);
    expect(associationSubclass.data.edfiXsd.xsd_Properties).not.toContain(baseIdentityProperty);
  });
});

describe('when enhancing association subclass with identity renames', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const baseAssociationName: string = 'BaseName';
  const baseIdentityName: string = 'BaseKeyName';
  const subclassAssociationName: string = 'SubclassName';
  let baseIdentityProperty: AssociationProperty;
  let subclassIdentityProperty: AssociationProperty;
  let subclassIdentityRenameProperty: AssociationProperty;

  beforeAll(() => {
    baseIdentityProperty = Object.assign(newAssociationProperty(), {
      metaEdName: baseIdentityName,
      isPartOfIdentity: true,
    });

    const baseAssociation: Association = Object.assign(newAssociation(), {
      metaEdName: baseAssociationName,
      properties: [
        baseIdentityProperty,
      ],
      identityProperties: [
        baseIdentityProperty,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.association.set(baseAssociation.metaEdName, baseAssociation);

    subclassIdentityProperty = Object.assign(newAssociationProperty(), {
      metaEdName: 'SubclassIdentityProperty',
      isPartOfIdentity: true,
    });

    subclassIdentityRenameProperty = Object.assign(newAssociationProperty(), {
      metaEdName: 'SubclassIdentityRenameProperty',
      isIdentityRename: true,
      baseKeyName: baseIdentityName,
    });

    const subclassAssociation: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: subclassAssociationName,
      baseEntityName: baseAssociationName,
      baseEntity: baseAssociation,
      properties: [
        subclassIdentityProperty,
        subclassIdentityRenameProperty,
      ],
      identityProperties: [
        subclassIdentityProperty,
        subclassIdentityRenameProperty,
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.associationSubclass.set(subclassAssociation.metaEdName, subclassAssociation);

    initializeTopLevelEntities(metaEd);
    copyPropertiesEnhance(metaEd);
    enhance(metaEd);
  });

  it('should not add renamed identity property to subclass', () => {
    const associationSubclass: any = metaEd.entity.associationSubclass.get(subclassAssociationName);
    expect(associationSubclass.data.edfiXsd.xsd_IdentityProperties).not.toContain(baseIdentityProperty);
  });
});
