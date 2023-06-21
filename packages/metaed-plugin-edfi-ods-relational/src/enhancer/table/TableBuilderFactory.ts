import type { CommonProperty, EntityProperty, PropertyType } from '@edfi/metaed-core';
import { columnCreatorFactory } from './ColumnCreatorFactory';
import { choicePropertyTableBuilder } from './ChoicePropertyTableBuilder';
import { commonExtensionPropertyTableBuilder } from './CommonExtensionPropertyTableBuilder';
import { commonPropertyTableBuilder } from './CommonPropertyTableBuilder';
import { descriptorPropertyTableBuilder } from './DescriptorPropertyTableBuilder';
import { enumerationPropertyTableBuilder } from './EnumerationPropertyTableBuilder';
import { inlineCommonPropertyTableBuilder } from './InlineCommonPropertyTableBuilder';
import { referencePropertyTableBuilder } from './ReferencePropertyTableBuilder';
import { simplePropertyTableBuilder } from './SimplePropertyTableBuilder';
import { TableBuilder, nullTableBuilder } from './TableBuilder';

export interface TableBuilderFactory {
  tableBuilderFor(property: EntityProperty): TableBuilder;
}

export const tableBuilderFactory: TableBuilderFactory = {
  tableBuilderFor: (property: EntityProperty): TableBuilder => {
    const tableBuilder: { [propertyType in PropertyType]: () => TableBuilder } = {
      association: () => referencePropertyTableBuilder(columnCreatorFactory),
      choice: () => choicePropertyTableBuilder(tableBuilderFactory),
      common: () =>
        (property as CommonProperty).isExtensionOverride
          ? commonExtensionPropertyTableBuilder(tableBuilderFactory, columnCreatorFactory)
          : commonPropertyTableBuilder(tableBuilderFactory, columnCreatorFactory),
      descriptor: () => descriptorPropertyTableBuilder(columnCreatorFactory),
      domainEntity: () => referencePropertyTableBuilder(columnCreatorFactory),
      enumeration: () => enumerationPropertyTableBuilder(columnCreatorFactory),
      inlineCommon: () => inlineCommonPropertyTableBuilder(tableBuilderFactory),
      schoolYearEnumeration: () => enumerationPropertyTableBuilder(columnCreatorFactory),

      boolean: () => simplePropertyTableBuilder(columnCreatorFactory),
      currency: () => simplePropertyTableBuilder(columnCreatorFactory),
      date: () => simplePropertyTableBuilder(columnCreatorFactory),
      datetime: () => simplePropertyTableBuilder(columnCreatorFactory),
      decimal: () => simplePropertyTableBuilder(columnCreatorFactory),
      duration: () => simplePropertyTableBuilder(columnCreatorFactory),
      integer: () => simplePropertyTableBuilder(columnCreatorFactory),
      percent: () => simplePropertyTableBuilder(columnCreatorFactory),
      sharedDecimal: () => simplePropertyTableBuilder(columnCreatorFactory),
      sharedInteger: () => simplePropertyTableBuilder(columnCreatorFactory),
      sharedShort: () => simplePropertyTableBuilder(columnCreatorFactory),
      sharedString: () => simplePropertyTableBuilder(columnCreatorFactory),
      short: () => simplePropertyTableBuilder(columnCreatorFactory),
      string: () => simplePropertyTableBuilder(columnCreatorFactory),
      time: () => simplePropertyTableBuilder(columnCreatorFactory),
      year: () => simplePropertyTableBuilder(columnCreatorFactory),

      unknown: () => nullTableBuilder(),
    };

    return tableBuilder[property.type]();
  },
};
