// @flow
import { DOMParser } from 'xmldom';
import xpath from 'xpath';
import initializeXsdPlugin from '../../src/edfiXsd';
import { generate } from '../../src/generator/XsdGenerator';
import type { MetaEdEnvironment } from '../../../metaed-core/index';
// This is a cheat until we determine how to access plugin dependencies for testing
import initializeUnifiedPlugin from '../../../metaed-plugin-edfi-unified/src/unified';

const parser = new DOMParser();
const parseXml = (xmlString: string) => parser.parseFromString(xmlString);

export const xpathSelect = xpath.useNamespaces({
  xs: 'http://www.w3.org/2001/XMLSchema',
  ann: 'http://ed-fi.org/annotation',
});

export function enhanceAndGenerate(metaEd: MetaEdEnvironment) {
  initializeUnifiedPlugin().enhancer.forEach(enhance => enhance(metaEd));
  initializeXsdPlugin().enhancer.forEach(enhance => enhance(metaEd));

  const generatorResult = generate(metaEd).generatedOutput;
  const coreResultString = generatorResult[0].resultString;
  const extensionResultString = generatorResult[1].resultString;
  return {
    coreResult: parseXml(coreResultString),
    extensionResult: parseXml(extensionResultString),
  };
}
