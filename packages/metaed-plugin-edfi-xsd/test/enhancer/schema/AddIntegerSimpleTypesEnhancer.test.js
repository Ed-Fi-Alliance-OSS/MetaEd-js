// @flow
import { newMetaEdEnvironment, newIntegerType } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, IntegerType } from '../../../../metaed-core/index';
import type { IntegerSimpleType } from '../../../src/model/schema/IntegerSimpleType';
import { NoSimpleType } from '../../../src/model/schema/SimpleType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance } from '../../../src/enhancer/schema/AddIntegerSimpleTypesEnhancer';

describe('when enhancing integer type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const minValue: string = '1';
  const maxValue: string = '100';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newIntegerType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      minValue,
      maxValue,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): IntegerSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have annotation documentation assigned', () => {
    expect(createdSimpleType.annotation).toBeDefined();
    expect(createdSimpleType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', () => {
    expect(createdSimpleType.annotation.typeGroup).toBe('Simple');
  });

  it('should have base type assigned', () => {
    expect(createdSimpleType.baseType).toBe('xs:int');
  });

  it('should have max value assigned', () => {
    expect(createdSimpleType.maxValue).toBe(maxValue);
  });

  it('should have min value assigned', () => {
    expect(createdSimpleType.minValue).toBe(minValue);
  });

  it('should have name assigned', () => {
    expect(createdSimpleType.name).toBe(simpleTypeName);
  });
});

describe('when enhancing integer type is short', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const minValue: string = '1';
  const maxValue: string = '100';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newIntegerType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      isShort: true,
      minValue,
      maxValue,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): IntegerSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have annotation documentation assigned', () => {
    expect(createdSimpleType.annotation).toBeDefined();
    expect(createdSimpleType.annotation.documentation).toBe(documentation);
  });

  it('should have annotation type group assigned', () => {
    expect(createdSimpleType.annotation.typeGroup).toBe('Simple');
  });

  it('should have base type assigned', () => {
    expect(createdSimpleType.baseType).toBe('xs:short');
  });

  it('should have max value assigned', () => {
    expect(createdSimpleType.maxValue).toBe(maxValue);
  });

  it('should have min value assigned', () => {
    expect(createdSimpleType.minValue).toBe(minValue);
  });

  it('should have name assigned', () => {
    expect(createdSimpleType.name).toBe(simpleTypeName);
  });
});

describe('when enhancing generated integer type with min value only', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const minValue: string = '1';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newIntegerType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      minValue,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): IntegerSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should not have max value assigned', () => {
    expect(createdSimpleType.maxValue).toBe('');
  });

  it('should have min value assigned', () => {
    expect(createdSimpleType.minValue).toBe(minValue);
  });
});

describe('when enhancing generated integer type with max value only', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const maxValue: string = '100';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newIntegerType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      maxValue,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): IntegerSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have max value assigned', () => {
    expect(createdSimpleType.maxValue).toBe(maxValue);
  });

  it('should not have min value assigned', () => {
    expect(createdSimpleType.minValue).toBe('');
  });
});

describe('when enhancing non-generated integer type with no restrictions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newIntegerType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): IntegerSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should not have max value assigned', () => {
    expect(createdSimpleType.maxValue).toBe('');
  });

  it('should not have min value assigned', () => {
    expect(createdSimpleType.minValue).toBe('');
  });
});

describe('when enhancing generated integer type with no restrictions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: IntegerType;
  let createdSimpleType: IntegerSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newIntegerType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.integerType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): IntegerSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBe(NoSimpleType);
  });
});
