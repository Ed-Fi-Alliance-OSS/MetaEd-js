// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  GeneratorResult,
  MetaEdEnvironment,
  NamespaceBuilder,
  DomainEntityBuilder,
  CommonBuilder,
  DomainEntitySubclassBuilder,
  SharedStringBuilder,
  SemVer,
  MetaEdTextBuilder,
  newMetaEdEnvironment,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as initializeApiSchemaPlugin } from '@edfi/metaed-plugin-edfi-api-schema';
import readXlsxFile from 'read-excel-file/node';
import type { CellValue, Row } from 'read-excel-file';
import { generate } from '../../src/generator/ApiCatalogGenerator';
import { propertiesWorksheetName, resourcesWorksheetName } from '../../src/model/ApiCatalogRow';

/**
 * Represents a single worksheet cell value returned by read-excel-file.
 */
type WorksheetCell = CellValue | null;

/**
 * Represents a worksheet row keyed by column header.
 */
type WorksheetRow = Record<string, WorksheetCell>;

/**
 * Maps worksheet rows into objects keyed by the header row.
 */
function toWorksheetRows(rows: Row[]): WorksheetRow[] {
  const [headerRow, ...valueRows] = rows;
  const headers: string[] = headerRow.map((cell) => `${cell ?? ''}`);

  return valueRows.map((valueRow) =>
    headers.reduce(
      (mappedRow: WorksheetRow, header: string, index: number): WorksheetRow => ({
        ...mappedRow,
        [header]: valueRow[index] ?? null,
      }),
      {},
    ),
  );
}

