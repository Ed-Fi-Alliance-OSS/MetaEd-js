// @flow
import { newMetaEdEnvironment, newNamespaceInfo, newStringType } from '../../../metaed-core/index';
import type { MetaEdEnvironment, NamespaceInfo } from '../../../metaed-core/index';
import { enhance } from '../../src/enhancer/DeleteExtraneousImplicitExtensionSimpleTypesEnhancer';

describe('when there are duplicate string types', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const coreOnlySimpleTypeName: string = 'CoreOnlySimpleTypeName';
  const coreDuplicatedSimpleTypeName: string = 'CoreDuplicatedSimpleTypeName';
  const extensionOnlySimpleTypeName: string = 'ExtensionOnlySimpleTypeName';

  const extensionNamespaceInfo : NamespaceInfo = Object.assign(newNamespaceInfo(), { isExtension: true, projectExtension: 'extension' });

  beforeAll(() => {
    metaEd.entity.stringType.set(coreOnlySimpleTypeName, Object.assign(newStringType(), { metaEdName: coreOnlySimpleTypeName }));
    metaEd.entity.stringType.set(coreDuplicatedSimpleTypeName, Object.assign(newStringType(), { metaEdName: coreDuplicatedSimpleTypeName }));
    metaEd.entity.stringType.set(`${extensionNamespaceInfo.projectExtension}-${coreDuplicatedSimpleTypeName}`, Object.assign(newStringType(), {
      metaEdName: coreDuplicatedSimpleTypeName,
      namespaceInfo: extensionNamespaceInfo,
    }));
    metaEd.entity.stringType.set(`${extensionNamespaceInfo.projectExtension}-${extensionOnlySimpleTypeName}`, Object.assign(newStringType(), {
      metaEdName: extensionOnlySimpleTypeName,
      namespaceInfo: extensionNamespaceInfo,
    }));

    enhance(metaEd);
  });

  it('should not have removed the core only type', () => {
    expect(metaEd.entity.stringType.get(coreOnlySimpleTypeName)).toBeDefined();
  });

  it('should not have removed the extension only type', () => {
    expect(metaEd.entity.stringType.get(`${extensionNamespaceInfo.projectExtension}-${extensionOnlySimpleTypeName}`)).toBeDefined();
  });

  it('should not have removed the core duplicated type', () => {
    expect(metaEd.entity.stringType.get(coreDuplicatedSimpleTypeName)).toBeDefined();
  });

  it('should have removed the extension duplicated type', () => {
    expect(metaEd.entity.stringType.get(`${extensionNamespaceInfo.projectExtension}-${coreDuplicatedSimpleTypeName}`)).toBeUndefined();
  });
});
