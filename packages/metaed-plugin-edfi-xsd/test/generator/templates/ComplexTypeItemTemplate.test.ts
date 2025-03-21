// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import xmlParser from 'xml-js';
import { createElementComplexTypeItem, createElementGroupComplexTypeItem } from '../GeneratorTestBase';
import {
  xsdMinOccurs,
  xsdMaxOccurs,
  xsdAttributeName,
  xsdAttributeType,
  nextHeadText,
  nextHeadName,
  nextHead,
  nextLength,
} from './TemplateTestHelper';
import { templateNamed, registerPartials } from '../../../src/generator/XsdGeneratorBase';

const complexTypeItem = nextHead;

describe('when generating complex type item', (): void => {
  const documentation = 'Documentation';
  const complexTypeName = 'Complex Type Name';
  const type = 'ComplexObjectType';

  let result;

  beforeAll(() => {
    registerPartials();
    const testObject = createElementComplexTypeItem(complexTypeName, documentation, type);
    const rawXsd = templateNamed('complexTypeItem')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be element complex type only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:element');
  });

  it('should have element complex type name', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeName), result)).toBe(complexTypeName);
  });

  it('should have element complex type type', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeType), result)).toBe(type);
  });

  it('should have annotation only', (): void => {
    expect(R.view(R.compose(complexTypeItem, nextLength), result)).toBe(1);
    expect(R.view(R.compose(complexTypeItem, nextHeadName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(complexTypeItem, nextHead, nextHead, nextHeadText), result)).toBe(documentation);
  });

  it('should not have min occurs', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdMinOccurs), result)).not.toBeDefined();
  });

  it('should not have max occurs', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdMaxOccurs), result)).not.toBeDefined();
  });
});

describe('when generating complex type item with min occurs', (): void => {
  const documentation = 'Documentation';
  const complexTypeName = 'Complex Type Name';
  const type = 'ComplexObjectType';
  const minOccurs = '0';

  let result;

  beforeAll(() => {
    registerPartials();
    const testObject = createElementComplexTypeItem(complexTypeName, documentation, type, minOccurs);
    const rawXsd = templateNamed('complexTypeItem')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be element complex type only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:element');
  });

  it('should have element complex type name', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeName), result)).toBe(complexTypeName);
  });

  it('should have element complex type type', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeType), result)).toBe(type);
  });

  it('should have annotation only', (): void => {
    expect(R.view(R.compose(complexTypeItem, nextLength), result)).toBe(1);
    expect(R.view(R.compose(complexTypeItem, nextHeadName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(complexTypeItem, nextHead, nextHead, nextHeadText), result)).toBe(documentation);
  });

  it('should have min occurs', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdMinOccurs), result)).toBe(minOccurs);
  });

  it('should not have max occurs', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdMaxOccurs), result)).not.toBeDefined();
  });
});

describe('when generating complex type item with max occurs unbounded', (): void => {
  const documentation = 'Documentation';
  const complexTypeName = 'Complex Type Name';
  const type = 'ComplexObjectType';

  let result;

  beforeAll(() => {
    registerPartials();
    const testObject = createElementComplexTypeItem(complexTypeName, documentation, type, '', '', true);
    const rawXsd = templateNamed('complexTypeItem')(testObject);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be element complex type only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:element');
  });

  it('should have element complex type name', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeName), result)).toBe(complexTypeName);
  });

  it('should have element complex type type', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeType), result)).toBe(type);
  });

  it('should have annotation only', (): void => {
    expect(R.view(R.compose(complexTypeItem, nextLength), result)).toBe(1);
    expect(R.view(R.compose(complexTypeItem, nextHeadName), result)).toBe('xs:annotation');
    expect(R.view(R.compose(complexTypeItem, nextHead, nextHead, nextHeadText), result)).toBe(documentation);
  });

  it('should not have min occurs', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdMinOccurs), result)).not.toBeDefined();
  });

  it('should not have max occurs', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdMaxOccurs), result)).toBe('unbounded');
  });
});

describe('when generating complex type item with element item', (): void => {
  const documentation = 'Documentation';
  const complexTypeName = 'Complex Type Name';
  const type = 'ComplexObjectType';

  let result;

  beforeAll(() => {
    registerPartials();
    const elementGroup = createElementGroupComplexTypeItem();
    const element = createElementComplexTypeItem(complexTypeName, documentation, type);
    elementGroup.items.push(element);
    const rawXsd = templateNamed('complexTypeItem')(elementGroup);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be sequence complex type only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:sequence');
  });

  it('should not have element complex type name', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeName), result)).not.toBeDefined();
  });

  it('should not have element complex type type', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeType), result)).not.toBeDefined();
  });

  it('should not have annotation, but element instead', (): void => {
    expect(R.view(R.compose(complexTypeItem, nextLength), result)).toBe(1);
    expect(R.view(R.compose(complexTypeItem, nextHeadName), result)).toBe('xs:element');
  });
});

describe('when generating element group complex type item is choice with element item', (): void => {
  const documentation = 'Documentation';
  const complexTypeName = 'Complex Type Name';
  const type = 'ComplexObjectType';

  let result;

  beforeAll(() => {
    registerPartials();
    const elementGroup = createElementGroupComplexTypeItem(true);
    const element = createElementComplexTypeItem(complexTypeName, documentation, type);
    elementGroup.items.push(element);
    const rawXsd = templateNamed('complexTypeItem')(elementGroup);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be sequence complex type only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:choice');
  });

  it('should not have element complex type name', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeName), result)).not.toBeDefined();
  });

  it('should not have element complex type type', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeType), result)).not.toBeDefined();
  });

  it('should not have annotation, but element instead', (): void => {
    expect(R.view(R.compose(complexTypeItem, nextLength), result)).toBe(1);
    expect(R.view(R.compose(complexTypeItem, nextHeadName), result)).toBe('xs:element');
  });
});

describe('when generating element group complex type item with element group item', (): void => {
  const documentation = 'Documentation';
  const complexTypeName = 'Complex Type Name';
  const type = 'ComplexObjectType';

  let result;

  beforeAll(() => {
    registerPartials();
    const elementGroup = createElementGroupComplexTypeItem();
    const subElementGroup = createElementGroupComplexTypeItem();
    const element = createElementComplexTypeItem(complexTypeName, documentation, type);
    elementGroup.items.push(subElementGroup);
    subElementGroup.items.push(element);
    const rawXsd = templateNamed('complexTypeItem')(elementGroup);
    result = xmlParser.xml2js(rawXsd);
  });

  it('should be sequence complex type only', (): void => {
    expect(R.view(nextLength, result)).toBe(1);
    expect(R.view(nextHeadName, result)).toBe('xs:sequence');
  });

  it('should not have element complex type name', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeName), result)).not.toBeDefined();
  });

  it('should not have element complex type type', (): void => {
    expect(R.view(R.compose(complexTypeItem, xsdAttributeType), result)).not.toBeDefined();
  });

  it('should not have annotation, but sequqence followed by element instead', (): void => {
    expect(R.view(R.compose(complexTypeItem, nextLength), result)).toBe(1);
    expect(R.view(R.compose(complexTypeItem, nextHeadName), result)).toBe('xs:sequence');
    expect(R.view(R.compose(complexTypeItem, nextHead, nextHeadName), result)).toBe('xs:element');
  });
});
