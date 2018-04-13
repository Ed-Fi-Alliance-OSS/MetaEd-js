// @flow
import { NamespaceInfoBuilder } from '../../src/builder/NamespaceInfoBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';
import { DefaultExtensionEntitySuffix } from '../../src/model/NamespaceInfo';

describe('when building extension namespace info', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  beforeAll(() => {
    const builder = new NamespaceInfoBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartCommon('Dummy')
      .withDocumentation('Dummy')
      .withIntegerProperty('Dummy', 'Dummy', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one namespace info', () => {
    expect(metaEd.entity.namespaceInfo.size).toBe(1);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have correct namespace', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.namespace).toBe(namespace);
  });

  it('should have correct project extension', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should be an extension', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.isExtension).toBe(true);
  });

  it('should have correct extension suffix', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.extensionEntitySuffix).toBe(DefaultExtensionEntitySuffix);
  });
});

describe('when building core namespace info', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'edfi';

  beforeAll(() => {
    const builder = new NamespaceInfoBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartCommon('Dummy')
      .withDocumentation('Dummy')
      .withIntegerProperty('Dummy', 'Dummy', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one namespace info', () => {
    expect(metaEd.entity.namespaceInfo.size).toBe(1);
  });

  it('should have correct namespace', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.namespace).toBe(namespace);
  });

  it('should have a blank project extension', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.projectExtension).toBe('');
  });

  it('should not be an extension', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.isExtension).toBe(false);
  });

  it('should have correct extension suffix', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.extensionEntitySuffix).toBe(DefaultExtensionEntitySuffix);
  });
});

describe('when building extension namespace info source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  beforeAll(() => {
    const builder = new NamespaceInfoBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartCommon('Dummy')
      .withDocumentation('Dummy')
      .withIntegerProperty('Dummy', 'Dummy', true, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have type', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.sourceMap.type).toBeDefined();
  });

  it('should have namespace', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.sourceMap.namespace).toBeDefined();
  });

  it('should have isExtension', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.sourceMap.isExtension).toBeDefined();
  });

  it('should have projectExtension', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.sourceMap.projectExtension).toBeDefined();
  });

  it('should have line, column, text for each property', () => {
    const namespaceInfo: any = metaEd.entity.namespaceInfo.get(namespace);
    expect(namespaceInfo.sourceMap).toMatchSnapshot();
  });
});
