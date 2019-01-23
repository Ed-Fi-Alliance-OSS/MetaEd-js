import R from 'ramda';

export const nameOf = R.lensProp('name');
export const textOf = R.lensProp('text');
export const nextLength = R.lensPath(['elements', 'length']);
export const nextHead = R.lensPath(['elements', 0]);
export const nextSecond = R.lensPath(['elements', 1]);
export const nextThird = R.lensPath(['elements', 2]);
export const nextFourth = R.lensPath(['elements', 3]);
export const nextFifth = R.lensPath(['elements', 4]);
export const nextHeadName = R.compose(
  nextHead,
  nameOf,
);
export const nextHeadText = R.compose(
  nextHead,
  textOf,
);
export const nextSecondName = R.compose(
  nextSecond,
  nameOf,
);
export const nextThirdName = R.compose(
  nextThird,
  nameOf,
);
export const nextFourthName = R.compose(
  nextFourth,
  nameOf,
);
export const nextFifthName = R.compose(
  nextFifth,
  nameOf,
);
export const xsdAttributeName = R.lensPath(['attributes', 'name']);
export const xsdAttributeType = R.lensPath(['attributes', 'type']);
export const xsdAttributeUse = R.lensPath(['attributes', 'use']);
export const xsdAttributeBase = R.lensPath(['attributes', 'base']);
export const xsdAttributeAbstract = R.lensPath(['attributes', 'abstract']);
export const xsdAttributeValue = R.lensPath(['attributes', 'value']);
export const xsdMinOccurs = R.lensPath(['attributes', 'minOccurs']);
export const xsdMaxOccurs = R.lensPath(['attributes', 'maxOccurs']);
export const elementsArray = R.lensProp('elements');
