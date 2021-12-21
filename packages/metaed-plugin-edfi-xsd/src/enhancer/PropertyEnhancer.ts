import {
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  EntityProperty,
  ReferentialProperty,
  SimpleProperty,
  CommonProperty,
  SharedDecimalProperty,
  SharedIntegerProperty,
  SharedShortProperty,
  SharedStringProperty,
  DecimalProperty,
  IntegerProperty,
  ShortProperty,
  StringProperty,
  InlineCommonProperty,
  EnumerationProperty,
  SchoolYearEnumerationProperty,
  DescriptorProperty,
  AssociationProperty,
  DomainEntityProperty,
} from 'metaed-core';
import { NoTopLevelEntity, NoSharedSimple, getAllProperties, getAllTopLevelEntitiesForNamespaces } from 'metaed-core';
import { EntityPropertyEdfiXsd } from '../model/property/EntityProperty';

const enhancerName = 'PropertyEnhancer';

const queryableFieldsFrom = (topLevelEntities: TopLevelEntity[]): EntityProperty[] => {
  const result: EntityProperty[] = [];
  topLevelEntities.forEach((topLevelEntity: TopLevelEntity) => result.push(...topLevelEntity.queryableFields));
  return result;
};

const adjustEnumerationSuffix = (metaEdName: string): string =>
  metaEdName.endsWith('Type') ? metaEdName : `${metaEdName}Type`;

function noParentOrReferencedEntityProjectExtension(property: ReferentialProperty | SimpleProperty): boolean {
  return (
    property.parentEntityName === '' ||
    property.referencedEntity === NoTopLevelEntity ||
    property.referencedEntity === NoSharedSimple
  );
}

function prependedWithProjectExtension(projectExtension: string, typeName: string) {
  return projectExtension ? `${projectExtension}-${typeName}` : typeName;
}

function prependReferencedProjectExtension(property: ReferentialProperty, typeName: string) {
  if (noParentOrReferencedEntityProjectExtension(property)) {
    return prependedWithProjectExtension(property.namespace.projectExtension, typeName);
  }
  return prependedWithProjectExtension(property.referencedEntity.namespace.projectExtension, typeName);
}

function prependReferencedProjectExtensionForCommonProperty(property: CommonProperty, typeName: string) {
  if (property.isExtensionOverride) {
    return prependedWithProjectExtension(
      property.namespace.projectExtension,
      `${typeName}${property.namespace.extensionEntitySuffix}`,
    );
  }

  return prependReferencedProjectExtension(property, typeName);
}

function reconcileSimpleTypeExtension(property: SimpleProperty, typeName: string) {
  if (noParentOrReferencedEntityProjectExtension(property)) {
    return prependedWithProjectExtension(property.namespace.projectExtension, typeName);
  }
  return prependedWithProjectExtension(property.referencedEntity.namespace.projectExtension, typeName);
}

function xsdTypeFor(property: EntityProperty): string {
  const typeStringFor: { [propertyType: string]: () => string } = {
    sharedDecimal: () => reconcileSimpleTypeExtension(property as SharedDecimalProperty, property.referencedType),
    sharedInteger: () => reconcileSimpleTypeExtension(property as SharedIntegerProperty, property.referencedType),
    sharedShort: () => reconcileSimpleTypeExtension(property as SharedShortProperty, property.referencedType),
    sharedString: () => reconcileSimpleTypeExtension(property as SharedStringProperty, property.referencedType),
    boolean: () => 'xs:boolean',
    currency: () => 'Currency',
    date: () => 'xs:date',
    datetime: () => 'xs:dateTime',
    duration: () => 'TimeInterval',
    percent: () => 'Percent',
    time: () => 'xs:time',
    year: () => 'xs:gYear',
    decimal: () => reconcileSimpleTypeExtension(property as DecimalProperty, property.metaEdName),
    integer: () =>
      property.hasRestriction ? reconcileSimpleTypeExtension(property as IntegerProperty, property.metaEdName) : 'xs:int',
    short: () =>
      property.hasRestriction ? reconcileSimpleTypeExtension(property as ShortProperty, property.metaEdName) : 'xs:short',
    string: () => reconcileSimpleTypeExtension(property as StringProperty, property.metaEdName),
    choice: () => 'ChoiceEntityPropertyHasNoType',
    inlineCommon: () => prependReferencedProjectExtension(property as InlineCommonProperty, property.metaEdName),
    common: () => prependReferencedProjectExtensionForCommonProperty(property as CommonProperty, property.metaEdName),
    enumeration: () =>
      prependReferencedProjectExtension(property as EnumerationProperty, adjustEnumerationSuffix(property.metaEdName)),
    schoolYearEnumeration: () =>
      prependReferencedProjectExtension(
        property as SchoolYearEnumerationProperty,
        adjustEnumerationSuffix(property.metaEdName),
      ),
    descriptor: () =>
      prependReferencedProjectExtension(property as DescriptorProperty, `${property.metaEdName}DescriptorReferenceType`),
    association: () =>
      prependReferencedProjectExtension(property as AssociationProperty, `${property.metaEdName}ReferenceType`),
    domainEntity: () =>
      prependReferencedProjectExtension(property as DomainEntityProperty, `${property.metaEdName}ReferenceType`),
  };

  return typeStringFor[property.type]();
}

// Note: XSD ignores 'role name' entry if same name as entity (typically used for ODS naming)
function xsdNameFor(property: EntityProperty): string {
  const baseName =
    property.roleName === property.metaEdName ? property.metaEdName : `${property.roleName}${property.metaEdName}`;
  return ['choice', 'association', 'domainEntity'].includes(property.type) ? `${baseName}Reference` : baseName;
}

function applyXsdNameAndType(property: EntityProperty) {
  const entityPropertyEdfiXsd: EntityPropertyEdfiXsd = property.data.edfiXsd;
  entityPropertyEdfiXsd.xsdName = xsdNameFor(property);
  entityPropertyEdfiXsd.xsdType = xsdTypeFor(property);
}

// this assumes all properties in propertyIndex **and** all queryable fields have been edfiXsd initialized
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const allProperties: EntityProperty[] = getAllProperties(metaEd.propertyIndex);
  allProperties.forEach((property) => applyXsdNameAndType(property));

  const allQueryableFields: EntityProperty[] = queryableFieldsFrom(
    getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values())),
  );
  allQueryableFields.forEach((property) => applyXsdNameAndType(property));

  return {
    enhancerName,
    success: true,
  };
}
