// @flow
import { AssociationExtensionBuilder } from '../../src/builder/AssociationExtensionBuilder';
import { MetaEdTextBuilder } from '../MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getAssociationExtension } from '../TestHelper';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';


describe('when building association extension in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociationExtension(entityName, '1')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getAssociationExtension(metaEd.entity, entityName)).toBeDefined();
    expect(getAssociationExtension(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have one property', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', () => {
    const integerProperty = getAssociationExtension(metaEd.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });
});

describe('when building duplicate association extensions', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociationExtension(entityName, '1')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()

      .withStartAssociationExtension(entityName, '1')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getAssociationExtension(metaEd.entity, entityName)).toBeDefined();
    expect(getAssociationExtension(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot('when building duplicate association extensions should have validation failures for each entity -> Association 1 message');
    expect(validationFailures[0].sourceMap).toMatchSnapshot('when building duplicate association extensions should have validation failures for each entity -> Association 1 sourceMap');

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot('when building duplicate association extensions should have validation failures for each entity -> Association 2 message');
    expect(validationFailures[1].sourceMap).toMatchSnapshot('when building duplicate association extensions should have validation failures for each entity -> Association 2 sourceMap');
  });
});

describe('when building association extension with no association extension name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = '';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociationExtension(entityName, '1')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should not build association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(0);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building association extension with lowercase association extension name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'entityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociationExtension(entityName, '1')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should not build association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(0);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building association extension with no property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociationExtension(entityName, '1')
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getAssociationExtension(metaEd.entity, entityName)).toBeDefined();
    expect(getAssociationExtension(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no property', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building association extension with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociationExtension(entityName, '1')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withTrailingText(trailingText)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one association extension', () => {
    expect(metaEd.entity.associationExtension.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getAssociationExtension(metaEd.entity, entityName)).toBeDefined();
    expect(getAssociationExtension(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have extendee name', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).baseEntityName).toBe(entityName);
  });

  it('should have namespace', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have one property', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', () => {
    const integerProperty = getAssociationExtension(metaEd.entity, entityName).properties[0];

    expect(integerProperty.metaEdName).toBe(propertyName);
    expect(integerProperty.type).toBe('integer');
    expect(integerProperty.isRequired).toBe(true);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building association extension source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  beforeAll(() => {
    const builder = new AssociationExtensionBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartAssociationExtension(entityName, '1')
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndAssociationExtension()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have a metaEdId property', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).sourceMap.metaEdId).toBeDefined();
  });

  it('should have a metaEdName property', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have a type property', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map data', () => {
    expect(getAssociationExtension(metaEd.entity, entityName).sourceMap).toMatchSnapshot();
  });
});
