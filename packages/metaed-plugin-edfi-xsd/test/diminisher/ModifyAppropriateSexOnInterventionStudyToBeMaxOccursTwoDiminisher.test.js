// @flow
import R from 'ramda';
import type { MetaEdEnvironment, DomainEntity, EnhancerResult, IntegerType, Namespace } from 'metaed-core';
import { newDomainEntity, newIntegerType, newMetaEdEnvironment, newNamespace } from 'metaed-core';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { enhance } from '../../src/diminisher/ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher';

describe('when ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher diminishes intervention study domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'edfi' });
  metaEd.namespace.set(namespace.namespaceName, namespace);
  let entity: DomainEntity;

  beforeAll(() => {
    const domainEntityName1: string = 'InterventionStudy';
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      namespace,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: domainEntityName1,
              items: [
                Object.assign(newElement(), {
                  name: 'AppropriateSex',
                  type: 'SexType',
                  maxOccursIsUnbounded: true,
                }),
              ],
            }),
          ],
        },
      },
    });
    namespace.entity.domainEntity.set(domainEntityName1, domainEntity1);
    metaEd.dataStandardVersion = '2.0.0';

    enhance(metaEd);

    // $FlowIgnore - entity could be undefined
    entity = namespace.entity.domainEntity.get(domainEntityName1);
    expect(entity).toBeDefined();
  });

  it("should have maxOccurs set to '2'", () => {
    expect(R.head(R.head(entity.data.edfiXsd.xsd_ComplexTypes).items).maxOccursIsUnbounded).toBe(false);
    expect(R.head(R.head(entity.data.edfiXsd.xsd_ComplexTypes).items).maxOccurs).toBe('2');
  });
});

describe('when ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher diminishes with no intervention study', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = Object.assign(newNamespace(), { namespaceName: 'edfi' });
  metaEd.namespace.set(namespace.namespaceName, namespace);
  let result: EnhancerResult;

  beforeAll(() => {
    const domainEntityName1: string = 'DomainEntityName1';
    const integerTypeName1: string = 'IntegerTypeName1';
    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      namespace,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: domainEntityName1,
              items: [
                Object.assign(newElement(), {
                  name: 'ComplexItemName',
                  type: 'ComplexItemType',
                }),
              ],
            }),
          ],
        },
      },
    });
    namespace.entity.domainEntity.set(domainEntityName1, domainEntity1);

    const integerType1: IntegerType = Object.assign(newIntegerType(), {
      metaEdName: integerTypeName1,
      data: {
        edfiXsd: {
          xsd_SimpleType: 'SimpleTypeName1',
          minValue: '1',
        },
      },
    });
    namespace.entity.integerType.set(integerTypeName1, integerType1);
    metaEd.dataStandardVersion = '2.0.0';

    result = enhance(metaEd);
  });

  it('should run without error', () => {
    expect(result.success).toBe(true);
  });
});
