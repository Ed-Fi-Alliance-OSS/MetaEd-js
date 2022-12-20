import * as R from 'ramda';
import { Common, MetaEdEnvironment, IntegerType, Namespace } from '@edfi/metaed-core';
import { addEntityForNamespace, newCommon, newMetaEdEnvironment, newIntegerType, newNamespace } from '@edfi/metaed-core';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newIntegerSimpleType } from '../../src/model/schema/IntegerSimpleType';
import { NoSimpleType } from '../../src/model/schema/SimpleType';
import { enhance } from '../../src/diminisher/ModifyOrderOfPriorityToUsePositiveIntegerDiminisher';

describe('when ModifyOrderOfPriorityToUsePositiveIntegerDiminisher diminishes telephone common type', (): void => {
  const positiveIntegerType = 'xs:positiveInteger';
  let commonEntity: Common;
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    const commonEntityName = 'Telephone';
    const elementNameType = 'OrderOfPriority';

    commonEntity = {
      ...newCommon(),
      metaEdName: commonEntityName,
      namespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [
            {
              ...newComplexType(),
              name: commonEntityName,
              items: [{ ...newElement(), name: elementNameType, type: elementNameType }],
            },
          ],
        },
      },
    };
    addEntityForNamespace(commonEntity);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have element with positive integer type', (): void => {
    expect(R.head(R.head(commonEntity.data.edfiXsd.xsdComplexTypes).items).type).toBe(positiveIntegerType);
  });
});

describe('when ModifyOrderOfPriorityToUsePositiveIntegerDiminisher diminishes order of priority simple type', (): void => {
  let integerType: IntegerType;
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    const integerTypeName = 'OrderOfPriority';

    integerType = {
      ...newIntegerType(),
      metaEdName: integerTypeName,
      namespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newIntegerSimpleType(), name: integerTypeName, minValue: '1' },
        },
      },
    };
    addEntityForNamespace(integerType);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have no integer simple type for order of priority integer type', (): void => {
    expect(integerType.data.edfiXsd.xsdSimpleType).toBe(NoSimpleType);
  });
});

describe('when ModifyOrderOfPriorityToUsePositiveIntegerDiminisher diminishes with no order of priority', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    const commonEntityName = 'CommonEntityName';
    const integerTypeName = 'IntegerTypeName';

    const commonEntity: Common = {
      ...newCommon(),
      metaEdName: 'commonEntityName',
      namespace,
      data: {
        edfiXsd: {
          xsdComplexTypes: [
            {
              ...newComplexType(),
              name: commonEntityName,
              items: [{ ...newElement(), name: 'ElementName', type: 'ElementType' }],
            },
          ],
        },
      },
    };
    addEntityForNamespace(commonEntity);

    const integerType: IntegerType = {
      ...newIntegerType(),
      metaEdName: integerTypeName,
      namespace,
      data: {
        edfiXsd: {
          xsdSimpleType: { ...newIntegerSimpleType(), name: integerTypeName, minValue: '1' },
        },
      },
    };
    addEntityForNamespace(integerType);

    metaEd.dataStandardVersion = '2.0.0';
  });

  it('should run without error', (): void => {
    expect(enhance(metaEd).success).toBe(true);
  });
});
