// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  CommonBuilder,
  CommonSubclassBuilder,
  CommonExtensionBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
} from '@edfi/metaed-core';
import { commonReferenceEnhancer, commonSubclassBaseClassEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';

describe('when collecting properties for CommonSubclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon('BaseContact')
      .withDocumentation('doc')
      .withStringProperty('FirstName', 'doc', true, false, '75')
      .withStringProperty('LastName', 'doc', true, false, '75')
      .withIntegerProperty('Age', 'doc', false, false)
      .withBooleanProperty('IsActive', 'doc', true, false)
      .withEndCommon()
      .withStartCommonSubclass('BusinessContact', 'BaseContact')
      .withDocumentation('doc')
      .withStringProperty('CompanyName', 'doc', true, false, '100')
      .withStringProperty('JobTitle', 'doc', false, false, '50')
      .withBooleanProperty('IsManager', 'doc', false, false)
      .withEndCommonSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    commonReferenceEnhancer(metaEd);
    commonSubclassBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
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
});

describe('when collecting properties for CommonSubclass with complex property types', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartCommon('BaseAsset')
      .withDocumentation('doc')
      .withStringProperty('AssetName', 'doc', true, false, '100')
      .withDecimalProperty('Value', 'doc', true, false, '10', '2')
      .withDateProperty('AcquisitionDate', 'doc', false, false)
      .withEndCommon()
      .withStartCommonSubclass('TechnicalAsset', 'BaseAsset')
      .withDocumentation('doc')
      .withStringProperty('SerialNumber', 'doc', true, false, '50')
      .withDatetimeProperty('LastMaintenanceDate', 'doc', false, false)
      .withTimeProperty('OperatingHours', 'doc', false, false)
      .withEndCommonSubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

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
      .withDocumentation('doc')
      .withStringProperty('Email', 'doc', true, false, '100')
      .withStringProperty('Phone', 'doc', false, false, '20')
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

describe('when collecting properties for CommonExtension with Address/AddressExtension scenario', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreNamespaceName = 'EdFi';
  const extensionNamespaceName = 'Sample';
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartCommon('Address')
      .withDocumentation('doc')
      .withStringIdentity('City', 'doc', '30')
      .withStringProperty('StreetNumberName', 'doc', true, false, '150')
      .withStringProperty('PostalCode', 'doc', false, false, '17')
      .withStringProperty('StateAbbreviation', 'doc', false, false, '5')
      .withEndCommon()
      .withEndNamespace()
      .withBeginNamespace(extensionNamespaceName)
      .withStartCommonExtension(`${coreNamespaceName}.Address`)
      .withStringProperty('Complex', 'doc', false, false, '30')
      .withBooleanProperty('OnBusRoute', 'doc', true, false)
      .withStringProperty('SchoolDistrict', 'doc', false, true, '250')
      .withIntegerProperty('Latitude', 'doc', false, false)
      .withDecimalProperty('Longitude', 'doc', false, false, '9', '6')
      .withEndCommonExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(coreNamespaceName);
    extensionNamespace = metaEd.namespace.get(extensionNamespaceName);

    extensionNamespace.dependencies.push(coreNamespace);

    commonReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
  });

  it('should collect only base properties for base Address Common entity', () => {
    const baseAddress = coreNamespace.entity.common.get('Address');
    const apiSchemaData = baseAddress.data.edfiApiSchema as EntityApiSchemaData;

    const propertyData = {
      collectedApiPropertiesCount: apiSchemaData.collectedApiProperties.length,
      allPropertiesCount: apiSchemaData.allProperties.length,
      apiPropertyNames: apiSchemaData.collectedApiProperties.map((p) => p.property.metaEdName).sort(),
      allPropertyNames: apiSchemaData.allProperties.map((p) => p.property.metaEdName).sort(),
    };

    // Base Address should only have its own properties, not extension properties
    expect(propertyData).toMatchInlineSnapshot(`
      Object {
        "allPropertiesCount": 4,
        "allPropertyNames": Array [
          "City",
          "PostalCode",
          "StateAbbreviation",
          "StreetNumberName",
        ],
        "apiPropertyNames": Array [
          "City",
          "PostalCode",
          "StateAbbreviation",
          "StreetNumberName",
        ],
        "collectedApiPropertiesCount": 4,
      }
    `);
  });

  it('should collect only extension properties for AddressExtension CommonExtension entity', () => {
    const addressExtension = extensionNamespace.entity.commonExtension.get('Address');
    const apiSchemaData = addressExtension.data.edfiApiSchema as EntityApiSchemaData;

    const propertyData = {
      collectedApiPropertiesCount: apiSchemaData.collectedApiProperties.length,
      allPropertiesCount: apiSchemaData.allProperties.length,
      apiPropertyNames: apiSchemaData.collectedApiProperties.map((p) => p.property.metaEdName).sort(),
      allPropertyNames: apiSchemaData.allProperties.map((p) => p.property.metaEdName).sort(),
    };

    // CommonExtension entities only collect their own extension properties (not base properties)
    expect(propertyData).toMatchInlineSnapshot(`
      Object {
        "allPropertiesCount": 5,
        "allPropertyNames": Array [
          "Complex",
          "Latitude",
          "Longitude",
          "OnBusRoute",
          "SchoolDistrict",
        ],
        "apiPropertyNames": Array [
          "Complex",
          "Latitude",
          "Longitude",
          "OnBusRoute",
          "SchoolDistrict",
        ],
        "collectedApiPropertiesCount": 5,
      }
    `);
  });

  it('should correctly identify base entity names for CommonExtension', () => {
    const addressExtension = extensionNamespace.entity.commonExtension.get('Address');
    const baseAddress = coreNamespace.entity.common.get('Address');

    expect(addressExtension).toBeDefined();
    expect(baseAddress).toBeDefined();
    expect(addressExtension.metaEdName).toBe('Address');
    expect(baseAddress.metaEdName).toBe('Address');
    expect(addressExtension.baseEntityName).toBe('Address');
    expect(addressExtension.baseEntityNamespaceName).toBe('EdFi');
  });

  it('should collect only extension properties from CommonExtension entities', () => {
    const addressExtension = extensionNamespace.entity.commonExtension.get('Address');
    const apiSchemaData = addressExtension.data.edfiApiSchema as EntityApiSchemaData;

    const allPropertyNames = apiSchemaData.collectedApiProperties.map((p) => p.property.metaEdName).sort();

    // Extension properties only
    expect(allPropertyNames).toContain('Complex');
    expect(allPropertyNames).toContain('OnBusRoute');
    expect(allPropertyNames).toContain('SchoolDistrict');
    expect(allPropertyNames).toContain('Latitude');
    expect(allPropertyNames).toContain('Longitude');

    // Should not contain base properties
    expect(allPropertyNames).not.toContain('City');
    expect(allPropertyNames).not.toContain('StreetNumberName');
    expect(allPropertyNames).not.toContain('PostalCode');
    expect(allPropertyNames).not.toContain('StateAbbreviation');

    expect(allPropertyNames).toHaveLength(5);
  });
});
