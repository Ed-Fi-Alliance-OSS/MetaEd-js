// @flow
import { isReferentialProperty } from 'metaed-core';
import type { ReferentialProperty, TopLevelEntity, PropertyType, InterchangeItem } from 'metaed-core';
import type { MergedInterchange } from 'metaed-plugin-edfi-xsd';
import { escapeForMarkdownTableContent } from './Shared';
import type { ReferenceUsageInfo } from '../model/ReferenceUsageInfo';

function buildReferencedUsageInfo(
  referentialProperty: ReferentialProperty,
  rootEntityName: string,
  isOptional: boolean = false,
): ReferenceUsageInfo {
  const descriptor: TopLevelEntity = referentialProperty.referencedEntity;
  const cardinalityDescription: string = `${isOptional ? 'Optional' : 'Required'}. `;
  let name: string;
  let description: string;
  if (descriptor.type !== 'descriptor') {
    name = referentialProperty.data.edfiXsd.xsd_Name;
    description = cardinalityDescription + referentialProperty.documentation;
  } else {
    name = descriptor.data.edfiXsd.xsd_DescriptorName;
    description = cardinalityDescription + descriptor.documentation;
  }
  return {
    name: escapeForMarkdownTableContent(name),
    rootEntityName: escapeForMarkdownTableContent(rootEntityName),
    isOptional,
    description: escapeForMarkdownTableContent(description),
  };
}

export function getReferenceUsageInfoList(
  matchingPropertyTypes: Array<PropertyType>,
  entityExclusionList: Array<string>,
  previouslyMatchedProperties: Array<ReferentialProperty>,
  referentialProperty: ReferentialProperty,
  rootEntityNameParam: ?string = null,
  isParentRelationshipOptional: boolean = false,
): Array<ReferenceUsageInfo> {
  const results: Array<ReferenceUsageInfo> = [];
  const rootEntityName = rootEntityNameParam || referentialProperty.parentEntityName;
  const isOptional =
    isParentRelationshipOptional || referentialProperty.isOptional || referentialProperty.isOptionalCollection;

  if (
    matchingPropertyTypes.includes(referentialProperty.type) &&
    !entityExclusionList.some(i => i === referentialProperty.referencedEntity.metaEdName) &&
    !previouslyMatchedProperties.includes(referentialProperty)
  ) {
    results.push(buildReferencedUsageInfo(referentialProperty, rootEntityName, isOptional));
    previouslyMatchedProperties.push(referentialProperty);
  } else if (['inlineCommon', 'common', 'choice'].includes(referentialProperty.type)) {
    const referencedEntityProperties: Array<ReferentialProperty> = ((referentialProperty.referencedEntity.properties.filter(
      isReferentialProperty,
    ): any): Array<ReferentialProperty>);
    results.push(
      ...referencedEntityProperties.reduce(
        (result: Array<ReferenceUsageInfo>, referencedEntityProperty: ReferentialProperty) => {
          result.push(
            ...getReferenceUsageInfoList(
              matchingPropertyTypes,
              entityExclusionList,
              previouslyMatchedProperties,
              referencedEntityProperty,
              rootEntityName,
              isOptional,
            ),
          );
          return result;
        },
        [],
      ),
    );
  }
  return results;
}

function getEntityAndParents(topLevelEntity: TopLevelEntity): Array<TopLevelEntity> {
  const results: Array<TopLevelEntity> = [topLevelEntity];
  if (topLevelEntity.baseEntity) {
    results.push(...getEntityAndParents(topLevelEntity.baseEntity));
  }
  return results;
}

function getPropertiesToScan(topLevelEntity: TopLevelEntity, identityOnly: boolean = false): Array<ReferentialProperty> {
  const results: Array<ReferentialProperty> = [];
  const propertiesToAdd: Array<ReferentialProperty> = (((identityOnly
    ? topLevelEntity.identityProperties
    : topLevelEntity.properties
  ).filter(isReferentialProperty): any): Array<ReferentialProperty>);
  results.push(...propertiesToAdd);

  if (topLevelEntity.baseEntity) {
    results.push(...getPropertiesToScan(topLevelEntity.baseEntity, identityOnly));
  }
  return results;
}

export function topLevelEntitiesFrom(mergedInterchange: MergedInterchange): Array<TopLevelEntity> {
  const interchangeTopLevelEntities: Array<TopLevelEntity> = mergedInterchange.elements.reduce(
    (array: Array<TopLevelEntity>, element: InterchangeItem) => {
      array.push(...getEntityAndParents(element.referencedEntity));
      return array;
    },
    [],
  );

  const identityTemplatesTopLevelEntities: Array<TopLevelEntity> = mergedInterchange.identityTemplates.reduce(
    (array: Array<TopLevelEntity>, element: InterchangeItem) => {
      array.push(...getEntityAndParents(element.referencedEntity));
      return array;
    },
    [],
  );

  return interchangeTopLevelEntities.concat(identityTemplatesTopLevelEntities);
}

export function topLevelReferencePropertiesFrom(mergedInterchange: MergedInterchange): Array<ReferentialProperty> {
  const interchangeTopLevelReferenceProperties: Array<ReferentialProperty> = mergedInterchange.elements.reduce(
    (array: Array<ReferentialProperty>, element: InterchangeItem) => {
      array.push(...getPropertiesToScan(element.referencedEntity, false));
      return array;
    },
    [],
  );

  // eslint-disable-next-line prettier/prettier
  const identityTemplatesTopLevelReferenceProperties: Array<ReferentialProperty> =
   mergedInterchange.identityTemplates.reduce((array: Array<ReferentialProperty>, element: InterchangeItem) => {
    array.push(...getPropertiesToScan(element.referencedEntity, true));
    return array;
  }, []);

  return interchangeTopLevelReferenceProperties.concat(identityTemplatesTopLevelReferenceProperties);
}
