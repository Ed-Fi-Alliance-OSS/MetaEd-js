// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntity,
  MetaEdPropertyPath,
  newChoice,
  newChoiceProperty,
  newDomainEntity,
  newIntegerProperty,
  newStringProperty,
} from '@edfi/metaed-core';
import { Choice, ChoiceProperty, IntegerProperty, StringProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';
import { Column, StringColumn } from '../../../src/model/database/Column';

describe('when creating columns for choice with is collection property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const length = '50';
  let property: StringProperty;
  let columns: Column[];

  beforeAll(() => {
    const choiceName = 'ChoiceName';
    const choice: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName,
      data: {
        edfiOdsRelational: {
          odsTableId: choiceName,
          odsProperties: [],
        },
      },
    });

    const choiceProperty: ChoiceProperty = Object.assign(newChoiceProperty(), {
      metaEdName: choiceName,
      referencedEntity: choice,
      data: {
        edfiOdsRelational: {
          odsIsCollection: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [choiceProperty],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    property = Object.assign(newStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
          odsIsCollection: true,
        },
      },
    });

    choice.data.edfiOdsRelational.odsProperties.push(property);

    columns = createColumnFor(entity, choiceProperty, BuildStrategyDefault, '' as MetaEdPropertyPath, '7.0.0');
  });

  it('should return no columns', (): void => {
    expect(columns).toHaveLength(0);
  });
});

describe('when creating columns for choice with only one property', (): void => {
  const choiceName = 'ChoiceName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const length = '50';
  let property: StringProperty;
  let columns: Column[];

  beforeAll(() => {
    const choice: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName,
      data: {
        edfiOdsRelational: {
          odsTableId: choiceName,
          odsProperties: [],
        },
      },
    });

    const choiceProperty: ChoiceProperty = Object.assign(newChoiceProperty(), {
      metaEdName: choiceName,
      fullPropertyName: choiceName,
      referencedEntity: choice,
      data: {
        edfiOdsRelational: {
          odsIsCollection: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [choiceProperty],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    property = Object.assign(newStringProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    choice.data.edfiOdsRelational.odsProperties.push(property);

    columns = createColumnFor(entity, choiceProperty, BuildStrategyDefault, '' as MetaEdPropertyPath, '7.0.0');
  });

  it('should return a single column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).maxLength).toBe(length);
    expect(columns[0].columnId).toBe(propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for choice with two properties', (): void => {
  const choiceName = 'ChoiceName';
  const stringPropertyName = 'StringPropertyName';
  const integerPropertyName = 'IntegerPropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const length = '50';
  let stringProperty: StringProperty;
  let integerProperty: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    const choice: Choice = Object.assign(newChoice(), {
      metaEdName: choiceName,
      data: {
        edfiOdsRelational: {
          odsTableId: choiceName,
          odsProperties: [],
        },
      },
    });

    const choiceProperty: ChoiceProperty = Object.assign(newChoiceProperty(), {
      metaEdName: choiceName,
      fullPropertyName: choiceName,
      referencedEntity: choice,
      data: {
        edfiOdsRelational: {
          odsIsCollection: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [choiceProperty],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    stringProperty = Object.assign(newStringProperty(), {
      metaEdName: stringPropertyName,
      fullPropertyName: stringPropertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOdsRelational: {
          odsName: stringPropertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      fullPropertyName: integerPropertyName,
      documentation: propertyDocumentation,
      data: {
        edfiOdsRelational: {
          odsName: integerPropertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    choice.data.edfiOdsRelational.odsProperties.push(stringProperty);
    choice.data.edfiOdsRelational.odsProperties.push(integerProperty);

    columns = createColumnFor(entity, choiceProperty, BuildStrategyDefault, 'FirstLevel' as MetaEdPropertyPath, '7.0.0');
  });

  it('should return two columns', (): void => {
    expect(columns).toHaveLength(2);
  });

  it('should return a string column', (): void => {
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).maxLength).toBe(length);
    expect(columns[0].columnId).toBe(stringPropertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(stringProperty);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"FirstLevel.StringPropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });

  it('should return an integer column', (): void => {
    expect(columns[1].type).toBe('integer');
    expect(columns[1].columnId).toBe(integerPropertyName);
    expect(columns[1].description).toBe(propertyDocumentation);
    expect(columns[1].isIdentityDatabaseType).toBe(false);
    expect(columns[1].isNullable).toBe(false);
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].originalContextPrefix).toBe('');
    expect(columns[1].sourceEntityProperties[0]).toBe(integerProperty);
    expect(columns[1].propertyPath).toMatchInlineSnapshot(`"FirstLevel.IntegerPropertyName"`);
    expect(columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});
