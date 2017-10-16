// @flow
import { newMetaEdEnvironment, newAssociation, newCommon, newCommonProperty, newStringProperty } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Common, Association } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/AddInlineIdentityEnhancer';

describe('when enhancing association with inline string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const inlineName: string = 'InlineName';
  const entityName: string = 'EntityName';
  const propertyName1: string = 'PropertyName1';
  const propertyName2: string = 'PropertyName2';

  beforeAll(() => {
    const properties = [
      Object.assign(newStringProperty(), {
        metaEdName: propertyName1,
        isPartOfIdentity: false,
      }),
      Object.assign(newStringProperty(), {
        metaEdName: propertyName2,
        isPartOfIdentity: true,
      }),
    ];

    const inlineCommon: Common = Object.assign(newCommon(), {
      metaEdName: inlineName,
      inlineInOds: true,
      properties,
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.common.set(inlineCommon.metaEdName, inlineCommon);

    const association: Association = Object.assign(newAssociation(), {
      metaEdName: entityName,
      properties: [
        Object.assign(newCommonProperty(), {
          metaEdName: inlineName,
          referencedEntity: inlineCommon,
        }),
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.association.set(association.metaEdName, association);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });


  it('should add identity properties to association', () => {
    const association: any = metaEd.entity.association.get(entityName);
    expect(association.properties[0].type).toBe('common');
    expect(association.data.edfiXsd.xsd_IdentityProperties.length).toBe(1);
    expect(association.data.edfiXsd.xsd_IdentityProperties[0].metaEdName).toBe(propertyName2);
  });
});

describe('when enhancing association with inline nested string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const inline1Name: string = 'Inline1Name';
  const inline2Name: string = 'Inline2Name';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const inlineCommon2: Common = Object.assign(newCommon(), {
      metaEdName: inline2Name,
      inlineInOds: true,
      properties: [
        Object.assign(newStringProperty(), {
          metaEdName: propertyName,
          isPartOfIdentity: true,
        }),
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.common.set(inlineCommon2.metaEdName, inlineCommon2);

    const inlineCommon1: Common = Object.assign(newCommon(), {
      metaEdName: inline1Name,
      inlineInOds: true,
      properties: [
        Object.assign(newCommonProperty(), {
          metaEdName: inline2Name,
          referencedEntity: inlineCommon2,
        }),
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.common.set(inlineCommon1.metaEdName, inlineCommon1);

    const association: Association = Object.assign(newAssociation(), {
      metaEdName: entityName,
      properties: [
        Object.assign(newCommonProperty(), {
          metaEdName: inline1Name,
          referencedEntity: inlineCommon1,
        }),
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.association.set(association.metaEdName, association);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });


  it('should add identity properties to association', () => {
    const association: any = metaEd.entity.association.get(entityName);
    expect(association.properties[0].type).toBe('common');
    expect(association.data.edfiXsd.xsd_IdentityProperties.length).toBe(1);
    expect(association.data.edfiXsd.xsd_IdentityProperties[0].metaEdName).toBe(propertyName);
  });
});
