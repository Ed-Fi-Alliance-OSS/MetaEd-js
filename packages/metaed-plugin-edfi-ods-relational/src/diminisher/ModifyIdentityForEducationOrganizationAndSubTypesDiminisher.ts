import R from 'ramda';
import { String as sugar } from 'sugar';
import { asTopLevelEntity, getEntitiesOfTypeForNamespaces, newIntegerProperty, versionSatisfies } from '@edfi/metaed-core';
import {
  EnhancerResult,
  EntityProperty,
  IntegerProperty,
  DomainEntitySubclass,
  MetaEdEnvironment,
  ModelBase,
  Namespace,
} from '@edfi/metaed-core';
import { addEntityPropertyEdfiOdsTo } from '../model/property/EntityProperty';

// METAED-498
// Replacing EducationOrganization and subclasses with surrogate key identity
const enhancerName = 'ModifyIdentityForEducationOrganizationAndSubTypesDiminisher';
const targetVersions = '2.x';

const educationOrganization = 'EducationOrganization';
const educationOrganizationIdentifier = 'EducationOrganizationIdentifier';
const surrogateKeyNameTemplate = '{0}Id';
const educationOrganizationSurrogateKeyName: string = sugar.format(surrogateKeyNameTemplate, educationOrganization);

function modifyIdentityForEducationOrganizationSubclasses(namespace: Namespace): void {
  getEntitiesOfTypeForNamespaces([namespace], 'domainEntitySubclass').forEach((entity) => {
    const entitySubclass: DomainEntitySubclass = entity as DomainEntitySubclass;
    if (entitySubclass.baseEntityName !== educationOrganization) return;

    const identifierProperty: EntityProperty | null = entitySubclass.data.edfiOdsRelational.odsIdentityProperties.find(
      (x: EntityProperty) => x.metaEdName === educationOrganizationIdentifier,
    );
    if (identifierProperty != null) {
      identifierProperty.data.edfiOdsRelational.odsIsUniqueIndex = true;
      identifierProperty.isPartOfIdentity = false;
      entitySubclass.data.edfiOdsRelational.odsIdentityProperties = R.reject(
        (x: EntityProperty) => x.metaEdName === identifierProperty.metaEdName,
      )(entitySubclass.data.edfiOdsRelational.odsIdentityProperties);
      entitySubclass.data.edfiOdsRelational.odsProperties = R.reject(
        (x: EntityProperty) => x.metaEdName === identifierProperty.metaEdName,
      )(entitySubclass.data.edfiOdsRelational.odsProperties);
    }

    // Remove any identity renames
    const removeIdentityRenames = R.without(
      entitySubclass.data.edfiOdsRelational.odsProperties.filter((property: EntityProperty) => property.isIdentityRename),
    );

    entitySubclass.data.edfiOdsRelational.odsIdentityProperties = removeIdentityRenames(
      entitySubclass.data.edfiOdsRelational.odsIdentityProperties,
    );
    entitySubclass.data.edfiOdsRelational.odsProperties = removeIdentityRenames(
      entitySubclass.data.edfiOdsRelational.odsProperties,
    );

    const surrogateKeyProperty: IntegerProperty = {
      ...newIntegerProperty(),
      metaEdName: sugar.format(surrogateKeyNameTemplate, entitySubclass.metaEdName),
      documentation: `The identifier assigned to a ${asTopLevelEntity(entitySubclass).typeHumanizedName}.`,
      isPartOfIdentity: true,
      namespace: entitySubclass.namespace,
      parentEntity: asTopLevelEntity(entitySubclass),
      parentEntityName: entitySubclass.metaEdName,
      isIdentityRename: true,
      baseKeyName: educationOrganizationSurrogateKeyName,
    };
    addEntityPropertyEdfiOdsTo(surrogateKeyProperty);
    entitySubclass.data.edfiOdsRelational.odsIdentityProperties.push(surrogateKeyProperty);
    entitySubclass.data.edfiOdsRelational.odsProperties.push(surrogateKeyProperty);
  });
}

function modifyIdentityForEducationOrganization(namespace: Namespace): void {
  const entity: ModelBase | undefined = getEntitiesOfTypeForNamespaces([namespace], 'domainEntity').find(
    (x: ModelBase) => x.metaEdName === educationOrganization,
  );
  if (entity == null || entity.data.edfiOdsRelational.odsIdentityProperties.length === 0) return;

  const identifierProperty: EntityProperty | null = entity.data.edfiOdsRelational.odsIdentityProperties.find(
    (x: EntityProperty) => x.metaEdName === educationOrganizationIdentifier,
  );
  if (identifierProperty == null) return;

  identifierProperty.data.edfiOdsRelational.odsIsUniqueIndex = true;
  identifierProperty.isPartOfIdentity = false;
  entity.data.edfiOdsRelational.odsIdentityProperties = R.reject(
    (x: EntityProperty) => x.metaEdName === identifierProperty.metaEdName,
  )(entity.data.edfiOdsRelational.odsIdentityProperties);

  const surrogateKeyProperty: IntegerProperty = {
    ...newIntegerProperty(),
    metaEdName: educationOrganizationSurrogateKeyName,
    documentation: identifierProperty.documentation,
    isPartOfIdentity: true,
    namespace: identifierProperty.namespace,
    parentEntity: identifierProperty.parentEntity,
    parentEntityName: identifierProperty.parentEntityName,
    data: {
      edfiOdsRelational: {
        odsIsIdentityDatabaseType: true,
      },
    },
  };
  addEntityPropertyEdfiOdsTo(surrogateKeyProperty);
  entity.data.edfiOdsRelational.odsIdentityProperties.push(surrogateKeyProperty);
  entity.data.edfiOdsRelational.odsProperties.push(surrogateKeyProperty);

  modifyIdentityForEducationOrganizationSubclasses(namespace);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  modifyIdentityForEducationOrganization(coreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
