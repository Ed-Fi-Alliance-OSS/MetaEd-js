// @flow
import { newAssociationExtension, newNamespaceInfo, newMetaEdEnvironment } from 'metaed-core';
import type { AssociationExtension, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/AssociationExtension';

describe('when AssociationExtension enhances association extension entity', () => {
  const associationExtensionName: string = 'AssociationExtensionName';
  const extensionEntitySuffix: string = 'Extension';
  let associationExtension: AssociationExtension;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    associationExtension = Object.assign(newAssociationExtension(), {
      metaEdName: associationExtensionName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        extensionEntitySuffix,
      }),
    });
    metaEd.entity.associationExtension.set(associationExtensionName, associationExtension);
    enhance(metaEd);
  });

  it('should have ods extension name with extension entity suffix', () => {
    expect(associationExtension.data.edfiOds.ods_ExtensionName).toBe(associationExtensionName + extensionEntitySuffix);
  });
});
