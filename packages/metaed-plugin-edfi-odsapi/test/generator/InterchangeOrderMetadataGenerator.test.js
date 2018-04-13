// @flow

import R from 'ramda';
import xmlParser from 'xml-js';
import { newPluginEnvironment, newMetaEdEnvironment, newNamespaceInfo, newInterchangeItem } from 'metaed-core';
import type { MetaEdEnvironment, NamespaceInfo, InterchangeItem, GeneratedOutput } from 'metaed-core';
import { newEdFiXsdEntityRepository, newMergedInterchange, addMergedInterchangeToRepository } from 'metaed-plugin-edfi-xsd';
import type { MergedInterchange } from 'metaed-plugin-edfi-xsd';
import { nextHead, nextSecond, nextThird, nextLength, xsdAttributeName } from './TemplateTestHelper';
import { generate } from '../../src/generator/interchangeOrderMetadata/InterchangeOrderMetadataGenerator';

describe('when generating core interchange', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const elementName1: string = 'ElementName1';
  const elementName2: string = 'ElementName2';
  const interchangeName: string = 'InterchangeName';
  let result: GeneratedOutput;

  beforeAll(async () => {
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'edfi',
    });
    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);

    const element1: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementName1,
    });

    const element2: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementName2,
    });

    const mergedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespaceInfo,
      metaEdName: interchangeName,
      orderedElements: [element1, element2],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    result = (await generate(metaEd)).generatedOutput[0];
  });

  it('should generate correct filename', () => {
    expect(result.fileName).toBe('InterchangeOrderMetadata.xml');
  });

  it('should generate valid xsd', () => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result.resultString));

    const interchange = R.view(nextHead, interchanges);
    expect(R.view(xsdAttributeName, interchange)).toBe(interchangeName);

    const element1 = R.view(nextHead, interchange);
    expect(R.view(xsdAttributeName, element1)).toBe(elementName1);

    const element2 = R.view(nextSecond, interchange);
    expect(R.view(xsdAttributeName, element2)).toBe(elementName2);
  });
});

describe('when generating extension interchange', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const elementName1: string = 'ElementName1';
  const elementName2: string = 'ElementName2';
  const interchangeName: string = 'InterchangeName';
  let result: GeneratedOutput;

  beforeAll(async () => {
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    });
    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);

    const element1: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementName1,
    });

    const element2: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementName2,
    });

    const mergedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespaceInfo,
      metaEdName: interchangeName,
      orderedElements: [element1, element2],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    result = (await generate(metaEd)).generatedOutput[0];
  });

  it('should generate correct filename', () => {
    expect(result.fileName).toBe('InterchangeOrderMetadata-EXTENSION.xml');
  });

  it('should generate valid xsd', () => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result.resultString));

    const interchange = R.view(nextHead, interchanges);
    expect(R.view(nextLength, interchange)).toBe(2);
    expect(R.view(xsdAttributeName, interchange)).toBe(interchangeName);

    const element1 = R.view(nextHead, interchange);
    expect(R.view(xsdAttributeName, element1)).toBe(elementName1);

    const element2 = R.view(nextSecond, interchange);
    expect(R.view(xsdAttributeName, element2)).toBe(elementName2);
  });
});

describe('when generating core and extension interchange', () => {
  const plugin = Object.assign(newPluginEnvironment(), {
    entity: newEdFiXsdEntityRepository(),
  });
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiXsd', plugin);
  const elementName1: string = 'ElementName1';
  const elementName2: string = 'ElementName2';
  const elementName3: string = 'ElementName3';
  const coreInterchangeName: string = 'CoreInterchangeName';
  const extensionInterchangeName: string = 'ExtensionInterchangeName';
  let result: Array<GeneratedOutput>;

  beforeAll(async () => {
    const coreNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'edfi',
    });
    metaEd.entity.namespaceInfo.set(coreNamespaceInfo.namespace, coreNamespaceInfo);

    const extensionNamespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    });
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const element1: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementName1,
    });

    const element2: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementName2,
    });

    const element3: InterchangeItem = Object.assign(newInterchangeItem(), {
      metaEdName: elementName3,
    });

    const mergedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespaceInfo: coreNamespaceInfo,
      metaEdName: coreInterchangeName,
      orderedElements: [element1, element2],
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    const mergedExtensionInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespaceInfo: extensionNamespaceInfo,
      metaEdName: extensionInterchangeName,
      orderedElements: [element1, element3, element2],
    });
    addMergedInterchangeToRepository(metaEd, mergedExtensionInterchange);

    result = (await generate(metaEd)).generatedOutput;
  });

  it('should generate correct filenames', () => {
    expect(result[0].fileName).toBe('InterchangeOrderMetadata.xml');
    expect(result[1].fileName).toBe('InterchangeOrderMetadata-EXTENSION.xml');
  });

  it('should generate valid core xsd', () => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result[0].resultString));

    const interchange = R.view(nextHead, interchanges);
    expect(R.view(nextLength, interchange)).toBe(2);
    expect(R.view(xsdAttributeName, interchange)).toBe(coreInterchangeName);

    const element1 = R.view(nextHead, interchange);
    expect(R.view(xsdAttributeName, element1)).toBe(elementName1);

    const element2 = R.view(nextSecond, interchange);
    expect(R.view(xsdAttributeName, element2)).toBe(elementName2);
  });

  it('should generate valid extension xsd', () => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result[1].resultString));

    const coreInterchange = R.view(nextHead, interchanges);
    expect(R.view(nextLength, coreInterchange)).toBe(2);
    expect(R.view(xsdAttributeName, coreInterchange)).toBe(coreInterchangeName);

    const coreElement1 = R.view(nextHead, coreInterchange);
    expect(R.view(xsdAttributeName, coreElement1)).toBe(elementName1);

    const coreElement2 = R.view(nextSecond, coreInterchange);
    expect(R.view(xsdAttributeName, coreElement2)).toBe(elementName2);

    const extensionInterchange = R.view(nextSecond, interchanges);
    expect(R.view(nextLength, extensionInterchange)).toBe(3);
    expect(R.view(xsdAttributeName, extensionInterchange)).toBe(extensionInterchangeName);

    const extensionElement1 = R.view(nextHead, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement1)).toBe(elementName1);

    const extensionElement2 = R.view(nextSecond, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement2)).toBe(elementName3);

    const extensionElement3 = R.view(nextThird, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement3)).toBe(elementName2);
  });
});
