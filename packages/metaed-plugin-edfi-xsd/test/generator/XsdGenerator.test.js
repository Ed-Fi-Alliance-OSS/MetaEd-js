// @flow
import xmlParser from 'xml-js';
import { newMetaEdEnvironment, newNamespaceInfo } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import {
  createElementComplexTypeItem,
  createComplexType,
  createStringSimpleType,
  createSchemaSection,
  createSchema,
} from './GeneratorTestBase';
import { generate } from '../../src/generator/XsdGenerator';

describe('when generating schema', () => {
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), {
    // dataStandardVersion: '2.1.0',
  });
  const complexTypeItemName: string = 'Element ComplexTypeItem';
  const complexTypeItemDocumentation: string = 'Element ComplexTypeItem Documentation';
  const complexTypeItemType: string = 'xs:string';
  const complexTypeName: string = 'ComplexType';
  const complexTypeDocumentation: string = 'ComplexType Documentation';
  const simpleTypeName: string = 'String SimpleType';
  const simpleTypeDocumentation: string = 'String SimpleType Documentation';
  const simpleTypeBaseType: string = 'xs:string';
  const schemaSectionDocumentation: string = 'SchemaSection Documentation';
  const schemaVersion: string = '200';
  const schemaDocumentation: string = 'Schema Documentation';

  let result;

  beforeAll(async () => {
    const element = createElementComplexTypeItem(complexTypeItemName, complexTypeItemDocumentation, complexTypeItemType);
    const complexType = createComplexType(complexTypeName, complexTypeDocumentation);
    complexType.items.push(element);
    const simpleType = createStringSimpleType(simpleTypeName, simpleTypeBaseType, simpleTypeDocumentation);
    const schemaSection = createSchemaSection(schemaSectionDocumentation);
    schemaSection.simpleTypes.push(simpleType);
    schemaSection.complexTypes.push(complexType);
    const schema = createSchema(schemaVersion, schemaDocumentation);
    schema.sections.push(schemaSection);
    const namespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'edfi',
      projectExtension: 'EXTENSION',
      data: {
        edfiXsd: {
          xsd_Schema: schema,
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    const rawXsd = (await generate(metaEd)).generatedOutput[0].resultString;
    result = xmlParser.xml2js(rawXsd);
  });

  it('should generate valid xsd', () => {
    const xsSchema = result.elements[1];

    const schemaDocumentationAnnotation = xsSchema.elements[1];
    expect(schemaDocumentationAnnotation.name).toBe('xs:annotation');
    expect(schemaDocumentationAnnotation.elements[0].name).toBe('xs:documentation');
    expect(schemaDocumentationAnnotation.elements[0].elements[0].text).toBe(schemaDocumentation);

    const schemaSectionDocumentationAnnotation = xsSchema.elements[2];
    expect(schemaSectionDocumentationAnnotation.name).toBe('xs:annotation');
    expect(schemaSectionDocumentationAnnotation.elements[0].name).toBe('xs:documentation');
    expect(schemaSectionDocumentationAnnotation.elements[0].elements[0].text).toBe(schemaSectionDocumentation);

    const complexType = xsSchema.elements[3];
    expect(complexType.name).toBe('xs:complexType');
    expect(complexType.attributes.name).toBe(complexTypeName);
    expect(complexType.elements[0].name).toBe('xs:annotation');
    expect(complexType.elements[0].elements[0].name).toBe('xs:documentation');
    expect(complexType.elements[0].elements[0].elements[0].text).toBe(complexTypeDocumentation);

    const complexTypeSequence = complexType.elements[1];
    expect(complexTypeSequence.name).toBe('xs:sequence');

    const complexTypeItem = complexTypeSequence.elements[0];
    expect(complexTypeItem.name).toBe('xs:element');
    expect(complexTypeItem.attributes.name).toBe(complexTypeItemName);
    expect(complexTypeItem.attributes.type).toBe(complexTypeItemType);

    const complexTypeItemDocumentationElement = complexTypeItem.elements[0].elements[0];
    expect(complexTypeItemDocumentationElement.name).toBe('xs:documentation');
    expect(complexTypeItemDocumentationElement.elements[0].text).toBe(complexTypeItemDocumentation);

    const simpleType = xsSchema.elements[4];
    expect(simpleType.name).toBe('xs:simpleType');
    expect(simpleType.attributes.name).toBe(simpleTypeName);
    expect(simpleType.elements[0].name).toBe('xs:annotation');
    expect(simpleType.elements[0].elements[0].name).toBe('xs:documentation');
    expect(simpleType.elements[0].elements[0].elements[0].text).toBe(simpleTypeDocumentation);

    const simpleTypeRestriction = simpleType.elements[1];
    expect(simpleTypeRestriction.name).toBe('xs:restriction');
    expect(simpleTypeRestriction.attributes.base).toBe(simpleTypeBaseType);
  });
});
