import R from 'ramda';
import { getEntityFromNamespace, versionSatisfies } from 'metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase, ModelType, Namespace } from 'metaed-core';
import { ComplexType } from '../model/schema/ComplexType';
import { Element } from '../model/schema/Element';

// Workaround for METAED-457: Rename StateOfIssueStateAbbreviation to StateOfIssueStateAbbreviationType on Credential Common TYpe
// This problem is resolved for the 2.1 Data Standard through ticket DATASTD-819
const enhancerName = 'ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher';
const targetVersions = '2.0.x';

const commonName = 'Credential';
const commonModelType: ModelType = 'common';
const elementName = 'StateOfIssueStateAbbreviation';
const elementType = 'StateAbbreviationType';
const newElementName = 'StateOfIssueStateAbbreviationType';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  const common: ModelBase | null = getEntityFromNamespace(commonName, coreNamespace, commonModelType);
  const complexType: ComplexType | null = common != null ? R.head(common.data.edfiXsd.xsdComplexTypes) : null;
  const element: Element | undefined | null =
    complexType != null
      ? complexType.items.map((x) => x as unknown as Element).find((x) => x.name === elementName && x.type === elementType)
      : null;

  if (element != null) element.name = newElementName;

  return {
    enhancerName,
    success: true,
  };
}
