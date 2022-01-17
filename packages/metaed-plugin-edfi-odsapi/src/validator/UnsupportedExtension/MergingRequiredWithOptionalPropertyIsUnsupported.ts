// 2.x - METAED-695 - ODS-1177
import { asTopLevelEntity, getAllTopLevelEntitiesForNamespaces, versionSatisfies, V2Only } from '@edfi/metaed-core';
import {
  EntityProperty,
  MetaEdEnvironment,
  ModelBase,
  TopLevelEntity,
  ValidationFailure,
  SemVer,
  PluginEnvironment,
} from '@edfi/metaed-core';
import { collectSingleEntity, propertyCollector } from '../ValidatorShared/PropertyCollector';

type PropertyCollectorArray = {
  roleName: string;
  isOptional: boolean;
  property: EntityProperty;
}[];

const validatorName = 'MergingRequiredWithOptionalPropertyIsUnsupported';
const targetTechnologyVersion: SemVer = V2Only;

function isTargetTechnologyVersion(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies(
    (metaEd.plugin.get('edfiOdsApi') as PluginEnvironment).targetTechnologyVersion,
    targetTechnologyVersion,
  );
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  if (!isTargetTechnologyVersion(metaEd)) return failures;

  getAllTopLevelEntitiesForNamespaces([...metaEd.namespace.values()])
    .map((entity: ModelBase) => asTopLevelEntity(entity))
    .forEach((entity: TopLevelEntity) => {
      const result: {
        referencedEntities: {
          roleName: string;
          isOptional: boolean;
          entity: TopLevelEntity;
        }[];
        properties: PropertyCollectorArray;
      } = collectSingleEntity(
        entity,
        true,
        (referencedEntity, property) => ({
          roleName: property.roleName,
          isOptional: property.isOptional,
          entity: asTopLevelEntity(referencedEntity),
        }),
        (_referencedEntity, property) => ({
          roleName: property.roleName,
          isOptional: property.isOptional,
          property,
        }),
      );

      const optionalProperties: PropertyCollectorArray = [];
      const requiredProperties: PropertyCollectorArray = [];

      requiredProperties.push(...result.properties.filter((property) => !property.isOptional));
      optionalProperties.push(...result.properties.filter((property) => property.isOptional));
      result.referencedEntities.forEach((referencedEntity) => {
        if (referencedEntity.isOptional)
          optionalProperties.push(
            ...propertyCollector(referencedEntity.entity).map((property) => ({
              roleName: referencedEntity.roleName,
              isOptional: referencedEntity.isOptional,
              property,
            })),
          );
        else {
          requiredProperties.push(
            ...propertyCollector(referencedEntity.entity).map((property) => ({
              roleName: referencedEntity.roleName,
              isOptional: referencedEntity.isOptional,
              property,
            })),
          );
        }
      });

      const requiredPropertiesNames: string[] = requiredProperties.map(
        (x) => x.roleName + x.property.roleName + x.property.metaEdName,
      );
      const duplicateProperties: PropertyCollectorArray = optionalProperties.filter((x) =>
        requiredPropertiesNames.includes(x.roleName + x.property.roleName + x.property.metaEdName),
      );

      duplicateProperties.forEach((duplicate: { roleName: string; isOptional: boolean; property: EntityProperty }) => {
        // skip failure message for now if this is a core only issue - in future maybe report if in a core-only mode (like IDE Alliance mode)
        if (!entity.namespace.isExtension) return;

        failures.push({
          validatorName,
          category: 'warning',
          message: `[ODS-1177] ${entity.typeHumanizedName} ${
            entity.metaEdName
          } has both a required and optional property path to property ${
            duplicate.roleName + duplicate.property.metaEdName
          }. Merging required properties with optional properties of the same name is currently unsupported by the ODS/API.`,
          sourceMap: duplicate.property.sourceMap.metaEdName,
          fileMap: null,
        });
        failures.push({
          validatorName,
          category: 'warning',
          message: `[ODS-1177] ${entity.typeHumanizedName} ${
            entity.metaEdName
          } has both a required and optional property path to property ${
            duplicate.roleName + duplicate.property.metaEdName
          }. Merging required properties with optional properties of the same name is currently unsupported by the ODS/API.`,
          sourceMap: entity.sourceMap.metaEdName,
          fileMap: null,
        });
      });
    });

  return failures;
}
