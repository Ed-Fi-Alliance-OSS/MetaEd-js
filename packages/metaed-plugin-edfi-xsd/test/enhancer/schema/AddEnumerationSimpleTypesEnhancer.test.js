// @flow
import { newMetaEdEnvironment, newEnumeration, newEnumerationItem } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, Enumeration } from '../../../../metaed-core/index';
import type { EnumerationSimpleType } from '../../../src/model/schema/EnumerationSimpleType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance } from '../../../src/enhancer/schema/AddEnumerationSimpleTypesEnhancer';

describe('when enhancing enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const simpleTypeName: string = 'EnumerationSimpleType';
  const simpleTypeNameWithExtension: string = `${projectExtension}-${simpleTypeName}`;
  const documentation: string = 'Documentation';
  const item1Documentation: string = 'Item 1 Documentation';
  const item1ShortDescription: string = 'Item 1 Short Description';
  const item2Documentation: string = 'Item 2 Documentation';
  const item2ShortDescription: string = 'Item 2 Short Description';

  let enhancedItem: Enumeration;
  let createdSimpleType: EnumerationSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newEnumeration(), {
      metaEdName: simpleTypeName,
      documentation,
      enumerationItems: [
        Object.assign(newEnumerationItem(), {
          documentation: item1Documentation,
          shortDescription: item1ShortDescription,
        }),
        Object.assign(newEnumerationItem(), {
          documentation: item2Documentation,
          shortDescription: item2ShortDescription,
        }),
      ],
      data: {
        edfiXsd: {
          xsd_EnumerationNameWithExtension: simpleTypeNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.enumeration.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsd_EnumerationSimpleType;
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have annotation documentation assigned', () => {
    expect(createdSimpleType.annotation).toBeDefined();
    expect(createdSimpleType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', () => {
    expect(createdSimpleType.annotation.typeGroup).toBe('Enumeration');
  });

  it('should have base type assigned', () => {
    expect(createdSimpleType.baseType).toBe('xs:token');
  });

  it('should have name assigned', () => {
    expect(createdSimpleType.name).toBe(simpleTypeNameWithExtension);
  });

  it('should have enumeration tokens', () => {
    expect(createdSimpleType.enumerationTokens.length).toBe(2);
  });
});
