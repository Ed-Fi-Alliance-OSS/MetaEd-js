import { asTopLevelEntity, getAllEntitiesOfType, newReferentialProperty, NoTopLevelEntity } from 'metaed-core';
import { EnhancerResult, MetaEdEnvironment, PropertyType, ReferentialProperty, TopLevelEntity } from 'metaed-core';
import { addEntityPropertyEdfiOdsTo } from '../model/property/EntityProperty';

const enhancerName = 'TopLevelEntityBaseReferenceEnhancer';

export function propertyTypeFor(entity: TopLevelEntity): PropertyType {
  switch (entity.type) {
    case 'association':
    case 'associationExtension':
    case 'associationSubclass':
      return 'association';
    case 'domainEntity':
    case 'domainEntityExtension':
    case 'domainEntitySubclass':
      return 'domainEntity';
    default:
      return 'unknown';
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'associationExtension',
    'associationSubclass',
    'domainEntityExtension',
    'domainEntitySubclass',
  )
    .map((x) => asTopLevelEntity(x))
    .forEach((entity: TopLevelEntity) => {
      if (entity.data.edfiOdsRelational.odsProperties.some((x) => x.isIdentityRename)) return;

      const referenceToBase: ReferentialProperty = {
        ...newReferentialProperty(),
        metaEdName: entity.baseEntity ? entity.baseEntity.metaEdName : '',
        documentation: entity.baseEntity ? entity.baseEntity.documentation : '',
        type: entity.baseEntity ? propertyTypeFor(entity.baseEntity) : 'unknown',
        isPartOfIdentity: true,
        parentEntity: entity,
        referencedEntity: entity.baseEntity ? entity.baseEntity : NoTopLevelEntity,
        namespace: entity.namespace,
        data: {
          edfiOdsRelational: {
            odsDeleteCascadePrimaryKey: true,
            odsCausesCyclicUpdateCascade: false,
            odsIsReferenceToSuperclass: entity.type === 'associationSubclass' || entity.type === 'domainEntitySubclass',
            odsIsReferenceToExtensionParent:
              entity.type === 'associationExtension' || entity.type === 'domainEntityExtension',
          },
        },
      };
      addEntityPropertyEdfiOdsTo(referenceToBase);
      entity.data.edfiOdsRelational.odsProperties.push(referenceToBase);
      entity.data.edfiOdsRelational.odsIdentityProperties.push(referenceToBase);
    });

  return {
    enhancerName,
    success: true,
  };
}
