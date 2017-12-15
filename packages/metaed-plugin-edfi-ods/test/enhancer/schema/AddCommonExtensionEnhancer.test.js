// @flow
import { newCommonExtension, newNamespaceInfo, newMetaEdEnvironment } from 'metaed-core';
import type { CommonExtension, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/CommonExtension';

describe('when CommonExtension enhances common extension entity', () => {
  const commonExtensionName: string = 'CommonExtensionName';
  const extensionEntitySuffix: string = 'Extension';
  let commonExtension: CommonExtension;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    commonExtension = Object.assign(newCommonExtension(), {
      metaEdName: commonExtensionName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        extensionEntitySuffix,
      }),
    });
    metaEd.entity.commonExtension.set(commonExtensionName, commonExtension);
    enhance(metaEd);
  });

  it('should have ods extension name with extension entity suffix', () => {
    expect(commonExtension.data.edfiOds.ods_ExtensionName).toBe(commonExtensionName + extensionEntitySuffix);
  });
});
