import R from 'ramda';
import { getEntityFromNamespace, versionSatisfies } from 'metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase, ModelType, Namespace } from 'metaed-core';
import { ComplexType } from '../model/schema/ComplexType';
import { Element } from '../model/schema/Element';

// Workaround for METAED-455: Force Data Type to xs:int in Xsd for TotalInstructionalDays
// This problem is resolved for the 2.1 Data Standard through ticket DATASTD-869
const enhancerName = 'ModifyTotalInstructionalDaysToUseIntDiminisher';
const targetVersions = '2.0.x';

const domainEntityNames: string[] = ['AcademicWeek', 'Session'];
const domainEntityType: ModelType = 'domainEntity';
const elementNameType = 'TotalInstructionalDays';
const intType = 'xs:int';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  domainEntityNames.forEach((domainEntityName) => {
    const entity: ModelBase | null = getEntityFromNamespace(domainEntityName, coreNamespace, domainEntityType);
    const complexType: ComplexType | null = entity != null ? R.head(entity.data.edfiXsd.xsdComplexTypes) : null;
    const element: Element | null | undefined =
      complexType != null
        ? complexType.items
            .map((x) => x as unknown as Element)
            .find((x) => x.name === elementNameType && x.type === elementNameType)
        : null;

    if (element != null) element.type = intType;
  });

  return {
    enhancerName,
    success: true,
  };
}
