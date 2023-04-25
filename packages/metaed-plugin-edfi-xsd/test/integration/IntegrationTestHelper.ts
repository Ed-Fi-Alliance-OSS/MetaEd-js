import { DOMParser } from '@xmldom/xmldom';
import xpath from 'xpath';
import { MetaEdEnvironment, GeneratedOutput, Namespace } from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as initializeXsdPlugin } from '../../index';
import { generate } from '../../src/generator/XsdGenerator';
import { generate as generateInterchange } from '../../src/generator/InterchangeGenerator';

// This is a cheat until we determine how to access plugin dependencies for testing

const parser = new DOMParser();

function parseXml(xmlString: string): any {
  return parser.parseFromString(xmlString);
}

export const xpathSelect = xpath.useNamespaces({
  xs: 'http://www.w3.org/2001/XMLSchema',
  ann: 'http://ed-fi.org/annotation',
});

interface EnhanceAndGenerateResult {
  coreResult: string;
  extensionResult: string | null;
  interchangeResults: string[];
}

export function initializeNamespaceDependencies(
  metaEd: MetaEdEnvironment,
  namespaceName: string,
  extensionNamespaceName: string,
): void {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
  if (coreNamespace == null) throw new Error();
  const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extensionNamespaceName);
  if (extensionNamespace == null) throw new Error();
  extensionNamespace.dependencies.push(coreNamespace);
}

export async function enhanceAndGenerate(metaEd: MetaEdEnvironment): Promise<EnhanceAndGenerateResult> {
  metaEd.dataStandardVersion = '3.0.0';

  initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
  initializeXsdPlugin().enhancer.forEach((enhance) => enhance(metaEd));

  const generatorResult: GeneratedOutput[] = (await generate(metaEd)).generatedOutput;
  const interchangeGeneratorResult: GeneratedOutput[] = (await generateInterchange(metaEd)).generatedOutput || [];
  const coreResultString = generatorResult[0].resultString;
  const extensionResultString = generatorResult[1] ? generatorResult[1].resultString : null;
  return {
    coreResult: parseXml(coreResultString),
    extensionResult: extensionResultString ? parseXml(extensionResultString) : null,
    interchangeResults: interchangeGeneratorResult.map((result: GeneratedOutput) => parseXml(result.resultString)),
  };
}
