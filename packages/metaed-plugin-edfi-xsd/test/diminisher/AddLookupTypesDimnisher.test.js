// @flow
import R from 'ramda';
import type {
  DomainEntity,
  MetaEdEnvironment,
} from '../../../metaed-core/index';
import {
  newBooleanProperty,
  newDomainEntity,
  newMetaEdEnvironment,
  newNamespaceInfo,
} from '../../../metaed-core/index';
import { newComplexType, NoComplexType } from '../../src/model/schema/ComplexType';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { enhance } from '../../src/diminisher/AddLookupTypesDiminisher';

describe('when AddLookupTypesDiminisher diminishes entity included in lookupTypeNames list', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'Assessment';
  const booleanPropertyName1: string = 'BooleanPropertyName1';
  const booleanPropertyType: string = 'BooleanPropertyType';
  const booleanPropertyDocumentation: string = 'BooleanPropertyDocumentation';
  const typeGroup: string = 'Lookup';
  let entity: DomainEntity;

  beforeAll(() => {
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiXsd: {
          xsd_ReferenceType: Object.assign(newComplexType(), {
            name: `${domainEntityName1}Reference`,
          }),
        },
      },
      queryableFields: [
        Object.assign(newBooleanProperty(), {
          documentation: booleanPropertyDocumentation,
          isRequiredCollection: true,
          data: {
            edfiXsd: {
              xsd_Name: booleanPropertyName1,
              xsd_Type: booleanPropertyType,
            },
          },
        }),
      ],
    });
    metaEd.entity.domainEntity.set(domainEntityName1, domainEntity1);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);

    // $FlowIgnore - entity could be undefined
    entity = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(entity).toBeDefined();
  });

  it('should have lookup type', () => {
    expect(entity.data.edfiXsd.xsd_LookupType).toBeTruthy();
    expect(entity.data.edfiXsd.xsd_LookupType).not.toBe(NoComplexType);
  });

  it('should have lookup type name', () => {
    expect(entity.data.edfiXsd.xsd_LookupType.name).toBe(`${domainEntityName1}${typeGroup}Type`);
  });

  it('should have lookup type annotation documentation', () => {
    expect(entity.data.edfiXsd.xsd_LookupType.annotation.documentation).toBeTruthy();
    expect(entity.data.edfiXsd.xsd_LookupType.annotation.documentation).toMatchSnapshot();
  });

  it('should have lookup type type group', () => {
    expect(entity.data.edfiXsd.xsd_LookupType.annotation.typeGroup).toBe(typeGroup);
  });

  it('should have no lookup type base type', () => {
    expect(entity.data.edfiXsd.xsd_LookupType.baseType).toBeFalsy();
  });

  it('should have lookup type item', () => {
    expect(entity.data.edfiXsd.xsd_LookupType.items).toHaveLength(1);
    expect(R.head(entity.data.edfiXsd.xsd_LookupType.items)).toBeTruthy();
  });

  it('should have lookup type item name', () => {
    expect(R.head(entity.data.edfiXsd.xsd_LookupType.items).name).toBe(booleanPropertyName1);
  });

  it('should have lookup type item type', () => {
    expect(R.head(entity.data.edfiXsd.xsd_LookupType.items).type).toBe(booleanPropertyType);
  });

  it('should have lookup type item annotation', () => {
    expect(R.head(entity.data.edfiXsd.xsd_LookupType.items).annotation).toBeTruthy();
  });

  it('should have lookup type item annotation documentation', () => {
    expect(R.head(entity.data.edfiXsd.xsd_LookupType.items).annotation.documentation)
      .toBe(booleanPropertyDocumentation);
  });

  it('should have no lookup type item annotation descriptorName', () => {
    expect(R.head(entity.data.edfiXsd.xsd_LookupType.items).annotation.descriptorName).toBeFalsy();
  });

  it('should have lookup type item minOccurs', () => {
    expect(R.head(entity.data.edfiXsd.xsd_LookupType.items).minOccurs).toBe('0');
  });

  it('should have lookup type item maxOccursIsUnbounded', () => {
    expect(R.head(entity.data.edfiXsd.xsd_LookupType.items).maxOccursIsUnbounded).toBe(false);
  });

  it('should have reference type', () => {
    expect(entity.data.edfiXsd.xsd_ReferenceType).toBeTruthy();
    expect(entity.data.edfiXsd.xsd_ReferenceType).not.toBe(NoComplexType);
  });

  it('should have reference type item', () => {
    expect(entity.data.edfiXsd.xsd_ReferenceType.items).toHaveLength(1);
    expect(R.head(entity.data.edfiXsd.xsd_ReferenceType.items)).toBeTruthy();
  });

  it('should have reference type item name', () => {
    expect(R.head(entity.data.edfiXsd.xsd_ReferenceType.items).name)
      .toBe(`${domainEntityName1}${typeGroup}`);
  });

  it('should have reference type item type', () => {
    expect(R.head(entity.data.edfiXsd.xsd_ReferenceType.items).type)
      .toBe(`${domainEntityName1}${typeGroup}Type`);
  });

  it('should have reference type item annotation', () => {
    expect(R.head(entity.data.edfiXsd.xsd_ReferenceType.items).annotation).toBeTruthy();
  });

  it('should have reference type item annotation documentation', () => {
    expect(R.head(entity.data.edfiXsd.xsd_ReferenceType.items).annotation.documentation)
      .toBe(entity.data.edfiXsd.xsd_LookupType.annotation.documentation);
  });

  it('should have no reference type item annotation descriptorName', () => {
    expect(R.head(entity.data.edfiXsd.xsd_ReferenceType.items).annotation.descriptorName).toBeFalsy();
  });

  it('should have reference type item minOccurs', () => {
    expect(R.head(entity.data.edfiXsd.xsd_ReferenceType.items).minOccurs).toBe('0');
  });

  it('should have reference type item maxOccursIsUnbounded', () => {
    expect(R.head(entity.data.edfiXsd.xsd_ReferenceType.items).maxOccursIsUnbounded).toBe(false);
  });
});

