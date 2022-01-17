import R from 'ramda';
import { ReferentialProperty, MetaEdEnvironment, TopLevelEntity, PropertyType, Namespace } from '@edfi/metaed-core';
import { EdFiXsdEntityRepository } from '@edfi/metaed-plugin-edfi-xsd';
import { edfiXsdRepositoryForNamespace } from '@edfi/metaed-plugin-edfi-xsd';
import { ReferenceUsageInfo } from '../model/ReferenceUsageInfo';
import { MergedInterchangeEdfiInterchangeBrief } from '../model/MergedInterchange';
import { addMergedInterchangeEdfiInterchangeBriefTo } from '../model/MergedInterchange';
import {
  getReferenceUsageInfoList,
  topLevelEntitiesFrom,
  topLevelReferencePropertiesFrom,
} from './MergedInterchangeDependenciesEnhancerBase';

const enhancerName = 'MergedInterchangeDescriptorDependenciesEnhancer';
const descriptorType: PropertyType = 'descriptor';

export function enhance(metaEd: MetaEdEnvironment) {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const xsdRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (xsdRepository == null) return;

    xsdRepository.mergedInterchange.forEach((mergedInterchange) => {
      addMergedInterchangeEdfiInterchangeBriefTo(mergedInterchange);

      const topLevelEntities: TopLevelEntity[] = topLevelEntitiesFrom(mergedInterchange);
      const topLevelReferenceProperties: ReferentialProperty[] = topLevelReferencePropertiesFrom(mergedInterchange);

      const previouslyMatchedProperties: ReferentialProperty[] = [];
      const descriptorExclusionList: string[] = topLevelEntities
        .filter((x) => x.type === descriptorType)
        .map((x) => x.metaEdName);

      const allDescriptorDependencies: ReferenceUsageInfo[] = topLevelReferenceProperties.reduce(
        (referencedUsageInfos: ReferenceUsageInfo[], tlrp: ReferentialProperty) => {
          const extendedReferencesFromProperty: ReferenceUsageInfo[] = [
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
      const groupByName = R.groupBy((x) => x.name);
      const sortByOptional = R.sortBy((x) => x.isOptional);
      const orderByName = R.sortBy((x) => x.name);
      const filteredDescriptorDependencies: ReferenceUsageInfo[] = orderByName(
        R.map(R.head, R.map(sortByOptional, R.values(groupByName(allDescriptorDependencies)))),
      );

      (
        mergedInterchange.data.edfiInterchangeBrief as MergedInterchangeEdfiInterchangeBrief
      ).interchangeBriefDescriptorReferences.push(...filteredDescriptorDependencies);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