describe('when generating api catalog workbook for real-model edge cases', (): void => {
  const dataStandardVersion: SemVer = '5.2.0';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };

  let generatorResults: GeneratorResult;
  let resourceRows: WorksheetRow[];
  let propertyRows: WorksheetRow[];

  beforeAll(async () => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartSharedString('URI')
      .withDocumentation('URI doc')
      .withStringRestrictions('255')
      .withEndSharedString()

      .withStartDomainEntity('Assessment')
      .withDocumentation('Assessment doc')
      .withIntegerIdentity('AssessmentIdentifier', 'Assessment identifier doc')
      .withDomainEntityProperty('Program', 'Program doc', true, false)
      .withCommonProperty('ContentStandard', 'Content standard doc', false, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Program')
      .withDocumentation('Program doc')
      .withIntegerIdentity('ProgramId', 'Program id doc')
      .withStringIdentity('ProgramName', 'Program name doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity('Contact')
      .withDocumentation('Contact doc')
      .withStringIdentity('ContactIdentifier', 'Contact identifier doc', '30')
      .withCommonProperty('Address', 'Address doc', false, true)
      .withCommonProperty('Address', 'International address doc', false, true, 'International')
      .withEndDomainEntity()

      .withStartCommon('Address')
      .withDocumentation('Address doc')
      .withStringProperty('City', 'City doc', false, false, '75')
      .withEndCommon()

      .withStartCommon('ContentStandard')
      .withDocumentation('Content standard doc')
      .withStringProperty('Title', 'Title doc', false, false, '30')
      .withDomainEntityProperty('EducationOrganization', 'Education organization doc', false, false, false, 'Mandating')
      .withEndCommon()

      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('Education organization doc')
      .withIntegerIdentity('EducationOrganizationId', 'Education organization id doc')
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('School doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'School id doc')
      .withEndDomainEntitySubclass()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    initializeApiSchemaPlugin().enhancer.forEach((enhance) => enhance(metaEd));

    generatorResults = await generate(metaEd);

    resourceRows = toWorksheetRows(
      await readXlsxFile(generatorResults.generatedOutput[0].resultStream ?? Buffer.alloc(0), {
        sheet: resourcesWorksheetName,
      }),
    );

    propertyRows = toWorksheetRows(
      await readXlsxFile(generatorResults.generatedOutput[0].resultStream ?? Buffer.alloc(0), {
        sheet: propertiesWorksheetName,
      }),
    );
  });

  it('should generate resource rows for the modeled resources', (): void => {
    expect(
      resourceRows.map(
        (row): WorksheetRow => ({
          resourceName: row['Resource Name'],
          resourceDescription: row['Resource Description'],
        }),
      ),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "resourceDescription": "Assessment doc",
          "resourceName": "assessments",
        },
        Object {
          "resourceDescription": "Program doc",
          "resourceName": "programs",
        },
        Object {
          "resourceDescription": "Contact doc",
          "resourceName": "contacts",
        },
        Object {
          "resourceDescription": "School doc",
          "resourceName": "schools",
        },
      ]
    `);
  });

  it('should unpack reference natural keys and role-named common paths in the properties sheet', (): void => {
    expect(
      propertyRows
        .filter((row: WorksheetRow): boolean =>
          [
            'programReference',
            'programReference.programId',
            'programReference.programName',
            'contentStandard.mandatingEducationOrganizationReference',
            'contentStandard.mandatingEducationOrganizationReference.educationOrganizationId',
            'addresses',
            'address.city',
            'internationalAddresses',
            'internationalAddress.city',
          ].includes(`${row['Property Name'] ?? ''}`),
        )
        .map(
          (row: WorksheetRow): WorksheetRow => ({
            resourceName: row['Resource Name'],
            propertyName: row['Property Name'],
            description: row['Property Description'],
            dataType: row['Data Type'],
            isIdentityKey: row['Is Identity Key'],
            isRequired: row['Is Required'],
          }),
        ),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "dataType": "reference",
          "description": "#/components/schemas/EdFi_Program_Reference",
          "isIdentityKey": false,
          "isRequired": true,
          "propertyName": "programReference",
          "resourceName": "assessments",
        },
        Object {
          "dataType": "int32",
          "description": "Program id doc",
          "isIdentityKey": true,
          "isRequired": true,
          "propertyName": "programReference.programId",
          "resourceName": "assessments",
        },
        Object {
          "dataType": "string",
          "description": "Program name doc",
          "isIdentityKey": true,
          "isRequired": true,
          "propertyName": "programReference.programName",
          "resourceName": "assessments",
        },
        Object {
          "dataType": "reference",
          "description": "#/components/schemas/EdFi_EducationOrganization_Reference",
          "isIdentityKey": false,
          "isRequired": false,
          "propertyName": "contentStandard.mandatingEducationOrganizationReference",
          "resourceName": "assessments",
        },
        Object {
          "dataType": "int64",
          "description": null,
          "isIdentityKey": true,
          "isRequired": true,
          "propertyName": "contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
          "resourceName": "assessments",
        },
        Object {
          "dataType": "array",
          "description": "#/components/schemas/EdFi_Contact_Address",
          "isIdentityKey": false,
          "isRequired": false,
          "propertyName": "addresses",
          "resourceName": "contacts",
        },
        Object {
          "dataType": "string",
          "description": "City doc",
          "isIdentityKey": false,
          "isRequired": false,
          "propertyName": "address.city",
          "resourceName": "contacts",
        },
        Object {
          "dataType": "array",
          "description": "#/components/schemas/EdFi_Contact_InternationalAddress",
          "isIdentityKey": false,
          "isRequired": false,
          "propertyName": "internationalAddresses",
          "resourceName": "contacts",
        },
        Object {
          "dataType": "string",
          "description": "City doc",
          "isIdentityKey": false,
          "isRequired": false,
          "propertyName": "internationalAddress.city",
          "resourceName": "contacts",
        },
      ]
    `);
  });

  it('should not collapse role-named common properties into duplicate unqualified paths', (): void => {
    expect(propertyRows.filter((row: WorksheetRow): boolean => row['Property Name'] === 'city')).toEqual([]);
  });
});
