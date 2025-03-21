// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DomainEntity, DomainEntityProperty, IntegerProperty, MetaEdPropertyPath } from '@edfi/metaed-core';
import { newDomainEntity, newDomainEntityProperty, newIntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { Column } from '../../../src/model/database/Column';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for identity collection reference property', (): void => {
  let columns: Column[];

  beforeAll(() => {
    const property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'PropertyName',
      fullPropertyName: 'PropertyName',
      documentation: 'PropertyDocumentation',
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [property],
          odsIdentityProperties: [property],
        },
      },
    });

    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: 'DomainEntityProperty',
      fullPropertyName: 'DomainEntityProperty',
      referencedEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsCollection: true,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [domainEntityProperty],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      domainEntityProperty,
      BuildStrategyDefault,
      'DomainEntityProperty' as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return no columns', (): void => {
    expect(columns).toHaveLength(0);
  });
});

describe('when creating columns for identity reference property', (): void => {
  const domainEntityPropertyName = 'DomainEntityPropertyName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [property],
          odsIdentityProperties: [property],
        },
      },
    });

    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName,
      fullPropertyName: domainEntityPropertyName,
      referencedEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPropertyName,
          odsContextPrefix: '',
          odsIsCollection: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [domainEntityProperty],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      domainEntityProperty,
      BuildStrategyDefault,
      domainEntityProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].referenceContext).toBe(domainEntityPropertyName + propertyName);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"DomainEntityPropertyName.PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for identity reference properties with composite primary key', (): void => {
  const domainEntityPropertyName = 'DomainEntityPropertyName';
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';
  const propertyDocumentation = 'PropertyDocumentation';
  let property1: IntegerProperty;
  let property2: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property1 = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName1,
      fullPropertyName: propertyName1,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName1,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    property2 = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName2,
      fullPropertyName: propertyName2,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName2,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [property1, property2],
          odsIdentityProperties: [property1, property2],
        },
      },
    });

    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName,
      fullPropertyName: domainEntityPropertyName,
      referencedEntity: domainEntity,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPropertyName,
          odsContextPrefix: '',
          odsIsCollection: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [domainEntityProperty],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      domainEntityProperty,
      BuildStrategyDefault,
      domainEntityProperty.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return two columns', (): void => {
    expect(columns).toHaveLength(2);
  });

  it('should return a primary key column for first property', (): void => {
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(propertyName1);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property1);
    expect(columns[0].referenceContext).toBe(domainEntityPropertyName + propertyName1);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"DomainEntityPropertyName.PropertyName1"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });

  it('should return a primary key column for second property', (): void => {
    expect(columns[1].type).toBe('integer');
    expect(columns[1].columnId).toBe(propertyName2);
    expect(columns[1].description).toBe(propertyDocumentation);
    expect(columns[1].isNullable).toBe(false);
    expect(columns[1].isPartOfPrimaryKey).toBe(true);
    expect(columns[1].sourceEntityProperties[0]).toBe(property2);
    expect(columns[1].referenceContext).toBe(domainEntityPropertyName + propertyName2);
    expect(columns[1].propertyPath).toMatchInlineSnapshot(`"DomainEntityPropertyName.PropertyName2"`);
    expect(columns[1].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for identity reference property that references entity with identity reference property', (): void => {
  const domainEntityPropertyName1 = 'DomainEntityPropertyName1';
  const domainEntityPropertyName2 = 'DomainEntityPropertyName2';
  const propertyName1 = 'PropertyName1';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName1,
      fullPropertyName: propertyName1,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName1,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [property],
          odsIdentityProperties: [property],
        },
      },
    });

    const domainEntityProperty1: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
      fullPropertyName: domainEntityPropertyName1,
      referencedEntity: domainEntity1,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPropertyName1,
          odsContextPrefix: '',
          odsIsCollection: false,
        },
      },
    });

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [domainEntityProperty1],
          odsIdentityProperties: [domainEntityProperty1],
        },
      },
    });

    const domainEntityProperty2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName2,
      fullPropertyName: domainEntityPropertyName2,
      referencedEntity: domainEntity2,
      data: {
        edfiOdsRelational: {
          odsName: domainEntityPropertyName2,
          odsContextPrefix: '',
          odsIsCollection: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [domainEntityProperty2],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      domainEntityProperty2,
      BuildStrategyDefault,
      domainEntityProperty2.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(propertyName1);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].referenceContext).toBe(domainEntityPropertyName2 + domainEntityPropertyName1 + propertyName1);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(
      `"DomainEntityPropertyName2.DomainEntityPropertyName1.PropertyName1"`,
    );
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});
