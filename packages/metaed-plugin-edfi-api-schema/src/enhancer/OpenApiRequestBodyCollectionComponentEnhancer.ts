import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  EntityProperty,
  TopLevelEntity,
  CommonProperty,
} from '@edfi/metaed-core';

import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { OpenApiObject, OpenApiProperty } from '../model/OpenApi';
import { PropertyModifier, prefixedName } from '../model/PropertyModifier';
import { singularize, uncapitalize } from '../Utility';
import {
  openApiObjectFrom,
  openApiCollectionReferenceNameFor,
  SchoolYearOpenApis,
  newSchoolYearOpenApis,
  openApiPropertyForNonReference,
} from './OpenApiComponentEnhancerBase';
import { openApiObjectForScalarCommonProperty } from './OpenApiRequestBodyComponentEnhancer';
import { OpenApiRequestBodyCollectionSchema } from '../model/OpenApiRequestBodyCollectionSchema';

const enhancerName = 'OpenApiRequestBodyCollectionComponentEnhancer';

/**
 * Returns an OpenApi schema that specifies the API body element shape
 * corresponding to the given descriptor collection property.
 */
function openApiDescriptorCollectionReferenceSchemaFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
): OpenApiObject {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const descriptorName: string = uncapitalize(prefixedName(apiMapping.descriptorCollectionName, propertyModifier));

  const documentation: string = property.documentation.toString();
  const descriptorOpenApiProperty: { [key: string]: OpenApiProperty } = {
    [descriptorName]: { type: 'string', description: documentation, maxLength: 306 },
  };

  return openApiObjectFrom(descriptorOpenApiProperty, [descriptorName]);
}

/**
 * Returns an OpenApi schema that specifies the API body element shape
 * corresponding to the given non-reference collection property.
 */
function openApiNonReferenceCollectionSchemaFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  schoolYearOpenApis: SchoolYearOpenApis,
): OpenApiObject {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const propertyName: string = uncapitalize(singularize(prefixedName(apiMapping.fullName, propertyModifier)));

  const openApiProperty: { [key: string]: OpenApiProperty } = {
    [propertyName]: openApiPropertyForNonReference(property, schoolYearOpenApis),
  };

  return openApiObjectFrom(openApiProperty, [propertyName]);
}

/**
 * Returns an OpenApi schema corresponding to the given property
 */
export function openApiCollectionReferenceSchemaFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  schoolYearOpenApis: SchoolYearOpenApis,
  generatedReferenceName: string = '',
): OpenApiRequestBodyCollectionSchema[] {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  let referenceSchemas: OpenApiRequestBodyCollectionSchema[] = [];
  const propertyName: string =
    generatedReferenceName !== '' ? generatedReferenceName : openApiCollectionReferenceNameFor(property, propertyModifier);

  if (apiMapping.isReferenceCollection) {
    return [];
  }
  if (apiMapping.isDescriptorCollection) {
    const schemaDetails: OpenApiRequestBodyCollectionSchema = {
      schema: openApiDescriptorCollectionReferenceSchemaFor(property, propertyModifier),
      propertyName,
    };
    referenceSchemas.push(schemaDetails);
    return referenceSchemas;
  }
  if (apiMapping.isCommonCollection) {
    const scalarCommonOpenApiObject: OpenApiObject = openApiObjectForScalarCommonProperty(
      property as CommonProperty,
      propertyModifier,
      schoolYearOpenApis,
    );
    const openApiRequestBodyCollectionSchema: OpenApiRequestBodyCollectionSchema = {
      schema: scalarCommonOpenApiObject,
      propertyName,
    };
    referenceSchemas.push(openApiRequestBodyCollectionSchema);
    (property as CommonProperty).referencedEntity.properties.forEach((childProperty) => {
      const childReferenceName: string = `${propertyName}_${childProperty.fullPropertyName}`;
      const openApiRequestBodyCollectionSchemas: OpenApiRequestBodyCollectionSchema[] = openApiCollectionReferenceSchemaFor(
        childProperty,
        propertyModifier,
        schoolYearOpenApis,
        childReferenceName,
      );
      referenceSchemas = referenceSchemas.concat(openApiRequestBodyCollectionSchemas);
    });
    return referenceSchemas;
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    const openApiRequestBodyCollectionSchema: OpenApiRequestBodyCollectionSchema = {
      schema: openApiNonReferenceCollectionSchemaFor(property, propertyModifier, schoolYearOpenApis),
      propertyName,
    };
    referenceSchemas.push(openApiRequestBodyCollectionSchema);
    return referenceSchemas;
  }
  return [];
}

/**
 * Builds an array of collection schemas
 */
function buildOpenApiCollectionSchemaList(
  entityForOpenApi: TopLevelEntity,
  schoolYearOpenApis: SchoolYearOpenApis,
): OpenApiRequestBodyCollectionSchema[] {
  const schemas: OpenApiRequestBodyCollectionSchema[] = [];

  const { collectedApiProperties } = entityForOpenApi.data.edfiApiSchema as EntityApiSchemaData;

  collectedApiProperties.forEach(({ property, propertyModifier }) => {
    const referenceSchemas: OpenApiRequestBodyCollectionSchema[] = openApiCollectionReferenceSchemaFor(
      property,
      propertyModifier,
      schoolYearOpenApis,
    );
    referenceSchemas.forEach((schemaItem) => {
      schemas.push(schemaItem);
    });
  });

  return schemas;
}

/**
 * This enhancer creates a set of schema components for request body collections for each MetaEd entity.
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
    entityApiOpenApiData.openApiRequestBodyCollectionComponents = buildOpenApiCollectionSchemaList(
      entity as TopLevelEntity,
      schoolYearOpenApis,
    );
  });

  return {
    enhancerName,
    success: true,
  };
}
