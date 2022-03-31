import { newIntegerProperty, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { IntegerProperty, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../../src/model/property/EntityProperty';

describe('when PropertyEnhancer enhances integer property', (): void => {
  const integerPropertyName = 'IntegerPropertyName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have ods name', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsName).toBe(integerPropertyName);
  });

  it('should have empty ods context prefix', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsContextPrefix).toBe('');
  });

  it('should have false ods is collection', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsIsCollection).toBe(false);
  });
});

describe('when PropertyEnhancer enhances property with required collection', (): void => {
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const integerPropertyName = 'IntegerPropertyName';
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      isRequiredCollection: true,
      isCollection: true,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have true ods is collection', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsIsCollection).toBe(true);
  });
});

describe('when PropertyEnhancer enhances property with optional collection', (): void => {
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const integerPropertyName = 'IntegerPropertyName';
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      isOptionalCollection: true,
      isCollection: true,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have true ods is collection', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsIsCollection).toBe(true);
  });
});

describe('when PropertyEnhancer enhances property role name', (): void => {
  const integerPropertyName = 'IntegerPropertyName';
  const contextName = 'ContextName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      roleName: contextName,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have ods name prefixed role name', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsName).toBe(contextName + integerPropertyName);
  });

  it('should have ods context prefix', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsContextPrefix).toBe(contextName);
  });
});

describe('when PropertyEnhancer enhances property with shortened context', (): void => {
  const integerPropertyName = 'IntegerPropertyName';
  const contextName = 'ContextName';
  const shortenToName = 'shortenToName';
  let integerProperty: IntegerProperty;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      roleName: contextName,
      shortenTo: shortenToName,
    });

    metaEd.propertyIndex.integer.push(integerProperty);
    enhance(metaEd);
  });

  it('should have ods name prefixed role name', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsName).toBe(contextName + integerPropertyName);
  });

  it('should have ods context prefix with shortened name', (): void => {
    expect(integerProperty.data.edfiOdsRelational.odsContextPrefix).toBe(shortenToName);
  });
});
