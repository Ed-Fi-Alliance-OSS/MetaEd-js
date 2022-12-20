import * as R from 'ramda';
import { MetaEdEnvironment, DomainEntity, EnhancerResult, IntegerType, Namespace } from '@edfi/metaed-core';
import { newDomainEntity, newIntegerType, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newIntegerSimpleType } from '../../src/model/schema/IntegerSimpleType';
import { NoSimpleType } from '../../src/model/schema/SimpleType';
import { enhance } from '../../src/diminisher/ModifyDisciplineActionLengthToUseIntegerDiminisher';

describe('when ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher diminishes discipline action domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const domainEntityName1 = 'DisciplineAction';
  const integerType = 'xs:integer';
  let entity: DomainEntity;

  beforeAll(() => {
    const elementNameType1 = 'DisciplineActionLength';
    const elementName2 = 'ActualDisciplineActionLength';

    const domainEntity1: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntityName1,
      namespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [
            {
              ...newComplexType(),
              name: domainEntityName1,
              items: [
                { ...newElement(), name: elementNameType1, type: elementNameType1, maxOccursIsUnbounded: true },
                { ...newElement(), name: elementName2, type: elementNameType1, maxOccursIsUnbounded: true },
              ],
            },
          ],
        },
      },
    };
    namespace.entity.domainEntity.set(domainEntityName1, domainEntity1);
    metaEd.dataStandardVersion = '2.0.0';

    enhance(metaEd);

    entity = namespace.entity.domainEntity.get(domainEntityName1) as DomainEntity;
    expect(entity).toBeDefined();
  });

  it('should set type to integer type', (): void => {
    expect(R.head(R.head(entity.data.edfiXsd.xsdComplexTypes).items).type).toBe(integerType);
    expect(R.last(R.head(entity.data.edfiXsd.xsdComplexTypes).items).type).toBe(integerType);
  });
});

describe('when ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher diminishes discipline action simple type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  let entity: IntegerType;

  beforeAll(() => {
    const integerTypeName1 = 'DisciplineActionLength';

    const integerType1: IntegerType = {
      ...newIntegerType(),
      metaEdName: integerTypeName1,
      namespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newIntegerSimpleType(), name: integerTypeName1, minValue: '1' },
        },
      },
    };
    namespace.entity.integerType.set(integerTypeName1, integerType1);
    metaEd.dataStandardVersion = '2.0.0';

    enhance(metaEd);

    entity = namespace.entity.integerType.get(integerTypeName1) as IntegerType;
    expect(entity).toBeDefined();
  });

  it('should set simple type to NoSimpleType', (): void => {
    expect(entity.data.edfiXsd.xsdSimpleType).toBe(NoSimpleType);
  });
});

describe('when ModifyAppropriateSexOnInterventionStudyToBeMaxOccursTwoDiminisher diminishes with no discipline action', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  let result: EnhancerResult;

  beforeAll(() => {
    const domainEntityName1 = 'DomainEntityName1';
    const elementName1 = 'ElementName1';
    const elementType1 = 'ElementType1';
    const integerTypeName1 = 'IntegerTypeName';

    const domainEntity1: DomainEntity = {
      ...newDomainEntity(),
      metaEdName: domainEntityName1,
      namespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [
            {
              ...newComplexType(),
              name: domainEntityName1,
              items: [{ ...newElement(), name: elementName1, type: elementType1, maxOccursIsUnbounded: true }],
            },
          ],
        },
      },
    };
    namespace.entity.domainEntity.set(domainEntityName1, domainEntity1);

    const integerType1: IntegerType = {
      ...newIntegerType(),
      metaEdName: integerTypeName1,
      data: {
        edfiXsd: {
          xsdSimpleType: 'SimpleTypeName1',
          minValue: '1',
        },
      },
    };
    namespace.entity.integerType.set(integerTypeName1, integerType1);
    metaEd.dataStandardVersion = '2.0.0';

    result = enhance(metaEd);
  });

  it('should run without error', (): void => {
    expect(result.success).toBe(true);
  });
});
