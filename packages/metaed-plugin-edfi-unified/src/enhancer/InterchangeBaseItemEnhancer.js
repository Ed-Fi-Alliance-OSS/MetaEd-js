// @flow
import type { MetaEdEnvironment, EnhancerResult, Interchange, InterchangeItem } from '../../../metaed-core/index';
import { asTopLevelEntity, getEntity, getEntitiesOfType } from '../../../metaed-core/index';
import { asInterchange } from '../../../metaed-core/src/model/Interchange';

const enhancerName: string = 'InterchangeBaseItemEnhancer';

function assignReference(metaEd: MetaEdEnvironment, item: InterchangeItem) {
  const referencedEntity = getEntity(metaEd.entity, item.metaEdName, ...item.referencedType);
  if (referencedEntity) item.referencedEntity = asTopLevelEntity(referencedEntity);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'interchange', 'interchangeExtension').forEach(interchangeBase => {
    const interchange: Interchange = asInterchange(interchangeBase);
    interchange.elements.forEach(item => assignReference(metaEd, item));
    interchange.identityTemplates.forEach(item => assignReference(metaEd, item));
  });

  return {
    enhancerName,
    success: true,
  };
}
