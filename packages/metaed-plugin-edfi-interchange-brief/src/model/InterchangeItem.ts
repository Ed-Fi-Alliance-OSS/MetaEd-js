import { MetaEdEnvironment, EnhancerResult, Interchange, InterchangeItem } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

export interface InterchangeItemEdfiInterchangeBrief {
  interchangeBriefDescription: string;
}

const enhancerName = 'InterchangeItemSetupEnhancer';

export function addInterchangeItemEdfiInterchangeBriefTo(interchangeItem: InterchangeItem) {
  if (interchangeItem.data.edfiInterchangeBrief == null) interchangeItem.data.edfiInterchangeBrief = {};

  Object.assign(interchangeItem.data.edfiInterchangeBrief, {
    interchangeBriefDescription: '',
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'interchange') as Interchange[]).forEach((interchange: Interchange) => {
    if (interchange.elements.length === 0) return;

    interchange.elements.forEach((item) => {
      addInterchangeItemEdfiInterchangeBriefTo(item);
    });

    interchange.identityTemplates.forEach((item) => {
      addInterchangeItemEdfiInterchangeBriefTo(item);
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
