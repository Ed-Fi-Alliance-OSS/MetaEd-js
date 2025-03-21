// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import xmlParser from 'xml-js';
import {
  addEntityForNamespace,
  newBooleanProperty,
  newDescriptor,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Descriptor } from '@edfi/metaed-core';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { createSchema } from './GeneratorTestBase';
import { generate } from '../../src/generator/SchemaAnnotationGenerator';

describe('when generating schema annotation for a single descriptor', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '2.1.0' };
  const schema = createSchema('200', 'Schema Documentation');
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

  const xsdDescriptorName = 'DescriptorNameDescriptor';
  let descriptorElement;

  beforeAll(async () => {
    const descriptor: Descriptor = {
      ...newDescriptor(),
      metaEdName: 'DescriptorName',
      namespace,
      documentation: 'DescriptorDocumentation',
      data: {
        edfiXsd: {
          xsdDescriptorName,
          xsdDescriptorNameWithExtension: 'XsdDescriptorNameExtension',
          xsdIsMapType: false,
          xsdHasPropertiesOrMapType: false,
        },
      },
      properties: [
        {
          ...newBooleanProperty(),
          namespace,
          metaEdName: 'BooleanPropertyName',
          documentation: 'PropertyDocumentation',
          isRequired: false,
        },
      ],
    };
    addEntityForNamespace(descriptor);

    const rawXsd = (await generate(metaEd)).generatedOutput[0].resultString;
    [, descriptorElement] = xmlParser.xml2js(rawXsd).elements[0].elements;
  });

  it('should be simple type for descriptor list', (): void => {
    expect(descriptorElement.name).toBe('xs:simpleType');
  });

  it('should be token restriction for descriptor list', (): void => {
    expect(descriptorElement.elements[1].name).toBe('xs:restriction');
    expect(descriptorElement.elements[1].attributes.base).toBe('xs:token');
  });

  it('should have single descriptor', (): void => {
    expect(descriptorElement.elements[1].elements).toHaveLength(1);
    expect(descriptorElement.elements[1].elements[0].name).toBe('xs:enumeration');
    expect(descriptorElement.elements[1].elements[0].attributes.value).toBe(xsdDescriptorName);
  });
});
