/* eslint-disable no-underscore-dangle */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  ChoiceBuilder,
  CommonBuilder,
  CommonSubclassBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntitySubclassBuilder,
  DescriptorBuilder,
  EnumerationBuilder,
  newPluginEnvironment,
  DomainEntityExtensionBuilder,
  newNamespace,
  AssociationBuilder,
  CommonExtensionBuilder,
  AssociationExtensionBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
  domainEntityExtensionBaseClassEnhancer,
  associationReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as decimalPropertyValidationInfoEnhancer } from '../../../src/enhancer/DecimalPropertyValidationInfoEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance as commonExtensionOverrideResolverEnhancer } from '../../../src/enhancer/CommonExtensionOverrideResolverEnhancer';
import { enhance as flatteningTableMetadataEnhancer } from '../../../src/enhancer/flattening/FlatteningTableMetadataEnhancer';
import { enhance as flatteningAbstractResourceConsolidatorEnhancer } from '../../../src/enhancer/flattening/AbstractResourceFlatteningMetadataEnhancer';

function runApiSchemaPrerequisites(metaEd: MetaEdEnvironment): void {
  // Core reference wiring
  domainEntityReferenceEnhancer(metaEd);
  associationReferenceEnhancer(metaEd);
  choiceReferenceEnhancer(metaEd);
  inlineCommonReferenceEnhancer(metaEd);
  commonReferenceEnhancer(metaEd);
  commonSubclassBaseClassEnhancer(metaEd);
  descriptorReferenceEnhancer(metaEd);
  enumerationReferenceEnhancer(metaEd);
  domainEntitySubclassBaseClassEnhancer(metaEd);
  domainEntityExtensionBaseClassEnhancer(metaEd);

  // Data initialization
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);

  // Naming collisions
  subclassPropertyNamingCollisionEnhancer(metaEd);

  // Property collection and mapping
  referenceComponentEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);

  // JsonPath and validation metadata
  allJsonPathsMappingEnhancer(metaEd);
  mergeJsonPathsMappingEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  decimalPropertyValidationInfoEnhancer(metaEd);
  typeCoercionJsonPathsEnhancer(metaEd);

  // Extension overrides
  commonExtensionOverrideResolverEnhancer(metaEd);

  // Flattening metadata
  flatteningTableMetadataEnhancer(metaEd);
  flatteningAbstractResourceConsolidatorEnhancer(metaEd);
}

