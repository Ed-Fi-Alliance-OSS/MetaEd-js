import R from 'ramda';
import xmlParser from 'xml-js';
import { GeneratorResult, newMetaEdEnvironment, newNamespace, newPluginEnvironment } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace, GeneratedOutput } from '@edfi/metaed-core';
import {
  addEdFiXsdEntityRepositoryTo,
  newMergedInterchange,
  addMergedInterchangeToRepository,
} from '@edfi/metaed-plugin-edfi-xsd';
import { MergedInterchange } from '@edfi/metaed-plugin-edfi-xsd';
import { nextHead, nextSecond, nextThird, nextLength, xsdAttributeName, xsdAttributeOrder } from './TemplateTestHelper';
import { generate } from '../../src/generator/interchangeOrderMetadata/InterchangeOrderMetadataGenerator';

describe('when generating core interchange', (): void => {
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '2.0.0' });
  const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'EdFi' });
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.0.0',
    }),
  );

  const elementName1 = 'ElementName1';
  const elementName2 = 'ElementName2';
  const interchangeName = 'InterchangeName';
  const interchangeOrder = 10;
  let result: GeneratedOutput;

  beforeAll(async () => {
    const element1: { name: string } = { name: elementName1 };
    const element2: { name: string } = { name: elementName2 };

    const mergedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace,
      metaEdName: interchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1, element2], apiOrder: interchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    [result] = (await generate(metaEd)).generatedOutput;
  });

  it('should generate correct filename', (): void => {
    expect(result.fileName).toBe('InterchangeOrderMetadata.xml');
  });

  it('should generate valid xsd', (): void => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result.resultString));

    const interchange = R.view(nextHead, interchanges);
    expect(R.view(xsdAttributeName, interchange)).toBe(interchangeName);
    expect(R.view(xsdAttributeOrder, interchange)).toBe(`${interchangeOrder}`);

    const element1 = R.view(nextHead, interchange);
    expect(R.view(xsdAttributeName, element1)).toBe(elementName1);

    const element2 = R.view(nextSecond, interchange);
    expect(R.view(xsdAttributeName, element2)).toBe(elementName2);
  });
});

describe('when generating core interchange on DS 3.0', (): void => {
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '3.0.0' });
  const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'EdFi' });
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.0.0',
    }),
  );

  const elementName1 = 'ElementName1';
  const elementName2 = 'ElementName2';
  const interchangeName = 'InterchangeName';
  const interchangeOrder = 10;
  let result: GeneratedOutput;

  beforeAll(async () => {
    const element1: { name: string } = { name: elementName1 };
    const element2: { name: string } = { name: elementName2 };

    const mergedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace,
      metaEdName: interchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1, element2], apiOrder: interchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    [result] = (await generate(metaEd)).generatedOutput;
  });

  it('should generate correct filename', (): void => {
    expect(result.fileName).toBe('InterchangeOrderMetadata.xml');
  });

  it('should generate valid xsd', (): void => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result.resultString));

    const interchange = R.view(nextHead, interchanges);
    expect(R.view(xsdAttributeName, interchange)).toBe(interchangeName);
    expect(R.view(xsdAttributeOrder, interchange)).toBe(`${interchangeOrder}`);

    const element1 = R.view(nextHead, interchange);
    expect(R.view(xsdAttributeName, element1)).toBe(elementName1);

    const element2 = R.view(nextSecond, interchange);
    expect(R.view(xsdAttributeName, element2)).toBe(elementName2);
  });
});

describe('when generating extension interchange', (): void => {
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '2.0.0' });
  const coreNamespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'EdFi' });
  metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
  const extensionNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  });
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(coreNamespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.0.0',
    }),
  );

  const elementName1 = 'ElementName1';
  const elementName2 = 'ElementName2';
  const interchangeName = 'InterchangeName';
  const interchangeOrder = 10;
  let result: GeneratedOutput;

  beforeAll(async () => {
    const element1: { name: string } = { name: elementName1 };
    const element2: { name: string } = { name: elementName2 };

    const mergedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace: extensionNamespace,
      metaEdName: interchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1, element2], apiOrder: interchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    [result] = (await generate(metaEd)).generatedOutput;
  });

  it('should generate correct filename', (): void => {
    expect(result.fileName).toBe('InterchangeOrderMetadata-EXTENSION.xml');
  });

  it('should generate valid xsd', (): void => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result.resultString));
    const interchange = R.view(nextHead, interchanges);

    expect(R.view(nextLength, interchange)).toBe(2);
    expect(R.view(xsdAttributeName, interchange)).toBe(interchangeName);
    expect(R.view(xsdAttributeOrder, interchange)).toBe(`${interchangeOrder}`);

    const element1 = R.view(nextHead, interchange);
    expect(R.view(xsdAttributeName, element1)).toBe(elementName1);

    const element2 = R.view(nextSecond, interchange);
    expect(R.view(xsdAttributeName, element2)).toBe(elementName2);
  });
});

