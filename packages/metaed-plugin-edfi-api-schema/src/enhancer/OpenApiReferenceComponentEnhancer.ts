import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { OpenApiObject, OpenApiProperties, OpenApiProperty } from '../model/OpenApi';
import { defaultPropertyModifier, prefixedName } from '../model/PropertyModifier';
import { findIdenticalRoleNamePatternPrefix, prependPrefixWithCollapse, uncapitalize } from '../Utility';
import { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';
import {
  isOpenApiPropertyRequired,
  newSchoolYearOpenApis,
  openApiObjectFrom,
  openApiPropertyForNonReference,
  SchoolYearOpenApis,
} from './OpenApiComponentEnhancerBase';

const enhancerName = 'OpenApiReferenceComponentEnhancer';

/**
 * Returns an OpenApi object that specifies the reference component shape
 * corresponding to the given entity.
 */
function openApiReferenceComponentFor(entity: TopLevelEntity, schoolYearOpenApis: SchoolYearOpenApis): OpenApiObject {
  const openApiProperties: OpenApiProperties = {};
  const required: Set<string> = new Set();

  const referencedEntityApiMapping = (entity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  // Ignore merges on references
  const flattenedIdentityPropertiesOmittingMerges = referencedEntityApiMapping.flattenedIdentityProperties.filter(
    (flattenedIdentityProperty: FlattenedIdentityProperty) => flattenedIdentityProperty.mergedAwayBy == null,
  );

  flattenedIdentityPropertiesOmittingMerges.forEach((flattenedIdentityProperty: FlattenedIdentityProperty) => {
    const identityPropertyApiMapping = (
      flattenedIdentityProperty.identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData
    ).apiMapping;

    const specialPrefix: string = findIdenticalRoleNamePatternPrefix(flattenedIdentityProperty);

    const adjustedName =
      specialPrefix === ''
        ? identityPropertyApiMapping.fullName
        : prependPrefixWithCollapse(identityPropertyApiMapping.fullName, specialPrefix);

    const openApiPropertyName: string = uncapitalize(prefixedName(adjustedName, defaultPropertyModifier));

    // Because these are flattened, we know they are non-reference properties
    const openApiProperty: OpenApiProperty = openApiPropertyForNonReference(
      flattenedIdentityProperty.identityProperty,
      schoolYearOpenApis,
    );

    // Note that this key/value usage of Object implictly merges by overwrite if there is more than one scalar property
    // with the same name sourced from different identity reference properties. There is no need to check
    // properties for merge directive annotations because MetaEd has already validated merges and any scalar identity
    // property name duplication _must_ be a merge.
    openApiProperties[openApiPropertyName] = openApiProperty;

    if (isOpenApiPropertyRequired(flattenedIdentityProperty.identityProperty, defaultPropertyModifier)) {
      // As above, this usage of Set implictly merges by overwrite
      required.add(openApiPropertyName);
    }
  });

  return openApiObjectFrom(openApiProperties, Array.from(required.values()));
}

/**
 * This enhancer uses the results of the ApiMappingEnhancer to create an OpenApiReferenceComponent
 * for each MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const schoolYearOpenApis: SchoolYearOpenApis = newSchoolYearOpenApis(metaEd.minSchoolYear, metaEd.maxSchoolYear);

  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'associationExtension',
    'domainEntityExtension',
  ).forEach((entity) => {
    const entityApiOpenApiData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiOpenApiData.openApiReferenceComponent = openApiReferenceComponentFor(
      entity as TopLevelEntity,
      schoolYearOpenApis,
    );
    entityApiOpenApiData.openApiReferenceComponentPropertyName = `${entity.namespace.namespaceName}_${entity.metaEdName}_Reference`;
  });

  return {
    enhancerName,
    success: true,
  };
}
