import { getEntitiesOfTypeForNamespaces, newIntegerProperty } from '@edfi/metaed-core';
import { EnhancerResult, EntityProperty, IntegerProperty, MetaEdEnvironment, ModelBase, Namespace } from '@edfi/metaed-core';
import { addEntityPropertyEdfiOdsTo } from '../model/property/EntityProperty';
import { TopLevelEntityEdfiOds } from '../model/TopLevelEntity';

const enhancerName = 'CreateUsisFromUniqueIdsEnhancer';

// UniqueId properties become unique indexes, but demoted from primary key
// As of METAED-1134, all other identity properties are demoted and made unique indexes as well
function demoteIdentityPropertiesAndAddToUniqueIndex(topLevelEntityEdfiOds: TopLevelEntityEdfiOds) {
  topLevelEntityEdfiOds.odsProperties = topLevelEntityEdfiOds.odsProperties.filter((x) => !x.isPartOfIdentity);
  topLevelEntityEdfiOds.odsIdentityProperties.forEach((identityProperty) => {
    const formerIdentityProperty: EntityProperty = { ...identityProperty };
    formerIdentityProperty.data.edfiOdsRelational.odsIsUniqueIndex = true;
    formerIdentityProperty.isPartOfIdentity = false;
    topLevelEntityEdfiOds.odsProperties.push(formerIdentityProperty);
  });

  topLevelEntityEdfiOds.odsIdentityProperties = [];
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  getEntitiesOfTypeForNamespaces([coreNamespace], 'domainEntity').forEach((entity: ModelBase) => {
    const uniqueIdProperty: EntityProperty | null = entity.data.edfiOdsRelational.odsIdentityProperties.find(
      (x) => x.metaEdName === 'UniqueId',
    );
    if (uniqueIdProperty == null) return;

    demoteIdentityPropertiesAndAddToUniqueIndex(entity.data.edfiOdsRelational);

    // a UniqueId property gets a parallel USI identity column
    const usiProperty: IntegerProperty = {
      ...newIntegerProperty(),
      metaEdName: 'USI',
      roleName: uniqueIdProperty.roleName,
      shortenTo: uniqueIdProperty.shortenTo,
      documentation: uniqueIdProperty.documentation,
      isPartOfIdentity: true,
      parentEntityName: uniqueIdProperty.parentEntityName,
      parentEntity: uniqueIdProperty.parentEntity,
    };
    addEntityPropertyEdfiOdsTo(usiProperty);
    usiProperty.data.edfiOdsRelational.odsIsIdentityDatabaseType = true;
    entity.data.edfiOdsRelational.odsProperties.push(usiProperty);
    entity.data.edfiOdsRelational.odsIdentityProperties.push(usiProperty);
  });

  return {
    enhancerName,
    success: true,
  };
}
