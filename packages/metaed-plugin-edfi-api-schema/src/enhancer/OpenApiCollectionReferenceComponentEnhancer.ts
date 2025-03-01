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
import { OpenApiCollectionReferenceSchema, OpenApiObject, OpenApiProperty } from '../model/OpenApi';
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

const enhancerName = 'OpenApiCollectionReferenceComponentEnhancer';

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
): OpenApiCollectionReferenceSchema[] | [] {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  let referenceSchemas: OpenApiCollectionReferenceSchema[] = [];
  const referenceName: string =
    generatedReferenceName !== '' ? generatedReferenceName : openApiCollectionReferenceNameFor(property);

  if (apiMapping.isReferenceCollection) {
    return [];
  }
  if (apiMapping.isDescriptorCollection) {
    const schemaDetails: OpenApiCollectionReferenceSchema = {
      schema: openApiDescriptorCollectionReferenceSchemaFor(property, propertyModifier),
      referenceName,
    };
    referenceSchemas.push(schemaDetails);
    return referenceSchemas;
  }
  if (apiMapping.isCommonCollection) {
    const scalarCommonProperty: OpenApiObject = openApiObjectForScalarCommonProperty(
      property as CommonProperty,
      propertyModifier,
      schoolYearOpenApis,
    );
    const schemaDetails: OpenApiCollectionReferenceSchema = {
      schema: scalarCommonProperty,
      referenceName,
    };
    referenceSchemas.push(schemaDetails);
    (property as CommonProperty).referencedEntity.properties.forEach((childProperty) => {
      const childReferenceName: string = `${referenceName}_${childProperty.fullPropertyName}`;
      const childSchemaDetails: OpenApiCollectionReferenceSchema[] | [] = openApiCollectionReferenceSchemaFor(
        childProperty,
        propertyModifier,
        schoolYearOpenApis,
        childReferenceName,
      );
      referenceSchemas = referenceSchemas.concat(childSchemaDetails);
    });
    return referenceSchemas;
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    const schemaDetails: OpenApiCollectionReferenceSchema = {
      schema: openApiNonReferenceCollectionSchemaFor(property, propertyModifier, schoolYearOpenApis),
      referenceName,
    };
    referenceSchemas.push(schemaDetails);
    return referenceSchemas;
  }
  return [];
}

/**
 * Builds an array of referenced schemas
 */
function buildOpenApiReferenceSchemaList(
  entityForOpenApi: TopLevelEntity,
  schoolYearOpenApis: SchoolYearOpenApis,
): OpenApiCollectionReferenceSchema[] {
  const schemas: OpenApiCollectionReferenceSchema[] = [];

  const { collectedApiProperties } = entityForOpenApi.data.edfiApiSchema as EntityApiSchemaData;

  collectedApiProperties.forEach(({ property, propertyModifier }) => {
    const referenceSchemas: OpenApiCollectionReferenceSchema[] = openApiCollectionReferenceSchemaFor(
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
 * This enhancer creates a set of schema components for collection references for each MetaEd entity.
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
    const schemas: OpenApiCollectionReferenceSchema[] = buildOpenApiReferenceSchemaList(
      entity as TopLevelEntity,
      schoolYearOpenApis,
    );
    schemas.forEach((schemaDetail) => {
      const referenceItem: [string, OpenApiObject] = [schemaDetail.referenceName, schemaDetail.schema];
      entityApiOpenApiData.openApiCollectionReferenceComponents.push(referenceItem);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
