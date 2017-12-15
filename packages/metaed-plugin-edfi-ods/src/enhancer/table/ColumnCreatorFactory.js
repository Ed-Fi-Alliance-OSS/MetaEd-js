// @flow
import type { EntityProperty, PropertyType } from 'metaed-core';
import { choicePropertyColumnCreator } from './ChoicePropertyColumnCreator';
import { commonPropertyColumnCreator } from './CommonPropertyColumnCreator';
import { descriptorPropertyColumnCreator } from './DescriptorPropertyColumnCreator';
import { enumerationPropertyColumnCreator } from './EnumerationPropertyColumnCreator';
import { inlineCommonPropertyColumnCreator } from './InlineCommonPropertyColumnCreator';
import { referencePropertyColumnCreator } from './ReferencePropertyColumnCreator';
import { schoolYearEnumerationPropertyColumnCreator } from './SchoolYearEnumerationPropertyColumnCreator';
import { simplePropertyColumnCreator } from './SimplePropertyColumnCreator';
import type { ColumnCreator } from './ColumnCreator';

export type ColumnCreatorFactory = {
  columnCreatorFor(property: EntityProperty): ColumnCreator
}

export const columnCreatorFactory: ColumnCreatorFactory = {
  columnCreatorFor: (property: EntityProperty): ColumnCreator => {
    const columnCreator: { [PropertyType]: () => ColumnCreator } = {
      association: () => referencePropertyColumnCreator(columnCreatorFactory),
      choice: () => choicePropertyColumnCreator(columnCreatorFactory),
      common: () => commonPropertyColumnCreator(columnCreatorFactory),
      domainEntity: () => referencePropertyColumnCreator(columnCreatorFactory),
      inlineCommon: () => inlineCommonPropertyColumnCreator(columnCreatorFactory),

      descriptor: () => descriptorPropertyColumnCreator(),
      enumeration: () => enumerationPropertyColumnCreator(),
      schoolYearEnumeration: () => schoolYearEnumerationPropertyColumnCreator(),

      boolean: () => simplePropertyColumnCreator(),
      currency: () => simplePropertyColumnCreator(),
      date: () => simplePropertyColumnCreator(),
      decimal: () => simplePropertyColumnCreator(),
      duration: () => simplePropertyColumnCreator(),
      integer: () => simplePropertyColumnCreator(),
      percent: () => simplePropertyColumnCreator(),
      sharedDecimal: () => simplePropertyColumnCreator(),
      sharedInteger: () => simplePropertyColumnCreator(),
      sharedShort: () => simplePropertyColumnCreator(),
      sharedString: () => simplePropertyColumnCreator(),
      short: () => simplePropertyColumnCreator(),
      string: () => simplePropertyColumnCreator(),
      time: () => simplePropertyColumnCreator(),
      year: () => simplePropertyColumnCreator(),
    };

    return columnCreator[property.type]();
  },
};