describe('when building simple domain entity with all the simple non-collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('OptionalBooleanProperty', 'doc1', false, false)
      .withCurrencyProperty('RequiredCurrencyProperty', 'doc2', true, false)
      .withDecimalProperty('OptionalDecimalProperty', 'doc3', false, false, '2', '1')
      .withDurationProperty('RequiredDurationProperty', 'doc4', true, false)
      .withPercentProperty('OptionalPercentProperty', 'doc5', false, false)
      .withDateProperty('RequiredDateProperty', 'doc6', true, false)
      .withDatetimeProperty('RequiredDatetimeProperty', 'doc7', true, false)
      .withIntegerProperty('RequiredIntegerProperty', 'doc8', true, false, '10', '5')
      .withShortProperty('OptionalShortProperty', 'doc9', false, false)
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withTimeProperty('RequiredTimeProperty', 'doc11', true, false)
      .withEnumerationProperty('SchoolYear', 'doc12', false, false)
      .withYearProperty('OptionalYear', 'doc13', false, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "DomainEntityName",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "OptionalBooleanProperty",
              "columnType": "boolean",
              "isRequired": false,
              "jsonPath": "$.optionalBooleanProperty",
            },
            Object {
              "columnName": "RequiredCurrencyProperty",
              "columnType": "currency",
              "isRequired": true,
              "jsonPath": "$.requiredCurrencyProperty",
            },
            Object {
              "columnName": "OptionalDecimalProperty",
              "columnType": "decimal",
              "isRequired": false,
              "jsonPath": "$.optionalDecimalProperty",
              "precision": "2",
              "scale": "1",
            },
            Object {
              "columnName": "RequiredDurationProperty",
              "columnType": "duration",
              "isRequired": true,
              "jsonPath": "$.requiredDurationProperty",
            },
            Object {
              "columnName": "OptionalPercentProperty",
              "columnType": "percent",
              "isRequired": false,
              "jsonPath": "$.optionalPercentProperty",
            },
            Object {
              "columnName": "RequiredDateProperty",
              "columnType": "date",
              "isRequired": true,
              "jsonPath": "$.requiredDateProperty",
            },
            Object {
              "columnName": "RequiredDatetimeProperty",
              "columnType": "datetime",
              "isRequired": true,
              "jsonPath": "$.requiredDatetimeProperty",
            },
            Object {
              "columnName": "RequiredIntegerProperty",
              "columnType": "integer",
              "isRequired": true,
              "jsonPath": "$.requiredIntegerProperty",
            },
            Object {
              "columnName": "OptionalShortProperty",
              "columnType": "integer",
              "isRequired": false,
              "jsonPath": "$.optionalShortProperty",
            },
            Object {
              "columnName": "StringIdentity",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.stringIdentity",
              "maxLength": "30",
            },
            Object {
              "columnName": "RequiredTimeProperty",
              "columnType": "time",
              "isRequired": true,
              "jsonPath": "$.requiredTimeProperty",
            },
            Object {
              "columnName": "SchoolYear",
              "columnType": "integer",
              "isRequired": false,
              "jsonPath": "$.schoolYearTypeReference.schoolYear",
            },
            Object {
              "columnName": "OptionalYear",
              "columnType": "year",
              "isRequired": false,
              "jsonPath": "$.optionalYear",
            },
          ],
        },
      }
    `);
  });
});

describe('when building simple domain entity with all the simple collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('OptionalBooleanProperty', 'doc1', false, true)
      .withCurrencyProperty('RequiredCurrencyProperty', 'doc2', true, true)
      .withDecimalProperty('OptionalDecimalProperty', 'doc3', false, true, '2', '1')
      .withDurationProperty('RequiredDurationProperty', 'doc4', true, true)
      .withPercentProperty('OptionalPercentProperty', 'doc5', false, true)
      .withDateProperty('RequiredDateProperty', 'doc6', true, true)
      .withDatetimeProperty('RequiredDatetimeProperty', 'doc7', true, true)
      .withIntegerProperty('RequiredIntegerProperty', 'doc8', true, true, '10', '5')
      .withShortProperty('OptionalShortProperty', 'doc9', false, true)
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withStringProperty('RequiredStringProperty', 'doc11', true, true, '31', '21')
      .withTimeProperty('RequiredTimeProperty', 'doc12', true, true)
      .withEnumerationProperty('SchoolYear', 'doc13', false, true)
      .withYearProperty('OptionalYear', 'doc14', false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "DomainEntityName",
          "childTables": Array [
            Object {
              "baseName": "DomainEntityNameOptionalBooleanProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "OptionalBooleanProperty",
                  "columnType": "boolean",
                  "isRequired": false,
                  "jsonPath": "$.optionalBooleanProperties[*].optionalBooleanProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameRequiredCurrencyProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "RequiredCurrencyProperty",
                  "columnType": "currency",
                  "isRequired": false,
                  "jsonPath": "$.requiredCurrencyProperties[*].requiredCurrencyProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameOptionalDecimalProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "OptionalDecimalProperty",
                  "columnType": "decimal",
                  "isRequired": false,
                  "jsonPath": "$.optionalDecimalProperties[*].optionalDecimalProperty",
                  "precision": "2",
                  "scale": "1",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameRequiredDurationProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "RequiredDurationProperty",
                  "columnType": "duration",
                  "isRequired": false,
                  "jsonPath": "$.requiredDurationProperties[*].requiredDurationProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameOptionalPercentProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "OptionalPercentProperty",
                  "columnType": "percent",
                  "isRequired": false,
                  "jsonPath": "$.optionalPercentProperties[*].optionalPercentProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameRequiredDateProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "RequiredDateProperty",
                  "columnType": "date",
                  "isRequired": false,
                  "jsonPath": "$.requiredDateProperties[*].requiredDateProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameRequiredDatetimeProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "RequiredDatetimeProperty",
                  "columnType": "datetime",
                  "isRequired": false,
                  "jsonPath": "$.requiredDatetimeProperties[*].requiredDatetimeProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameRequiredIntegerProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "RequiredIntegerProperty",
                  "columnType": "integer",
                  "isRequired": false,
                  "jsonPath": "$.requiredIntegerProperties[*].requiredIntegerProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameOptionalShortProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "OptionalShortProperty",
                  "columnType": "integer",
                  "isRequired": false,
                  "jsonPath": "$.optionalShortProperties[*].optionalShortProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameRequiredStringProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "RequiredStringProperty",
                  "columnType": "string",
                  "isRequired": false,
                  "jsonPath": "$.requiredStringProperties[*].requiredStringProperty",
                  "maxLength": "31",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameRequiredTimeProperty",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "RequiredTimeProperty",
                  "columnType": "time",
                  "isRequired": false,
                  "jsonPath": "$.requiredTimeProperties[*].requiredTimeProperty",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameSchoolYear",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "SchoolYear",
                  "columnType": "integer",
                  "isRequired": false,
                  "jsonPath": "$.schoolYearTypeReference[*].schoolYear",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "DomainEntityNameOptionalYear",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "OptionalYear",
                  "columnType": "year",
                  "isRequired": false,
                  "jsonPath": "$.optionalYears[*].optionalYear",
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "StringIdentity",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.stringIdentity",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe('when building a domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withDomainEntityProperty('ClassPeriod', 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "DomainEntityName",
          "childTables": Array [
            Object {
              "baseName": "DomainEntityNameClassPeriod",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "ClassPeriod_Id",
                  "columnType": "bigint",
                  "fromReferencePath": "ClassPeriod",
                  "isRequired": true,
                },
                Object {
                  "columnName": "DomainEntityName_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "SectionIdentifier",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.sectionIdentifier",
              "maxLength": "30",
            },
            Object {
              "columnName": "CourseOffering_Id",
              "columnType": "bigint",
              "fromReferencePath": "CourseOffering",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "CourseOffering",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "LocalCourseCode",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.localCourseCode",
              "maxLength": "30",
            },
            Object {
              "columnName": "School_Id",
              "columnType": "bigint",
              "fromReferencePath": "School",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for ClassPeriod', () => {
    const entity = namespace.entity.domainEntity.get('ClassPeriod');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "ClassPeriod",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "ClassPeriodName",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.classPeriodName",
              "maxLength": "30",
            },
            Object {
              "columnName": "School_Id",
              "columnType": "bigint",
              "fromReferencePath": "School",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "School",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "SchoolId",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.schoolId",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe('when building a domain entity referencing CourseOffering with an implicit merge between School and Session.School', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc', '30')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "DomainEntityName",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "SectionIdentifier",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.sectionIdentifier",
              "maxLength": "30",
            },
            Object {
              "columnName": "CourseOffering_Id",
              "columnType": "bigint",
              "fromReferencePath": "CourseOffering",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "CourseOffering",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "LocalCourseCode",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.localCourseCode",
              "maxLength": "30",
            },
            Object {
              "columnName": "School_Id",
              "columnType": "bigint",
              "fromReferencePath": "School",
              "isNaturalKey": true,
              "isRequired": true,
            },
            Object {
              "columnName": "Session_Id",
              "columnType": "bigint",
              "fromReferencePath": "Session",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for Session', () => {
    const entity = namespace.entity.domainEntity.get('Session');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Session",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "SessionName",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.sessionName",
              "maxLength": "30",
            },
            Object {
              "columnName": "SchoolYear",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.schoolYearTypeReference.schoolYear",
            },
            Object {
              "columnName": "School_Id",
              "columnType": "bigint",
              "fromReferencePath": "School",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "School",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "SchoolId",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.schoolId",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with nested choice and inline commons', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withChoiceProperty('LearningResourceChoice', 'doc', true, false)
      .withStringProperty('RequiredURI', 'doc', true, true, '30')
      .withEndDomainEntity()

      .withStartChoice('LearningResourceChoice')
      .withDocumentation('doc')
      .withStringProperty('LearningResourceMetadataURI', 'doc', true, false, '30')
      .withInlineCommonProperty('LearningResource', 'doc', true, false)
      .withEndChoice()

      .withStartDescriptor('ContentClass')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartInlineCommon('LearningResource')
      .withDocumentation('doc')
      .withStringProperty('Description', 'doc', false, false, '30')
      .withStringProperty('ShortDescription', 'doc', true, false, '30')
      .withDescriptorProperty('ContentClass', 'doc', true, false)
      .withInlineCommonProperty('EducationContentSource', 'doc', false, false, 'DerivativeSource')
      .withEndInlineCommon()

      .withStartInlineCommon('EducationContentSource')
      .withDocumentation('doc')
      .withDomainEntityProperty('EducationContent', 'doc', false, true)
      .withStringProperty('URI', 'doc', false, true, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "EducationContent",
          "childTables": Array [
            Object {
              "baseName": "EducationContentDerivativeSourceEducationContent",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "DerivativeSource_EducationContent_Id",
                  "columnType": "bigint",
                  "fromReferencePath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent",
                  "isRequired": true,
                },
                Object {
                  "columnName": "EducationContent_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "EducationContentDerivativeSourceURI",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "DerivativeSourceURI",
                  "columnType": "string",
                  "isRequired": false,
                  "jsonPath": "$.derivativeSourceURIs[*].derivativeSourceURI",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "EducationContent_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "EducationContentRequiredURI",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "RequiredURI",
                  "columnType": "string",
                  "isRequired": false,
                  "jsonPath": "$.requiredURIs[*].requiredURI",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "EducationContent_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "ContentIdentifier",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.contentIdentifier",
              "maxLength": "30",
            },
            Object {
              "columnName": "LearningResourceMetadataURI",
              "columnType": "string",
              "isRequired": true,
              "jsonPath": "$.learningResourceMetadataURI",
              "maxLength": "30",
            },
            Object {
              "columnName": "Description",
              "columnType": "string",
              "isRequired": false,
              "jsonPath": "$.description",
              "maxLength": "30",
            },
            Object {
              "columnName": "ShortDescription",
              "columnType": "string",
              "isRequired": true,
              "jsonPath": "$.shortDescription",
              "maxLength": "30",
            },
            Object {
              "columnName": "ContentClass",
              "columnType": "descriptor",
              "isRequired": true,
              "jsonPath": "$.contentClassDescriptor",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with scalar collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withStringProperty(`${domainEntityName}SuffixName`, 'doc', true, true, '30')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema - parent name prefix removed on array only', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "EducationContent",
          "childTables": Array [
            Object {
              "baseName": "EducationContentEducationContentSuffixName",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "EducationContentSuffixName",
                  "columnType": "string",
                  "isRequired": false,
                  "jsonPath": "$.suffixNames[*].educationContentSuffixName",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "EducationContent_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "ContentIdentifier",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.contentIdentifier",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with Association/DomainEntity collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withDomainEntityProperty(`${domainEntityName}SuffixName`, 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity(`${domainEntityName}SuffixName`)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema - parent name prefix retained', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "EducationContent",
          "childTables": Array [
            Object {
              "baseName": "EducationContentEducationContentSuffixName",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "EducationContentSuffixName_Id",
                  "columnType": "bigint",
                  "fromReferencePath": "EducationContentSuffixName",
                  "isRequired": true,
                },
                Object {
                  "columnName": "EducationContent_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "ContentIdentifier",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.contentIdentifier",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for EducationContentSuffixName', () => {
    const entity = namespace.entity.domainEntity.get(`${domainEntityName}SuffixName`);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "EducationContentSuffixName",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "StringIdentity",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.stringIdentity",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with acronym property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'StudentSpecialEducationProgramAssociation';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withDatetimeIdentity(`IEPBeginDate`, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema - acronym with correct casing', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "StudentSpecialEducationProgramAssociation",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "ContentIdentifier",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.contentIdentifier",
              "maxLength": "30",
            },
            Object {
              "columnName": "IEPBeginDate",
              "columnType": "datetime",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.iepBeginDate",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with a simple common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('AssessmentIdentificationCode', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('AssessmentIdentificationCode')
      .withDocumentation('doc')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDescriptorIdentity('AssessmentIdentificationSystem', 'doc')
      .withEndCommon()

      .withStartDescriptor('AssessmentIdentificationSystem')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Assessment",
          "childTables": Array [
            Object {
              "baseName": "AssessmentAssessmentIdentificationCode",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "IdentificationCode",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.identificationCodes[*].identificationCode",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "AssessmentIdentificationSystem",
                  "columnType": "descriptor",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$.identificationCodes[*].assessmentIdentificationSystemDescriptor",
                },
                Object {
                  "columnName": "Assessment_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "AssessmentIdentifier",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentIdentifier",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity subclass with common collection and descriptor identity in superclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntitySubclassName = 'CommunityOrganization';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withCommonProperty('EducationOrganizationIdentificationCode', 'doc', false, true)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('CommunityOrganizationId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withStartCommon('EducationOrganizationIdentificationCode')
      .withDocumentation('doc')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDescriptorIdentity('EducationOrganizationIdentificationSystem', 'doc')
      .withEndCommon()

      .withStartDescriptor('EducationOrganizationIdentificationSystem')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "CommunityOrganization",
          "childTables": Array [
            Object {
              "baseName": "CommunityOrganizationEducationOrganizationIdentificationCode",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "IdentificationCode",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.identificationCodes[*].identificationCode",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "EducationOrganizationIdentificationSystem",
                  "columnType": "descriptor",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$.identificationCodes[*].educationOrganizationIdentificationSystemDescriptor",
                },
                Object {
                  "columnName": "CommunityOrganization_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "CommunityOrganizationId",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "isSuperclassIdentity": true,
              "jsonPath": "$.communityOrganizationId",
            },
          ],
          "discriminatorValue": "CommunityOrganization",
        },
      }
    `);
  });
});

