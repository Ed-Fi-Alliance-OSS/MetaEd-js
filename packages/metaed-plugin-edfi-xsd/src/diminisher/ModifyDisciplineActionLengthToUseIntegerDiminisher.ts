import * as R from 'ramda';
import { getEntityFromNamespace, versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, ModelBase, ModelType, Namespace } from '@edfi/metaed-core';
import { NoSimpleType } from '../model/schema/SimpleType';
import { Element } from '../model/schema/Element';
import { ComplexType } from '../model/schema/ComplexType';

// Workaround for METAED-453: Force Data Type to xs:integer in Xsd for DisciplineActionLength and ActualDisciplineActionLength
// This problem is resolved for the 2.1 Data Standard through ticket DATASTD-870
const enhancerName = 'ModifyDisciplineActionLengthToUseIntegerDiminisher';
const targetVersions = '2.0.x';

const entityName1 = 'DisciplineAction';
const entityType1: ModelType = 'domainEntity';
const entityType2: ModelType = 'integerType';
const elementNameType1 = 'DisciplineActionLength';
const elementName2 = 'ActualDisciplineActionLength';
const integerType = 'xs:integer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };

  const entity: ModelBase | null = getEntityFromNamespace(entityName1, coreNamespace, entityType1);
  if (entity != null && !R.isEmpty(entity.data.edfiXsd.xsdComplexTypes)) {
    const complexType: ComplexType = entity.data.edfiXsd.xsdComplexTypes.find((x) => x.name === entityName1);

    if (complexType != null && complexType.hasItems()) {
      const element1: any = (complexType.items as unknown as Element[]).find(
        (x) => x.name != null && x.name === elementNameType1 && x.type != null && x.type === elementNameType1,
      );
      if (element1 != null) Object.assign(element1, { type: integerType });

      const element2: any = (complexType.items as unknown as Element[]).find(
        (x) => x.name != null && x.name === elementName2 && x.type != null && x.type === elementNameType1,
      );
      if (element2 != null) Object.assign(element2, { type: integerType });
    }
  }

  const element: ModelBase | null = getEntityFromNamespace(elementNameType1, coreNamespace, entityType2);
  if (element != null) element.data.edfiXsd.xsdSimpleType = NoSimpleType;

  return {
    enhancerName,
    success: true,
  };
}
