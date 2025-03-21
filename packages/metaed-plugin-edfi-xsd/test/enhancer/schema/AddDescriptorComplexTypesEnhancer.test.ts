// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newDescriptor,
  newMapTypeEnumeration,
  newBooleanProperty,
  newDescriptorProperty,
  newNamespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Descriptor, MapTypeEnumeration, Namespace } from '@edfi/metaed-core';
import { ComplexType } from '../../../src/model/schema/ComplexType';
import { Element } from '../../../src/model/schema/Element';
import { NoComplexType } from '../../../src/model/schema/ComplexType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { addDescriptorPropertyEdfiXsdTo } from '../../../src/model/property/DescriptorProperty';
import { enhance as initializeTopLevelEntities } from '../../../src/model/TopLevelEntity';
import { enhance } from '../../../src/enhancer/schema/AddDescriptorComplexTypesEnhancer';

describe('when enhancing descriptor', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const complexTypeName = 'ComplexTypeName';
  const complexTypeDescriptorName = `${complexTypeName}Descriptor`;
  const complexTypeDescriptorNameWithExtension = `${projectExtension}-${complexTypeDescriptorName}`;
  const documentation = 'Documentation';
  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    enhancedItem = {
      ...newDescriptor(),
      metaEdName: complexTypeName,
      documentation,
      data: {
        edfiXsd: {
          xsdDescriptorName: complexTypeDescriptorName,
          xsdDescriptorNameWithExtension: complexTypeDescriptorNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
    createdReferenceType = enhancedItem.data.edfiXsd.xsdReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsdLookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsdIdentityType;
  });

  it('should create complex type', (): void => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', (): void => {
    expect(createdComplexType.annotation.typeGroup).toBe('Descriptor');
  });

  it('should have base type assigned', (): void => {
    expect(createdComplexType.baseType).toBe('DescriptorType');
  });

  it('should have name assigned', (): void => {
    expect(createdComplexType.name).toBe(complexTypeDescriptorNameWithExtension);
  });

  it('should not have items', (): void => {
    expect(createdComplexType.items.length).toBe(0);
  });

  it('should not create reference type', (): void => {
    expect(createdReferenceType).toBe(NoComplexType);
  });

  it('should not have reference type items', (): void => {
    expect(createdReferenceType.items.length).toBe(0);
  });

  it('should not create identity type', (): void => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', (): void => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});

describe('when enhancing descriptor with required map type', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const complexTypeName = 'ComplexTypeName';
  const complexTypeDescriptorName = `${complexTypeName}Descriptor`;
  const complexTypeDescriptorNameWithExtension = `${projectExtension}-${complexTypeDescriptorName}`;
  const documentation = 'Documentation';
  const mapTypeName = 'MapTypeName';
  const enumerationName = 'EnumerationName';
  const enumerationNameWithExtension = `${projectExtension}-${enumerationName}`;

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const mapTypeEnumeration: MapTypeEnumeration = {
      ...newMapTypeEnumeration(),
      metaEdName: mapTypeName,
      documentation,
      data: {
        edfiXsd: {
          xsdEnumerationName: enumerationName,
          xsdEnumerationNameWithExtension: enumerationNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(mapTypeEnumeration);
    namespace.entity.mapTypeEnumeration.set(mapTypeEnumeration.metaEdName, mapTypeEnumeration);

    enhancedItem = {
      ...newDescriptor(),
      metaEdName: complexTypeName,
      documentation,
      isMapTypeRequired: true,
      isMapTypeOptional: false,
      mapTypeEnumeration,
      data: {
        edfiXsd: {
          xsdDescriptorName: complexTypeDescriptorName,
          xsdDescriptorNameWithExtension: complexTypeDescriptorNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
    createdReferenceType = enhancedItem.data.edfiXsd.xsdReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsdLookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsdIdentityType;
  });

  it('should create complex type', (): void => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', (): void => {
    expect(createdComplexType.annotation.typeGroup).toBe('Descriptor');
  });

  it('should have base type assigned', (): void => {
    expect(createdComplexType.baseType).toBe('DescriptorType');
  });

  it('should have name assigned', (): void => {
    expect(createdComplexType.name).toBe(complexTypeDescriptorNameWithExtension);
  });

  it('should not have items', (): void => {
    expect(createdComplexType.items.length).toBe(1);

    const mapTypeItem: Element = createdComplexType.items[0] as Element;
    expect(mapTypeItem).toBeDefined();
    expect(mapTypeItem.name).toBe(mapTypeName);
    expect(mapTypeItem.type).toBe(enumerationNameWithExtension);
    expect(mapTypeItem.annotation).toBeDefined();
    expect(mapTypeItem.minOccurs).toBe('');
  });

  it('should not create reference type', (): void => {
    expect(createdReferenceType).toBe(NoComplexType);
  });

  it('should not create identity type', (): void => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', (): void => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});

describe('when enhancing descriptor with optional map type', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const complexTypeName = 'ComplexTypeName';
  const complexTypeDescriptorName = `${complexTypeName}Descriptor`;
  const complexTypeDescriptorNameWithExtension = `${projectExtension}-${complexTypeDescriptorName}`;
  const documentation = 'Documentation';
  const mapTypeName = 'MapTypeName';
  const enumerationName = 'EnumerationName';
  const enumerationNameWithExtension = `${projectExtension}-${enumerationName}`;

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const mapTypeEnumeration: MapTypeEnumeration = {
      ...newMapTypeEnumeration(),
      metaEdName: mapTypeName,
      documentation,
      data: {
        edfiXsd: {
          xsdEnumerationName: enumerationName,
          xsdEnumerationNameWithExtension: enumerationNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(mapTypeEnumeration);
    namespace.entity.mapTypeEnumeration.set(mapTypeEnumeration.metaEdName, mapTypeEnumeration);

    enhancedItem = {
      ...newDescriptor(),
      metaEdName: complexTypeName,
      documentation,
      isMapTypeRequired: false,
      isMapTypeOptional: true,
      mapTypeEnumeration,
      data: {
        edfiXsd: {
          xsdDescriptorName: complexTypeDescriptorName,
          xsdDescriptorNameWithExtension: complexTypeDescriptorNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
    createdReferenceType = enhancedItem.data.edfiXsd.xsdReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsdLookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsdIdentityType;
  });

  it('should create complex type', (): void => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', (): void => {
    expect(createdComplexType.annotation.typeGroup).toBe('Descriptor');
  });

  it('should have base type assigned', (): void => {
    expect(createdComplexType.baseType).toBe('DescriptorType');
  });

  it('should have name assigned', (): void => {
    expect(createdComplexType.name).toBe(complexTypeDescriptorNameWithExtension);
  });

  it('should not have items', (): void => {
    expect(createdComplexType.items.length).toBe(1);

    const mapTypeItem: Element = createdComplexType.items[0] as Element;
    expect(mapTypeItem).toBeDefined();
    expect(mapTypeItem.name).toBe(mapTypeName);
    expect(mapTypeItem.type).toBe(enumerationNameWithExtension);
    expect(mapTypeItem.annotation).toBeDefined();
    expect(mapTypeItem.minOccurs).toBe('0');
  });

  it('should not create reference type', (): void => {
    expect(createdReferenceType).toBe(NoComplexType);
  });

  it('should not create identity type', (): void => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', (): void => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});

describe('when enhancing descriptor with property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const complexTypeName = 'ComplexTypeName';
  const complexTypeNameWithExtension = `${projectExtension}-${complexTypeName}`;
  const documentation = 'Documentation';
  const propertyName = 'PropertyName';
  const propertyType = 'PropertyType';
  const propertyDocumentation = 'PropertyDocumentation';

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;

  beforeAll(() => {
    enhancedItem = {
      ...newDescriptor(),
      metaEdName: complexTypeName,
      documentation,
      properties: [
        {
          ...newBooleanProperty(),
          metaEdName: propertyName,
          documentation: propertyDocumentation,
          data: {
            edfiXsd: {
              xsdName: propertyName,
              xsdType: propertyType,
            },
          },
        },
      ],
      data: {
        edfiXsd: {
          xsdDescriptorName: complexTypeName,
          xsdDescriptorNameWithExtension: complexTypeNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
  });

  it('should have items', (): void => {
    expect(createdComplexType.items.length).toBe(1);
  });

  it('should create complex type item element', (): void => {
    const complexTypeItem: Element = createdComplexType.items[0] as Element;
    expect(complexTypeItem.name).toBe(propertyName);
    expect(complexTypeItem.type).toBe(propertyType);
    expect(complexTypeItem.annotation.documentation).toBe(propertyDocumentation);
    expect(complexTypeItem.annotation.descriptorName).toBe('');
    expect(complexTypeItem.minOccurs).toBe('');
    expect(complexTypeItem.maxOccursIsUnbounded).toBe(false);
  });
});

describe('when enhancing descriptor with property and map type', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const complexTypeName = 'ComplexTypeName';
  const complexTypeNameWithExtension = `${projectExtension}-${complexTypeName}`;
  const documentation = 'Documentation';
  const mapTypeName = 'MapTypeName';
  const enumerationName = 'EnumerationName';
  const enumerationNameWithExtension = `${projectExtension}-${enumerationName}`;
  const propertyName = 'PropertyName';
  const propertyType = 'PropertyType';
  const propertyDocumentation = 'PropertyDocumentation';

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;

  beforeAll(() => {
    const mapTypeEnumeration: MapTypeEnumeration = {
      ...newMapTypeEnumeration(),
      metaEdName: mapTypeName,
      documentation,
      data: {
        edfiXsd: {
          xsdEnumerationName: enumerationName,
          xsdEnumerationNameWithExtension: enumerationNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(mapTypeEnumeration);
    namespace.entity.mapTypeEnumeration.set(mapTypeEnumeration.metaEdName, mapTypeEnumeration);

    enhancedItem = {
      ...newDescriptor(),
      metaEdName: complexTypeName,
      documentation,
      mapTypeEnumeration,
      properties: [
        {
          ...newBooleanProperty(),
          metaEdName: propertyName,
          documentation: propertyDocumentation,
          data: {
            edfiXsd: {
              xsdName: propertyName,
              xsdType: propertyType,
            },
          },
        },
      ],
      data: {
        edfiXsd: {
          xsdDescriptorName: complexTypeName,
          xsdDescriptorNameWithExtension: complexTypeNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
  });

  it('should have two items', (): void => {
    expect(createdComplexType.items.length).toBe(2);
  });

  it('should create complex type item element', (): void => {
    const complexTypeItem: Element = createdComplexType.items[0] as Element;
    expect(complexTypeItem.name).toBe(propertyName);
    expect(complexTypeItem.type).toBe(propertyType);
    expect(complexTypeItem.annotation.documentation).toBe(propertyDocumentation);
    expect(complexTypeItem.annotation.descriptorName).toBe('');
    expect(complexTypeItem.minOccurs).toBe('');
    expect(complexTypeItem.maxOccursIsUnbounded).toBe(false);
  });

  it('should create map type item element', (): void => {
    const complexTypeItem: Element = createdComplexType.items[1] as Element;
    expect(complexTypeItem.name).toBe(mapTypeName);
    expect(complexTypeItem.type).toBe(enumerationNameWithExtension);
    expect(complexTypeItem.annotation.documentation).toMatchSnapshot();
    expect(complexTypeItem.annotation.descriptorName).toBe('');
    expect(complexTypeItem.minOccurs).toBe('');
    expect(complexTypeItem.maxOccursIsUnbounded).toBe(false);
  });
});

describe('when enhancing descriptor with descriptor property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const complexTypeName = 'ComplexTypeName';
  const complexTypeNameWithExtension = `${projectExtension}-${complexTypeName}`;
  const descriptorName = 'DescriptorName';
  const descriptorNameWithExtension = `${projectExtension}-${descriptorName}`;
  const documentation = 'Documentation';
  const propertyType = 'PropertyType';
  const propertyDocumentation = 'PropertyDocumentation';

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;

  beforeAll(() => {
    const referencedDescriptor = {
      ...newDescriptor(),
      metaEdName: descriptorName,
      data: {
        edfiXsd: {
          xsdDescriptorName: descriptorName,
          xsdDescriptorNameWithExtension: descriptorNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(referencedDescriptor);
    namespace.entity.descriptor.set(referencedDescriptor.metaEdName, referencedDescriptor);

    const descriptorProperty = {
      ...newDescriptorProperty(),
      metaEdName: descriptorName,
      documentation: propertyDocumentation,
      referencedEntity: referencedDescriptor,
      data: {
        edfiXsd: {
          xsdName: descriptorName,
          xsdType: propertyType,
        },
      },
    };
    addDescriptorPropertyEdfiXsdTo(descriptorProperty);

    enhancedItem = {
      ...newDescriptor(),
      metaEdName: complexTypeName,
      documentation,
      properties: [descriptorProperty],
      data: {
        edfiXsd: {
          xsdDescriptorName: complexTypeName,
          xsdDescriptorNameWithExtension: complexTypeNameWithExtension,
        },
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
  });

  it('should have items', (): void => {
    expect(createdComplexType.items.length).toBe(1);
  });

  it('should create complex type item element', (): void => {
    const complexTypeItem: Element = createdComplexType.items[0] as Element;
    expect(complexTypeItem.name).toBe(descriptorName);
    expect(complexTypeItem.type).toBe(propertyType);
    expect(complexTypeItem.annotation.documentation).toBe(propertyDocumentation);
    expect(complexTypeItem.annotation.descriptorName).toBe(descriptorNameWithExtension);
  });
});

describe('when enhancing descriptor with both queryable and identity property', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const projectExtension = 'EXTENSION';
  const complexTypeName = 'ComplexTypeName';
  const complexTypeNameWithExtension = `${projectExtension}-${complexTypeName}`;
  const documentation = 'Documentation';
  const property1Name = 'Property1Name';
  const property1Type = 'Property1Type';
  const property1Documentation = 'Property1Documentation';
  const property2Name = 'Property2Name';
  const property2Type = 'Property2Type';
  const property2Documentation = 'Property2Documentation';

  let enhancedItem: Descriptor;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const identityProperty = {
      ...newBooleanProperty(),
      metaEdName: property1Name,
      documentation: property1Documentation,
      isRequiredCollection: true,
      data: {
        edfiXsd: {
          xsdName: property1Name,
          xsdType: property1Type,
        },
      },
    };

    enhancedItem = {
      ...newDescriptor(),
      metaEdName: complexTypeName,
      documentation,
      properties: [identityProperty],
      identityProperties: [identityProperty],
      queryableFields: [
        {
          ...newBooleanProperty(),
          metaEdName: property2Name,
          documentation: property2Documentation,
          isRequiredCollection: true,
          data: {
            edfiXsd: {
              xsdName: property2Name,
              xsdType: property2Type,
            },
          },
        },
      ],
      data: {
        edfiXsd: {
          xsdDescriptorName: complexTypeName,
          xsdDescriptorNameWithExtension: complexTypeNameWithExtension,
          xsdIdentityProperties: [identityProperty],
        },
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.descriptor.set(enhancedItem.metaEdName, enhancedItem);

    metaEd.dataStandardVersion = '3.2.0-c';
    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
    createdReferenceType = enhancedItem.data.edfiXsd.xsdReferenceType;
    createdLookupType = enhancedItem.data.edfiXsd.xsdLookupType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsdIdentityType;
  });

  it('should create complex type', (): void => {
    expect(createdComplexType).toBeDefined();
  });

  it('should not create reference type', (): void => {
    expect(createdReferenceType).toBe(NoComplexType);
  });

  it('should not have reference type items', (): void => {
    expect(createdReferenceType.items.length).toBe(0);
  });

  it('should not create identity type', (): void => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', (): void => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});
