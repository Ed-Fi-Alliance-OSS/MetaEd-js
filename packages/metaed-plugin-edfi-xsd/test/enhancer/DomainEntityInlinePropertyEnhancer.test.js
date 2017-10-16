// @flow
import { newMetaEdEnvironment, newDomainEntity, newCommon, newCommonProperty, newStringProperty } from '../../../metaed-core/index';
import type { MetaEdEnvironment, Common, DomainEntity } from '../../../metaed-core/index';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/AddInlineIdentityEnhancer';

describe('when enhancing domainEntity with inline string property', () => {
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

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
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
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });


  it('should add identity properties to domainEntity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(entityName);
    expect(domainEntity.properties[0].type).toBe('common');
    expect(domainEntity.data.edfiXsd.xsd_IdentityProperties.length).toBe(1);
    expect(domainEntity.data.edfiXsd.xsd_IdentityProperties[0].metaEdName).toBe(propertyName2);
  });
});

describe('when enhancing domainEntity with inline nested string property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const inline1Name: string = 'Inline1Name';
  const inline2Name: string = 'Inline2Name';
  const entityName: string = 'EntityName';
  const property1Name: string = 'Property1Name';
  const property2Name: string = 'Property2Name';

  beforeAll(() => {
    const inlineCommon2: Common = Object.assign(newCommon(), {
      metaEdName: inline2Name,
      inlineInOds: true,
      properties: [
        Object.assign(newStringProperty(), {
          metaEdName: property1Name,
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
        Object.assign(newStringProperty(), {
          metaEdName: property2Name,
          isPartOfIdentity: true,
        }),
      ],
      data: {
        edfiXsd: {
        },
      },
    });
    metaEd.entity.common.set(inlineCommon1.metaEdName, inlineCommon1);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
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
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });


  it('should add identity properties to domainEntity', () => {
    const domainEntity: any = metaEd.entity.domainEntity.get(entityName);
    expect(domainEntity.properties[0].type).toBe('common');
    expect(domainEntity.data.edfiXsd.xsd_IdentityProperties.length).toBe(2);
    expect(domainEntity.data.edfiXsd.xsd_IdentityProperties[0].metaEdName).toBe(property2Name);
    expect(domainEntity.data.edfiXsd.xsd_IdentityProperties[1].metaEdName).toBe(property1Name);
  });
});
