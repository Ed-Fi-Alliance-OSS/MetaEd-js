// @flow

// 2.x - METAED-711 - ODS-1732
import { asTopLevelEntity, getEntitiesOfType, versionSatisfies } from 'metaed-core';
import type {
  EntityProperty,
  MetaEdEnvironment,
  ModelBase,
  PluginEnvironment,
  SemVer,
  TopLevelEntity,
  ValidationFailure,
} from 'metaed-core';
import { collectSingleEntity, propertyCollector } from '../ValidatorShared/PropertyCollector';

const validatorName: string = 'MergingEntityExtensionPropertyWithCorePropertyOfSameNameIsUnsupported';
const targetTechnologyVersion: SemVer = '2.x';

function isTargetTechnologyVersion(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies(
    ((metaEd.plugin.get('edfiOdsApi'): any): PluginEnvironment).targetTechnologyVersion,
    targetTechnologyVersion,
  );
}

export function validate(metaEd: MetaEdEnvironment): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];
  if (!isTargetTechnologyVersion(metaEd)) return failures;

  getEntitiesOfType(
    metaEd.entity,
    'associationExtension',
    'associationSubclass',
    'domainEntityExtension',
    'domainEntitySubclass',
  )
    .map((entity: ModelBase) => asTopLevelEntity(entity))
    .forEach((entity: TopLevelEntity) => {
      if (!entity.namespaceInfo.isExtension || !entity.baseEntity) return;
      if (entity.baseEntity.namespaceInfo.isExtension) return;

      const baseEntityResult: {
        referencedEntities: Array<{
          withContext: string,
          entity: TopLevelEntity,
        }>,
        properties: Array<{
          withContext: string,
          property: EntityProperty,
        }>,
      } = collectSingleEntity(
        entity.baseEntity,
        true,
        (referencedEntity, property) => ({
          withContext: property.withContext,
          entity: asTopLevelEntity(referencedEntity),
        }),
        (referencedEntity, property) => ({
          withContext: property.withContext,
          property,
        }),
      );

      const extensionEntityResult: {
        referencedEntities: Array<{
          withContext: string,
          entity: TopLevelEntity,
        }>,
        properties: Array<{
          withContext: string,
          property: EntityProperty,
        }>,
      } = collectSingleEntity(
        entity,
        true,
        (referencedEntity, property) => ({
          withContext: property.withContext,
          entity: asTopLevelEntity(referencedEntity),
        }),
        (referencedEntity, property) => ({
          withContext: property.withContext,
          property,
        }),
      );

      const baseProperties: Array<{ withContext: string, property: EntityProperty }> = [];
      const extensionProperties: Array<{ withContext: string, property: EntityProperty }> = [];

      baseEntityResult.properties.forEach(result => {
        baseProperties.push({ withContext: result.withContext, property: result.property });
      });
      baseEntityResult.referencedEntities.forEach(result => {
        baseProperties.push(
          ...propertyCollector(result.entity).map(property => ({
            withContext: result.withContext,
            property,
          })),
        );
      });

      extensionEntityResult.properties.forEach(result => {
        baseProperties.push({ withContext: result.withContext, property: result.property });
      });
      extensionEntityResult.referencedEntities.forEach(referencedEntity => {
        extensionProperties.push(
          ...propertyCollector(referencedEntity.entity).map(property => ({
            withContext: referencedEntity.withContext,
            property,
          })),
        );
      });
      const extensionPropertyNames: Array<string> = extensionProperties.map(
        x => x.withContext + x.property.withContext + x.property.metaEdName,
      );

      const duplicateProperties: Array<{
        withContext: string,
        property: EntityProperty,
      }> = baseProperties.filter(x =>
        extensionPropertyNames.includes(x.withContext + x.property.withContext + x.property.metaEdName),
      );

      duplicateProperties.forEach((duplicate: { withContext: string, property: EntityProperty }) => {
        if (!entity.baseEntity) return;
        failures.push({
          validatorName,
          category: 'warning',
          message: `[ODS-1732] ${entity.typeHumanizedName} ${
            entity.metaEdName
          } has a property path that conflicts with property ${duplicate.property.metaEdName} on core ${
            entity.baseEntity.typeHumanizedName
          } ${
            entity.baseEntity.metaEdName
          }. Merging properties of an extension entity with a core property of the same name is currently unsupported by the ODS/API.`,
          sourceMap: duplicate.property.sourceMap.type,
          fileMap: null,
        });
      });
    });
  return failures;
}
