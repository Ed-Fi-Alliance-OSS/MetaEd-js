// @flow
import R from 'ramda';
import type { ReferentialProperty, MetaEdEnvironment, TopLevelEntity, PropertyType } from 'metaed-core';
import type { EdFiXsdEntityRepository } from 'metaed-plugin-edfi-xsd';
import type { ReferenceUsageInfo } from '../model/ReferenceUsageInfo';
import type { MergedInterchangeEdfiInterchangeBrief } from '../model/MergedInterchange';
import { addMergedInterchangeEdfiInterchangeBriefTo } from '../model/MergedInterchange';
import {
  getReferenceUsageInfoList,
  topLevelEntitiesFrom,
  topLevelReferencePropertiesFrom,
} from './MergedInterchangeDependenciesEnhancerBase';

const enhancerName = 'MergedInterchangeDescriptorDependenciesEnhancer';
const descriptorType: PropertyType = 'descriptor';

export function enhance(metaEd: MetaEdEnvironment) {
  const xsdRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;

  xsdRepository.mergedInterchange.forEach(mergedInterchange => {
    addMergedInterchangeEdfiInterchangeBriefTo(mergedInterchange);

    const topLevelEntities: Array<TopLevelEntity> = topLevelEntitiesFrom(mergedInterchange);
    const topLevelReferenceProperties: Array<ReferentialProperty> = topLevelReferencePropertiesFrom(mergedInterchange);

    const previouslyMatchedProperties: Array<ReferentialProperty> = [];
    const descriptorExclusionList: Array<string> = topLevelEntities
      .filter(x => x.type === descriptorType)
      .map(x => x.metaEdName);

    const allDescriptorDependencies: Array<ReferenceUsageInfo> = topLevelReferenceProperties.reduce(
      (referencedUsageInfos: Array<ReferenceUsageInfo>, tlrp: ReferentialProperty) => {
        const extendedReferencesFromProperty: Array<ReferenceUsageInfo> = [
          ...getReferenceUsageInfoList([descriptorType], descriptorExclusionList, previouslyMatchedProperties, tlrp),
        ];
        if (extendedReferencesFromProperty.length > 0) {
          referencedUsageInfos.push(...extendedReferencesFromProperty);
        }
        return referencedUsageInfos;
      },
      [],
    );

    // Group By and order to filter out duplicates, make sure we're always picking required dependencies over optional ones
    const groupByName = R.groupBy(x => x.name);
    const sortByOptional = R.sortBy(x => x.isOptional);
    const orderByName = R.sortBy(x => x.name);
    const filteredDescriptorDependencies: Array<ReferenceUsageInfo> = orderByName(
      R.map(R.head, R.map(sortByOptional, R.values(groupByName(allDescriptorDependencies)))),
    );

    ((mergedInterchange.data
      .edfiInterchangeBrief: any): MergedInterchangeEdfiInterchangeBrief).interchangeBriefDescriptorReferences.push(
      ...filteredDescriptorDependencies,
    );
  });
  return {
    enhancerName,
    success: true,
  };
}
