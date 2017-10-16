// @flow
import R from 'ramda';
import type {
  MetaEdEnvironment,
  DomainEntity,
  EnhancerResult,
  IntegerType,
} from '../../../metaed-core/index';
import {
  newDomainEntity,
  newIntegerType,
  newMetaEdEnvironment,
} from '../../../metaed-core/index';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newIntegerSimpleType } from '../../src/model/schema/IntegerSimpleType';
import { NoSimpleType } from '../../src/model/schema/SimpleType';
import { enhance } from '../../src/diminisher/ModifyDisciplineActionLengthToUseIntegerDiminisher';

describe('when ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher diminishes discipline action domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName1: string = 'DisciplineAction';
  const integerType: string = 'xs:integer';
  let entity: DomainEntity;

  beforeAll(() => {
    const elementNameType1: string = 'DisciplineActionLength';
    const elementName2: string = 'ActualDisciplineActionLength';

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: domainEntityName1,
              items: [
                Object.assign(newElement(), {
                  name: elementNameType1,
                  type: elementNameType1,
                  maxOccursIsUnbounded: true,
                }),
                Object.assign(newElement(), {
                  name: elementName2,
                  type: elementNameType1,
                  maxOccursIsUnbounded: true,
                }),
              ],
            }),
          ],
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntityName1, domainEntity1);
    metaEd.dataStandardVersion = '2.0.0';

    enhance(metaEd);

    // $FlowIgnore - entity could be undefined
    entity = metaEd.entity.domainEntity.get(domainEntityName1);
    expect(entity).toBeDefined();
  });

  it('should set type to integer type', () => {
    expect(R.head(R.head(entity.data.edfiXsd.xsd_ComplexTypes).items).type).toBe(integerType);
    expect(R.last(R.head(entity.data.edfiXsd.xsd_ComplexTypes).items).type).toBe(integerType);
  });
});

describe('when ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher diminishes discipline action simple type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let entity: DomainEntity;

  beforeAll(() => {
    const integerTypeName1: string = 'DisciplineActionLength';

    const integerType1: IntegerType = Object.assign(newIntegerType(), {
      metaEdName: integerTypeName1,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newIntegerSimpleType(), {
            name: integerTypeName1,
            minValue: '1',
          }),
        },
      },
    });
    metaEd.entity.integerType.set(integerTypeName1, integerType1);
    metaEd.dataStandardVersion = '2.0.0';

    enhance(metaEd);

    // $FlowIgnore - entity could be undefined
    entity = metaEd.entity.integerType.get(integerTypeName1);
    expect(entity).toBeDefined();
  });

  it('should set simple type to NoSimpleType', () => {
    expect(entity.data.edfiXsd.xsd_SimpleType).toBe(NoSimpleType);
  });
});

describe('when ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher diminishes with no discipline action', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  let result: EnhancerResult;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const elementName1: string = 'ElementName1';
    const elementType1: string = 'ElementType1';
    const integerTypeName1: string = 'IntegerTypeName';

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: domainEntityName1,
              items: [
                Object.assign(newElement(), {
                  name: elementName1,
                  type: elementType1,
                  maxOccursIsUnbounded: true,
                }),
              ],
            }),
          ],
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntityName1, domainEntity1);

    const integerType1: IntegerType = Object.assign(newIntegerType(), {
      metaEdName: integerTypeName1,
      data: {
        edfiXsd: {
          xsd_SimpleType: 'SimpleTypeName1',
          minValue: '1',
        },
      },
    });
    metaEd.entity.integerType.set(integerTypeName1, integerType1);
    metaEd.dataStandardVersion = '2.0.0';

    result = enhance(metaEd);
  });

  it('should run without error', () => {
    expect(result.success).toBe(true);
  });
});

