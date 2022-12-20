import * as R from 'ramda';
import xmlParser from 'xml-js';
import { createAnnotation } from '../GeneratorTestBase';
import { nextSecondName, nextHeadText, nextHeadName, nextSecond, nextHead, nextLength } from './TemplateTestHelper';
import { templateNamed } from '../../../src/generator/XsdGeneratorBase';

const annotation = nextHead;

describe('when generating schema', (): void => {
  const documentation = 'documentation';
  let result;

  beforeAll(() => {
    const testObject = createAnnotation(documentation);
    const rawXsd = templateNamed('annotation')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be annotation only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:annotation');
  });

  it('should have correct documentation', (): void => {
    expect(R.view(R.compose(annotation, nextLength), result)).toBe(1);
    expect(R.view(R.compose(annotation, nextHeadName), result)).toBe('xs:documentation');
    expect(R.view(R.compose(annotation, nextHead, nextHeadText), result)).toBe(documentation);
  });
});

describe('when generating annotation with type group', (): void => {
  const documentation = 'Documentation';
  const typeGroup = 'TypeGroup';
  let result;

  beforeAll(() => {
    const testObject = createAnnotation(documentation, typeGroup);
    const rawXsd = templateNamed('annotation')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be annotation only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:annotation');
  });

  it('should be annotation only', (): void => {
    expect(R.view(R.compose(annotation, nextLength), result)).toBe(2);
  });

  it('should have correct documentation', (): void => {
    expect(R.view(R.compose(annotation, nextHeadName), result)).toBe('xs:documentation');
    expect(R.view(R.compose(annotation, nextHead, nextHeadText), result)).toBe(documentation);
  });

  it('should have appinfo', (): void => {
    expect(R.view(R.compose(annotation, nextSecondName), result)).toBe('xs:appinfo');
  });

  it('should have type group only', (): void => {
    const appinfo = R.compose(annotation, nextSecond);
    expect(R.view(R.compose(appinfo, nextLength), result)).toBe(1);
    expect(R.view(R.compose(appinfo, nextHead, nextHeadText), result)).toBe(typeGroup);
  });
});
