import { EntityProperty, PropertyType, SemVer } from '@edfi/metaed-core';
import { choicePropertyColumnCreator } from './ChoicePropertyColumnCreator';
import { commonPropertyColumnCreator } from './CommonPropertyColumnCreator';
import { descriptorPropertyColumnCreator } from './DescriptorPropertyColumnCreator';
import { enumerationPropertyColumnCreator } from './EnumerationPropertyColumnCreator';
import { inlineCommonPropertyColumnCreator } from './InlineCommonPropertyColumnCreator';
import { referencePropertyColumnCreator } from './ReferencePropertyColumnCreator';
import { schoolYearEnumerationPropertyColumnCreator } from './SchoolYearEnumerationPropertyColumnCreator';
import { simplePropertyColumnCreator } from './SimplePropertyColumnCreator';
import { ColumnCreator, nullColumnCreator } from './ColumnCreator';

export interface ColumnCreatorFactory {
  columnCreatorFor(property: EntityProperty, targetTechnologyVersion: SemVer): ColumnCreator;
}

export const columnCreatorFactory: ColumnCreatorFactory = {
  columnCreatorFor: (property: EntityProperty, targetTechnologyVersion: SemVer): ColumnCreator => {
    const columnCreator: { [propertyType in PropertyType]: () => ColumnCreator } = {
      association: () => referencePropertyColumnCreator(columnCreatorFactory, targetTechnologyVersion),
      choice: () => choicePropertyColumnCreator(columnCreatorFactory, targetTechnologyVersion),
      common: () => commonPropertyColumnCreator(columnCreatorFactory, targetTechnologyVersion),
      domainEntity: () => referencePropertyColumnCreator(columnCreatorFactory, targetTechnologyVersion),
      inlineCommon: () => inlineCommonPropertyColumnCreator(columnCreatorFactory, targetTechnologyVersion),

      descriptor: () => descriptorPropertyColumnCreator(),
      enumeration: () => enumerationPropertyColumnCreator(),
      schoolYearEnumeration: () => schoolYearEnumerationPropertyColumnCreator(),

      boolean: () => simplePropertyColumnCreator(),
      currency: () => simplePropertyColumnCreator(),
      date: () => simplePropertyColumnCreator(),
      datetime: () => simplePropertyColumnCreator(),
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

      unknown: () => nullColumnCreator(),
    };

    return columnCreator[property.type]();
  },
};
