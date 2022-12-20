import * as R from 'ramda';
import xmlParser from 'xml-js';
import { createComplexType, createStringSimpleType, createSchema, createSchemaSection } from '../GeneratorTestBase';
import {
  nextHeadText,
  nextHeadName,
  nextSecondName,
  nextThirdName,
  nextFourthName,
  nextFifthName,
  nextHead,
  nextSecond,
  nextThird,
  nextFourth,
  nextFifth,
  nextLength,
} from './TemplateTestHelper';
import { templateNamed, registerPartials } from '../../../src/generator/XsdGeneratorBase';

const schema = nextHead;

const schemaDocumentation = 'Documentation';
const schemaVersion = '200';

const schemaSectionDocumentation = 'Schema Section Documentation';

const complexTypeName = 'Complex Type Name';
const complexTypeDocumentation = 'Complex Type Documentatio';

const simpleTypeName = 'Simple Type Name';
const simpleTypeBaseType = 'xs:string';
const simpleTypeDocumentation = 'Simple Type Documentation';

describe('when generating core schema', (): void => {
  let result;

  beforeAll(() => {
    registerPartials();
    const testObject = createSchema(schemaVersion, schemaDocumentation);
    const schemaSection = createSchemaSection(schemaSectionDocumentation);
    const complexType = createComplexType(complexTypeName, complexTypeDocumentation);
    const simpleType = createStringSimpleType(simpleTypeName, simpleTypeBaseType, simpleTypeDocumentation);
    schemaSection.simpleTypes.push(simpleType);
    schemaSection.complexTypes.push(complexType);
    testObject.sections.push(schemaSection);
    const rawXsd = templateNamed('schema')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be schema only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:schema');
  });

  it('should have schema version', (): void => {
    expect(R.view(R.compose(schema, R.lensPath(['attributes', 'xmlns'])), result)).toContain(schemaVersion);
    expect(R.view(R.compose(schema, R.lensPath(['attributes', 'targetNamespace'])), result)).toContain(schemaVersion);
  });

  it('should have five sections', (): void => {
    expect(R.view(R.compose(schema, nextLength), result)).toBe(5);
  });

  it('should have annotation import', (): void => {
    expect(R.view(R.compose(schema, nextHeadName), result)).toBe('xs:import');
  });

  it('should have annotation', (): void => {
    expect(R.view(R.compose(schema, nextSecondName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(schema, nextSecond, nextHead, nextHeadText), result)).toBe(schemaDocumentation);
  });

  it('should have section annotation', (): void => {
    expect(R.view(R.compose(schema, nextThirdName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(schema, nextThird, nextHead, nextHeadText), result)).toBe(schemaSectionDocumentation);
  });

  it('should have complex type', (): void => {
    expect(R.view(R.compose(schema, nextFourthName), result)).toBe('xs:complexType');
    expect(R.view(R.compose(schema, nextFourth, nextHead, nextHead, nextHeadText), result)).toBe(complexTypeDocumentation);
  });

  it('should have simple type', (): void => {
    expect(R.view(R.compose(schema, nextFifthName), result)).toBe('xs:simpleType');
    expect(R.view(R.compose(schema, nextFifth, nextHead, nextHead, nextHeadText), result)).toBe(simpleTypeDocumentation);
  });
});

describe('when generating extension schema', (): void => {
  let result;

  beforeAll(() => {
    registerPartials();
    const testObject = createSchema(schemaVersion, schemaDocumentation, true);
    const schemaSection = createSchemaSection(schemaSectionDocumentation);
    const complexType = createComplexType(complexTypeName, complexTypeDocumentation);
    const simpleType = createStringSimpleType(simpleTypeName, simpleTypeBaseType, simpleTypeDocumentation);
    schemaSection.simpleTypes.push(simpleType);
    schemaSection.complexTypes.push(complexType);
    testObject.sections.push(schemaSection);
    const rawXsd = templateNamed('schema')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be schema only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:schema');
  });

  it('should have schema version', (): void => {
    expect(R.view(R.compose(schema, R.lensPath(['attributes', 'xmlns'])), result)).toContain(schemaVersion);
    expect(R.view(R.compose(schema, R.lensPath(['attributes', 'targetNamespace'])), result)).toContain(schemaVersion);
  });

  it('should have five sections', (): void => {
    expect(R.view(R.compose(schema, nextLength), result)).toBe(5);
  });

  it('should have include', (): void => {
    expect(R.view(R.compose(schema, nextHeadName), result)).toBe('xs:include');
  });

  it('should have annotation', (): void => {
    expect(R.view(R.compose(schema, nextSecondName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(schema, nextSecond, nextHead, nextHeadText), result)).toBe(schemaDocumentation);
  });

  it('should have section annotation', (): void => {
    expect(R.view(R.compose(schema, nextThirdName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(schema, nextThird, nextHead, nextHeadText), result)).toBe(schemaSectionDocumentation);
  });

  it('should have complex type', (): void => {
    expect(R.view(R.compose(schema, nextFourthName), result)).toBe('xs:complexType');
    expect(R.view(R.compose(schema, nextFourth, nextHead, nextHead, nextHeadText), result)).toBe(complexTypeDocumentation);
  });

  it('should have simple type', (): void => {
    expect(R.view(R.compose(schema, nextFifthName), result)).toBe('xs:simpleType');
    expect(R.view(R.compose(schema, nextFifth, nextHead, nextHead, nextHeadText), result)).toBe(simpleTypeDocumentation);
  });
});
