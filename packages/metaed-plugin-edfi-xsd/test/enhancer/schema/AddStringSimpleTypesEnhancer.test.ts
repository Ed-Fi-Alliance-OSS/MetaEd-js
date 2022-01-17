import { newMetaEdEnvironment, newStringType, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, StringType, Namespace } from '@edfi/metaed-core';
import { StringSimpleType } from '../../../src/model/schema/StringSimpleType';
import { NoSimpleType } from '../../../src/model/schema/SimpleType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance } from '../../../src/enhancer/schema/AddStringSimpleTypesEnhancer';

describe('when enhancing string type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  const minLength = '1';
  const maxLength = '100';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    enhancedItem = {
      ...newStringType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      minLength,
      maxLength,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as StringSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have annotation documentation assigned', (): void => {
    expect(createdSimpleType.annotation).toBeDefined();
    expect(createdSimpleType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', (): void => {
    expect(createdSimpleType.annotation.typeGroup).toBe('Simple');
  });

  it('should have base type assigned', (): void => {
    expect(createdSimpleType.baseType).toBe('xs:string');
  });

  it('should have max length assigned', (): void => {
    expect(createdSimpleType.maxLength).toBe(maxLength);
  });

  it('should have min length assigned', (): void => {
    expect(createdSimpleType.minLength).toBe(minLength);
  });

  it('should have name assigned', (): void => {
    expect(createdSimpleType.name).toBe(simpleTypeName);
  });
});

describe('when enhancing generated string type with min length only', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  const minLength = '1';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    enhancedItem = {
      ...newStringType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      minLength,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as StringSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should not have max length assigned', (): void => {
    expect(createdSimpleType.maxLength).toBe('');
  });

  it('should have min length assigned', (): void => {
    expect(createdSimpleType.minLength).toBe(minLength);
  });
});

describe('when enhancing generated string type with max length only', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  const maxLength = '100';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    enhancedItem = {
      ...newStringType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      maxLength,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as StringSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have max length assigned', (): void => {
    expect(createdSimpleType.maxLength).toBe(maxLength);
  });

  it('should not have min length assigned', (): void => {
    expect(createdSimpleType.minLength).toBe('');
  });
});

describe('when enhancing non-generated string type with no restrictions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    enhancedItem = {
      ...newStringType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as StringSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should not have max length assigned', (): void => {
    expect(createdSimpleType.maxLength).toBe('');
  });

  it('should not have min length assigned', (): void => {
    expect(createdSimpleType.minLength).toBe('');
  });
});

describe('when enhancing generated string type with no restrictions', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    enhancedItem = {
      ...newStringType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as StringSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBe(NoSimpleType);
  });
});