describe('when building association with a common collection in a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentEducationOrganizationAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withCommonProperty('Address', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('Address')
      .withDocumentation('doc')
      .withStringProperty('StreetNumberName', 'doc', true, false, '30')
      .withCommonProperty('Period', 'doc', false, true)
      .withEndCommon()

      .withStartCommon('Period')
      .withDocumentation('doc')
      .withIntegerIdentity('BeginDate', 'doc')
      .withIntegerProperty('EndDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "StudentEducationOrganizationAssociation",
          "childTables": Array [
            Object {
              "baseName": "StudentEducationOrganizationAssociationAddress",
              "childTables": Array [
                Object {
                  "baseName": "StudentEducationOrganizationAssociationAddressPeriod",
                  "childTables": Array [],
                  "columns": Array [
                    Object {
                      "columnName": "BeginDate",
                      "columnType": "integer",
                      "isNaturalKey": true,
                      "isRequired": true,
                      "jsonPath": "$.addresses[*].periods[*].beginDate",
                    },
                    Object {
                      "columnName": "EndDate",
                      "columnType": "integer",
                      "isRequired": false,
                      "jsonPath": "$.addresses[*].periods[*].endDate",
                    },
                    Object {
                      "columnName": "StudentEducationOrganizationAssociationAddress_Id",
                      "columnType": "bigint",
                      "isParentReference": true,
                      "isRequired": true,
                    },
                  ],
                },
              ],
              "columns": Array [
                Object {
                  "columnName": "StreetNumberName",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.addresses[*].streetNumberName",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "StudentEducationOrganizationAssociation_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "StudentId",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.studentId",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with a descriptor with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withDescriptorProperty('GradeLevel', 'doc', false, false, 'Assessed')
      .withEndDomainEntity()

      .withStartDescriptor('GradeLevel')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Assessment",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "AssessmentIdentifier",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentIdentifier",
            },
            Object {
              "columnName": "AssessedGradeLevel",
              "columnType": "descriptor",
              "isRequired": false,
              "jsonPath": "$.assessedGradeLevelDescriptor",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with a descriptor collection with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withDescriptorProperty('GradeLevel', 'doc', false, true, 'Assessed')
      .withEndDomainEntity()

      .withStartDescriptor('GradeLevel')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Assessment",
          "childTables": Array [
            Object {
              "baseName": "AssessmentAssessedGradeLevel",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "AssessedGradeLevel",
                  "columnType": "descriptor",
                  "isRequired": false,
                  "jsonPath": "$.assessedGradeLevels[*].gradeLevelDescriptor",
                },
                Object {
                  "columnName": "Assessment_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "AssessmentIdentifier",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentIdentifier",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with a common with a choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('ContentStandard', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('ContentStandard')
      .withDocumentation('doc')
      .withStringProperty('Title', 'doc', false, false, '30')
      .withChoiceProperty('PublicationDateChoice', 'doc', false, false)
      .withEndCommon()

      .withStartChoice('PublicationDateChoice')
      .withDocumentation('doc')
      .withStringProperty('PublicationDate', 'doc', true, false, '30')
      .withStringProperty('PublicationYear', 'doc', true, false, '30')
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Assessment",
          "childTables": Array [
            Object {
              "baseName": "AssessmentContentStandard",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "Title",
                  "columnType": "string",
                  "isRequired": false,
                  "jsonPath": "$.contentStandard.title",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "PublicationDate",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.contentStandard.publicationDate",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "PublicationYear",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.contentStandard.publicationYear",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "Assessment_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "AssessmentIdentifier",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentIdentifier",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with a common and a common collection with parent entity prefix', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('AssessmentScore', 'doc', true, true)
      .withCommonProperty('AssessmentPeriod', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('AssessmentScore')
      .withDocumentation('doc')
      .withStringProperty('MinimumScore', 'doc', true, false, '30')
      .withEndCommon()

      .withStartCommon('AssessmentPeriod')
      .withDocumentation('doc')
      .withStringProperty('BeginDate', 'doc', false, false, '30')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Assessment",
          "childTables": Array [
            Object {
              "baseName": "AssessmentAssessmentScore",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "MinimumScore",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.scores[*].minimumScore",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "Assessment_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "AssessmentAssessmentPeriod",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "BeginDate",
                  "columnType": "string",
                  "isRequired": false,
                  "jsonPath": "$.period.beginDate",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "Assessment_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "AssessmentIdentifier",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentIdentifier",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with an all-caps property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withStringProperty('URI', 'doc', false, false, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Assessment",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "AssessmentIdentifier",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentIdentifier",
            },
            Object {
              "columnName": "URI",
              "columnType": "string",
              "isRequired": false,
              "jsonPath": "$.uri",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with a common with a domain entity reference with a role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('ContentStandard', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('ContentStandard')
      .withDocumentation('doc')
      .withStringProperty('Title', 'doc', false, false, '30')
      .withDomainEntityProperty('EducationOrganization', 'doc', false, false, false, 'Mandating')
      .withEndCommon()

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Assessment",
          "childTables": Array [
            Object {
              "baseName": "AssessmentContentStandard",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "Title",
                  "columnType": "string",
                  "isRequired": false,
                  "jsonPath": "$.contentStandard.title",
                  "maxLength": "30",
                },
                Object {
                  "columnName": "Mandating_EducationOrganization_Id",
                  "columnType": "bigint",
                  "fromReferencePath": "ContentStandard.MandatingEducationOrganization",
                  "isRequired": false,
                },
                Object {
                  "columnName": "Assessment_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "AssessmentIdentifier",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentIdentifier",
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for EducationOrganization', () => {
    const entity = namespace.entity.domainEntity.get('EducationOrganization');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "EducationOrganization",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "EducationOrganizationId",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.educationOrganizationId",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with two school year enumerations, one role named', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentSchoolAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEnumerationProperty('SchoolYear', 'doc', false, false)
      .withEnumerationProperty('SchoolYear', 'doc', false, false, 'ClassOf')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "StudentSchoolAssociation",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "SchoolId",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.schoolId",
            },
            Object {
              "columnName": "SchoolYear",
              "columnType": "integer",
              "isRequired": false,
              "jsonPath": "$.schoolYearTypeReference.schoolYear",
            },
            Object {
              "columnName": "ClassOfSchoolYear",
              "columnType": "integer",
              "isRequired": false,
              "jsonPath": "$.classOfSchoolYearTypeReference.schoolYear",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with reference to domain entity with school year enumeration as part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentSchoolAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withDomainEntityProperty('Calendar', 'doc', false, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Calendar')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withIdentityProperty('enumeration', 'SchoolYear', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "StudentSchoolAssociation",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "SchoolId",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.schoolId",
            },
            Object {
              "columnName": "Calendar_Id",
              "columnType": "bigint",
              "fromReferencePath": "Calendar",
              "isRequired": false,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for Calendar', () => {
    const entity = namespace.entity.domainEntity.get('Calendar');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Calendar",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "SchoolId",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.schoolId",
            },
            Object {
              "columnName": "SchoolYear",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.schoolYearTypeReference.schoolYear",
            },
          ],
        },
      }
    `);
  });
});

describe('when building a descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor('GradeLevel')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));
    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.descriptor.get('GradeLevel');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`undefined`);
  });
});

describe('when building a school year enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.schoolYearEnumeration.get('SchoolYear');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`undefined`);
  });
});

describe('when building a schema for studentEducationOrganizationAssociation', () => {
  // The core problem addressed by this test is in RND-456: The CohortYears schoolYearTypeReference was being interpreted as
  // an integer, rather than as a SchoolYearTypeEnumeration. This test builds the minimum components of
  // studentEducationOrganizationAssociation required to duplicate the issue.

  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('StudentCohort')
      .withDocumentation('doc')
      .withCommonProperty('CohortYear', '', false, true)
      .withStringIdentity('StudentUniqueId', '', '100')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()

      .withStartCommon('CohortYear')
      .withDocumentation('doc')
      .withEnumerationIdentity('SchoolYear', '')
      .withEndCommon()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCohort');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "StudentCohort",
          "childTables": Array [
            Object {
              "baseName": "StudentCohortCohortYear",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "SchoolYear",
                  "columnType": "integer",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$.years[*].schoolYearTypeReference.schoolYear",
                },
                Object {
                  "columnName": "StudentCohort_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "StudentUniqueId",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.studentUniqueId",
              "maxLength": "100",
            },
          ],
        },
      }
    `);
  });
});

describe('when building a domain entity with an inline common property with a descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor('CreditType')
      .withDocumentation('Documentation')
      .withEndDescriptor()
      .withStartInlineCommon('Credits')
      .withDocumentation('Documentation')
      .withDescriptorProperty('CreditType', 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartDomainEntity('Section')
      .withDocumentation('Documentation')
      .withIntegerIdentity('SectionIdentifier', 'Documentation')
      .withInlineCommonProperty('Credits', 'Documentation', false, false, 'Available')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    runApiSchemaPrerequisites(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('common descriptor decollisioned top level name should be correct', () => {
    const common = namespace.entity.common.get('Credits');
    expect(common.properties[0].data.edfiApiSchema.apiMapping.decollisionedTopLevelName).toBe('CreditTypeDescriptor');
  });

  it('should be a correct schema for section', () => {
    const entity = namespace.entity.domainEntity.get('Section');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Section",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "SectionIdentifier",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.sectionIdentifier",
            },
            Object {
              "columnName": "AvailableCreditType",
              "columnType": "descriptor",
              "isRequired": false,
              "jsonPath": "$.availableCreditTypeDescriptor",
            },
          ],
        },
      }
    `);
  });
});

describe('when building a domain entity referencing another using a shortenTo directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentCompetencyObjective')
      .withDocumentation('doc')
      .withStringIdentity('Identity1', 'doc', '30')
      .withDomainEntityPropertyWithShortenTo(
        'CompetencyObjective',
        'doc',
        true,
        false,
        false,
        'CompetencyObjective',
        'Objective',
      )
      .withEndDomainEntity()

      .withStartDomainEntity('CompetencyObjective')
      .withDocumentation('doc')
      .withStringIdentity('Identity2', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "StudentCompetencyObjective",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "Identity1",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.identity1",
              "maxLength": "30",
            },
            Object {
              "columnName": "Objective_CompetencyObjective_Id",
              "columnType": "bigint",
              "fromReferencePath": "CompetencyObjective",
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for CompetencyObjective', () => {
    const entity = namespace.entity.domainEntity.get('CompetencyObjective');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "CompetencyObjective",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "Identity2",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.identity2",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe('when building a domain entity with different string properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentCompetencyObjective')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withStringProperty('StringRequired', 'doc', true, false, '30')
      .withStringProperty('StringOptional', 'doc', false, false, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "StudentCompetencyObjective",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "StringIdentity",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.stringIdentity",
              "maxLength": "30",
            },
            Object {
              "columnName": "StringRequired",
              "columnType": "string",
              "isRequired": true,
              "jsonPath": "$.stringRequired",
              "maxLength": "30",
            },
            Object {
              "columnName": "StringOptional",
              "columnType": "string",
              "isRequired": false,
              "jsonPath": "$.stringOptional",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe('when domain entity extension references domain entity in different namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const entityName = 'EntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(referencedEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('ReferencedIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityIdentity', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension')
      .withStartDomainEntityExtension(entityName)
      .withDomainEntityProperty(`EdFi.${referencedEntityName}`, 'doc', false, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(entityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "EntityNameExtension",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "ReferencedEntityName_Id",
              "columnType": "bigint",
              "fromReferencePath": "ReferencedEntityName",
              "isRequired": false,
            },
          ],
          "isExtensionTable": true,
        },
      }
    `);
  });

  it('should be a correct schema for referenced entity', () => {
    const coreNamespace = metaEd.namespace.get('EdFi');
    const entity = coreNamespace?.entity.domainEntity.get(referencedEntityName);
    expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "ReferencedEntityName",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "ReferencedIdentity",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.referencedIdentity",
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for core entity', () => {
    const coreNamespace = metaEd.namespace.get('EdFi');
    const entity = coreNamespace?.entity.domainEntity.get(entityName);
    expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "EntityName",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "EntityIdentity",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.entityIdentity",
            },
          ],
        },
      }
    `);
  });
});

describe('when building a domain entity referencing another referencing another with rolenamed identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'AssessmentAdministrationParticipation';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('AssessmentAdministrationParticipationId', 'doc', '30')
      .withDomainEntityIdentity('AssessmentAdministration', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('AssessmentAdministration')
      .withDocumentation('doc')
      .withStringIdentity('AssessmentAdministrationId', 'doc', '30')
      .withDomainEntityIdentity('EducationOrganization', 'doc', 'Assigning')
      .withEndDomainEntity()

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withStringIdentity('EducationOrganizationId', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be correct flatteningMetadata for AssessmentAdministrationParticipation', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "AssessmentAdministrationParticipation",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "AssessmentAdministrationParticipationId",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentAdministrationParticipationId",
              "maxLength": "30",
            },
            Object {
              "columnName": "AssessmentAdministration_Id",
              "columnType": "bigint",
              "fromReferencePath": "AssessmentAdministration",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be correct flatteningMetadata for AssessmentAdministration', () => {
    const entity = namespace.entity.domainEntity.get('AssessmentAdministration');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "AssessmentAdministration",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "AssessmentAdministrationId",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.assessmentAdministrationId",
              "maxLength": "30",
            },
            Object {
              "columnName": "Assigning_EducationOrganization_Id",
              "columnType": "bigint",
              "fromReferencePath": "AssigningEducationOrganization",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be correct flatteningMetadata for EducationOrganization', () => {
    const entity = namespace.entity.domainEntity.get('EducationOrganization');
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "EducationOrganization",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "EducationOrganizationId",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.educationOrganizationId",
              "maxLength": "30",
            },
          ],
        },
      }
    `);
  });
});

describe(
  'when building association with domain entity with two entities, one with role named educationOrganization and' +
    ' one with non role named educationOrganization ',
  () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartAssociation('StudentAssessmentRegistrationBatteryPartAssociation')
        .withDocumentation('doc')
        .withAssociationDomainEntityProperty('StudentAssessmentRegistration', 'doc')
        .withAssociationDomainEntityProperty('UnusedEntity', 'doc')
        .withEndAssociation()

        .withStartDomainEntity('StudentAssessmentRegistration')
        .withDocumentation('doc')
        .withDomainEntityIdentity('AssessmentAdministration', 'doc')
        .withAssociationIdentity('StudentEducationOrganizationAssociation', 'doc')
        .withEndDomainEntity()

        .withStartDomainEntity('AssessmentAdministration')
        .withDocumentation('doc')
        .withDomainEntityIdentity('EducationOrganization', 'doc', 'Assigning')
        .withEndDomainEntity()

        .withStartAssociation('StudentEducationOrganizationAssociation')
        .withDocumentation('doc')
        .withAssociationDomainEntityProperty('EducationOrganization', 'doc')
        .withAssociationDomainEntityProperty('UnusedEntity', 'doc')
        .withEndAssociation()

        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('doc')
        .withIntegerIdentity('EducationOrganizationId', 'doc')
        .withEndDomainEntity()

        .withStartDomainEntity('UnusedEntity')
        .withDocumentation('doc')
        .withStringIdentity('UnusedProperty', 'doc', '30')
        .withEndDomainEntity()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new AssociationBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      runApiSchemaPrerequisites(metaEd);
    });

    it('should be correct schema for StudentAssessmentRegistrationBatteryPartAssociation', () => {
      const entity = metaEd.namespace
        .get(namespaceName)
        ?.entity.association.get('StudentAssessmentRegistrationBatteryPartAssociation');
      const { flatteningMetadata } = entity?.data.edfiApiSchema as EntityApiSchemaData;
      expect(flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "StudentAssessmentRegistrationBatteryPartAssociation",
            "childTables": Array [],
            "columns": Array [
              Object {
                "columnName": "StudentAssessmentRegistration_Id",
                "columnType": "bigint",
                "fromReferencePath": "StudentAssessmentRegistration",
                "isNaturalKey": true,
                "isRequired": true,
              },
              Object {
                "columnName": "UnusedEntity_Id",
                "columnType": "bigint",
                "fromReferencePath": "UnusedEntity",
                "isNaturalKey": true,
                "isRequired": true,
              },
            ],
          },
        }
      `);
    });

    it('should be correct flatteningMetadata for StudentAssessmentRegistration', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessmentRegistration');
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "StudentAssessmentRegistration",
            "childTables": Array [],
            "columns": Array [
              Object {
                "columnName": "AssessmentAdministration_Id",
                "columnType": "bigint",
                "fromReferencePath": "AssessmentAdministration",
                "isNaturalKey": true,
                "isRequired": true,
              },
              Object {
                "columnName": "StudentEducationOrganizationAssociation_Id",
                "columnType": "bigint",
                "fromReferencePath": "StudentEducationOrganizationAssociation",
                "isNaturalKey": true,
                "isRequired": true,
              },
            ],
          },
        }
      `);
    });

    it('should be correct flatteningMetadata for AssessmentAdministration', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('AssessmentAdministration');
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "AssessmentAdministration",
            "childTables": Array [],
            "columns": Array [
              Object {
                "columnName": "Assigning_EducationOrganization_Id",
                "columnType": "bigint",
                "fromReferencePath": "AssigningEducationOrganization",
                "isNaturalKey": true,
                "isRequired": true,
              },
            ],
          },
        }
      `);
    });

    it('should be correct flatteningMetadata for StudentEducationOrganizationAssociation', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.association.get('StudentEducationOrganizationAssociation');
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "StudentEducationOrganizationAssociation",
            "childTables": Array [],
            "columns": Array [
              Object {
                "columnName": "EducationOrganization_Id",
                "columnType": "bigint",
                "fromReferencePath": "EducationOrganization",
                "isNaturalKey": true,
                "isRequired": true,
              },
              Object {
                "columnName": "UnusedEntity_Id",
                "columnType": "bigint",
                "fromReferencePath": "UnusedEntity",
                "isNaturalKey": true,
                "isRequired": true,
              },
            ],
          },
        }
      `);
    });

    it('should be correct flatteningMetadata for EducationOrganization', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('EducationOrganization');
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "EducationOrganization",
            "childTables": Array [],
            "columns": Array [
              Object {
                "columnName": "EducationOrganizationId",
                "columnType": "integer",
                "isNaturalKey": true,
                "isRequired": true,
                "jsonPath": "$.educationOrganizationId",
              },
            ],
          },
        }
      `);
    });

    it('should be correct flatteningMetadata for UnusedEntity', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('UnusedEntity');
      expect(entity?.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
        Object {
          "table": Object {
            "baseName": "UnusedEntity",
            "childTables": Array [],
            "columns": Array [
              Object {
                "columnName": "UnusedProperty",
                "columnType": "string",
                "isNaturalKey": true,
                "isRequired": true,
                "jsonPath": "$.unusedProperty",
                "maxLength": "30",
              },
            ],
          },
        }
      `);
    });
  },
);

