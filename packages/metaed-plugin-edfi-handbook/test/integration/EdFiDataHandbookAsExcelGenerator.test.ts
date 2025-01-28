import {
  MetaEdEnvironment,
  GeneratorResult,
  SemVer,
  PluginEnvironment,
  newPluginEnvironment,
  SharedStringBuilder,
} from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  EnumerationBuilder,
} from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as initializeOdsRelationalPlugin } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as initializeOdsSqlServerPlugin } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { initialize as initializeApiSchemaPlugin } from '@edfi/metaed-plugin-edfi-api-schema';
import { defaultPluginTechVersion } from '@edfi/metaed-core';
import readXlsxFile from 'read-excel-file/node';
import { initialize as initializeHandbookPlugin } from '../../src/index';
import { generate } from '../../src/generator/EdFiDataHandbookAsExcelGenerator';
import { handbookWorksheetName } from '../../src/model/HandbookRow';

describe('when generating excel version of handbook', (): void => {
  const dataStandardVersion: SemVer = '3.2.0-c';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };

  let generatorResults: GeneratorResult;
  let resultRows: any;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const enumerationBuilder = new EnumerationBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartSharedString('URI')
      .withDocumentation('doc')
      .withStringRestrictions('30')
      .withEndSharedString()

      .withStartDomainEntity('Entity1')
      .withDocumentation('Entity1 doc')
      .withIntegerIdentity('Entity1Integer', 'Entity1Integer doc')
      .withStringProperty('Entity1String', 'Entity1String doc', true, false, '0', '100')
      .withDateProperty('Entity1DateCollection', 'Entity1DateCollection doc', false, true)
      .withEndDomainEntity()

      .withStartDomainEntity('Entity2')
      .withDocumentation('Entity2 doc')
      .withIntegerIdentity('Entity2Integer', 'Entity2Integer doc')
      .withStringProperty('Entity2String', 'Entity2String doc', true, false, '0', '100')
      .withDateProperty('Entity2DateCollection', 'Entity2DateCollection doc', false, true)
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(enumerationBuilder)
      .sendToListener(new SharedStringBuilder(metaEd, []))
      .sendToListener(domainEntityBuilder);

    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeOdsRelationalPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    const edfiOdsRelationalPluginEnvironment: PluginEnvironment | undefined = metaEd.plugin.get('edfiOdsRelational');
    if (edfiOdsRelationalPluginEnvironment != null)
      edfiOdsRelationalPluginEnvironment.targetTechnologyVersion = defaultPluginTechVersion;
    initializeOdsSqlServerPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    initializeApiSchemaPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeHandbookPlugin().enhancer.forEach((enhance) => enhance(metaEd));

    generatorResults = await generate(metaEd);

    resultRows = await readXlsxFile(generatorResults.generatedOutput[0].resultStream ?? Buffer.alloc(0), {
      sheet: handbookWorksheetName,
    });
  });

  it('should generate excel sheet', (): void => {
    expect(resultRows).toMatchInlineSnapshot(`
      Array [
        Array [
          "Name",
          "Definition",
          "UML Type",
          "Type Characteristics",
          "Option List",
          "References",
          "ODS",
        ],
        Array [
          "Currency",
          "U.S. currency in dollars and cents.",
          "Currency",
          null,
          null,
          null,
          "Currency [MONEY]",
        ],
        Array [
          "Entity1DateCollection",
          "Entity1DateCollection doc",
          "Date",
          null,
          null,
          "Used By:
      Entity1.Entity1DateCollection (as optional collection)",
          "Entity1DateCollection [DATE]",
        ],
        Array [
          "Entity2DateCollection",
          "Entity2DateCollection doc",
          "Date",
          null,
          null,
          "Used By:
      Entity2.Entity2DateCollection (as optional collection)",
          "Entity2DateCollection [DATE]",
        ],
        Array [
          "Entity1 (EdFi)",
          "Entity1 doc",
          "Class",
          null,
          null,
          "Contains:
      Entity1DateCollection (optional collection)
      Entity1Integer (identity)
      Entity1String (required)",
          "edfi.Entity1

      Entity1Integer [INT] NOT NULL
      Entity1String [NVARCHAR](0) NOT NULL
      CreateDate [DATETIME] NOT NULL
      LastModifiedDate [DATETIME] NOT NULL
      Id [UNIQUEIDENTIFIER] NOT NULL

      Primary Keys:
      Entity1Integer



      edfi.Entity1DateCollection

      Entity1DateCollection [DATE] NOT NULL
      Entity1Integer [INT] NOT NULL
      CreateDate [DATETIME] NOT NULL

      Primary Keys:
      Entity1DateCollection
      Entity1Integer",
        ],
        Array [
          "Entity2 (EdFi)",
          "Entity2 doc",
          "Class",
          null,
          null,
          "Contains:
      Entity2DateCollection (optional collection)
      Entity2Integer (identity)
      Entity2String (required)",
          "edfi.Entity2

      Entity2Integer [INT] NOT NULL
      Entity2String [NVARCHAR](0) NOT NULL
      CreateDate [DATETIME] NOT NULL
      LastModifiedDate [DATETIME] NOT NULL
      Id [UNIQUEIDENTIFIER] NOT NULL

      Primary Keys:
      Entity2Integer



      edfi.Entity2DateCollection

      Entity2DateCollection [DATE] NOT NULL
      Entity2Integer [INT] NOT NULL
      CreateDate [DATETIME] NOT NULL

      Primary Keys:
      Entity2DateCollection
      Entity2Integer",
        ],
        Array [
          "Percent",
          "A proportion in relation to the whole (as measured in parts per one hundred).",
          "Percent",
          null,
          null,
          null,
          "Percent [DECIMAL](5, 4)",
        ],
        Array [
          "TimeInterval",
          "A period of time with fixed, well-defined limits.",
          "TimeInterval",
          null,
          null,
          null,
          "TimeInterval [NVARCHAR](30)",
        ],
      ]
    `);
  });
});
