import { EntityProperty, MetaEdPropertyPath, SemVer, TopLevelEntity } from '@edfi/metaed-core';
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
  originalEntity: TopLevelEntity,
  property: EntityProperty,
  buildStrategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
  targetTechnologyVersion: SemVer,
): Column[] {
  switch (property.type) {
    case 'association':
    case 'domainEntity':
      return referencePropertyColumnCreator(
        originalEntity,
        property,
        buildStrategy,
        currentPropertyPath,
        targetTechnologyVersion,
      );

    case 'choice':
      return choicePropertyColumnCreator(
        originalEntity,
        property,
        buildStrategy,
        currentPropertyPath,
        targetTechnologyVersion,
      );
    case 'common':
      return commonPropertyColumnCreator(
        originalEntity,
        property,
        buildStrategy,
        currentPropertyPath,
        targetTechnologyVersion,
      );
    case 'inlineCommon':
      return inlineCommonPropertyColumnCreator(
        originalEntity,
        property,
        buildStrategy,
        currentPropertyPath,
        targetTechnologyVersion,
      );
    case 'descriptor':
      return descriptorPropertyColumnCreator(originalEntity, property, buildStrategy, currentPropertyPath);
    case 'enumeration':
      return enumerationPropertyColumnCreator(originalEntity, property, buildStrategy, currentPropertyPath);
    case 'schoolYearEnumeration':
      return schoolYearEnumerationPropertyColumnCreator(originalEntity, property, buildStrategy, currentPropertyPath);

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
      return simplePropertyColumnCreator(originalEntity, property, buildStrategy, currentPropertyPath);

    default:
      return [];
  }
}