describe('when building domain entity with CommonSubclass property that inherits from Common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '32')
      .withCommonProperty('Pet', 'doc', false, true)
      .withCommonProperty('AquaticPet', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('Pet')
      .withDocumentation('doc')
      .withStringProperty('PetName', 'doc', true, false, '20', '3')
      .withBooleanProperty('IsFixed', 'doc', false, false)
      .withEndCommon()

      .withStartCommonSubclass('AquaticPet', 'Pet')
      .withDocumentation('doc')
      .withIntegerProperty('MimimumTankVolume', 'doc', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should generate correct schema for domain entity with CommonSubclass property', () => {
    const entity = namespace.entity.domainEntity.get('Student');
    const schema = entity.data.edfiApiSchema.flatteningMetadata;
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Student",
          "childTables": Array [
            Object {
              "baseName": "StudentPet",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "PetName",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.pets[*].petName",
                  "maxLength": "20",
                },
                Object {
                  "columnName": "IsFixed",
                  "columnType": "boolean",
                  "isRequired": false,
                  "jsonPath": "$.pets[*].isFixed",
                },
                Object {
                  "columnName": "Student_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "StudentAquaticPet",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "MimimumTankVolume",
                  "columnType": "integer",
                  "isRequired": true,
                  "jsonPath": "$.aquaticPets[*].mimimumTankVolume",
                },
                Object {
                  "columnName": "PetName",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.aquaticPets[*].petName",
                  "maxLength": "20",
                },
                Object {
                  "columnName": "IsFixed",
                  "columnType": "boolean",
                  "isRequired": false,
                  "jsonPath": "$.aquaticPets[*].isFixed",
                },
                Object {
                  "columnName": "Student_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "StudentUniqueId",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.studentUniqueId",
              "maxLength": "32",
            },
          ],
        },
      }
    `);
  });
});

describe('when building domain entity with CommonSubclass with complex inheritance chain', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '32')
      .withCommonProperty('Vehicle', 'doc', false, true)
      .withCommonProperty('ElectricVehicle', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('Vehicle')
      .withDocumentation('doc')
      .withStringProperty('Make', 'doc', true, false, '50')
      .withStringProperty('Model', 'doc', true, false, '50')
      .withIntegerProperty('Year', 'doc', false, false)
      .withBooleanProperty('IsOperational', 'doc', false, false)
      .withEndCommon()

      .withStartCommonSubclass('ElectricVehicle', 'Vehicle')
      .withDocumentation('doc')
      .withDecimalProperty('BatteryCapacity', 'doc', true, false, '5', '2')
      .withIntegerProperty('Range', 'doc', false, false)
      .withBooleanProperty('FastChargeCapable', 'doc', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should generate correct schema with all inherited properties and correct types', () => {
    const entity = namespace.entity.domainEntity.get('School');
    const schema = entity.data.edfiApiSchema.flatteningMetadata;
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "School",
          "childTables": Array [
            Object {
              "baseName": "SchoolVehicle",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "Make",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.vehicles[*].make",
                  "maxLength": "50",
                },
                Object {
                  "columnName": "Model",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.vehicles[*].model",
                  "maxLength": "50",
                },
                Object {
                  "columnName": "Year",
                  "columnType": "integer",
                  "isRequired": false,
                  "jsonPath": "$.vehicles[*].year",
                },
                Object {
                  "columnName": "IsOperational",
                  "columnType": "boolean",
                  "isRequired": false,
                  "jsonPath": "$.vehicles[*].isOperational",
                },
                Object {
                  "columnName": "School_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
            Object {
              "baseName": "SchoolElectricVehicle",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "BatteryCapacity",
                  "columnType": "decimal",
                  "isRequired": true,
                  "jsonPath": "$.electricVehicles[*].batteryCapacity",
                  "precision": "5",
                  "scale": "2",
                },
                Object {
                  "columnName": "Range",
                  "columnType": "integer",
                  "isRequired": false,
                  "jsonPath": "$.electricVehicles[*].range",
                },
                Object {
                  "columnName": "FastChargeCapable",
                  "columnType": "boolean",
                  "isRequired": true,
                  "jsonPath": "$.electricVehicles[*].fastChargeCapable",
                },
                Object {
                  "columnName": "Make",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.electricVehicles[*].make",
                  "maxLength": "50",
                },
                Object {
                  "columnName": "Model",
                  "columnType": "string",
                  "isRequired": true,
                  "jsonPath": "$.electricVehicles[*].model",
                  "maxLength": "50",
                },
                Object {
                  "columnName": "Year",
                  "columnType": "integer",
                  "isRequired": false,
                  "jsonPath": "$.electricVehicles[*].year",
                },
                Object {
                  "columnName": "IsOperational",
                  "columnType": "boolean",
                  "isRequired": false,
                  "jsonPath": "$.electricVehicles[*].isOperational",
                },
                Object {
                  "columnName": "School_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "SchoolId",
              "columnType": "string",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.schoolId",
              "maxLength": "32",
            },
          ],
        },
      }
    `);
  });
});

