// 2.x - METAED-711 - ODS-1732
import {
  asTopLevelEntity,
  getAllEntitiesOfType,
  versionSatisfies,
  V2Only,
  EntityProperty,
  MetaEdEnvironment,
  ModelBase,
  PluginEnvironment,
  SemVer,
  TopLevelEntity,
  ValidationFailure,
} from 'metaed-core';
import { collectSingleEntity, propertyCollector } from '../ValidatorShared/PropertyCollector';

const validatorName = 'MergingEntityExtensionPropertyWithCorePropertyOfSameNameIsUnsupported';
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

  getAllEntitiesOfType(
    metaEd,
    'associationExtension',
    'associationSubclass',
    'domainEntityExtension',
    'domainEntitySubclass',
  )
    .map((entity: ModelBase) => asTopLevelEntity(entity))
    .forEach((entity: TopLevelEntity) => {
      if (!entity.namespace.isExtension || !entity.baseEntity) return;
      if (entity.baseEntity.namespace.isExtension) return;

      const baseEntityResult: {
        referencedEntities: {
          roleName: string;
          entity: TopLevelEntity;
        }[];
        properties: {
          roleName: string;
          property: EntityProperty;
        }[];
      } = collectSingleEntity(
        entity.baseEntity,
        true,
        (referencedEntity, property) => ({
          roleName: property.roleName,
          entity: asTopLevelEntity(referencedEntity),
        }),
        (_referencedEntity, property) => ({
          roleName: property.roleName,
          property,
        }),
      );

      const extensionEntityResult: {
        referencedEntities: {
          roleName: string;
          entity: TopLevelEntity;
        }[];
        properties: {
          roleName: string;
          property: EntityProperty;
        }[];
      } = collectSingleEntity(
        entity,
        true,
        (referencedEntity, property) => ({
          roleName: property.roleName,
          entity: asTopLevelEntity(referencedEntity),
        }),
        (_referencedEntity, property) => ({
          roleName: property.roleName,
          property,
        }),
      );

      const baseProperties: { roleName: string; property: EntityProperty }[] = [];
      const extensionProperties: { roleName: string; property: EntityProperty }[] = [];

      baseEntityResult.properties.forEach((result) => {
        baseProperties.push({ roleName: result.roleName, property: result.property });
      });
      baseEntityResult.referencedEntities.forEach((result) => {
        baseProperties.push(
          ...propertyCollector(result.entity).map((property) => ({
            roleName: result.roleName,
            property,
          })),
        );
      });

      extensionEntityResult.properties.forEach((result) => {
        baseProperties.push({ roleName: result.roleName, property: result.property });
      });
      extensionEntityResult.referencedEntities.forEach((referencedEntity) => {
        extensionProperties.push(
          ...propertyCollector(referencedEntity.entity).map((property) => ({
            roleName: referencedEntity.roleName,
            property,
          })),
        );
      });
      const extensionPropertyNames: string[] = extensionProperties.map(
        (x) => x.roleName + x.property.roleName + x.property.metaEdName,
      );

      const duplicateProperties: {
        roleName: string;
        property: EntityProperty;
      }[] = baseProperties.filter((x) =>
        extensionPropertyNames.includes(x.roleName + x.property.roleName + x.property.metaEdName),
      );

      duplicateProperties.forEach((duplicate: { roleName: string; property: EntityProperty }) => {
        if (!entity.baseEntity) return;
        failures.push({
          validatorName,
          category: 'warning',
          message: `[ODS-1732] ${entity.typeHumanizedName} ${entity.metaEdName} has a property path that conflicts with property ${duplicate.property.metaEdName} on core ${entity.baseEntity.typeHumanizedName} ${entity.baseEntity.metaEdName}. Merging properties of an extension entity with a core property of the same name is currently unsupported by the ODS/API.`,
          sourceMap: duplicate.property.sourceMap.type,
          fileMap: null,
        });
      });
    });
  return failures;
}
