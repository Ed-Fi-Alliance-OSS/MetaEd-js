// @flow
import type { ReferentialProperty, MetaEdEnvironment, TopLevelEntity } from 'metaed-core';
import type { EdFiXsdEntityRepository } from 'metaed-plugin-edfi-xsd';
import type { ReferenceUsageInfo } from '../model/ReferenceUsageInfo';
import { sortByNameThenRootEntityName } from '../model/ReferenceUsageInfo';
import type { MergedInterchangeEdfiInterchangeBrief } from '../model/MergedInterchange';
import { addMergedInterchangeEdfiInterchangeBriefTo } from '../model/MergedInterchange';
import {
  getReferenceUsageInfoList,
  topLevelEntitiesFrom,
  topLevelReferencePropertiesFrom,
} from './MergedInterchangeDependenciesEnhancerBase';

const enhancerName = 'MergedInterchangeExtendedReferencesEnhancer';

export function enhance(metaEd: MetaEdEnvironment) {
  const xsdRepository: EdFiXsdEntityRepository = (metaEd.plugin.get('edfiXsd'): any).entity;

  xsdRepository.mergedInterchange.forEach(mergedInterchange => {
    addMergedInterchangeEdfiInterchangeBriefTo(mergedInterchange);

    const topLevelEntities: Array<TopLevelEntity> = topLevelEntitiesFrom(mergedInterchange);
    const topLevelReferenceProperties: Array<ReferentialProperty> = topLevelReferencePropertiesFrom(mergedInterchange);

    const previouslyMatchedProperties: Array<ReferentialProperty> = [];
    const referenceExclusionList: Array<string> = topLevelEntities.map(i => i.metaEdName);
    const allExtendedReferences: Array<ReferenceUsageInfo> = topLevelReferenceProperties.reduce(
      (referencedUsageInfos: Array<ReferenceUsageInfo>, tlrp: ReferentialProperty) => {
        const extendedReferencesFromProperty: Array<ReferenceUsageInfo> = [
          ...getReferenceUsageInfoList(
            ['domainEntity', 'association'],
            referenceExclusionList,
            previouslyMatchedProperties,
            tlrp,
          ),
        ];
        if (extendedReferencesFromProperty.length > 0) {
          referencedUsageInfos.push(...extendedReferencesFromProperty);
        }
        return referencedUsageInfos;
      },
      [],
    );
    allExtendedReferences.sort(sortByNameThenRootEntityName);
    ((mergedInterchange.data
      .edfiInterchangeBrief: any): MergedInterchangeEdfiInterchangeBrief).interchangeBriefExtendedReferences.push(
      ...allExtendedReferences,
    );
  });
  return {
    enhancerName,
    success: true,
  };
}
