import * as R from 'ramda';
import { Common, IntegerType, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { addEntityForNamespace, newCommon, newIntegerType, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { newElement } from '../../src/model/schema/Element';
import { newIntegerSimpleType } from '../../src/model/schema/IntegerSimpleType';
import { enhance } from '../../src/diminisher/ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher';

describe('when ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher diminishes credential common type', (): void => {
  const expectedElementName = 'StateOfIssueStateAbbreviationType';
  let commonEntity: Common;
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    const commonEntityName = 'Credential';
    const elementName = 'StateOfIssueStateAbbreviation';
    const elementType = 'StateAbbreviationType';

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
              items: [{ ...newElement(), name: elementName, type: elementType }],
            },
          ],
        },
      },
    };
    addEntityForNamespace(commonEntity);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have element name set to legacy name', (): void => {
    expect(R.head(R.head(commonEntity.data.edfiXsd.xsdComplexTypes).items).name).toBe(expectedElementName);
  });
});

describe('when ModifyStaffCredentialStateOfIssueStateAbbreviationElementNameDiminisher diminishes with no credential common type', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    const commonEntityName = 'CommonEntityName';
    const integerTypeName = 'IntegerTypeName';

    const commonEntity: Common = {
      ...newCommon(),
      metaEdName: commonEntityName,
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
