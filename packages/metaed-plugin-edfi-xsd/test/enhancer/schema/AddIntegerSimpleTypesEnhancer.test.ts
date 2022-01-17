import { newMetaEdEnvironment, newIntegerType, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, IntegerType, Namespace } from '@edfi/metaed-core';
import { IntegerSimpleType } from '../../../src/model/schema/IntegerSimpleType';
import { NoSimpleType } from '../../../src/model/schema/SimpleType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance } from '../../../src/enhancer/schema/AddIntegerSimpleTypesEnhancer';

describe('when enhancing integer type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  const minValue = '1';
  const maxValue = '100';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    enhancedItem = {
      ...newIntegerType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      minValue,
      maxValue,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as IntegerSimpleType;
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
    expect(createdSimpleType.baseType).toBe('xs:int');
  });

  it('should have max value assigned', (): void => {
    expect(createdSimpleType.maxValue).toBe(maxValue);
  });

  it('should have min value assigned', (): void => {
    expect(createdSimpleType.minValue).toBe(minValue);
  });

  it('should have name assigned', (): void => {
    expect(createdSimpleType.name).toBe(simpleTypeName);
  });
});

describe('when enhancing integer type is short', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  const minValue = '1';
  const maxValue = '100';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = {
      ...newIntegerType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      isShort: true,
      minValue,
      maxValue,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as IntegerSimpleType;
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
    expect(createdSimpleType.baseType).toBe('xs:short');
  });

  it('should have max value assigned', (): void => {
    expect(createdSimpleType.maxValue).toBe(maxValue);
  });

  it('should have min value assigned', (): void => {
    expect(createdSimpleType.minValue).toBe(minValue);
  });

  it('should have name assigned', (): void => {
    expect(createdSimpleType.name).toBe(simpleTypeName);
  });
});

describe('when enhancing generated integer type with min value only', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  const minValue = '1';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = {
      ...newIntegerType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      minValue,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as IntegerSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should not have max value assigned', (): void => {
    expect(createdSimpleType.maxValue).toBe('');
  });

  it('should have min value assigned', (): void => {
    expect(createdSimpleType.minValue).toBe(minValue);
  });
});

describe('when enhancing generated integer type with max value only', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  const maxValue = '100';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = {
      ...newIntegerType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      maxValue,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as IntegerSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have max value assigned', (): void => {
    expect(createdSimpleType.maxValue).toBe(maxValue);
  });

  it('should not have min value assigned', (): void => {
    expect(createdSimpleType.minValue).toBe('');
  });
});

describe('when enhancing non-generated integer type with no restrictions', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = {
      ...newIntegerType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as IntegerSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should not have max value assigned', (): void => {
    expect(createdSimpleType.maxValue).toBe('');
  });

  it('should not have min value assigned', (): void => {
    expect(createdSimpleType.minValue).toBe('');
  });
});

describe('when enhancing generated integer type with no restrictions', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const simpleTypeName = 'SimpleTypeName';
  const documentation = 'Documentation';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = {
      ...newIntegerType(),
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      data: {
        edfiXsd: {},
      },
    };
    addModelBaseEdfiXsdTo(enhancedItem);
    namespace.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = enhancedItem.data.edfiXsd.xsdSimpleType as IntegerSimpleType;
  });

  it('should create simple type', (): void => {
    expect(createdSimpleType).toBe(NoSimpleType);
  });
});
