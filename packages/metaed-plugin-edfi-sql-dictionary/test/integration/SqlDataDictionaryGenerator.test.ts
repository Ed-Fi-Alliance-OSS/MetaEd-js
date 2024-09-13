import { MetaEdEnvironment, GeneratorResult, SemVer } from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  EnumerationBuilder,
} from '@edfi/metaed-core';
import { initialize as initializeOdsRelationalPlugin } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as initializeOdsSqlServerPlugin } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import readXlsxFile from 'read-excel-file/node';
import { generate } from '../../src/generator/SqlDataDictionaryGenerator';
import { tablesWorksheetName } from '../../src/model/Tables';
import { columnsWorksheetName } from '../../src/model/Columns';

describe('when generating a simple sql data dictionary', (): void => {
  const dataStandardVersion: SemVer = '3.2.0-c';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };

  let generatorResults: GeneratorResult;
  let tableResultRows: any;
  let columnResultRows: any;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const enumerationBuilder = new EnumerationBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

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
      .sendToListener(domainEntityBuilder);

    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeOdsRelationalPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeOdsSqlServerPlugin().enhancer.forEach((enhance) => enhance(metaEd));

    generatorResults = await generate(metaEd);

    tableResultRows = await readXlsxFile(generatorResults.generatedOutput[0].resultStream ?? Buffer.alloc(0), {
      sheet: tablesWorksheetName,
    });

    columnResultRows = await readXlsxFile(generatorResults.generatedOutput[0].resultStream ?? Buffer.alloc(0), {
      sheet: columnsWorksheetName,
    });
  });

  it('should generate table excel sheet', (): void => {
    expect(tableResultRows).toMatchInlineSnapshot(`
      Array [
        Array [
          "Entity Name",
          "Entity Schema",
          "Entity Definition",
        ],
        Array [
          "Descriptor",
          "edfi",
          "This is the base entity for the descriptor pattern.",
        ],
        Array [
          "Entity1",
          "edfi",
          "Entity1 doc",
        ],
        Array [
          "Entity1DateCollection",
          "edfi",
          "Entity1DateCollection doc",
        ],
        Array [
          "Entity2",
          "edfi",
          "Entity2 doc",
        ],
        Array [
          "Entity2DateCollection",
          "edfi",
          "Entity2DateCollection doc",
        ],
      ]
    `);
  });

  it('should generate column excel sheet', (): void => {
    expect(columnResultRows).toMatchInlineSnapshot(`
      Array [
        Array [
          "Entity/Table Owner",
          "Table Name",
          "Column Name",
          "Attribute/Column Definition",
          "Column Data Type",
          "Column Null Option",
          "Identity",
          "Primary Key",
          "Foreign Key",
        ],
        Array [
          "edfi",
          "Descriptor",
          "CodeValue",
          "A code or abbreviation that is used to refer to the descriptor.",
          "[NVARCHAR](50)",
          "NOT NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Descriptor",
          "Description",
          "The description of the descriptor.",
          "[NVARCHAR](1024)",
          "NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Descriptor",
          "DescriptorId",
          "A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.",
          "[INT]",
          "NOT NULL",
          "Yes",
          "Yes",
          "No",
        ],
        Array [
          "edfi",
          "Descriptor",
          "EffectiveBeginDate",
          "The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.",
          "[DATE]",
          "NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Descriptor",
          "EffectiveEndDate",
          "The end date of the period when the descriptor is in effect.",
          "[DATE]",
          "NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Descriptor",
          "Namespace",
          "A globally unique namespace that identifies this descriptor set. Author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary.",
          "[NVARCHAR](255)",
          "NOT NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Descriptor",
          "PriorDescriptorId",
          "A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.",
          "[INT]",
          "NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Descriptor",
          "ShortDescription",
          "A shortened description for the descriptor.",
          "[NVARCHAR](75)",
          "NOT NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Entity1",
          "Entity1Integer",
          "Entity1Integer doc",
          "[INT]",
          "NOT NULL",
          "No",
          "Yes",
          "No",
        ],
        Array [
          "edfi",
          "Entity1",
          "Entity1String",
          "Entity1String doc",
          "[NVARCHAR](0)",
          "NOT NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Entity1DateCollection",
          "Entity1DateCollection",
          "Entity1DateCollection doc",
          "[DATE]",
          "NOT NULL",
          "No",
          "Yes",
          "No",
        ],
        Array [
          "edfi",
          "Entity1DateCollection",
          "Entity1Integer",
          "Entity1Integer doc",
          "[INT]",
          "NOT NULL",
          "No",
          "Yes",
          "Yes",
        ],
        Array [
          "edfi",
          "Entity2",
          "Entity2Integer",
          "Entity2Integer doc",
          "[INT]",
          "NOT NULL",
          "No",
          "Yes",
          "No",
        ],
        Array [
          "edfi",
          "Entity2",
          "Entity2String",
          "Entity2String doc",
          "[NVARCHAR](0)",
          "NOT NULL",
          "No",
          "No",
          "No",
        ],
        Array [
          "edfi",
          "Entity2DateCollection",
          "Entity2DateCollection",
          "Entity2DateCollection doc",
          "[DATE]",
          "NOT NULL",
          "No",
          "Yes",
          "No",
        ],
        Array [
          "edfi",
          "Entity2DateCollection",
          "Entity2Integer",
          "Entity2Integer doc",
          "[INT]",
          "NOT NULL",
          "No",
          "Yes",
          "Yes",
        ],
      ]
    `);
  });
});
