import {
  MetaEdEnvironment,
  EnhancerResult,
  EntityProperty,
  getAllProperties,
  isReferentialProperty,
  ReferentialProperty,
  normalizeDescriptorSuffix,
  DescriptorProperty,
} from '@edfi/metaed-core';
import { isTopLevelReference, isDescriptor, uncapitalize, pluralize } from '../Utility';
import { ApiPropertyMapping } from '../model/ApiPropertyMapping';
import { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';

const enhancerName = 'ApiPropertyMappingEnhancer';

type NamingOptions = { removePrefixes: boolean };

/**
 * API naming removes prefixes of collection properties that match the parent entity name in some cases.
 *
 * This is derived from the ODS/API JSON naming pattern for collections.
 */
function parentPrefixRemovalConvention(property: EntityProperty): string {
  const name = property.fullPropertyName;

  // collections from association and domain entity properties don't get table names collapsed
  if (property.type === 'association' || property.type === 'domainEntity') return name;

  if (name.startsWith(property.parentEntity.metaEdName)) return name.slice(property.parentEntity.metaEdName.length);

  // For any collection (with the exception of domain entities and associations types),
  // given that the collection name starts with how the parent name ends,
  // then this overlapping text is collapsed.
  const parentLastWord = property.parentEntity.metaEdName.split(/(?=[A-Z])/).pop();
  const nameFirstWord = name.split(/(?=[A-Z])/)[0];
  if (parentLastWord === nameFirstWord) {
    return name.slice(parentLastWord.length);
  }

  if (property.parentEntity.metaEdName.endsWith(property.roleName) && name.startsWith(property.roleName)) {
    return name.slice(property.roleName.length);
  }

  return name;
}

/**
 * API descriptor reference property names are suffixed with "Descriptor"
 */
function apiDescriptorReferenceName(property: DescriptorProperty): string {
  if (property.isCollection) return normalizeDescriptorSuffix(uncapitalize(property.metaEdName));
  return normalizeDescriptorSuffix(uncapitalize(property.fullPropertyName));
}

/**
 * The basic name of a property in the API.  Generally, the property full name with the
 * first character lower cased, and pluralized if an array.
 */
function apiFullName(property: EntityProperty, { removePrefixes }: NamingOptions): string {
  if (property.isCollection && removePrefixes) {
    return uncapitalize(pluralize(parentPrefixRemovalConvention(property)));
  }
  if (property.type === 'common' && removePrefixes) {
    return uncapitalize(parentPrefixRemovalConvention(property));
  }
  if (property.isCollection && !removePrefixes) {
    return uncapitalize(pluralize(property.fullPropertyName));
  }
  if (isDescriptor(property)) return apiDescriptorReferenceName(property as DescriptorProperty);

  return uncapitalize(property.fullPropertyName);
}

/**
 * API reference property names are suffixed with "Reference"
 */
function apiReferenceName(property: EntityProperty): string {
  return `${uncapitalize(property.fullPropertyName)}Reference`;
}

/**
 * School year enumeration property names are "SchoolYearTypeReference" prefixed with role name
 */
function apiSchoolYearEnumerationName(property: EntityProperty): string {
  return uncapitalize(`${property.roleName}SchoolYearTypeReference`);
}

/**
 * The naming for a property when it is at the top level of the request body.
 *
 * Non-reference property names are different from reference property ones, and
 * reference property array names are different still.
 */
function apiTopLevelName(property: EntityProperty, { removePrefixes }: NamingOptions): string {
  if (property.type === 'schoolYearEnumeration') return apiSchoolYearEnumerationName(property);
  if (!isTopLevelReference(property)) return apiFullName(property, { removePrefixes });
  if (property.isRequiredCollection || property.isOptionalCollection) return apiFullName(property, { removePrefixes });
  return apiReferenceName(property);
}

/**
 * Whether the given property will be represented as a reference collection.
 */
function apiReferenceCollection(property: EntityProperty): boolean {
  if (!isTopLevelReference(property)) return false;
  return property.isRequiredCollection || property.isOptionalCollection;
}

/**
 * Whether the given property will be represented as a reference scalar.
 */
function apiReferenceScalar(property: EntityProperty): boolean {
  if (!isTopLevelReference(property)) return false;
  return !(property.isRequiredCollection || property.isOptionalCollection);
}

/**
 * Whether the given property will be represented as a descriptor collection.
 */
function apiDescriptorCollection(property: EntityProperty): boolean {
  if (!isDescriptor(property)) return false;
  return property.isRequiredCollection || property.isOptionalCollection;
}

/**
 * Whether the given property will be represented as a common collection.
 */
function apiCommonCollection(property: EntityProperty): boolean {
  if (property.type !== 'common') return false;
  return property.isRequiredCollection || property.isOptionalCollection;
}

/**
 * Whether the given property will be represented as a common scalar.
 */
function apiCommonScalar(property: EntityProperty): boolean {
  if (property.type !== 'common') return false;
  return !(property.isRequiredCollection || property.isOptionalCollection);
}

/**
 * Collects all of the API shape metadata for a MetaEd property.
 */
function buildApiPropertyMapping(property: EntityProperty): ApiPropertyMapping {
  const isReferenceCollection: boolean = apiReferenceCollection(property);
  const isDescriptorCollection: boolean = apiDescriptorCollection(property);
  const isCommonCollection: boolean = apiCommonCollection(property);
  const isScalarReference: boolean = apiReferenceScalar(property);
  const isScalarCommon: boolean = apiCommonScalar(property);

  return {
    metaEdName: property.metaEdName,
    metaEdType: isReferentialProperty(property) ? (property as ReferentialProperty).referencedEntity.type : property.type,
    topLevelName: apiTopLevelName(property, { removePrefixes: true }),
    decollisionedTopLevelName: apiTopLevelName(property, { removePrefixes: false }),
    fullName: apiFullName(property, { removePrefixes: true }),
    isReferenceCollection,
    referenceCollectionName: isReferenceCollection ? apiReferenceName(property) : '',
    isDescriptorCollection,
    descriptorCollectionName: isDescriptorCollection ? apiDescriptorReferenceName(property as DescriptorProperty) : '',
    isCommonCollection,
    isScalarCommon,
    isChoice: property.type === 'choice',
    isInlineCommon: property.type === 'inlineCommon',
    isScalarReference,
  };
}

/**
 * This enhancer uses the results of the ReferenceComponentEnhancer to build API
 * shape metadata for each MetaEd property.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllProperties(metaEd.propertyIndex).forEach((property) => {
    (property.data.edfiApiSchema as EntityPropertyApiSchemaData).apiMapping = buildApiPropertyMapping(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