describe('when domain entity extension has common extension override property with matching common extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'TestCommon';
  const domainEntityName = 'TestEntity';
  const extensionProperty = 'ExtensionProperty';
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CommonId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withStringProperty(extensionProperty, 'doc', false, false, '50')
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(core);
    extensionNamespace = metaEd.namespace.get(extension);
    extensionNamespace.dependencies.push(coreNamespace);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should include common extension schema in domain entity with extension override', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName);
    const schema = entity.data.edfiApiSchema.flatteningMetadata;
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "TestEntityExtension",
          "childTables": Array [
            Object {
              "baseName": "TestEntityExtensionTestCommon",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "CommonId",
                  "columnType": "integer",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$._ext.edfi.testCommon.commonId",
                },
                Object {
                  "columnName": "TestEntityExtension_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
              "isExtensionTable": true,
            },
          ],
          "columns": Array [],
          "isExtensionTable": true,
        },
      }
    `);
  });

  it('should be a correct schema for core TestEntity', () => {
    const entity = coreNamespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "TestEntity",
          "childTables": Array [
            Object {
              "baseName": "TestEntityTestCommon",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "CommonId",
                  "columnType": "integer",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$.testCommon.commonId",
                },
                Object {
                  "columnName": "TestEntity_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "EntityId",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.entityId",
            },
          ],
        },
      }
    `);
  });
});

