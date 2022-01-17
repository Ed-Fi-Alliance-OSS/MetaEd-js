import { MetaEdEnvironment, GeneratorResult, SemVer } from '@edfi/metaed-core';
import {
  newMetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  EnumerationBuilder,
} from '@edfi/metaed-core';
import { initialize as initializeXsdPlugin } from '@edfi/metaed-plugin-edfi-xsd';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { generate } from '../../src/generator/XmlDataDictionaryGenerator';
import { readWorkbook } from '../../src/model/Workbook';
import { Workbook } from '../../src/model/Workbook';

function rowToString(obj, value, i) {
  if (i > 0) return `${obj}, ${value}`;
  return value;
}

describe('when generating xsd for domain entity', (): void => {
  const dataStandardVersion: SemVer = '2.0.0';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };

  let generatorResults: GeneratorResult;
  let workbook: Workbook;

  beforeAll(async () => {
    const namespaceBuilder = new NamespaceBuilder(metaEd, []);
    const domainEntityBuilder = new DomainEntityBuilder(metaEd, []);
    const enumerationBuilder = new EnumerationBuilder(metaEd, []);
    MetaEdTextBuilder.build()

      .withBeginNamespace('EdFi')

      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('Domain entity documentation')
      .withIntegerIdentity('TotalInstructionalDays', 'The total instructional days during the academic week.')
      .withStringProperty('MyAddressLine', 'An address line.', true, false, '0', '100')
      .withDateProperty('BeginDate', 'The start date for the academic week.', false, true)
      .withEndDomainEntity()

      .withStartEnumeration('EnumerationName')
      .withDocumentation('Enumeration documentation')
      .withEnumerationItem('EnumerationItem1')
      .withEnumerationItem('EnumerationItem2')
      .withEnumerationItem('EnumerationItem3')
      .withEndEnumeration()

      .withEndNamespace()

      .sendToListener(namespaceBuilder)
      .sendToListener(enumerationBuilder)
      .sendToListener(domainEntityBuilder);

    initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
    initializeXsdPlugin().enhancer.forEach((enhance) => enhance(metaEd));

    generatorResults = await generate(metaEd);
    workbook = readWorkbook(generatorResults.generatedOutput[0].resultStream, 'buffer');
  });

  it('should generate excel sheet', (): void => {
    expect(generatorResults).toBeDefined();
  });

  it('should have three worksheets', (): void => {
    expect(workbook.sheets.length).toBe(3);
  });

  it('should have three sheets with the correct names', (): void => {
    expect(workbook.sheets).toHaveLength(3);
    expect(workbook.sheets[0].name).toBe('Elements');
    expect(workbook.sheets[1].name).toBe('Complex Types');
    expect(workbook.sheets[2].name).toBe('Simple Types');
  });

  it('should have an Elements sheet with the correct headers', (): void => {
    expect(workbook.sheets[0].rows[0].headers).toHaveLength(5);
    expect(workbook.sheets[0].rows[0].headers[0]).toBe('Name');
    expect(workbook.sheets[0].rows[0].headers[1]).toBe('Type');
    expect(workbook.sheets[0].rows[0].headers[2]).toBe('Parent Type');
    expect(workbook.sheets[0].rows[0].headers[3]).toBe('Cardinality');
    expect(workbook.sheets[0].rows[0].headers[4]).toBe('Description');
  });

  it('should have an Complex Types sheet with the correct headers', (): void => {
    expect(workbook.sheets[1].rows[0].headers).toHaveLength(2);
    expect(workbook.sheets[1].rows[0].headers[0]).toBe('Name');
    expect(workbook.sheets[1].rows[0].headers[1]).toBe('Description');
  });

  it('should have an Simple Types sheet with the correct headers', (): void => {
    expect(workbook.sheets[2].rows[0].headers).toHaveLength(3);
    expect(workbook.sheets[2].rows[0].headers[0]).toBe('Name');
    expect(workbook.sheets[2].rows[0].headers[1]).toBe('Restrictions');
    expect(workbook.sheets[2].rows[0].headers[2]).toBe('Description');
  });

  it('should have an Elements sheet with the correct rows', (): void => {
    expect(workbook.sheets[0].rows).toHaveLength(14);
    expect(workbook.sheets[0].rows[0].values.reduce(rowToString)).toBe(
      'BeginDate, xs:date, DomainEntityName, minOccurs: 0\nmaxOccurs: unbounded, The start date for the academic week.',
    );
    expect(workbook.sheets[0].rows[1].values.reduce(rowToString)).toBe(
      'CodeValue, CodeValue, DescriptorReferenceType, , A globally unique identifier within this descriptor type.',
    );
    expect(workbook.sheets[0].rows[2].values.reduce(rowToString)).toBe(
      'CodeValue, CodeValue, DescriptorType, , A code or abbreviation that is used to refer to the descriptor.',
    );
    expect(workbook.sheets[0].rows[3].values.reduce(rowToString)).toBe(
      'Description, Description, DescriptorType, minOccurs: 0, The description of the descriptor.',
    );
    expect(workbook.sheets[0].rows[4].values.reduce(rowToString)).toBe(
      'DomainEntityNameIdentity, DomainEntityNameIdentityType, DomainEntityNameReferenceType, minOccurs: 0, Identity of a DomainEntityName.',
    );
    expect(workbook.sheets[0].rows[5].values.reduce(rowToString)).toBe(
      'EffectiveBeginDate, xs:date, DescriptorType, minOccurs: 0, The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.',
    );
    expect(workbook.sheets[0].rows[6].values.reduce(rowToString)).toBe(
      'EffectiveEndDate, xs:date, DescriptorType, minOccurs: 0, The end date of the period when the descriptor is in effect.',
    );
    expect(workbook.sheets[0].rows[7].values.reduce(rowToString)).toBe(
      'MyAddressLine, MyAddressLine, DomainEntityName, , An address line.',
    );
    expect(workbook.sheets[0].rows[8].values.reduce(rowToString)).toBe(
      'Namespace, URI, DescriptorReferenceType, minOccurs: 0, An optional globally unique namespace that identifies this descriptor set. If supplied, the author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary. Actual usage of this element for matching descriptors will be system-specific.',
    );
    expect(workbook.sheets[0].rows[9].values.reduce(rowToString)).toBe(
      'Namespace, URI, DescriptorType, , A globally unique identifier for this descriptor.',
    );
    expect(workbook.sheets[0].rows[10].values.reduce(rowToString)).toBe(
      'PriorDescriptor, DescriptorReferenceType, DescriptorType, minOccurs: 0, Immediately prior to the date in Effective Date, the reference to the equivalent descriptor.',
    );
    expect(workbook.sheets[0].rows[11].values.reduce(rowToString)).toBe(
      'ShortDescription, ShortDescription, DescriptorType, , A shortened description for the descriptor.',
    );
    expect(workbook.sheets[0].rows[12].values.reduce(rowToString)).toBe(
      'TotalInstructionalDays, xs:int, DomainEntityName, , The total instructional days during the academic week.',
    );
    expect(workbook.sheets[0].rows[13].values.reduce(rowToString)).toBe(
      'TotalInstructionalDays, xs:int, DomainEntityNameIdentityType, , The total instructional days during the academic week.',
    );
  });

  it('should have a complex types sheet with the correct rows', (): void => {
    expect(workbook.sheets[1].rows).toHaveLength(7);
    expect(workbook.sheets[1].rows[0].values.reduce(rowToString)).toBe(
      'ComplexObjectType, This is the base type from which all entity elements are extended.',
    );
    expect(workbook.sheets[1].rows[1].values.reduce(rowToString)).toBe(
      'DescriptorReferenceType, Provides references for descriptors during interchange. Use XML IDREF to reference a descriptor record that is included in the interchange. To lookup when already loaded, specify the full URI or the final segment of the URI.',
    );
    expect(workbook.sheets[1].rows[2].values.reduce(rowToString)).toBe(
      'DescriptorType, This is the base for the Descriptor type.',
    );
    expect(workbook.sheets[1].rows[3].values.reduce(rowToString)).toBe('DomainEntityName, Domain entity documentation');
    expect(workbook.sheets[1].rows[4].values.reduce(rowToString)).toBe(
      'DomainEntityNameIdentityType, Identity of a DomainEntityName.',
    );
    expect(workbook.sheets[1].rows[5].values.reduce(rowToString)).toBe(
      'DomainEntityNameReferenceType, Provides alternative references for a DomainEntityName. Use XML IDREF to reference a record that is included in the interchange. Use the identity type to look up a record that was loaded previously.',
    );
    expect(workbook.sheets[1].rows[6].values.reduce(rowToString)).toBe(
      'ReferenceType, This is the base type for association references.',
    );
  });

  it('should have a simple types sheet with the correct rows', (): void => {
    expect(workbook.sheets[2].rows).toHaveLength(5);
    expect(workbook.sheets[2].rows[0].values.reduce(rowToString)).toBe(
      'CodeValue, minLength: 1\nmaxLength: 50, A code or abbreviation for an element.',
    );
    expect(workbook.sheets[2].rows[1].values.reduce(rowToString)).toBe('Currency, , U.S. currency in dollars and cents.');
    expect(workbook.sheets[2].rows[2].values.reduce(rowToString)).toBe(
      'EnumerationNameType, EnumerationItem1\nEnumerationItem2\nEnumerationItem3, Enumeration documentation',
    );
    expect(workbook.sheets[2].rows[3].values.reduce(rowToString)).toBe(
      'Percent, minValue: 0\nmaxValue: 1\ntotalDigits: 5\ndecimalPlaces: 4, A proportion in relation to the whole (as measured in parts per one hundred).',
    );
    expect(workbook.sheets[2].rows[4].values.reduce(rowToString)).toBe(
      'TimeInterval, , A period of time with fixed, well-defined limits.',
    );
  });
});
