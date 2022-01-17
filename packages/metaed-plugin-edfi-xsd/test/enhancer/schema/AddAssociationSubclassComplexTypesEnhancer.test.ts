import { newMetaEdEnvironment, newAssociation, newAssociationSubclass, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, AssociationSubclass, Namespace } from '@edfi/metaed-core';
import { ComplexType } from '../../../src/model/schema/ComplexType';
import { NoComplexType } from '../../../src/model/schema/ComplexType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance as initializeTopLevelEntities } from '../../../src/model/TopLevelEntity';
import { enhance } from '../../../src/enhancer/schema/AddAssociationSubclassComplexTypesEnhancer';

describe('when enhancing association subclass', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const baseTypeName = 'BaseTypeName';
  const complexTypeName = 'ComplexTypeName';
  const documentation = 'Documentation';
  let enhancedItem: AssociationSubclass;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdLookupType: ComplexType;
  let createdIdentityType: ComplexType;

  beforeAll(() => {
    const baseEntity = {
      ...newAssociation(),
      namespace,
      metaEdName: baseTypeName,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(baseEntity);
    namespace.entity.association.set(baseEntity.metaEdName, baseEntity);

    enhancedItem = {
      ...newAssociationSubclass(),
      namespace,
      metaEdName: complexTypeName,
      documentation,
      baseEntity,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.associationSubclass.set(enhancedItem.metaEdName, enhancedItem);

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
    expect(createdComplexType.annotation.typeGroup).toBe('Association');
  });

  it('should have base type assigned', (): void => {
    expect(createdComplexType.baseType).toBe(baseTypeName);
  });

  it('should have name assigned', (): void => {
    expect(createdComplexType.name).toBe(complexTypeName);
  });

  it('should not have items', (): void => {
    expect(createdComplexType.items.length).toBe(0);
  });

  it('should create reference type', (): void => {
    expect(createdReferenceType).toBeDefined();
  });

  it('should not create identity type', (): void => {
    expect(createdIdentityType).toBe(NoComplexType);
  });

  it('should not create lookup type', (): void => {
    expect(createdLookupType).toBe(NoComplexType);
  });
});
