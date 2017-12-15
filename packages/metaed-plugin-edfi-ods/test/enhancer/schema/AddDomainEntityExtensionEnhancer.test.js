// @flow
import { newDomainEntityExtension, newNamespaceInfo, newMetaEdEnvironment } from 'metaed-core';
import type { DomainEntityExtension, MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/DomainEntityExtension';

describe('when DomainEntityExtension enhances domain entity extension entity', () => {
  const domainEntityExtensionName: string = 'DomainEntityExtensionName';
  const extensionEntitySuffix: string = 'Extension';
  let domainEntityExtension: DomainEntityExtension;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    domainEntityExtension = Object.assign(newDomainEntityExtension(), {
      metaEdName: domainEntityExtensionName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        extensionEntitySuffix,
      }),
    });
    metaEd.entity.domainEntityExtension.set(domainEntityExtensionName, domainEntityExtension);
    enhance(metaEd);
  });

  it('should have ods extension name with extension entity suffix', () => {
    expect(domainEntityExtension.data.edfiOds.ods_ExtensionName).toBe(domainEntityExtensionName + extensionEntitySuffix);
  });
});
