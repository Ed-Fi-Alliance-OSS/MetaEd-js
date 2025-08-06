// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  CommonBuilder,
  CommonSubclassBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { commonReferenceEnhancer, commonSubclassBaseClassEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';

describe('when collecting properties for CommonSubclass with single-level inheritance', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    // Build MetaEd environment with base Common and CommonSubclass
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon('BaseContact')
      .withDocumentation('Base contact information.')
      .withStringProperty('FirstName', 'The person first name.', true, false, '75')
      .withStringProperty('LastName', 'The person last name.', true, false, '75')
      .withIntegerProperty('Age', 'The person age in years.', false, false)
      .withBooleanProperty('IsActive', 'Whether the contact is currently active.', true, false)
      .withEndCommon()
      .withStartCommonSubclass('BusinessContact', 'BaseContact')
      .withDocumentation('Business contact information extending base contact.')
      .withStringProperty('CompanyName', 'The name of the company.', true, false, '100')
      .withStringProperty('JobTitle', 'The person job title.', false, false, '50')
      .withBooleanProperty('IsManager', 'Whether the person is a manager.', false, false)
      .withEndCommonSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    // Run necessary enhancers
    commonReferenceEnhancer(metaEd);
    commonSubclassBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
  });

  it('should have correct baseEntity reference for CommonSubclass', () => {
    const commonSubclass = namespace.entity.commonSubclass.get('BusinessContact');
    const common = namespace.entity.common.get('BaseContact');

    expect(commonSubclass.baseEntity).toBe(common);
    expect(common.subclassedBy).toContain(commonSubclass);
  });

  it('should collect own properties for base Common entity', () => {
    const common = namespace.entity.common.get('BaseContact');
    const apiSchemaData = common.data.edfiApiSchema as EntityApiSchemaData;

    const propertyData = {
      collectedApiPropertiesCount: apiSchemaData.collectedApiProperties.length,
      allPropertiesCount: apiSchemaData.allProperties.length,
      apiPropertyNames: apiSchemaData.collectedApiProperties.map((p) => p.property.metaEdName).sort(),
      allPropertyNames: apiSchemaData.allProperties.map((p) => p.property.metaEdName).sort(),
    };

    expect(propertyData).toMatchInlineSnapshot(`
      Object {
        "allPropertiesCount": 4,
        "allPropertyNames": Array [
          "Age",
          "FirstName",
          "IsActive",
          "LastName",
        ],
        "apiPropertyNames": Array [
          "Age",
          "FirstName",
          "IsActive",
          "LastName",
        ],
        "collectedApiPropertiesCount": 4,
      }
    `);
  });

  it('should collect both inherited and own properties for CommonSubclass', () => {
    const commonSubclass = namespace.entity.commonSubclass.get('BusinessContact');
    const apiSchemaData = commonSubclass.data.edfiApiSchema as EntityApiSchemaData;

    const propertyData = {
      collectedApiPropertiesCount: apiSchemaData.collectedApiProperties.length,
      allPropertiesCount: apiSchemaData.allProperties.length,
      apiPropertyNames: apiSchemaData.collectedApiProperties.map((p) => p.property.metaEdName).sort(),
      allPropertyNames: apiSchemaData.allProperties.map((p) => p.property.metaEdName).sort(),
    };

    expect(propertyData).toMatchInlineSnapshot(`
      Object {
        "allPropertiesCount": 7,
        "allPropertyNames": Array [
          "Age",
          "CompanyName",
          "FirstName",
          "IsActive",
          "IsManager",
          "JobTitle",
          "LastName",
        ],
        "apiPropertyNames": Array [
          "Age",
          "CompanyName",
          "FirstName",
          "IsActive",
          "IsManager",
          "JobTitle",
          "LastName",
        ],
        "collectedApiPropertiesCount": 7,
      }
    `);
  });

  it('should preserve property types and requirements for all properties', () => {
    const commonSubclass = namespace.entity.commonSubclass.get('BusinessContact');
    const apiSchemaData = commonSubclass.data.edfiApiSchema as EntityApiSchemaData;

    const allPropertyDetails = apiSchemaData.collectedApiProperties.reduce((acc, p) => {
      acc[p.property.metaEdName] = {
        type: p.property.type,
        isRequired: p.property.isRequired,
        category: ['FirstName', 'LastName', 'Age', 'IsActive'].includes(p.property.metaEdName) ? 'inherited' : 'own',
      };
      return acc;
    }, {} as Record<string, any>);

    expect(allPropertyDetails).toMatchInlineSnapshot(`
      Object {
        "Age": Object {
          "category": "inherited",
          "isRequired": false,
          "type": "integer",
        },
        "CompanyName": Object {
          "category": "own",
          "isRequired": true,
          "type": "string",
        },
        "FirstName": Object {
          "category": "inherited",
          "isRequired": true,
          "type": "string",
        },
        "IsActive": Object {
          "category": "inherited",
          "isRequired": true,
          "type": "boolean",
        },
        "IsManager": Object {
          "category": "own",
          "isRequired": false,
          "type": "boolean",
        },
        "JobTitle": Object {
          "category": "own",
          "isRequired": false,
          "type": "string",
        },
        "LastName": Object {
          "category": "inherited",
          "isRequired": true,
          "type": "string",
        },
      }
    `);
  });

  it('should maintain correct property order with own properties first, then inherited properties', () => {
    const commonSubclass = namespace.entity.commonSubclass.get('BusinessContact');
    const apiSchemaData = commonSubclass.data.edfiApiSchema as EntityApiSchemaData;

    const propertyNames = apiSchemaData.collectedApiProperties.map((p) => p.property.metaEdName);

    // The first 3 properties should be own properties (CompanyName, JobTitle, IsManager)
    expect(propertyNames.slice(0, 3).sort()).toEqual(['CompanyName', 'IsManager', 'JobTitle']);

    // The remaining 4 properties should be inherited properties (FirstName, LastName, Age, IsActive)
    expect(propertyNames.slice(3).sort()).toEqual(['Age', 'FirstName', 'IsActive', 'LastName']);
  });

  it('should have same properties in both collectedApiProperties and allProperties arrays', () => {
    const commonSubclass = namespace.entity.commonSubclass.get('BusinessContact');
    const apiSchemaData = commonSubclass.data.edfiApiSchema as EntityApiSchemaData;

    const apiPropertyNames = apiSchemaData.collectedApiProperties.map((p) => p.property.metaEdName).sort();
    const allPropertyNames = apiSchemaData.allProperties.map((p) => p.property.metaEdName).sort();

    expect(apiPropertyNames).toEqual(allPropertyNames);
  });
});