describe('when AddLookupTypesDiminisher diminishes entity not included in lookupTypeNames list', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DomainEntityName1';
  let entity: DomainEntity;

  beforeAll(() => {
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        isExtension: true,
        projectExtension: 'Extension',
      }),
      metaEdName: domainEntityName1,
      data: {
        edfiXsd: {
          xsd_ReferenceType: Object.assign(newComplexType(), {
            name: `${domainEntityName1}Reference`,
          }),
        },
      },
      queryableFields: [
        Object.assign(newBooleanProperty(), {
          documentation: 'BooleanPropertyDocumentation',
          isRequiredCollection: true,
          data: {
            edfiXsd: {
              xsd_Name: 'BooleanPropertyName1',
              xsd_Type: 'BooleanPropertyType',
            },
          },
        }),
      ],
    });
    metaEd.entity.domainEntity.set(domainEntityName1, domainEntity1);
    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);

    // $FlowIgnore - entity could be undefined
    entity = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(entity).toBeDefined();
  });

  it('should have no lookup type', () => {
    expect(entity.data.edfiXsd.xsd_LookupType).toBeTruthy();
    expect(entity.data.edfiXsd.xsd_LookupType).toBe(NoComplexType);
  });

  it('should have no lookup type item', () => {
    expect(entity.data.edfiXsd.xsd_LookupType.items).toHaveLength(0);
  });

  it('should have no reference type', () => {
    expect(entity.data.edfiXsd.xsd_ReferenceType).toBeTruthy();
    expect(entity.data.edfiXsd.xsd_ReferenceType).toBe(NoComplexType);
  });

  it('should have no reference type item', () => {
    expect(entity.data.edfiXsd.xsd_ReferenceType.items).toHaveLength(0);
  });
});
