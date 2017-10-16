// @flow
import R from 'ramda';
import type {
  DomainEntity,
  IntegerType,
  MetaEdEnvironment,
} from '../../../metaed-core/index';
import {
  addEntity,
  newDomainEntity,
  newIntegerType,
  newMetaEdEnvironment,
} from '../../../metaed-core/index';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newIntegerSimpleType } from '../../src/model/schema/IntegerSimpleType';
import { enhance } from '../../src/diminisher/ModifyTotalInstructionalDaysToUseIntDiminisher';

describe('when ModifyTotalInstructionalDaysToUseIntDiminisher diminishes academic week domain entity', () => {
  const intType: string = 'xs:int';
  let domainEntity: DomainEntity;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName: string = 'AcademicWeek';
    const elementNameType: string = 'TotalInstructionalDays';

    domainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: domainEntityName,
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
    addEntity(metaEd.entity, domainEntity);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have type set to int type', () => {
    expect(R.head(R.head(domainEntity.data.edfiXsd.xsd_ComplexTypes).items).type).toBe(intType);
  });
});

describe('when ModifyTotalInstructionalDaysToUseIntDiminisher diminishes session domain entity', () => {
  const intType: string = 'xs:int';
  let domainEntity: DomainEntity;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const domainEntityName: string = 'Session';
    const elementNameType: string = 'TotalInstructionalDays';

    domainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: domainEntityName,
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
    addEntity(metaEd.entity, domainEntity);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have type set to int type', () => {
    expect(R.head(R.head(domainEntity.data.edfiXsd.xsd_ComplexTypes).items).type).toBe(intType);
  });
});

describe('when ModifyTotalInstructionalDaysToUseIntDiminisher diminishes with no academic week or session', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    const domainEntityName: string = 'DomainEntityName';
    const integerTypeName: string = 'IntegerTypeName';

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: domainEntityName,
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
    addEntity(metaEd.entity, domainEntity);

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