describe('when collecting properties for CommonSubclass with complex property types', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    // Build MetaEd environment with various property types
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon('BaseAsset')
      .withDocumentation('Base asset information.')
      .withStringProperty('AssetName', 'The asset name.', true, false, '100')
      .withDecimalProperty('Value', 'The asset monetary value.', true, false, '10', '2')
      .withDateProperty('AcquisitionDate', 'When the asset was acquired.', false, false)
      .withEndCommon()
      .withStartCommonSubclass('TechnicalAsset', 'BaseAsset')
      .withDocumentation('Technical asset extending base asset.')
      .withStringProperty('SerialNumber', 'The asset serial number.', true, false, '50')
      .withDatetimeProperty('LastMaintenanceDate', 'When the asset was last maintained.', false, false)
      .withTimeProperty('OperatingHours', 'Daily operating hours.', false, false)
      .withEndCommonSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    // Run necessary enhancers
    commonReferenceEnhancer(metaEd);
    commonSubclassBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
  });

  it('should correctly handle various property types in inheritance', () => {
    const commonSubclass = namespace.entity.commonSubclass.get('TechnicalAsset');
    const apiSchemaData = commonSubclass.data.edfiApiSchema as EntityApiSchemaData;

    const propertyAnalysis = {
      totalCount: apiSchemaData.collectedApiProperties.length,
      propertyDetails: apiSchemaData.collectedApiProperties.reduce((acc, p) => {
        acc[p.property.metaEdName] = {
          type: p.property.type,
          isRequired: p.property.isRequired,
          category: ['AssetName', 'Value', 'AcquisitionDate'].includes(p.property.metaEdName) ? 'inherited' : 'own',
        };
        return acc;
      }, {} as Record<string, any>),
    };

    expect(propertyAnalysis).toMatchInlineSnapshot(`
      Object {
        "propertyDetails": Object {
          "AcquisitionDate": Object {
            "category": "inherited",
            "isRequired": false,
            "type": "date",
          },
          "AssetName": Object {
            "category": "inherited",
            "isRequired": true,
            "type": "string",
          },
          "LastMaintenanceDate": Object {
            "category": "own",
            "isRequired": false,
            "type": "datetime",
          },
          "OperatingHours": Object {
            "category": "own",
            "isRequired": false,
            "type": "time",
          },
          "SerialNumber": Object {
            "category": "own",
            "isRequired": true,
            "type": "string",
          },
          "Value": Object {
            "category": "inherited",
            "isRequired": true,
            "type": "decimal",
          },
        },
        "totalCount": 6,
      }
    `);
  });
});

describe('when collecting properties for Common entity without subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    // Build simple Common entity without subclass
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon('SimpleContact')
      .withDocumentation('Simple contact information.')
      .withStringProperty('Email', 'Email address.', true, false, '100')
      .withStringProperty('Phone', 'Phone number.', false, false, '20')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    // Run necessary enhancers
    commonReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
  });

  it('should collect only own properties for Common entity without inheritance', () => {
    const common = namespace.entity.common.get('SimpleContact');
    const apiSchemaData = common.data.edfiApiSchema as EntityApiSchemaData;

    const propertyData = {
      collectedApiPropertiesCount: apiSchemaData.collectedApiProperties.length,
      allPropertiesCount: apiSchemaData.allProperties.length,
      propertyNames: apiSchemaData.collectedApiProperties.map((p) => p.property.metaEdName).sort(),
    };

    expect(propertyData).toMatchInlineSnapshot(`
      Object {
        "allPropertiesCount": 2,
        "collectedApiPropertiesCount": 2,
        "propertyNames": Array [
          "Email",
          "Phone",
        ],
      }
    `);
  });
});
