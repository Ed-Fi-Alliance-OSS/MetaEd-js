import * as R from 'ramda';
import { getEntityFromNamespace, versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase, ModelType, Namespace } from '@edfi/metaed-core';
import { ComplexType } from '../model/schema/ComplexType';
import { Element } from '../model/schema/Element';

// Workaround for METAED-456: Force Max Occurs to 2 for AppropriateSex on InterventionStudy
// This problem is resolved for the 2.1 Data Standard through ticket DATASTD-818
const enhancerName = 'ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher';
const targetVersions = '2.0.x';

const entityName = 'InterventionStudy';
const entityType: ModelType = 'domainEntity';
const elementName = 'AppropriateSex';
const elementType = 'SexType';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  const entity: ModelBase | null = getEntityFromNamespace(entityName, coreNamespace, entityType);
  if (entity != null && !R.isEmpty(entity.data.edfiXsd.xsdComplexTypes)) {
    const complexType: ComplexType = entity.data.edfiXsd.xsdComplexTypes.find((x) => x.name === entityName);
    if (complexType != null && complexType.hasItems()) {
      const element: Element | undefined = (complexType.items as unknown as Element[]).find(
        (x) => x.name != null && x.name === elementName && x.type != null && x.type === elementType,
      );
      if (element != null) {
        Object.assign(element, {
          maxOccurs: '2',
          maxOccursIsUnbounded: false,
        });
      }
    }
  }

  return {
    enhancerName,
    success: true,
  };
}
