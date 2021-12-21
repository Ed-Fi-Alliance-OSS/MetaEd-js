import R from 'ramda';
import xmlParser from 'xml-js';
import {
  newMetaEdEnvironment,
  newNamespace,
  newInterchange,
  newInterchangeExtension,
  newInterchangeItem,
} from 'metaed-core';
import {
  MetaEdEnvironment,
  Namespace,
  Interchange,
  InterchangeItem,
  InterchangeExtension,
  GeneratedOutput,
} from 'metaed-core';
import {
  nameOf,
  textOf,
  nextHead,
  nextSecond,
  nextThird,
  xsdAttributeName,
  xsdAttributeType,
  xsdMaxOccurs,
} from './templates/TemplateTestHelper';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { newMergedInterchange, addMergedInterchangeToRepository } from '../../src/model/MergedInterchange';
import { MergedInterchange } from '../../src/model/MergedInterchange';
import { generate } from '../../src/generator/InterchangeGenerator';

describe('when generating single interchange', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  const elementBaseName = 'ElementName';
  const elementTypeName = 'ElementNameType';
  const identityTemplateBaseName = 'IdentityTemplateNameReference';
  const identityTemplateTypeName = 'IdentityTemplateNameReferenceType';
  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const schemaDocumentation = `===== Interchange Name Interchange Model =====`;
  const schemaLocationName = 'SchemaLocation.xsd';
  let result;

  beforeAll(async () => {
    const element: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: elementBaseName,
      data: {
        edfiXsd: {
          xsdName: elementBaseName,
          xsdType: elementTypeName,
        },
      },
    };

    const identityTemplate: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: identityTemplateBaseName,
      data: {
        edfiXsd: {
          xsdName: identityTemplateBaseName,
          xsdType: identityTemplateTypeName,
        },
      },
    };

    const interchange: Interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      documentation: interchangeDocumentation,
      elements: [element],
      identityTemplates: [identityTemplate],
    };
    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    const mergedInterchange: MergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      namespace,
      interchangeName,
      documentation: interchangeDocumentation,
      schemaLocation: schemaLocationName,
      elements: [element],
      identityTemplates: [identityTemplate],
      orderedElements: [identityTemplate, element],
    };
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    const rawXsd = (await generate(metaEd)).generatedOutput[0].resultString;
    result = xmlParser.xml2js(rawXsd);
  });

  it('should generate valid xsd', (): void => {
    const xsSchema = R.view(nextHead, result);

    const schemaLocation = R.view(nextHead, xsSchema);
    expect(R.view(nameOf, schemaLocation)).toBe('xs:include');
    expect(R.view(R.lensPath(['attributes', 'schemaLocation']), schemaLocation)).toBe(schemaLocationName);

    const schemaDocumentationAnnotation = R.view(nextSecond, xsSchema);
    expect(R.view(nameOf, schemaDocumentationAnnotation)).toBe('xs:annotation');
    expect(R.view(R.compose(nextHead, nameOf), schemaDocumentationAnnotation)).toBe('xs:documentation');
    expect(R.view(R.compose(nextHead, nextHead, textOf), schemaDocumentationAnnotation)).toBe(schemaDocumentation);

    const interchangeElement = R.view(nextThird, xsSchema);
    expect(R.view(nameOf, interchangeElement)).toBe('xs:element');
    expect(R.view(xsdAttributeName, interchangeElement)).toBe(interchangeName);
    expect(R.view(R.compose(nextHead, nameOf), interchangeElement)).toBe('xs:annotation');
    expect(R.view(R.compose(nextHead, nextHead, nameOf), interchangeElement)).toBe('xs:documentation');
    expect(R.view(R.compose(nextHead, nextHead, nextHead, textOf), interchangeElement)).toBe(interchangeDocumentation);

    const complexType = R.view(nextSecond, interchangeElement);
    expect(R.view(nameOf, complexType)).toBe('xs:complexType');
    expect(R.view(R.compose(nextHead, nameOf), complexType)).toBe('xs:choice');
    expect(R.view(R.compose(nextHead, xsdMaxOccurs), complexType)).toBe('unbounded');

    const identityElement = R.view(R.compose(nextHead, nextHead), complexType);
    expect(R.view(nameOf, identityElement)).toBe('xs:element');
    expect(R.view(xsdAttributeName, identityElement)).toBe(identityTemplateBaseName);
    expect(R.view(xsdAttributeType, identityElement)).toBe(identityTemplateTypeName);

    const element = R.view(R.compose(nextHead, nextSecond), complexType);
    expect(R.view(nameOf, element)).toBe('xs:element');
    expect(R.view(xsdAttributeName, element)).toBe(elementBaseName);
    expect(R.view(xsdAttributeType, element)).toBe(elementTypeName);
  });
});

describe('when generating single interchange with extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const extensionNamespace: Namespace = {
    ...newNamespace(),
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  const elementBaseName = 'ElementName';
  const elementTypeName = 'ElementNameType';
  const identityTemplateBaseName = 'IdentityTemplateNameReference';
  const identityTemplateTypeName = 'IdentityTemplateNameReferenceType';
  const extensionElementBaseName = 'ExtensionElementName';
  const extensionElementTypeName = 'ExtensionElementNameType';
  const interchangeName = 'InterchangeName';
  const interchangeDocumentation = 'InterchangeDocumentation';
  const interchangeExtensionDocumentation = 'InterchangeExtensionDocumentation';
  const schemaLocationName = 'SchemaLocation.xsd';
  let result: GeneratedOutput[];

  beforeAll(() => {
    const element: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: elementBaseName,
      data: {
        edfiXsd: {
          xsdName: elementBaseName,
          xsdType: elementTypeName,
        },
      },
    };

    const identityTemplate: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: identityTemplateBaseName,
      data: {
        edfiXsd: {
          xsdName: identityTemplateBaseName,
          xsdType: identityTemplateTypeName,
        },
      },
    };

    const extensionElement: InterchangeItem = {
      ...newInterchangeItem(),
      metaEdName: elementBaseName,
      data: {
        edfiXsd: {
          xsdName: extensionElementBaseName,
          xsdType: extensionElementTypeName,
        },
      },
    };

    const interchange: Interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      documentation: interchangeDocumentation,
      elements: [element],
      identityTemplates: [identityTemplate],
    };
    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    const interchangeExtension: InterchangeExtension = {
      ...newInterchangeExtension(),
      metaEdName: interchangeName,
      namespace: extensionNamespace,
      documentation: interchangeExtensionDocumentation,
      elements: [extensionElement],
      identityTemplates: [],
    };
    extensionNamespace.entity.interchangeExtension.set(interchangeExtension.metaEdName, interchangeExtension);

    const mergedInterchange: MergedInterchange = {
      ...newMergedInterchange(),
      namespace,
      interchangeName,
      documentation: interchangeDocumentation,
      schemaLocation: schemaLocationName,
      elements: [element, extensionElement],
      identityTemplates: [identityTemplate],
      orderedElements: [identityTemplate, element],
    };
    addMergedInterchangeToRepository(metaEd, mergedInterchange);
  });

  it('should not generate explicit extension interchange', async () => {
    result = (await generate(metaEd)).generatedOutput;
    expect(result).toHaveLength(1);
  });

  it('should have interchange name', (): void => {
    const xsSchema = R.view(nextHead, xmlParser.xml2js(result[0].resultString));

    const interchangeElement = R.view(nextThird, xsSchema);
    expect(R.view(nameOf, interchangeElement)).toBe('xs:element');
    expect(R.view(xsdAttributeName, interchangeElement)).toBe(interchangeName);
  });
});
