import { EntityProperty, SemVer } from '@edfi/metaed-core';
import { choicePropertyColumnCreator } from './ChoicePropertyColumnCreator';
import { commonPropertyColumnCreator } from './CommonPropertyColumnCreator';
import { descriptorPropertyColumnCreator } from './DescriptorPropertyColumnCreator';
import { enumerationPropertyColumnCreator } from './EnumerationPropertyColumnCreator';
import { inlineCommonPropertyColumnCreator } from './InlineCommonPropertyColumnCreator';
import { referencePropertyColumnCreator } from './ReferencePropertyColumnCreator';
import { schoolYearEnumerationPropertyColumnCreator } from './SchoolYearEnumerationPropertyColumnCreator';
import { simplePropertyColumnCreator } from './SimplePropertyColumnCreator';
import { ColumnCreator, nullColumnCreator } from './ColumnCreator';

export function columnCreatorFor(property: EntityProperty, targetTechnologyVersion: SemVer): ColumnCreator {
  switch (property.type) {
    case 'association':
    case 'domainEntity':
      return referencePropertyColumnCreator(targetTechnologyVersion);

    case 'choice':
      return choicePropertyColumnCreator(targetTechnologyVersion);
    case 'common':
      return commonPropertyColumnCreator(targetTechnologyVersion);
    case 'inlineCommon':
      return inlineCommonPropertyColumnCreator(targetTechnologyVersion);
    case 'descriptor':
      return descriptorPropertyColumnCreator();
    case 'enumeration':
      return enumerationPropertyColumnCreator();
    case 'schoolYearEnumeration':
      return schoolYearEnumerationPropertyColumnCreator();

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
      return simplePropertyColumnCreator();

    default:
      return nullColumnCreator();
  }
}
