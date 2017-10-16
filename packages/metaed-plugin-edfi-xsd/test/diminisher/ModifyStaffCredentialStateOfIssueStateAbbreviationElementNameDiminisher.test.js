// @flow
import R from 'ramda';
import type { Common, IntegerType, MetaEdEnvironment } from '../../../metaed-core/index';
import { addEntity, newCommon, newIntegerType, newMetaEdEnvironment } from '../../../metaed-core/index';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newIntegerSimpleType } from '../../src/model/schema/IntegerSimpleType';
import { enhance } from '../../src/diminisher/ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher';

describe('when ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher diminishes credential common type', () => {
  const expectedElementName: string = 'StateOfIssueStateAbbreviationType';
  let commonEntity: Common;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const commonEntityName: string = 'Credential';
    const elementName: string = 'StateOfIssueStateAbbreviation';
    const elementType: string = 'StateAbbreviationType';

    commonEntity = Object.assign(newCommon(), {
      metaEdName: commonEntityName,
      data: {
        edfiXsd: {
          xsd_ComplexTypes: [
            Object.assign(newComplexType(), {
              name: commonEntityName,
              items: [
                Object.assign(newElement(), {
                  name: elementName,
                  type: elementType,
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

  it('should have element name set to legacy name', () => {
    expect(R.head(R.head(commonEntity.data.edfiXsd.xsd_ComplexTypes).items).name).toBe(expectedElementName);
  });
});

describe('when ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher diminishes with no credential common type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    const commonEntityName: string = 'CommonEntityName';
    const integerTypeName: string = 'IntegerTypeName';

    const commonEntity: Common = Object.assign(newCommon(), {
      metaEdName: commonEntityName,
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
