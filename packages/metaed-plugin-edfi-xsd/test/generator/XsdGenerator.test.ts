import xmlParser from 'xml-js';
import { newMetaEdEnvironment, newNamespace, MetaEdEnvironment } from '@edfi/metaed-core';
import {
  createElementComplexTypeItem,
  createComplexType,
  createStringSimpleType,
  createSchemaSection,
  createSchema,
} from './GeneratorTestBase';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { generate } from '../../src/generator/XsdGenerator';

describe('when generating schema', (): void => {
  const metaEd: MetaEdEnvironment = {
    ...newMetaEdEnvironment(),
    // dataStandardVersion: '2.1.0',
  };
  const complexTypeItemName = 'Element ComplexTypeItem';
  const complexTypeItemDocumentation = 'Element ComplexTypeItem Documentation';
  const complexTypeItemType = 'xs:string';
  const complexTypeName = 'ComplexType';
  const complexTypeDocumentation = 'ComplexType Documentation';
  const simpleTypeName = 'String SimpleType';
  const simpleTypeDocumentation = 'String SimpleType Documentation';
  const simpleTypeBaseType = 'xs:string';
  const schemaSectionDocumentation = 'SchemaSection Documentation';
  const schemaVersion = '200';
  const schemaDocumentation = 'Schema Documentation';

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
    const namespace = {
      ...newNamespace(),
      namespaceName: 'EdFi',
      projectExtension: 'EXTENSION',
      data: {
        edfiXsd: {
          xsdSchema: schema,
        },
      },
    };

    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiXsdEntityRepositoryTo(metaEd);
    const rawXsd = (await generate(metaEd)).generatedOutput[0].resultString;
    result = xmlParser.xml2js(rawXsd);
  });

  it('should generate valid xsd', (): void => {
    const xsSchema = result.elements[0];

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
