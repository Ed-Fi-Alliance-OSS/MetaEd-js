import * as R from 'ramda';
import xmlParser from 'xml-js';
import { createAttribute } from '../GeneratorTestBase';
import {
  nextHeadText,
  nextHeadName,
  nextHead,
  nextLength,
  xsdAttributeName,
  xsdAttributeType,
  xsdAttributeUse,
} from './TemplateTestHelper';
import { templateNamed, registerPartials } from '../../../src/generator/XsdGeneratorBase';

const attribute = nextHead;

describe('when generating attribute', (): void => {
  const documentation = 'Documentation';
  const attributeName = 'Attribute Name';
  const attributeType = 'xs:string';

  let result;

  beforeAll(() => {
    registerPartials();
    const testObject = createAttribute(attributeName, attributeType, documentation);
    const rawXsd = templateNamed('attribute')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be attribute only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:attribute');
  });

  it('should have attribute name', (): void => {
    expect(R.view(R.compose(attribute, xsdAttributeName), result)).toBe(attributeName);
  });

  it('should have attribute type', (): void => {
    expect(R.view(R.compose(attribute, xsdAttributeType), result)).toBe(attributeType);
  });

  it('should have annotation', (): void => {
    expect(R.view(R.compose(attribute, nextLength), result)).toBe(1);
    expect(R.view(R.compose(attribute, nextHeadName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(attribute, nextHead, nextHead, nextHeadText), result)).toBe(documentation);
  });

  it('should not have use required', (): void => {
    expect(R.view(R.compose(attribute, xsdAttributeUse), result)).not.toBeDefined();
  });
});

describe('when generating attribute with use required', (): void => {
  const documentation = 'Documentation';
  const attributeName = 'Attribute Name';
  const attributeType = 'xs:string';

  let result;

  beforeAll(() => {
    registerPartials();
    const testObject = createAttribute(attributeName, attributeType, documentation, true);
    const rawXsd = templateNamed('attribute')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be attribute only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:attribute');
  });

  it('should have attribute name', (): void => {
    expect(R.view(R.compose(attribute, xsdAttributeName), result)).toBe(attributeName);
  });

  it('should have attribute type', (): void => {
    expect(R.view(R.compose(attribute, xsdAttributeType), result)).toBe(attributeType);
  });

  it('should have annotation', (): void => {
    expect(R.view(R.compose(attribute, nextLength), result)).toBe(1);
    expect(R.view(R.compose(attribute, nextHeadName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(attribute, nextHead, nextHead, nextHeadText), result)).toBe(documentation);
  });

  it('should not have use required', (): void => {
    expect(R.view(R.compose(attribute, xsdAttributeUse), result)).toBe('required');
  });
});
