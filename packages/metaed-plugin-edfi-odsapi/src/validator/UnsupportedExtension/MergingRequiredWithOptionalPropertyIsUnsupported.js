// @flow

// 2.x - METAED-695 - ODS-1177
import { asTopLevelEntity, getAllTopLevelEntities } from 'metaed-core';
import type { EntityProperty, MetaEdEnvironment, ModelBase, TopLevelEntity, ValidationFailure } from 'metaed-core';
import { collectSingleEntity, propertyCollector } from '../ValidatorShared/PropertyCollector';

type PropertyCollectorArray = Array<{
  withContext: string,
  isOptional: boolean,
  property: EntityProperty,
}>;

const validatorName: string = 'MergingRequiredWithOptionalPropertyIsUnsupported';

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];

  getAllTopLevelEntities(metaEd.entity)
    .map((entity: ModelBase) => asTopLevelEntity(entity))
    .forEach((entity: TopLevelEntity) => {
      const result: {
        referencedEntities: Array<{
          withContext: string,
          isOptional: boolean,
          entity: TopLevelEntity,
        }>,
        properties: PropertyCollectorArray,
      } = collectSingleEntity(
        entity,
        true,
        (referencedEntity, property) => ({
          withContext: property.withContext,
          isOptional: property.isOptional,
          entity: asTopLevelEntity(referencedEntity),
        }),
        (referencedEntity, property) => ({
          withContext: property.withContext,
          isOptional: property.isOptional,
          property,
        }),
      );

      const optionalProperties: PropertyCollectorArray = [];
      const requiredProperties: PropertyCollectorArray = [];

      requiredProperties.push(...result.properties.filter(property => !property.isOptional));
      optionalProperties.push(...result.properties.filter(property => property.isOptional));
      result.referencedEntities.forEach(referencedEntity => {
        if (referencedEntity.isOptional)
          optionalProperties.push(
            ...propertyCollector(referencedEntity.entity).map(property => ({
              withContext: referencedEntity.withContext,
              isOptional: referencedEntity.isOptional,
              property,
            })),
          );
        else {
          requiredProperties.push(
            ...propertyCollector(referencedEntity.entity).map(property => ({
              withContext: referencedEntity.withContext,
              isOptional: referencedEntity.isOptional,
              property,
            })),
          );
        }
      });

      const requiredPropertiesNames: Array<string> = requiredProperties.map(
        x => x.withContext + x.property.withContext + x.property.metaEdName,
      );
      const duplicateProperties: PropertyCollectorArray = optionalProperties.filter(x =>
        requiredPropertiesNames.includes(x.withContext + x.property.withContext + x.property.metaEdName),
      );

      duplicateProperties.forEach((duplicate: { withContext: string, isOptional: boolean, property: EntityProperty }) => {
        // skip failure message for now if this is a core only issue - in future maybe report if in a core-only mode (like IDE Alliance mode)
        if (!entity.namespaceInfo.isExtension) return;

        failures.push({
          validatorName,
          category: 'warning',
          message: `[ODS-1177] ${entity.typeHumanizedName} ${
            entity.metaEdName
          } has both a required and optional property path to property ${duplicate.withContext +
            duplicate.property
              .metaEdName}. Merging required properties with optional properties of the same name is currently unsupported by the ODS/API.`,
          sourceMap: duplicate.property.sourceMap.metaEdName,
          fileMap: null,
        });
        failures.push({
          validatorName,
          category: 'warning',
          message: `[ODS-1177] ${entity.typeHumanizedName} ${
            entity.metaEdName
          } has both a required and optional property path to property ${duplicate.withContext +
            duplicate.property
              .metaEdName}. Merging required properties with optional properties of the same name is currently unsupported by the ODS/API.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      });
    });

  return failures;
}
