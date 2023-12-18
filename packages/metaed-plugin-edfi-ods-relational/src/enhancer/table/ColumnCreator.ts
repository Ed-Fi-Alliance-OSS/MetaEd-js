import { EntityProperty, MetaEdPropertyPath, SemVer } from '@edfi/metaed-core';
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

/**
 * Creates column(s) for the given property. Includes BuildStrategy to adjust column naming/attributes.
 * currentPropertyPath is for the given property.
 */
export function createColumnFor(
  property: EntityProperty,
  buildStrategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
  targetTechnologyVersion: SemVer,
): Column[] {
  switch (property.type) {
    case 'association':
    case 'domainEntity':
      return referencePropertyColumnCreator(property, buildStrategy, currentPropertyPath, targetTechnologyVersion);

    case 'choice':
      return choicePropertyColumnCreator(property, buildStrategy, currentPropertyPath, targetTechnologyVersion);
    case 'common':
      return commonPropertyColumnCreator(property, buildStrategy, currentPropertyPath, targetTechnologyVersion);
    case 'inlineCommon':
      return inlineCommonPropertyColumnCreator(property, buildStrategy, currentPropertyPath, targetTechnologyVersion);
    case 'descriptor':
      return descriptorPropertyColumnCreator(property, buildStrategy, currentPropertyPath);
    case 'enumeration':
      return enumerationPropertyColumnCreator(property, buildStrategy, currentPropertyPath);
    case 'schoolYearEnumeration':
      return schoolYearEnumerationPropertyColumnCreator(property, buildStrategy, currentPropertyPath);

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
      return simplePropertyColumnCreator(property, buildStrategy, currentPropertyPath);

    default:
      return [];
  }
}