describe('when association extension has common extension override property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'AssociationCommon';
  const associationName = 'TestAssociation';
  const domainEntity1 = 'Entity1';
  const domainEntity2 = 'Entity2';
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CommonId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity('Entity1Id', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity('Entity2Id', 'doc')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(domainEntity1, 'doc')
      .withAssociationDomainEntityProperty(domainEntity2, 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartAssociationExtension(`${core}.${associationName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, false)
      .withEndAssociationExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withBooleanProperty('ExtensionFlag', 'doc', false, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(core);
    extensionNamespace = metaEd.namespace.get(extension);

    extensionNamespace.dependencies.push(coreNamespace);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should include common extension schema in association with extension override', () => {
    const entity = extensionNamespace.entity.associationExtension.get(associationName);
    const schema = entity.data.edfiApiSchema.flatteningMetadata;
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "TestAssociationExtension",
          "childTables": Array [
            Object {
              "baseName": "TestAssociationExtensionAssociationCommon",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "CommonId",
                  "columnType": "integer",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$._ext.edfi.common.commonId",
                },
                Object {
                  "columnName": "TestAssociationExtension_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
              "isExtensionTable": true,
            },
          ],
          "columns": Array [],
          "isExtensionTable": true,
        },
      }
    `);
  });

  it('should be a correct schema for core association', () => {
    const entity = coreNamespace.entity.association.get(associationName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "TestAssociation",
          "childTables": Array [
            Object {
              "baseName": "TestAssociationAssociationCommon",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "CommonId",
                  "columnType": "integer",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$.common.commonId",
                },
                Object {
                  "columnName": "TestAssociation_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "Entity1_Id",
              "columnType": "bigint",
              "fromReferencePath": "Entity1",
              "isNaturalKey": true,
              "isRequired": true,
            },
            Object {
              "columnName": "Entity2_Id",
              "columnType": "bigint",
              "fromReferencePath": "Entity2",
              "isNaturalKey": true,
              "isRequired": true,
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for Entity1', () => {
    const entity = coreNamespace.entity.domainEntity.get(domainEntity1);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Entity1",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "Entity1Id",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.entity1Id",
            },
          ],
        },
      }
    `);
  });

  it('should be a correct schema for Entity2', () => {
    const entity = coreNamespace.entity.domainEntity.get(domainEntity2);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "Entity2",
          "childTables": Array [],
          "columns": Array [
            Object {
              "columnName": "Entity2Id",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.entity2Id",
            },
          ],
        },
      }
    `);
  });
});

