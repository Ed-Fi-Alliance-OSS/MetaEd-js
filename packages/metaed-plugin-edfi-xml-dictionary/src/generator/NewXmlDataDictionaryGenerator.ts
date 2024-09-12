import { MetaEdEnvironment, GeneratedOutput, GeneratorResult } from '@edfi/metaed-core';
import {
  SchemaContainer,
  SchemaSection,
  DecimalSimpleType,
  EnumerationSimpleType,
  IntegerSimpleType,
  StringSimpleType,
  EnumerationToken,
  ComplexType,
  ComplexTypeItem,
  Element,
  ElementGroup,
  NamespaceEdfiXsd,
} from '@edfi/metaed-plugin-edfi-xsd';
import { ElementsRow } from '../model/Elements';
import { ComplexTypesRow } from '../model/ComplexTypes';
import { HasName } from '../model/HasName';

type AnySimpleType = DecimalSimpleType & EnumerationSimpleType & IntegerSimpleType & StringSimpleType;
type AnyComplexTypeItem = Element & ElementGroup;

function sortByName(a: HasName, b: HasName) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

function formatRestrictions(simpleType: AnySimpleType): string {
  const result: string[] = [];
  if (simpleType.minValue) result.push(`minValue: ${simpleType.minValue}`);
  if (simpleType.maxValue) result.push(`maxValue: ${simpleType.maxValue}`);
  if (simpleType.minLength) result.push(`minLength: ${simpleType.minLength}`);
  if (simpleType.maxLength) result.push(`maxLength: ${simpleType.maxLength}`);
  if (simpleType.totalDigits) result.push(`totalDigits: ${simpleType.totalDigits}`);
  if (simpleType.decimalPlaces) result.push(`decimalPlaces: ${simpleType.decimalPlaces}`);

  if (simpleType.enumerationTokens) {
    simpleType.enumerationTokens.forEach((enumerationToken: EnumerationToken) => {
      result.push(enumerationToken.value);
    });
  }
  return result.join('\n');
}

function formatCardinality(element: Element): string {
  const result: string[] = [];
  if (element.minOccurs) result.push(`minOccurs: ${element.minOccurs}`);
  if (element.maxOccursIsUnbounded) {
    result.push('maxOccurs: unbounded');
  } else if (element.maxOccurs) {
    result.push(`maxOccurs: ${element.maxOccurs}`);
  }
  return result.join('\n');
}

interface ElementByComplexType {
  complexType: ComplexType;
  element: Element;
}

function elementFromElementGroupCollector(items: AnyComplexTypeItem[], results: Element[]) {
  items.forEach((item: AnyComplexTypeItem) => {
    if (item.items) {
      elementFromElementGroupCollector(item.items as AnyComplexTypeItem[], results);
    } else {
      results.push(item);
    }
  });
}

function elementsByComplexType(complexTypes: ComplexType[]): ElementByComplexType[] {
  const result: ElementByComplexType[] = [];
  complexTypes.forEach((complexType: ComplexType) => {
    complexType.items.forEach((item: ComplexTypeItem) => {
      // @ts-ignore - using items existence to determine if subtype is ElementGroup
      if (item.items) {
        const elements: Element[] = [];
        elementFromElementGroupCollector((item as ElementGroup).items as AnyComplexTypeItem[], elements);
        elements.forEach((element: Element) => {
          result.push({ complexType, element });
        });
      } else {
        const element = item as Element;
        result.push({ complexType, element });
      }
    });
  });

  return result;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const allComplexTypes: ComplexType[] = [];
  const allSimpleTypes: AnySimpleType[] = [];

  metaEd.namespace.forEach((namespace) => {
    const schemaContainer: SchemaContainer = (namespace.data.edfiXsd as NamespaceEdfiXsd).xsdSchema;
    schemaContainer.sections.forEach((section: SchemaSection) => {
      allComplexTypes.push(...section.complexTypes);
      const sectionSimpleTypes: AnySimpleType[] = section.simpleTypes as AnySimpleType[];
      allSimpleTypes.push(...sectionSimpleTypes);
    });
  });

  const allElementsByComplexType: ElementByComplexType[] = elementsByComplexType(allComplexTypes);

  const elementsRows: ElementsRow[] = [];

  allElementsByComplexType.forEach((elementByComplexType: ElementByComplexType) => {
    elementsRows.push({
      name: elementByComplexType.element.name,
      type: elementByComplexType.element.type,
      parentType: elementByComplexType.complexType.name,
      cardinality: formatCardinality(elementByComplexType.element),
      description: elementByComplexType.element.annotation.documentation,
    });
  });
  elementsRows.sort(sortByName);

  const complexTypesRows: ComplexTypesRow[] = [];

  allComplexTypes.forEach((complexType) => {
    complexTypesRows.push({
      name: complexType.name,
      description: complexType.annotation.documentation,
    });
  });
  complexTypesRows.sort(sortByName);

  const simpleTypesRows: SimpleTypesRow[] = [];

  allSimpleTypes.forEach((simpleType) => {
    simpleTypesRows.push({
      name: simpleType.name,
      restrictions: formatRestrictions(simpleType),
      description: simpleType.annotation.documentation,
    });
  });
  simpleTypesRows.sort(sortByName);

  eBook.sheets.push(elementsSheet);
  eBook.sheets.push(complexSheet);
  eBook.sheets.push(simpleSheet);

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'XmlDataDictionary',
      namespace: 'Documentation',
      folderName: 'DataDictionary',
      fileName: 'XmlDataDictionary.xlsx',
      resultString: '',
      resultStream: exportWorkbook(eBook, 'buffer'),
    },
  ];

  return {
    generatorName: 'edfiXmlDataDictionary.XmlDataDictionaryGenerator',
    generatedOutput,
  };
}
