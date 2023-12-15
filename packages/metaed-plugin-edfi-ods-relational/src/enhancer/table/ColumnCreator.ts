import { EntityProperty, SemVer } from '@edfi/metaed-core';
import { choicePropertyColumnCreator } from './ChoicePropertyColumnCreator';
import { commonPropertyColumnCreator } from './CommonPropertyColumnCreator';
import { descriptorPropertyColumnCreator } from './DescriptorPropertyColumnCreator';
import { enumerationPropertyColumnCreator } from './EnumerationPropertyColumnCreator';
import { inlineCommonPropertyColumnCreator } from './InlineCommonPropertyColumnCreator';
import { referencePropertyColumnCreator } from './ReferencePropertyColumnCreator';
import { schoolYearEnumerationPropertyColumnCreator } from './SchoolYearEnumerationPropertyColumnCreator';
import { simplePropertyColumnCreator } from './SimplePropertyColumnCreator';
import { Column } from '../../model/database/Column';
import { BuildStrategy } from './BuildStrategy';

export function columnCreatorFor(
  property: EntityProperty,
  buildStrategy: BuildStrategy,
  targetTechnologyVersion: SemVer,
): Column[] {
  switch (property.type) {
    case 'association':
    case 'domainEntity':
      return referencePropertyColumnCreator(property, buildStrategy, targetTechnologyVersion);

    case 'choice':
      return choicePropertyColumnCreator(property, buildStrategy, targetTechnologyVersion);
    case 'common':
      return commonPropertyColumnCreator(property, buildStrategy, targetTechnologyVersion);
    case 'inlineCommon':
      return inlineCommonPropertyColumnCreator(property, buildStrategy, targetTechnologyVersion);
    case 'descriptor':
      return descriptorPropertyColumnCreator(property, buildStrategy);
    case 'enumeration':
      return enumerationPropertyColumnCreator(property, buildStrategy);
    case 'schoolYearEnumeration':
      return schoolYearEnumerationPropertyColumnCreator(property, buildStrategy);

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
      return simplePropertyColumnCreator(property, buildStrategy);

    default:
      return [];
  }
}
