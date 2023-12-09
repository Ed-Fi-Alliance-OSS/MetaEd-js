import type { CommonProperty, EntityProperty } from '@edfi/metaed-core';
import { choicePropertyTableBuilder } from './ChoicePropertyTableBuilder';
import { commonExtensionPropertyTableBuilder } from './CommonExtensionPropertyTableBuilder';
import { commonPropertyTableBuilder } from './CommonPropertyTableBuilder';
import { descriptorPropertyTableBuilder } from './DescriptorPropertyTableBuilder';
import { enumerationPropertyTableBuilder } from './EnumerationPropertyTableBuilder';
import { inlineCommonPropertyTableBuilder } from './InlineCommonPropertyTableBuilder';
import { referencePropertyTableBuilder } from './ReferencePropertyTableBuilder';
import { simplePropertyTableBuilder } from './SimplePropertyTableBuilder';
import { TableBuilder, nullTableBuilder } from './TableBuilder';

export function tableBuilderFor(property: EntityProperty): TableBuilder {
  switch (property.type) {
    case 'association':
    case 'domainEntity':
      return referencePropertyTableBuilder();

    case 'choice':
      return choicePropertyTableBuilder();
    case 'common':
      return (property as CommonProperty).isExtensionOverride
        ? commonExtensionPropertyTableBuilder()
        : commonPropertyTableBuilder();
    case 'inlineCommon':
      return inlineCommonPropertyTableBuilder();
    case 'descriptor':
      return descriptorPropertyTableBuilder();

    case 'enumeration':
    case 'schoolYearEnumeration':
      return enumerationPropertyTableBuilder();

    case 'boolean':
    case 'currency':
    case 'date':
    case 'datetime':
    case 'decimal':
    case 'duration':
    case 'integer':
    case 'percent':
    case 'sharedDecimal':
    case 'sharedInteger':
    case 'sharedShort':
    case 'sharedString':
    case 'short':
    case 'string':
    case 'time':
    case 'year':
      return simplePropertyTableBuilder();

    default:
      return nullTableBuilder();
  }
}
