// @flow
import { newMetaEdEnvironment, newDecimalType } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, DecimalType } from '../../../../metaed-core/index';
import type { DecimalSimpleType } from '../../../src/model/schema/DecimalSimpleType';
import { NoSimpleType } from '../../../src/model/schema/SimpleType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance } from '../../../src/enhancer/schema/AddDecimalSimpleTypesEnhancer';

describe('when enhancing decimal type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const minValue: string = '1';
  const maxValue: string = '100';
  const decimalPlaces: string = '2';
  const totalDigits: string = '5';
  let enhancedItem: DecimalType;
  let createdSimpleType: DecimalSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDecimalType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      minValue,
      maxValue,
      decimalPlaces,
      totalDigits,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.decimalType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): DecimalSimpleType);
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
    expect(createdSimpleType.baseType).toBe('xs:decimal');
  });

  it('should have max value assigned', () => {
    expect(createdSimpleType.maxValue).toBe(maxValue);
  });

  it('should have min value assigned', () => {
    expect(createdSimpleType.minValue).toBe(minValue);
  });

  it('should have decimal places assigned', () => {
    expect(createdSimpleType.decimalPlaces).toBe(decimalPlaces);
  });

  it('should have total digits assigned', () => {
    expect(createdSimpleType.totalDigits).toBe(totalDigits);
  });

  it('should have name assigned', () => {
    expect(createdSimpleType.name).toBe(simpleTypeName);
  });
});

describe('when enhancing generated decimal type with min value only', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const minValue: string = '1';
  let enhancedItem: DecimalType;
  let createdSimpleType: DecimalSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDecimalType(), {
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
    metaEd.entity.decimalType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): DecimalSimpleType);
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

  it('should not have decimal places assigned', () => {
    expect(createdSimpleType.decimalPlaces).toBe('');
  });

  it('should not have total digits assigned', () => {
    expect(createdSimpleType.totalDigits).toBe('');
  });
});

describe('when enhancing generated decimal type with max value only', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const maxValue: string = '100';
  let enhancedItem: DecimalType;
  let createdSimpleType: DecimalSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDecimalType(), {
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
    metaEd.entity.decimalType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): DecimalSimpleType);
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

  it('should not have decimal places assigned', () => {
    expect(createdSimpleType.decimalPlaces).toBe('');
  });

  it('should not have total digits assigned', () => {
    expect(createdSimpleType.totalDigits).toBe('');
  });
});

describe('when enhancing generated decimal type with decimal places only', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const decimalPlaces: string = '2';
  let enhancedItem: DecimalType;
  let createdSimpleType: DecimalSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDecimalType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      decimalPlaces,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.decimalType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): DecimalSimpleType);
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

  it('should have decimal places assigned', () => {
    expect(createdSimpleType.decimalPlaces).toBe(decimalPlaces);
  });

  it('should not have total digits assigned', () => {
    expect(createdSimpleType.totalDigits).toBe('');
  });
});

describe('when enhancing generated decimal type with total digits only', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const totalDigits: string = '5';
  let enhancedItem: DecimalType;
  let createdSimpleType: DecimalSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDecimalType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      totalDigits,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.decimalType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): DecimalSimpleType);
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

  it('should not have decimal places assigned', () => {
    expect(createdSimpleType.decimalPlaces).toBe('');
  });

  it('should have total digits assigned', () => {
    expect(createdSimpleType.totalDigits).toBe(totalDigits);
  });
});

describe('when enhancing non-generated decimal type with no restrictions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: DecimalType;
  let createdSimpleType: DecimalSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDecimalType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.decimalType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): DecimalSimpleType);
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

  it('should not have decimal places assigned', () => {
    expect(createdSimpleType.decimalPlaces).toBe('');
  });

  it('should not have total digits assigned', () => {
    expect(createdSimpleType.totalDigits).toBe('');
  });
});

describe('when enhancing generated decimal type with no restrictions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: DecimalType;
  let createdSimpleType: DecimalSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newDecimalType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.decimalType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): DecimalSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBe(NoSimpleType);
  });
});
