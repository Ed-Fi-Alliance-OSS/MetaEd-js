// @flow
import xmlParser from 'xml-js';
import { addEntity, newBooleanProperty, newDescriptor, newMetaEdEnvironment, newNamespaceInfo } from '../../../metaed-core/index';
import { createSchema } from './GeneratorTestBase';
import { generate } from '../../src/generator/SchemaAnnotationGenerator';
import type { MetaEdEnvironment, Descriptor } from '../../../metaed-core/index';

describe('when generating schema annotation for a single descriptor', () => {
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), {
    dataStandardVersion: '2.1.0',
  });
  const xsdDescriptorName: string = 'DescriptorNameDescriptor';
  let descriptorElement;

  beforeAll(() => {
    const schema = createSchema('200', 'Schema Documentation');
    const namespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'edfi',
      projectExtension: 'EXTENSION',
      data: {
        edfiXsd: {
          xsd_Schema: schema,
        },
      },
    });
    metaEd.entity.namespaceInfo.push(namespaceInfo);

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

    const rawXsd = generate(metaEd).generatedOutput[0].resultString;
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
