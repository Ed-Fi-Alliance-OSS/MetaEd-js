// @flow
import { newMetaEdEnvironment, newDescriptor, newMapTypeEnumeration, newBooleanProperty, newDescriptorProperty } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, Descriptor, MapTypeEnumeration } from '../../../../metaed-core/index';
import type { ComplexType } from '../../../src/model/schema/ComplexType';
import type { Element } from '../../../src/model/schema/Element';
import { NoComplexType } from '../../../src/model/schema/ComplexType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { addDescriptorPropertyEdfiXsdTo } from '../../../src/model/property/DescriptorProperty';
import { enhance as initializeTopLevelEntities } from '../../../src/model/TopLevelEntity';
import { enhance } from '../../../src/enhancer/schema/AddDescriptorComplexTypesEnhancer';

describe('when enhancing descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const complexTypeName: string = 'ComplexTypeName';
  const complexTypeDescriptorName: string = `${complexTypeName}Descriptor`;
  const complexTypeDescriptorNameWithExtension: string = `${projectExtension}-${complexTypeDescriptorName}`;
  const documentation: string = 'Documentation';
  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDescriptor(), {
      metaEdName: complexTypeName,
      documentation,
      data: {
        edfiXsd: {
          xsd_DescriptorName: complexTypeDescriptorName,
          xsd_DescriptorNameWithExtension: complexTypeDescriptorNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
    createdReferenceType = enhancedItem.data.edfiXsd.xsd_ReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsd_LookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsd_IdentityType;
  });

  it('should create complex type', () => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', () => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', () => {
    expect(createdComplexType.annotation.typeGroup).toBe('Descriptor');
  });

  it('should have base type assigned', () => {
    expect(createdComplexType.baseType).toBe('DescriptorType');
  });

  it('should have name assigned', () => {
    expect(createdComplexType.name).toBe(complexTypeDescriptorNameWithExtension);
  });

  it('should not have items', () => {
    expect(createdComplexType.items.length).toBe(0);
  });

  it('should create reference type', () => {
    expect(createdReferenceType).toBeDefined();
  });

  it('should have reference type annotation documentation assigned', () => {
    expect(createdReferenceType.annotation).toBeDefined();
    expect(createdReferenceType.annotation.documentation).toMatchSnapshot();
  });

  it('should have reference type group assigned', () => {
    expect(createdReferenceType.annotation.typeGroup).toBe('Extended Descriptor Reference');
  });

  it('should have reference type base type assigned', () => {
    expect(createdReferenceType.baseType).toBe('DescriptorReferenceType');
  });

  it('should have reference type name assigned', () => {
    expect(createdReferenceType.name).toBe(`${complexTypeDescriptorNameWithExtension}ReferenceType`);
  });

  it('should not have reference type items', () => {
    expect(createdReferenceType.items.length).toBe(0);
  });

  it('should not create identity type', () => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', () => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});

describe('when enhancing descriptor with required map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const complexTypeName: string = 'ComplexTypeName';
  const complexTypeDescriptorName: string = `${complexTypeName}Descriptor`;
  const complexTypeDescriptorNameWithExtension: string = `${projectExtension}-${complexTypeDescriptorName}`;
  const documentation: string = 'Documentation';
  const mapTypeName: string = 'MapTypeName';
  const enumerationName: string = 'EnumerationName';
  const enumerationNameWithExtension: string = `${projectExtension}-${enumerationName}`;

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeName,
      documentation,
      data: {
        edfiXsd: {
          xsd_EnumerationName: enumerationName,
          xsd_EnumerationNameWithExtension: enumerationNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(mapTypeEnumeration);
    metaEd.entity.mapTypeEnumeration.set(mapTypeEnumeration.metaEdName, mapTypeEnumeration);

    enhancedItem = Object.assign(newDescriptor(), {
      metaEdName: complexTypeName,
      documentation,
      isMapTypeRequired: true,
      isMapTypeOptional: false,
      mapTypeEnumeration,
      data: {
        edfiXsd: {
          xsd_DescriptorName: complexTypeDescriptorName,
          xsd_DescriptorNameWithExtension: complexTypeDescriptorNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
    createdReferenceType = enhancedItem.data.edfiXsd.xsd_ReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsd_LookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsd_IdentityType;
  });

  it('should create complex type', () => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', () => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', () => {
    expect(createdComplexType.annotation.typeGroup).toBe('Descriptor');
  });

  it('should have base type assigned', () => {
    expect(createdComplexType.baseType).toBe('DescriptorType');
  });

  it('should have name assigned', () => {
    expect(createdComplexType.name).toBe(complexTypeDescriptorNameWithExtension);
  });

  it('should not have items', () => {
    expect(createdComplexType.items.length).toBe(1);

    const mapTypeItem: Element = ((createdComplexType.items[0]: any): Element);
    expect(mapTypeItem).toBeDefined();
    expect(mapTypeItem.name).toBe(mapTypeName);
    expect(mapTypeItem.type).toBe(enumerationNameWithExtension);
    expect(mapTypeItem.annotation).toBeDefined();
    expect(createdReferenceType.annotation.documentation).toMatchSnapshot();
    expect(mapTypeItem.minOccurs).toBe('');
  });

  it('should create reference type', () => {
    expect(createdReferenceType).toBeDefined();
  });

  it('should not create identity type', () => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', () => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});

describe('when enhancing descriptor with optional map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const complexTypeName: string = 'ComplexTypeName';
  const complexTypeDescriptorName: string = `${complexTypeName}Descriptor`;
  const complexTypeDescriptorNameWithExtension: string = `${projectExtension}-${complexTypeDescriptorName}`;
  const documentation: string = 'Documentation';
  const mapTypeName: string = 'MapTypeName';
  const enumerationName: string = 'EnumerationName';
  const enumerationNameWithExtension: string = `${projectExtension}-${enumerationName}`;

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeName,
      documentation,
      data: {
        edfiXsd: {
          xsd_EnumerationName: enumerationName,
          xsd_EnumerationNameWithExtension: enumerationNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(mapTypeEnumeration);
    metaEd.entity.mapTypeEnumeration.set(mapTypeEnumeration.metaEdName, mapTypeEnumeration);

    enhancedItem = Object.assign(newDescriptor(), {
      metaEdName: complexTypeName,
      documentation,
      isMapTypeRequired: false,
      isMapTypeOptional: true,
      mapTypeEnumeration,
      data: {
        edfiXsd: {
          xsd_DescriptorName: complexTypeDescriptorName,
          xsd_DescriptorNameWithExtension: complexTypeDescriptorNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
    createdReferenceType = enhancedItem.data.edfiXsd.xsd_ReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsd_LookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsd_IdentityType;
  });

  it('should create complex type', () => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', () => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', () => {
    expect(createdComplexType.annotation.typeGroup).toBe('Descriptor');
  });

  it('should have base type assigned', () => {
    expect(createdComplexType.baseType).toBe('DescriptorType');
  });

  it('should have name assigned', () => {
    expect(createdComplexType.name).toBe(complexTypeDescriptorNameWithExtension);
  });

  it('should not have items', () => {
    expect(createdComplexType.items.length).toBe(1);

    const mapTypeItem: Element = ((createdComplexType.items[0]: any): Element);
    expect(mapTypeItem).toBeDefined();
    expect(mapTypeItem.name).toBe(mapTypeName);
    expect(mapTypeItem.type).toBe(enumerationNameWithExtension);
    expect(mapTypeItem.annotation).toBeDefined();
    expect(createdReferenceType.annotation.documentation).toMatchSnapshot();
    expect(mapTypeItem.minOccurs).toBe('0');
  });

  it('should create reference type', () => {
    expect(createdReferenceType).toBeDefined();
  });

  it('should not create identity type', () => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', () => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});

describe('when enhancing descriptor with property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const complexTypeName: string = 'ComplexTypeName';
  const complexTypeNameWithExtension: string = `${projectExtension}-${complexTypeName}`;
  const documentation: string = 'Documentation';
  const propertyName: string = 'PropertyName';
  const propertyType: string = 'PropertyType';
  const propertyDocumentation: string = 'PropertyDocumentation';

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDescriptor(), {
      metaEdName: complexTypeName,
      documentation,
      properties: [
        Object.assign(newBooleanProperty(), {
          metaEdName: propertyName,
          documentation: propertyDocumentation,
          data: {
            edfiXsd: {
              xsd_Name: propertyName,
              xsd_Type: propertyType,
            },
          },
        }),
      ],
      data: {
        edfiXsd: {
          xsd_DescriptorName: complexTypeName,
          xsd_DescriptorNameWithExtension: complexTypeNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
  });

  it('should have items', () => {
    expect(createdComplexType.items.length).toBe(1);
  });

  it('should create complex type item element', () => {
    const complexTypeItem: Element = ((createdComplexType.items[0]: any): Element);
    expect(complexTypeItem.name).toBe(propertyName);
    expect(complexTypeItem.type).toBe(propertyType);
    expect(complexTypeItem.annotation.documentation).toBe(propertyDocumentation);
    expect(complexTypeItem.annotation.descriptorName).toBe('');
    expect(complexTypeItem.minOccurs).toBe('');
    expect(complexTypeItem.maxOccursIsUnbounded).toBe(false);
  });
});

describe('when enhancing descriptor with property and map type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const complexTypeName: string = 'ComplexTypeName';
  const complexTypeNameWithExtension: string = `${projectExtension}-${complexTypeName}`;
  const documentation: string = 'Documentation';
  const mapTypeName: string = 'MapTypeName';
  const enumerationName: string = 'EnumerationName';
  const enumerationNameWithExtension: string = `${projectExtension}-${enumerationName}`;
  const propertyName: string = 'PropertyName';
  const propertyType: string = 'PropertyType';
  const propertyDocumentation: string = 'PropertyDocumentation';

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;

  beforeAll(() => {
    const mapTypeEnumeration: MapTypeEnumeration = Object.assign(newMapTypeEnumeration(), {
      metaEdName: mapTypeName,
      documentation,
      data: {
        edfiXsd: {
          xsd_EnumerationName: enumerationName,
          xsd_EnumerationNameWithExtension: enumerationNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(mapTypeEnumeration);
    metaEd.entity.mapTypeEnumeration.set(mapTypeEnumeration.metaEdName, mapTypeEnumeration);

    enhancedItem = Object.assign(newDescriptor(), {
      metaEdName: complexTypeName,
      documentation,
      mapTypeEnumeration,
      properties: [
        Object.assign(newBooleanProperty(), {
          metaEdName: propertyName,
          documentation: propertyDocumentation,
          data: {
            edfiXsd: {
              xsd_Name: propertyName,
              xsd_Type: propertyType,
            },
          },
        }),
      ],
      data: {
        edfiXsd: {
          xsd_DescriptorName: complexTypeName,
          xsd_DescriptorNameWithExtension: complexTypeNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
  });

  it('should have two items', () => {
    expect(createdComplexType.items.length).toBe(2);
  });

  it('should create complex type item element', () => {
    const complexTypeItem: Element = ((createdComplexType.items[0]: any): Element);
    expect(complexTypeItem.name).toBe(propertyName);
    expect(complexTypeItem.type).toBe(propertyType);
    expect(complexTypeItem.annotation.documentation).toBe(propertyDocumentation);
    expect(complexTypeItem.annotation.descriptorName).toBe('');
    expect(complexTypeItem.minOccurs).toBe('');
    expect(complexTypeItem.maxOccursIsUnbounded).toBe(false);
  });

  it('should create map type item element', () => {
    const complexTypeItem: Element = ((createdComplexType.items[1]: any): Element);
    expect(complexTypeItem.name).toBe(mapTypeName);
    expect(complexTypeItem.type).toBe(enumerationNameWithExtension);
    expect(complexTypeItem.annotation.documentation).toMatchSnapshot();
    expect(complexTypeItem.annotation.descriptorName).toBe('');
    expect(complexTypeItem.minOccurs).toBe('');
    expect(complexTypeItem.maxOccursIsUnbounded).toBe(false);
  });
});

describe('when enhancing descriptor with descriptor property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const complexTypeName: string = 'ComplexTypeName';
  const complexTypeNameWithExtension: string = `${projectExtension}-${complexTypeName}`;
  const descriptorName: string = 'DescriptorName';
  const descriptorNameWithExtension: string = `${projectExtension}-${descriptorName}`;
  const documentation: string = 'Documentation';
  const propertyType: string = 'PropertyType';
  const propertyDocumentation: string = 'PropertyDocumentation';

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;

  beforeAll(() => {
    const referencedDescriptor = Object.assign(newDescriptor(), {
      metaEdName: descriptorName,
      data: {
        edfiXsd: {
          xsd_DescriptorName: descriptorName,
          xsd_DescriptorNameWithExtension: descriptorNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(referencedDescriptor);
    metaEd.entity.descriptor.set(referencedDescriptor.metaEdName, referencedDescriptor);

    const descriptorProperty = Object.assign(newDescriptorProperty(), {
      metaEdName: descriptorName,
      documentation: propertyDocumentation,
      referencedEntity: referencedDescriptor,
      data: {
        edfiXsd: {
          xsd_Name: descriptorName,
          xsd_Type: propertyType,
        },
      },
    });
    addDescriptorPropertyEdfiXsdTo(descriptorProperty);

    enhancedItem = Object.assign(newDescriptor(), {
      metaEdName: complexTypeName,
      documentation,
      properties: [descriptorProperty],
      data: {
        edfiXsd: {
          xsd_DescriptorName: complexTypeName,
          xsd_DescriptorNameWithExtension: complexTypeNameWithExtension,
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
  });

  it('should have items', () => {
    expect(createdComplexType.items.length).toBe(1);
  });

  it('should create complex type item element', () => {
    const complexTypeItem: Element = ((createdComplexType.items[0]: any): Element);
    expect(complexTypeItem.name).toBe(descriptorName);
    expect(complexTypeItem.type).toBe(propertyType);
    expect(complexTypeItem.annotation.documentation).toBe(propertyDocumentation);
    expect(complexTypeItem.annotation.descriptorName).toBe(descriptorNameWithExtension);
  });
});

describe('when enhancing descriptor with both queryable and identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const projectExtension: string = 'EXTENSION';
  const complexTypeName: string = 'ComplexTypeName';
  const complexTypeNameWithExtension: string = `${projectExtension}-${complexTypeName}`;
  const documentation: string = 'Documentation';
  const property1Name: string = 'Property1Name';
  const property1Type: string = 'Property1Type';
  const property1Documentation: string = 'Property1Documentation';
  const property2Name: string = 'Property2Name';
  const property2Type: string = 'Property2Type';
  const property2Documentation: string = 'Property2Documentation';

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const identityProperty = Object.assign(newBooleanProperty(), {
      metaEdName: property1Name,
      documentation: property1Documentation,
      isRequiredCollection: true,
      data: {
        edfiXsd: {
          xsd_Name: property1Name,
          xsd_Type: property1Type,
        },
      },
    });

    enhancedItem = Object.assign(newDescriptor(), {
      metaEdName: complexTypeName,
      documentation,
      properties: [
        identityProperty,
      ],
      identityProperties: [
        identityProperty,
      ],
      queryableFields: [
        Object.assign(newBooleanProperty(), {
          metaEdName: property2Name,
          documentation: property2Documentation,
          isRequiredCollection: true,
          data: {
            edfiXsd: {
              xsd_Name: property2Name,
              xsd_Type: property2Type,
            },
          },
        }),
      ],
      data: {
        edfiXsd: {
          xsd_DescriptorName: complexTypeName,
          xsd_DescriptorNameWithExtension: complexTypeNameWithExtension,
          xsd_IdentityProperties: [identityProperty],
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsd_ComplexTypes.length).toBe(1);
    createdComplexType = enhancedItem.data.edfiXsd.xsd_ComplexTypes[0];
    createdReferenceType = enhancedItem.data.edfiXsd.xsd_ReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsd_LookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsd_IdentityType;
  });

  it('should create complex type', () => {
    expect(createdComplexType).toBeDefined();
  });

  it('should create reference type', () => {
    expect(createdReferenceType).toBeDefined();
  });

  it('should not have reference type items', () => {
    expect(createdReferenceType.items.length).toBe(0);
  });

  it('should not create identity type', () => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', () => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});
