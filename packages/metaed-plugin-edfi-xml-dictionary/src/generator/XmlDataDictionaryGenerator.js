// @flow
import type { MetaEdEnvironment, GeneratedOutput, GeneratorResult } from 'metaed-core';
import type {
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
  NamespaceInfoEdfiXsd,
} from 'metaed-plugin-edfi-xsd';

import type { Workbook } from '../model/Workbook';
import { newWorkbook, exportWorkbook } from '../model/Workbook';
import type { Row } from '../model/Row';
import { newRow, createRow, setRow } from '../model/Row';
import type { Worksheet } from '../model/Worksheet';
import { newWorksheet } from '../model/Worksheet';

type AnySimpleType = DecimalSimpleType & EnumerationSimpleType & IntegerSimpleType & StringSimpleType;
type AnyComplexTypeItem = Element & ElementGroup;

function byNameDesc(a, b) {
  if (a.Name < b.Name) return -1;
  if (a.Name > b.Name) return 1;
  return 0;
}

function formatRestrictions(simpleType: AnySimpleType): string {
  const result: Array<string> = [];
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
  const result: Array<string> = [];
  if (element.minOccurs) result.push(`minOccurs: ${element.minOccurs}`);
  if (element.maxOccursIsUnbounded) {
    result.push('maxOccurs: unbounded');
  } else if (element.maxOccurs) {
    result.push(`maxOccurs: ${element.maxOccurs}`);
  }
  return result.join('\n');
}

type ElementByComplexType = { complexType: ComplexType, element: Element };

function elementFromElementGroupCollector(items: Array<AnyComplexTypeItem>, results: Array<Element>) {
  items.forEach((item: AnyComplexTypeItem) => {
    if (item.items) {
      elementFromElementGroupCollector(((item.items: any): Array<AnyComplexTypeItem>), results);
    } else {
      results.push(item);
    }
  });
}

function elementsByComplexType(complexTypes: Array<ComplexType>): Array<ElementByComplexType> {
  const result: Array<ElementByComplexType> = [];
  complexTypes.forEach((complexType: ComplexType) => {
    complexType.items.forEach((item: ComplexTypeItem) => {
      // $FlowIgnore - using items existence to determine if subtype is ElementGroup
      if (item.items) {
        const elements: Array<Element> = [];
        elementFromElementGroupCollector(((item.items: any): Array<AnyComplexTypeItem>), elements);
        elements.forEach((element: Element) => {
          result.push({ complexType, element });
        });
      } else {
        const element = ((item: any): Element);
        result.push({ complexType, element });
      }
    });
  });

  return result;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const allComplexTypes: Array<ComplexType> = [];
  const allSimpleTypes: Array<AnySimpleType> = [];

  metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
    const schemaContainer: SchemaContainer = ((namespaceInfo.data.edfiXsd: any): NamespaceInfoEdfiXsd).xsd_Schema;
    schemaContainer.sections.forEach((section: SchemaSection) => {
      allComplexTypes.push(...section.complexTypes);
      const sectionSimpleTypes: Array<AnySimpleType> = ((section.simpleTypes: any): Array<AnySimpleType>);
      allSimpleTypes.push(...sectionSimpleTypes);
    });
  });

  const allElementsByComplexType: Array<ElementByComplexType> = elementsByComplexType(allComplexTypes);

  const eBook: Workbook = newWorkbook();

  const elementsSheet: Worksheet = newWorksheet('Elements');

  allElementsByComplexType.forEach((elementByComplexType: ElementByComplexType) => {
    const eRow: Row = newRow();
    setRow(eRow, 'Name', elementByComplexType.element.name);
    setRow(eRow, 'Type', elementByComplexType.element.type);
    setRow(eRow, 'Parent Type', elementByComplexType.complexType.name);
    setRow(eRow, 'Cardinality', formatCardinality(elementByComplexType.element));
    setRow(eRow, 'Description', elementByComplexType.element.annotation.documentation);
    elementsSheet.rows.push(createRow(eRow));
    elementsSheet.rows.sort(byNameDesc);
    elementsSheet['!cols'] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 500 }];
  });

  const complexSheet: Worksheet = newWorksheet('Complex Types');
  allComplexTypes.forEach(complexType => {
    const eRow: Row = newRow();
    setRow(eRow, 'Name', complexType.name);
    setRow(eRow, 'Description', complexType.annotation.documentation);
    complexSheet.rows.push(createRow(eRow));
    complexSheet.rows.sort(byNameDesc);
    complexSheet['!cols'] = [{ wpx: 100 }, { wpx: 500 }];
  });

  const simpleSheet: Worksheet = newWorksheet('Simple Types');
  allSimpleTypes.forEach(simpleType => {
    const eRow: Row = newRow();
    setRow(eRow, 'Name', simpleType.name);
    setRow(eRow, 'Restrictions', formatRestrictions(simpleType));
    setRow(eRow, 'Description', simpleType.annotation.documentation);
    simpleSheet.rows.push(createRow(eRow));
    simpleSheet.rows.sort(byNameDesc);
    simpleSheet['!cols'] = [{ wpx: 100 }, { wpx: 100 }, { wpx: 500 }];
  });

  eBook.sheets.push(elementsSheet);
  eBook.sheets.push(complexSheet);
  eBook.sheets.push(simpleSheet);

  const generatedOutput: Array<GeneratedOutput> = [
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