describe('when generating core and extension interchange', (): void => {
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '2.0.0' });
  const coreNamespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'EdFi' });
  metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
  const extensionNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  });
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(coreNamespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.0.0',
    }),
  );

  const elementName1 = 'ElementName1';
  const elementName2 = 'ElementName2';
  const elementName3 = 'ElementName3';
  const coreInterchangeName = 'CoreInterchangeName';
  const extensionInterchangeName = 'ExtensionInterchangeName';
  const coreInterchangeOrder = 10;
  const extensionInterchangeOrder = 20;
  let result: GeneratedOutput[];

  beforeAll(async () => {
    const element1: { name: string } = { name: elementName1 };
    const element2: { name: string } = { name: elementName2 };
    const element3: { name: string } = { name: elementName3 };

    const mergedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace: coreNamespace,
      metaEdName: coreInterchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1, element2], apiOrder: coreInterchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    const mergedExtensionInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace: extensionNamespace,
      metaEdName: extensionInterchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1, element2, element3], apiOrder: extensionInterchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, mergedExtensionInterchange);

    result = (await generate(metaEd)).generatedOutput;
  });

  it('should generate correct filenames', (): void => {
    expect(result[0].fileName).toBe('InterchangeOrderMetadata.xml');
    expect(result[1].fileName).toBe('InterchangeOrderMetadata-EXTENSION.xml');
  });

  it('should generate valid core xsd', (): void => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result[0].resultString));

    const interchange = R.view(nextHead, interchanges);
    expect(R.view(nextLength, interchange)).toBe(2);
    expect(R.view(xsdAttributeName, interchange)).toBe(coreInterchangeName);
    expect(R.view(xsdAttributeOrder, interchange)).toBe(`${coreInterchangeOrder}`);

    const element1 = R.view(nextHead, interchange);
    expect(R.view(xsdAttributeName, element1)).toBe(elementName1);

    const element2 = R.view(nextSecond, interchange);
    expect(R.view(xsdAttributeName, element2)).toBe(elementName2);
  });

  it('should generate valid extension xsd', (): void => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result[1].resultString));

    const coreInterchange = R.view(nextHead, interchanges);
    expect(R.view(nextLength, coreInterchange)).toBe(2);
    expect(R.view(xsdAttributeName, coreInterchange)).toBe(coreInterchangeName);
    expect(R.view(xsdAttributeOrder, coreInterchange)).toBe(`${coreInterchangeOrder}`);

    const coreElement1 = R.view(nextHead, coreInterchange);
    expect(R.view(xsdAttributeName, coreElement1)).toBe(elementName1);

    const coreElement2 = R.view(nextSecond, coreInterchange);
    expect(R.view(xsdAttributeName, coreElement2)).toBe(elementName2);

    const extensionInterchange = R.view(nextSecond, interchanges);
    expect(R.view(nextLength, extensionInterchange)).toBe(3);
    expect(R.view(xsdAttributeName, extensionInterchange)).toBe(extensionInterchangeName);
    expect(R.view(xsdAttributeOrder, extensionInterchange)).toBe(`${extensionInterchangeOrder}`);

    const extensionElement1 = R.view(nextHead, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement1)).toBe(elementName1);

    const extensionElement2 = R.view(nextSecond, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement2)).toBe(elementName2);

    const extensionElement3 = R.view(nextThird, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement3)).toBe(elementName3);
  });
});