describe('when extension override property has collection modifier', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'CollectionCommon';
  const domainEntityName = 'CollectionEntity';
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CollectionId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(commonName, 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, true)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withDecimalProperty('ExtensionAmount', 'doc', false, false, '10', '2')
      .withIntegerProperty('ExtensionCount', 'doc', true, true)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(core);
    extensionNamespace = metaEd.namespace.get(extension);

    extensionNamespace.dependencies.push(coreNamespace);

    runApiSchemaPrerequisites(metaEd);
  });
  it('should include common extension schema in domain entity with extension override', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName);
    const schema = entity.data.edfiApiSchema.flatteningMetadata;
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "CollectionEntityExtension",
          "childTables": Array [
            Object {
              "baseName": "CollectionEntityExtensionCollectionCommon",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "CollectionId",
                  "columnType": "integer",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$._ext.edfi.collectionCommons[*].collectionId",
                },
                Object {
                  "columnName": "CollectionEntityExtension_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
              "isExtensionTable": true,
            },
          ],
          "columns": Array [],
          "isExtensionTable": true,
        },
      }
    `);
  });

  it('should be a correct schema for core CollectionEntity', () => {
    const entity = coreNamespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.flatteningMetadata).toMatchInlineSnapshot(`
      Object {
        "table": Object {
          "baseName": "CollectionEntity",
          "childTables": Array [
            Object {
              "baseName": "CollectionEntityCollectionCommon",
              "childTables": Array [],
              "columns": Array [
                Object {
                  "columnName": "CollectionId",
                  "columnType": "integer",
                  "isNaturalKey": true,
                  "isRequired": true,
                  "jsonPath": "$.collectionCommons[*].collectionId",
                },
                Object {
                  "columnName": "CollectionEntity_Id",
                  "columnType": "bigint",
                  "isParentReference": true,
                  "isRequired": true,
                },
              ],
            },
          ],
          "columns": Array [
            Object {
              "columnName": "EntityId",
              "columnType": "integer",
              "isNaturalKey": true,
              "isRequired": true,
              "jsonPath": "$.entityId",
            },
          ],
        },
      }
    `);
  });
});
