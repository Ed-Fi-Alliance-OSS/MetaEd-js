import { isReferentialProperty } from '@edfi/metaed-core';
import { ReferentialProperty, TopLevelEntity, PropertyType, InterchangeItem } from '@edfi/metaed-core';
import { MergedInterchange } from '@edfi/metaed-plugin-edfi-xsd';
import { escapeForMarkdownTableContent } from './Shared';
import { ReferenceUsageInfo } from '../model/ReferenceUsageInfo';

function buildReferencedUsageInfo(
  referentialProperty: ReferentialProperty,
  rootEntityName: string,
  isOptional: boolean = false,
): ReferenceUsageInfo {
  const descriptor: TopLevelEntity = referentialProperty.referencedEntity;
  const cardinalityDescription = `${isOptional ? 'Optional' : 'Required'}. `;
  let name: string;
  let description: string;
  if (descriptor.type !== 'descriptor') {
    name = referentialProperty.data.edfiXsd.xsdName;
    description = cardinalityDescription + referentialProperty.documentation;
  } else {
    name = descriptor.data.edfiXsd.xsdDescriptorName;
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
  matchingPropertyTypes: PropertyType[],
  entityExclusionList: string[],
  previouslyMatchedProperties: ReferentialProperty[],
  referentialProperty: ReferentialProperty,
  rootEntityNameParam: string | null = null,
  isParentRelationshipOptional: boolean = false,
): ReferenceUsageInfo[] {
  const results: ReferenceUsageInfo[] = [];
  const rootEntityName = rootEntityNameParam || referentialProperty.parentEntityName;
  const isOptional =
    isParentRelationshipOptional || referentialProperty.isOptional || referentialProperty.isOptionalCollection;

  if (
    matchingPropertyTypes.includes(referentialProperty.type) &&
    !entityExclusionList.some((i) => i === referentialProperty.referencedEntity.metaEdName) &&
    !previouslyMatchedProperties.includes(referentialProperty)
  ) {
    results.push(buildReferencedUsageInfo(referentialProperty, rootEntityName, isOptional));
    previouslyMatchedProperties.push(referentialProperty);
  } else if (['inlineCommon', 'common', 'choice'].includes(referentialProperty.type)) {
    const referencedEntityProperties: ReferentialProperty[] = referentialProperty.referencedEntity.properties.filter(
      isReferentialProperty,
    ) as ReferentialProperty[];
    results.push(
      ...referencedEntityProperties.reduce((result: ReferenceUsageInfo[], referencedEntityProperty: ReferentialProperty) => {
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
      }, []),
    );
  }
  return results;
}

function getEntityAndParents(topLevelEntity: TopLevelEntity): TopLevelEntity[] {
  const results: TopLevelEntity[] = [topLevelEntity];
  if (topLevelEntity.baseEntity) {
    results.push(...getEntityAndParents(topLevelEntity.baseEntity));
  }
  return results;
}

function getPropertiesToScan(topLevelEntity: TopLevelEntity, identityOnly: boolean = false): ReferentialProperty[] {
  const results: ReferentialProperty[] = [];
  const propertiesToAdd: ReferentialProperty[] = (
    identityOnly ? topLevelEntity.identityProperties : topLevelEntity.properties
  ).filter(isReferentialProperty) as ReferentialProperty[];
  results.push(...propertiesToAdd);

  if (topLevelEntity.baseEntity) {
    results.push(...getPropertiesToScan(topLevelEntity.baseEntity, identityOnly));
  }
  return results;
}

export function topLevelEntitiesFrom(mergedInterchange: MergedInterchange): TopLevelEntity[] {
  const interchangeTopLevelEntities: TopLevelEntity[] = mergedInterchange.elements.reduce(
    (array: TopLevelEntity[], element: InterchangeItem) => {
      array.push(...getEntityAndParents(element.referencedEntity));
      return array;
    },
    [],
  );

  const identityTemplatesTopLevelEntities: TopLevelEntity[] = mergedInterchange.identityTemplates.reduce(
    (array: TopLevelEntity[], element: InterchangeItem) => {
      array.push(...getEntityAndParents(element.referencedEntity));
      return array;
    },
    [],
  );

  return interchangeTopLevelEntities.concat(identityTemplatesTopLevelEntities);
}

export function topLevelReferencePropertiesFrom(mergedInterchange: MergedInterchange): ReferentialProperty[] {
  const interchangeTopLevelReferenceProperties: ReferentialProperty[] = mergedInterchange.elements.reduce(
    (array: ReferentialProperty[], element: InterchangeItem) => {
      array.push(...getPropertiesToScan(element.referencedEntity, false));
      return array;
    },
    [],
  );

  // eslint-disable-next-line prettier/prettier
  const identityTemplatesTopLevelReferenceProperties: ReferentialProperty[] =
   mergedInterchange.identityTemplates.reduce((array: ReferentialProperty[], element: InterchangeItem) => {
      array.push(...getPropertiesToScan(element.referencedEntity, true));
      return array;
    },
    [],
  );

  return interchangeTopLevelReferenceProperties.concat(identityTemplatesTopLevelReferenceProperties);
}
