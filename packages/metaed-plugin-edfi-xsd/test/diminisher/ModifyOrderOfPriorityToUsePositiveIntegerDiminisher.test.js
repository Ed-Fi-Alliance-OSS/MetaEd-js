// @flow
import R from 'ramda';
import type { Common, MetaEdEnvironment, IntegerType } from '../../../metaed-core/index';
import { addEntity, newCommon, newMetaEdEnvironment, newIntegerType } from '../../../metaed-core/index';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newIntegerSimpleType } from '../../src/model/schema/IntegerSimpleType';
import { NoSimpleType } from '../../src/model/schema/SimpleType';
import { enhance } from '../../src/diminisher/ModifyOrderOfPriorityToUsePositiveIntegerDiminisher';

describe('when ModifyOrderOfPriorityToUsePositiveIntegerDiminisher diminishes telephone common type', () => {
  const positiveIntegerType: string = 'xs:positiveInteger';
  let commonEntity: Common;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const commonEntityName: string = 'Telephone';
    const elementNameType: string = 'OrderOfPriority';

    commonEntity = Object.assign(newCommon(), {
      metaEdName: commonEntityName,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: commonEntityName,
              items: [
                Object.assign(newElement(), {
                  name: elementNameType,
                  type: elementNameType,
                }),
              ],
            }),
          ],
        },
      },
    });
    addEntity(metaEd.entity, commonEntity);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have element with positive integer type', () => {
    expect(R.head(R.head(commonEntity.data.edfiXsd.xsd_ComplexTypes).items).type).toBe(positiveIntegerType);
  });
});

describe('when ModifyOrderOfPriorityToUsePositiveIntegerDiminisher diminishes order of priority simple type', () => {
  let integerType: IntegerType;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const integerTypeName: string = 'OrderOfPriority';

    integerType = Object.assign(newIntegerType(), {
      metaEdName: integerTypeName,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newIntegerSimpleType(), { name: integerTypeName, minValue: '1' }),
        },
      },
    });
    addEntity(metaEd.entity, integerType);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have no integer simple type for order of priority integer type', () => {
    expect(integerType.data.edfiXsd.xsd_SimpleType).toBe(NoSimpleType);
  });
});

describe('when ModifyOrderOfPriorityToUsePositiveIntegerDiminisher diminishes with no order of priority', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  beforeAll(() => {
    const commonEntityName: string = 'CommonEntityName';
    const integerTypeName: string = 'IntegerTypeName';

    const commonEntity: Common = Object.assign(newCommon(), {
      metaEdName: 'commonEntityName',
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: commonEntityName,
              items: [
                Object.assign(newElement(), {
                  name: 'ElementName',
                  type: 'ElementType',
                }),
              ],
            }),
          ],
        },
      },
    });
    addEntity(metaEd.entity, commonEntity);

    const integerType: IntegerType = Object.assign(newIntegerType(), {
      metaEdName: integerTypeName,
      data: {
        edfiXsd: {
          xsd_SimpleType: Object.assign(newIntegerSimpleType(), { name: integerTypeName, minValue: '1' }),
        },
      },
    });
    addEntity(metaEd.entity, integerType);

    metaEd.dataStandardVersion = '2.0.0';
  });

  it('should run without error', () => {
    expect(enhance(metaEd).success).toBe(true);
  });
});
