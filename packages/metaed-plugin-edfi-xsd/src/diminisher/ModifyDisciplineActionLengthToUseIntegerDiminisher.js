// @flow
import R from 'ramda';
import { getEntity, versionSatisfies } from 'metaed-core';
import type { EnhancerResult, MetaEdEnvironment, ModelBase, ModelType } from 'metaed-core';
import { NoSimpleType } from '../model/schema/SimpleType';
import type { ComplexType } from '../model/schema/ComplexType';

// Workaround for METAED-453: Force Data Type to xs:integer in Xsd for DisciplineActionLength and ActualDisciplineActionLength
// This problem is resolved for the 2.1 Data Standard through ticket DATASTD-870
const enhancerName: string = 'ModifyDisciplineActionLengthToUseIntegerDiminisher';
const targetVersions: string = '2.0.x';

const entityName1: string = 'DisciplineAction';
const entityType1: ModelType = 'domainEntity';
const entityType2: ModelType = 'integerType';
const elementNameType1: string = 'DisciplineActionLength';
const elementName2: string = 'ActualDisciplineActionLength';
const integerType: string = 'xs:integer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };

  const entity: ?ModelBase = getEntity(metaEd.entity, entityName1, entityType1);
  if (entity != null && !R.isEmpty(entity.data.edfiXsd.xsd_ComplexTypes)) {
    const complexType: ComplexType = entity.data.edfiXsd.xsd_ComplexTypes.find(x => x.name === entityName1);

    if (complexType != null && complexType.hasItems()) {
      const element1: any = complexType.items.find(
        // $FlowIgnore - code is assuming item is of type Element
        x => x.name != null && x.name === elementNameType1 && x.type != null && x.type === elementNameType1,
      );
      if (element1 != null) Object.assign(element1, { type: integerType });

      const element2: any = complexType.items.find(
        // $FlowIgnore - code is assuming item is of type Element
        x => x.name != null && x.name === elementName2 && x.type != null && x.type === elementNameType1,
      );
      if (element2 != null) Object.assign(element2, { type: integerType });
    }
  }

  const element: ?ModelBase = getEntity(metaEd.entity, elementNameType1, entityType2);
  if (element != null) element.data.edfiXsd.xsd_SimpleType = NoSimpleType;

  return {
    enhancerName,
    success: true,
  };
}