describe('when generating core and extension interchange with same interchange name', (): void => {
  const metaEd: MetaEdEnvironment = Object.assign(newMetaEdEnvironment(), { dataStandardVersion: '2.0.0' });
  const coreNamespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'EdFi' });
  metaEd.namespace.set(coreNamespace.namespaceName, coreNamespace);
  const extensionNamespace: Namespace = Object.assign(newNamespace(), {
    namespaceName: 'Extension',
    projectExtension: 'EXTENSION',
    isExtension: true,
  });
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  extensionNamespace.dependencies.push(coreNamespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '3.0.0',
    }),
  );

  const elementName1 = 'ElementName1';
  const elementName2 = 'ElementName2';
  const elementName3 = 'ElementName3';
  const coreInterchangeName = 'CoreInterchangeName';
  const extensionInterchangeName = 'ExtensionInterchangeName';
  const sharedInterchangeName = 'SharedInterchangeName';
  const coreInterchangeOrder = 10;
  const extensionInterchangeOrder = 20;
  const sharedInterchangeOrder = 30;
  let result: GeneratedOutput[];

  beforeAll(async () => {
    const element1: { name: string } = { name: elementName1 };
    const element2: { name: string } = { name: elementName2 };
    const element3: { name: string } = { name: elementName3 };

    const coreSharedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace: coreNamespace,
      metaEdName: sharedInterchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1], apiOrder: sharedInterchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, coreSharedInterchange);

    const mergedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace: coreNamespace,
      metaEdName: coreInterchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1, element2], apiOrder: coreInterchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, mergedInterchange);

    const extensionSharedInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace: extensionNamespace,
      metaEdName: sharedInterchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1, element2, element3], apiOrder: sharedInterchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, extensionSharedInterchange);

    const mergedExtensionInterchange: MergedInterchange = Object.assign(newMergedInterchange(), {
      namespace: extensionNamespace,
      metaEdName: extensionInterchangeName,
      data: { edfiOdsApi: { apiOrderedElements: [element1, element2, element3], apiOrder: extensionInterchangeOrder } },
    });
    addMergedInterchangeToRepository(metaEd, mergedExtensionInterchange);

    result = (await generate(metaEd)).generatedOutput;
  });

  it('should generate correct filenames', (): void => {
    expect(result[0].fileName).toBe('InterchangeOrderMetadata.xml');
    expect(result[1].fileName).toBe('InterchangeOrderMetadata-EXTENSION.xml');
  });

  it('should generate valid core xsd', (): void => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result[0].resultString));

    const interchange = R.view(nextHead, interchanges);
    expect(R.view(nextLength, interchange)).toBe(2);
    expect(R.view(xsdAttributeName, interchange)).toBe(coreInterchangeName);
    expect(R.view(xsdAttributeOrder, interchange)).toBe(`${coreInterchangeOrder}`);

    const element1 = R.view(nextHead, interchange);
    expect(R.view(xsdAttributeName, element1)).toBe(elementName1);

    const element2 = R.view(nextSecond, interchange);
    expect(R.view(xsdAttributeName, element2)).toBe(elementName2);

    const sharedInterchange = R.view(nextSecond, interchanges);
    expect(R.view(nextLength, sharedInterchange)).toBe(1);
    expect(R.view(xsdAttributeName, sharedInterchange)).toBe(sharedInterchangeName);
    expect(R.view(xsdAttributeOrder, sharedInterchange)).toBe(`${sharedInterchangeOrder}`);

    const sharedElement1 = R.view(nextHead, sharedInterchange);
    expect(R.view(xsdAttributeName, sharedElement1)).toBe(elementName1);
  });

  it('should generate valid extension xsd', (): void => {
    const interchanges = R.view(nextSecond, xmlParser.xml2js(result[1].resultString));

    const coreInterchange = R.view(nextHead, interchanges);
    expect(R.view(nextLength, coreInterchange)).toBe(2);
    expect(R.view(xsdAttributeName, coreInterchange)).toBe(coreInterchangeName);
    expect(R.view(xsdAttributeOrder, coreInterchange)).toBe(`${coreInterchangeOrder}`);

    const coreElement1 = R.view(nextHead, coreInterchange);
    expect(R.view(xsdAttributeName, coreElement1)).toBe(elementName1);

    const coreElement2 = R.view(nextSecond, coreInterchange);
    expect(R.view(xsdAttributeName, coreElement2)).toBe(elementName2);

    const extensionInterchange = R.view(nextSecond, interchanges);
    expect(R.view(nextLength, extensionInterchange)).toBe(3);
    expect(R.view(xsdAttributeName, extensionInterchange)).toBe(extensionInterchangeName);
    expect(R.view(xsdAttributeOrder, extensionInterchange)).toBe(`${extensionInterchangeOrder}`);

    const extensionElement1 = R.view(nextHead, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement1)).toBe(elementName1);

    const extensionElement2 = R.view(nextSecond, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement2)).toBe(elementName2);

    const extensionElement3 = R.view(nextThird, extensionInterchange);
    expect(R.view(xsdAttributeName, extensionElement3)).toBe(elementName3);

    const sharedInterchange = R.view(nextThird, interchanges);
    expect(R.view(nextLength, sharedInterchange)).toBe(3);
    expect(R.view(xsdAttributeName, sharedInterchange)).toBe(sharedInterchangeName);
    expect(R.view(xsdAttributeOrder, sharedInterchange)).toBe(`${sharedInterchangeOrder}`);

    const sharedElement1 = R.view(nextHead, sharedInterchange);
    expect(R.view(xsdAttributeName, sharedElement1)).toBe(elementName1);

    const sharedElement2 = R.view(nextSecond, sharedInterchange);
    expect(R.view(xsdAttributeName, sharedElement2)).toBe(elementName2);

    const sharedElement3 = R.view(nextThird, sharedInterchange);
    expect(R.view(xsdAttributeName, sharedElement3)).toBe(elementName3);
  });
});

describe('when generating in targetTechnologyVersion >= 5.0.0', (): void => {
  const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '2.0.0' };
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  metaEd.plugin.set(
    'edfiOdsApi',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: '5.0.1',
    }),
  );
  let result: GeneratorResult;

  beforeAll(async () => {
    result = await generate(metaEd);
  });

  it('should return empty generatedOutput', (): void => {
    expect(result.generatedOutput.length === 0);
  });
});
