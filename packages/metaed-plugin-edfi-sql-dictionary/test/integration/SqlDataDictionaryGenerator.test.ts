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
import { generate } from '../../src/generator/SqlDataDictionaryGenerator';
import { readWorkbook } from '../../src/model/Workbook';
import { Workbook } from '../../src/model/Workbook';

function rowToString(obj, value, i) {
  if (i > 0) return `${obj}, ${value}`;
  return value;
}

describe('when generating a simple sql data dictionary', (): void => {
  const dataStandardVersion: SemVer = '3.0.0';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };

  let generatorResults: GeneratorResult;
  let workbook: Workbook;

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
    workbook = readWorkbook(generatorResults.generatedOutput[0].resultStream, 'buffer');
  });

  it('should generate excel sheet', (): void => {
    expect(generatorResults).toBeDefined();
  });

  it('should have three sheets with the correct names', (): void => {
    expect(workbook.sheets).toHaveLength(2);
    expect(workbook.sheets[0].name).toBe('Tables');
    expect(workbook.sheets[1].name).toBe('Columns');
  });

  it('should have a Tables sheet with the correct headers', (): void => {
    expect(workbook.sheets[0].rows[0].headers).toHaveLength(3);
    expect(workbook.sheets[0].rows[0].headers[0]).toBe('Entity Name');
    expect(workbook.sheets[0].rows[0].headers[1]).toBe('Entity Schema');
    expect(workbook.sheets[0].rows[0].headers[2]).toBe('Entity Definition');
  });

  it('should have a Columns sheet with the correct headers', (): void => {
    expect(workbook.sheets[1].rows[0].headers).toHaveLength(9);
    expect(workbook.sheets[1].rows[0].headers[0]).toBe('Entity/Table Owner');
    expect(workbook.sheets[1].rows[0].headers[1]).toBe('Table Name');
    expect(workbook.sheets[1].rows[0].headers[2]).toBe('Column Name');
    expect(workbook.sheets[1].rows[0].headers[3]).toBe('Attribute/Column Definition');
    expect(workbook.sheets[1].rows[0].headers[4]).toBe('Column Data Type');
    expect(workbook.sheets[1].rows[0].headers[5]).toBe('Column Null Option');
    expect(workbook.sheets[1].rows[0].headers[6]).toBe('Identity');
    expect(workbook.sheets[1].rows[0].headers[7]).toBe('Primary Key');
    expect(workbook.sheets[1].rows[0].headers[8]).toBe('Foreign Key');
  });

  it('should have a Tables sheet with the correct rows', (): void => {
    expect(workbook.sheets[0].rows).toHaveLength(5);
    expect(workbook.sheets[0].rows[0].values.reduce(rowToString)).toBe(
      'Descriptor, edfi, This is the base entity for the descriptor pattern.',
    );
    expect(workbook.sheets[0].rows[1].values.reduce(rowToString)).toBe('Entity1, edfi, Entity1 doc');
    expect(workbook.sheets[0].rows[2].values.reduce(rowToString)).toBe(
      'Entity1DateCollection, edfi, Entity1DateCollection doc',
    );
    expect(workbook.sheets[0].rows[3].values.reduce(rowToString)).toBe('Entity2, edfi, Entity2 doc');
    expect(workbook.sheets[0].rows[4].values.reduce(rowToString)).toBe(
      'Entity2DateCollection, edfi, Entity2DateCollection doc',
    );
  });

  it('should have a Columns sheet with the correct rows', (): void => {
    expect(workbook.sheets[1].rows).toHaveLength(16);
    expect(workbook.sheets[1].rows[0].values.reduce(rowToString)).toBe(
      'edfi, Descriptor, CodeValue, A code or abbreviation that is used to refer to the descriptor., [NVARCHAR](50), NOT NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[1].values.reduce(rowToString)).toBe(
      'edfi, Descriptor, Description, The description of the descriptor., [NVARCHAR](1024), NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[2].values.reduce(rowToString)).toBe(
      'edfi, Descriptor, DescriptorId, A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table., [INT], NOT NULL, Yes, Yes, No',
    );
    expect(workbook.sheets[1].rows[3].values.reduce(rowToString)).toBe(
      'edfi, Descriptor, EffectiveBeginDate, The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness., [DATE], NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[4].values.reduce(rowToString)).toBe(
      'edfi, Descriptor, EffectiveEndDate, The end date of the period when the descriptor is in effect., [DATE], NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[5].values.reduce(rowToString)).toBe(
      'edfi, Descriptor, Namespace, A globally unique namespace that identifies this descriptor set. Author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary., [NVARCHAR](255), NOT NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[6].values.reduce(rowToString)).toBe(
      'edfi, Descriptor, PriorDescriptorId, A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table., [INT], NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[7].values.reduce(rowToString)).toBe(
      'edfi, Descriptor, ShortDescription, A shortened description for the descriptor., [NVARCHAR](75), NOT NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[8].values.reduce(rowToString)).toBe(
      'edfi, Entity1, Entity1Integer, Entity1Integer doc, [INT], NOT NULL, No, Yes, No',
    );
    expect(workbook.sheets[1].rows[9].values.reduce(rowToString)).toBe(
      'edfi, Entity1, Entity1String, Entity1String doc, [NVARCHAR](0), NOT NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[10].values.reduce(rowToString)).toBe(
      'edfi, Entity1DateCollection, Entity1DateCollection, Entity1DateCollection doc, [DATE], NOT NULL, No, Yes, No',
    );
    expect(workbook.sheets[1].rows[11].values.reduce(rowToString)).toBe(
      'edfi, Entity1DateCollection, Entity1Integer, Entity1Integer doc, [INT], NOT NULL, No, Yes, Yes',
    );
    expect(workbook.sheets[1].rows[12].values.reduce(rowToString)).toBe(
      'edfi, Entity2, Entity2Integer, Entity2Integer doc, [INT], NOT NULL, No, Yes, No',
    );
    expect(workbook.sheets[1].rows[13].values.reduce(rowToString)).toBe(
      'edfi, Entity2, Entity2String, Entity2String doc, [NVARCHAR](0), NOT NULL, No, No, No',
    );
    expect(workbook.sheets[1].rows[14].values.reduce(rowToString)).toBe(
      'edfi, Entity2DateCollection, Entity2DateCollection, Entity2DateCollection doc, [DATE], NOT NULL, No, Yes, No',
    );
    expect(workbook.sheets[1].rows[15].values.reduce(rowToString)).toBe(
      'edfi, Entity2DateCollection, Entity2Integer, Entity2Integer doc, [INT], NOT NULL, No, Yes, Yes',
    );
  });
});
