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
import readXlsxFile from 'read-excel-file/node';
import { generate } from '../../src/generator/XmlDataDictionaryGenerator';
import { elementsWorksheetName } from '../../src/model/Elements';
import { complexTypesWorksheetName } from '../../src/model/ComplexTypes';
import { simpleTypesWorksheetName } from '../../src/model/SimpleTypes';

describe('when generating xsd for domain entity', (): void => {
  const dataStandardVersion: SemVer = '3.2.0-c';
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion };

  let generatorResults: GeneratorResult;
  let elementsResultRows: any;
  let complexTypesResultRows: any;
  let simpleTypesResultRows: any;

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

    elementsResultRows = await readXlsxFile(generatorResults.generatedOutput[0].resultStream ?? Buffer.alloc(0), {
      sheet: elementsWorksheetName,
    });

    complexTypesResultRows = await readXlsxFile(generatorResults.generatedOutput[0].resultStream ?? Buffer.alloc(0), {
      sheet: complexTypesWorksheetName,
    });

    simpleTypesResultRows = await readXlsxFile(generatorResults.generatedOutput[0].resultStream ?? Buffer.alloc(0), {
      sheet: simpleTypesWorksheetName,
    });
  });

  it('should generate elements excel sheet', (): void => {
    expect(elementsResultRows).toMatchInlineSnapshot(`
      Array [
        Array [
          "Name",
          "Type",
          "Parent Type",
          "Cardinality",
          "Description",
        ],
        Array [
          "BeginDate",
          "xs:date",
          "DomainEntityName",
          "minOccurs: 0
      maxOccurs: unbounded",
          "The start date for the academic week.",
        ],
        Array [
          "CodeValue",
          "CodeValue",
          "DescriptorType",
          null,
          "A code or abbreviation that is used to refer to the descriptor.",
        ],
        Array [
          "Description",
          "Description",
          "DescriptorType",
          "minOccurs: 0",
          "The description of the descriptor.",
        ],
        Array [
          "DomainEntityNameIdentity",
          "DomainEntityNameIdentityType",
          "DomainEntityNameReferenceType",
          "minOccurs: 0",
          "Identity of a DomainEntityName.",
        ],
        Array [
          "EffectiveBeginDate",
          "xs:date",
          "DescriptorType",
          "minOccurs: 0",
          "The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.",
        ],
        Array [
          "EffectiveEndDate",
          "xs:date",
          "DescriptorType",
          "minOccurs: 0",
          "The end date of the period when the descriptor is in effect.",
        ],
        Array [
          "MyAddressLine",
          "MyAddressLine",
          "DomainEntityName",
          null,
          "An address line.",
        ],
        Array [
          "Namespace",
          "URI",
          "DescriptorType",
          null,
          "A globally unique identifier for this descriptor.",
        ],
        Array [
          "PriorDescriptor",
          "DescriptorReferenceType",
          "DescriptorType",
          "minOccurs: 0",
          "Immediately prior to the date in Effective Date, the reference to the equivalent descriptor.",
        ],
        Array [
          "ShortDescription",
          "ShortDescription",
          "DescriptorType",
          null,
          "A shortened description for the descriptor.",
        ],
        Array [
          "TotalInstructionalDays",
          "xs:int",
          "DomainEntityName",
          null,
          "The total instructional days during the academic week.",
        ],
        Array [
          "TotalInstructionalDays",
          "xs:int",
          "DomainEntityNameIdentityType",
          null,
          "The total instructional days during the academic week.",
        ],
      ]
    `);
  });

  it('should generate complex types excel sheet', (): void => {
    expect(complexTypesResultRows).toMatchInlineSnapshot(`
      Array [
        Array [
          "Name",
          "Description",
        ],
        Array [
          "ComplexObjectType",
          "This is the base type from which all entity elements are extended.",
        ],
        Array [
          "DescriptorType",
          "This is the base for the Descriptor type.",
        ],
        Array [
          "DomainEntityName",
          "Domain entity documentation",
        ],
        Array [
          "DomainEntityNameIdentityType",
          "Identity of a DomainEntityName.",
        ],
        Array [
          "DomainEntityNameReferenceType",
          "Provides alternative references for a DomainEntityName. Use XML IDREF to reference a record that is included in the interchange. Use the identity type to look up a record that was loaded previously.",
        ],
        Array [
          "ReferenceType",
          "This is the base type for association references.",
        ],
      ]
    `);
  });

  it('should generate simple types excel sheet', (): void => {
    expect(simpleTypesResultRows).toMatchInlineSnapshot(`
      Array [
        Array [
          "Name",
          "Restrictions",
          "Description",
        ],
        Array [
          "CodeValue",
          "minLength: 1
      maxLength: 50",
          "A code or abbreviation for an element.",
        ],
        Array [
          "Currency",
          null,
          "U.S. currency in dollars and cents.",
        ],
        Array [
          "DescriptorReferenceType",
          "minLength: 1
      maxLength: 255",
          "Provides references for descriptors represented by the full URI format.",
        ],
        Array [
          "EnumerationNameType",
          "EnumerationItem1
      EnumerationItem2
      EnumerationItem3",
          "Enumeration documentation",
        ],
        Array [
          "Percent",
          "minValue: 0
      maxValue: 1
      totalDigits: 5
      decimalPlaces: 4",
          "A proportion in relation to the whole (as measured in parts per one hundred).",
        ],
        Array [
          "TimeInterval",
          null,
          "A period of time with fixed, well-defined limits.",
        ],
      ]
    `);
  });
});
