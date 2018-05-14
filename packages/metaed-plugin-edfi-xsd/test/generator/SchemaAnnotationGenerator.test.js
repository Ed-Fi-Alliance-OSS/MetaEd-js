// @flow
import xmlParser from 'xml-js';
import { addEntity, newBooleanProperty, newDescriptor, newMetaEdEnvironment, newNamespace } from 'metaed-core';
import type { MetaEdEnvironment, Descriptor } from 'metaed-core';
import { createSchema } from './GeneratorTestBase';
import { generate } from '../../src/generator/SchemaAnnotationGenerator';

describe('when generating schema annotation for a single descriptor', () => {
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), {
    dataStandardVersion: '2.1.0',
  });
  const xsdDescriptorName: string = 'DescriptorNameDescriptor';
  let descriptorElement;

  beforeAll(async () => {
    const schema = createSchema('200', 'Schema Documentation');
    const namespace = Object.assign(newNamespace(), {
      namespaceName: 'edfi',
      projectExtension: 'EXTENSION',
      data: {
        edfiXsd: {
          xsd_Schema: schema,
        },
      },
    });
    metaEd.entity.namespace.set(namespace.namespaceName, namespace);

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: 'DescriptorName',
      documentation: 'DescriptorDocumentation',
      data: {
        edfiXsd: {
          xsd_DescriptorName: xsdDescriptorName,
          xsd_DescriptorNameWithExtension: 'XsdDescriptorNameExtension',
          xsd_IsMapType: false,
          xsd_HasPropertiesOrMapType: false,
        },
      },
      properties: [
        Object.assign(newBooleanProperty(), {
          metaEdName: 'BooleanPropertyName',
          documentation: 'PropertyDocumentation',
          isRequired: false,
        }),
      ],
    });
    addEntity(metaEd.entity, descriptor);

    const rawXsd = (await generate(metaEd)).generatedOutput[0].resultString;
    descriptorElement = xmlParser.xml2js(rawXsd).elements[1].elements[1];
  });

  it('should be simple type for descriptor list', () => {
    expect(descriptorElement.name).toBe('xs:simpleType');
  });

  it('should be token restriction for descriptor list', () => {
    expect(descriptorElement.elements[1].name).toBe('xs:restriction');
    expect(descriptorElement.elements[1].attributes.base).toBe('xs:token');
  });

  it('should have single descriptor', () => {
    expect(descriptorElement.elements[1].elements).toHaveLength(1);
    expect(descriptorElement.elements[1].elements[0].name).toBe('xs:enumeration');
    expect(descriptorElement.elements[1].elements[0].attributes.value).toBe(xsdDescriptorName);
  });
});
