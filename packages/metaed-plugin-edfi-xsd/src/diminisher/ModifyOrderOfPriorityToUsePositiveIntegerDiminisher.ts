import R from 'ramda';
import { getEntityFromNamespace, versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase, ModelType, Namespace } from '@edfi/metaed-core';
import { NoSimpleType } from '../model/schema/SimpleType';
import { ComplexType } from '../model/schema/ComplexType';
import { Element } from '../model/schema/Element';

// Workaround for METAED-451: Force Data Type to Positive Integer in Xsd for Order of Priority
// This problem is resolved for the 2.1 Data Standard through ticket DATASTD-866
const enhancerName = 'ModifyOrderOfPriorityToUsePositiveIntegerDiminisher';
const targetVersions = '2.0.x';

const commonEntityName = 'Telephone';
const commonEntityType: ModelType = 'common';
const nameType = 'OrderOfPriority';
const integerTypeEntityType: ModelType = 'integerType';
const positiveIntegerType = 'xs:positiveInteger';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  const commonEntity: ModelBase | null = getEntityFromNamespace(commonEntityName, coreNamespace, commonEntityType);
  const complexType: ComplexType | null = commonEntity != null ? R.head(commonEntity.data.edfiXsd.xsdComplexTypes) : null;

  const element: Element | undefined | null =
    complexType != null
      ? complexType.items.map((x) => x as unknown as Element).find((x) => x.name === nameType && x.type === nameType)
      : null;
  if (element != null) element.type = positiveIntegerType;

  const integerType: ModelBase | null = getEntityFromNamespace(nameType, coreNamespace, integerTypeEntityType);
  if (integerType != null) integerType.data.edfiXsd.xsdSimpleType = NoSimpleType;

  return {
    enhancerName,
    success: true,
  };
}
