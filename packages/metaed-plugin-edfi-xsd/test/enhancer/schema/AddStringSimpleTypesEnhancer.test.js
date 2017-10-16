// @flow
import { newMetaEdEnvironment, newStringType } from '../../../../metaed-core/index';
import type { MetaEdEnvironment, StringType } from '../../../../metaed-core/index';
import type { StringSimpleType } from '../../../src/model/schema/StringSimpleType';
import { NoSimpleType } from '../../../src/model/schema/SimpleType';
import { addModelBaseEdfiXsdTo } from '../../../src/model/ModelBase';
import { enhance } from '../../../src/enhancer/schema/AddStringSimpleTypesEnhancer';

describe('when enhancing string type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const minLength: string = '1';
  const maxLength: string = '100';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newStringType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      minLength,
      maxLength,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): StringSimpleType);
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
    expect(createdSimpleType.baseType).toBe('xs:string');
  });

  it('should have max length assigned', () => {
    expect(createdSimpleType.maxLength).toBe(maxLength);
  });

  it('should have min length assigned', () => {
    expect(createdSimpleType.minLength).toBe(minLength);
  });

  it('should have name assigned', () => {
    expect(createdSimpleType.name).toBe(simpleTypeName);
  });
});

describe('when enhancing generated string type with min length only', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const minLength: string = '1';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newStringType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      minLength,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): StringSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should not have max length assigned', () => {
    expect(createdSimpleType.maxLength).toBe('');
  });

  it('should have min length assigned', () => {
    expect(createdSimpleType.minLength).toBe(minLength);
  });
});

describe('when enhancing generated string type with max length only', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  const maxLength: string = '100';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newStringType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      maxLength,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): StringSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should have max length assigned', () => {
    expect(createdSimpleType.maxLength).toBe(maxLength);
  });

  it('should not have min length assigned', () => {
    expect(createdSimpleType.minLength).toBe('');
  });
});

describe('when enhancing non-generated string type with no restrictions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newStringType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: false,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): StringSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBeDefined();
  });

  it('should not have max length assigned', () => {
    expect(createdSimpleType.maxLength).toBe('');
  });

  it('should not have min length assigned', () => {
    expect(createdSimpleType.minLength).toBe('');
  });
});

describe('when enhancing generated string type with no restrictions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const simpleTypeName: string = 'SimpleTypeName';
  const documentation: string = 'Documentation';
  let enhancedItem: StringType;
  let createdSimpleType: StringSimpleType;

  beforeAll(() => {
    enhancedItem = Object.assign(newStringType(), {
      metaEdName: simpleTypeName,
      documentation,
      generatedSimpleType: true,
      data: {
        edfiXsd: {
        },
      },
    });
    addModelBaseEdfiXsdTo(enhancedItem);
    metaEd.entity.stringType.set(enhancedItem.metaEdName, enhancedItem);

    enhance(metaEd);

    createdSimpleType = ((enhancedItem.data.edfiXsd.xsd_SimpleType: any): StringSimpleType);
  });

  it('should create simple type', () => {
    expect(createdSimpleType).toBe(NoSimpleType);
  });
});
