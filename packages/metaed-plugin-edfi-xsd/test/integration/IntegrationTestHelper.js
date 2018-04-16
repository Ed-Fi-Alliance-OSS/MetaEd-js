// @flow
import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import type { MetaEdEnvironment, GeneratedOutput } from 'metaed-core';
import { initialize as initializeUnifiedPlugin } from 'metaed-plugin-edfi-unified';
import { initialize as initializeXsdPlugin } from '../../index';
import { generate } from '../../src/generator/XsdGenerator';
import { generate as generateInterchange } from '../../src/generator/InterchangeGenerator';

// This is a cheat until we determine how to access plugin dependencies for testing

const parser = new DOMParser();

function parseXml(xmlString: string): string {
  return parser.parseFromString(xmlString);
}

export const xpathSelect = xpath.useNamespaces({
  xs: 'http://www.w3.org/2001/XMLSchema',
  ann: 'http://ed-fi.org/annotation',
});

type EnhanceAndGenerateResult = {
  coreResult: string,
  extensionResult: ?string,
  interchangeResults: Array<string>,
};

export async function enhanceAndGenerate(metaEd: MetaEdEnvironment): Promise<EnhanceAndGenerateResult> {
  metaEd.dataStandardVersion = '2.0.0';
  initializeUnifiedPlugin().enhancer.forEach(enhance => enhance(metaEd));
  initializeXsdPlugin().enhancer.forEach(enhance => enhance(metaEd));

  const generatorResult: Array<GeneratedOutput> = (await generate(metaEd)).generatedOutput;
  const interchangeGeneratorResult: Array<GeneratedOutput> = (await generateInterchange(metaEd)).generatedOutput || [];
  const coreResultString = generatorResult[0].resultString;
  const extensionResultString = generatorResult[1] ? generatorResult[1].resultString : null;
  return {
    coreResult: parseXml(coreResultString),
    extensionResult: extensionResultString ? parseXml(extensionResultString) : null,
    interchangeResults: interchangeGeneratorResult.map((result: GeneratedOutput) => parseXml(result.resultString)),
  };
}
