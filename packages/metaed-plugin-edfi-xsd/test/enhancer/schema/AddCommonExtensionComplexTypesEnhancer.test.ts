import { newMetaEdEnvironment, newCommon, newCommonExtension, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, CommonExtension, Namespace } from '@edfi/metaed-core';
import { ComplexType } from '../../../src/model/schema/ComplexType';
import { NoComplexType } from '../../../src/model/schema/ComplexType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance as initializeTopLevelEntities } from '../../../src/model/TopLevelEntity';
import { enhance } from '../../../src/enhancer/schema/AddCommonExtensionComplexTypesEnhancer';

describe('when enhancing common extension', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const baseTypeName = 'BaseTypeName';
  const complexTypeName = 'ComplexTypeName';
  const documentation = 'Documentation';
  let enhancedItem: CommonExtension;
  let createdComplexType: ComplexType;
  let createdReferenceType: ComplexType;
  let createdIdentityType: ComplexType;
  let createdLookupType: ComplexType;

  beforeAll(() => {
    const baseEntity = {
      ...newCommon(),
      namespace,
      metaEdName: baseTypeName,
      documentation,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(baseEntity);
    namespace.entity.common.set(baseEntity.metaEdName, baseEntity);

    enhancedItem = {
      ...newCommonExtension(),
      namespace,
      metaEdName: complexTypeName,
      documentation,
      baseEntity,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.commonExtension.set(enhancedItem.metaEdName, enhancedItem);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);

    expect(enhancedItem.data.edfiXsd.xsdComplexTypes.length).toBe(1);
    [createdComplexType] = enhancedItem.data.edfiXsd.xsdComplexTypes;
    createdReferenceType = enhancedItem.data.edfiXsd.xsdReferenceType;
    createdIdentityType = enhancedItem.data.edfiXsd.xsdIdentityType;
    createdLookupType = enhancedItem.data.edfiXsd.xsdLookupType;
  });

  it('should create complex type', (): void => {
    expect(createdComplexType).toBeDefined();
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdComplexType.annotation).toBeDefined();
    expect(createdComplexType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', (): void => {
    expect(createdComplexType.annotation.typeGroup).toBe('Common');
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
