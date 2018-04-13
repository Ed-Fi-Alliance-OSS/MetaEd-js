// @flow
import { ChoiceBuilder } from '../../src/builder/ChoiceBuilder';
import { NamespaceInfoBuilder } from '../../src/builder/NamespaceInfoBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getChoice } from '../TestHelper';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building choice in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const propertyName: string = 'PropertyName';
  const propertyMetaEdId: string = '2';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const entityDocumentation: string = 'EntityDocumentation';

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartChoice(entityName, entityMetaEdId)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, null, null, null, propertyMetaEdId)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one choice', () => {
    expect(metaEd.entity.choice.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getChoice(metaEd.entity, entityName)).toBeDefined();
    expect(getChoice(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getChoice(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getChoice(metaEd.entity, entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(getChoice(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getChoice(metaEd.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have one property', () => {
    expect(getChoice(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', () => {
    const property = getChoice(metaEd.entity, entityName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.metaEdId).toBe(propertyMetaEdId);
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });
});

describe('when building duplicate choices', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const propertyName: string = 'PropertyName';
  const propertyMetaEdId: string = '2';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const entityDocumentation: string = 'EntityDocumentation';

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartChoice(entityName, entityMetaEdId)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, null, null, null, propertyMetaEdId)
      .withEndChoice()

      .withStartChoice(entityName, entityMetaEdId)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, null, null, null, propertyMetaEdId)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one choice', () => {
    expect(metaEd.entity.choice.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getChoice(metaEd.entity, entityName)).toBeDefined();
    expect(getChoice(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate choices should have validation failures for each entity -> Choice 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate choices should have validation failures for each entity -> Choice 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate choices should have validation failures for each entity -> Choice 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate choices should have validation failures for each entity -> Choice 2 sourceMap',
    );
  });
});

describe('when building choice with no choice name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = '';
  const entityMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const propertyMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartChoice(entityName, entityMetaEdId)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, null, null, null, propertyMetaEdId)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not build choice', () => {
    expect(metaEd.entity.choice.size).toBe(0);
  });

  it('should have missing id error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building choice with lowercase choice name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'entityName';
  const expectedName: string = 'Name';
  const entityMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const propertyMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartChoice(entityName, entityMetaEdId)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, null, null, null, propertyMetaEdId)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one choice', () => {
    expect(metaEd.entity.choice.size).toBe(1);
  });

  it('should be found in entity repository but with lowercase prefix ignored', () => {
    expect(getChoice(metaEd.entity, expectedName)).toBeDefined();
    expect(getChoice(metaEd.entity, expectedName).metaEdName).toBe(expectedName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getChoice(metaEd.entity, expectedName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getChoice(metaEd.entity, expectedName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(getChoice(metaEd.entity, expectedName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getChoice(metaEd.entity, expectedName).documentation).toBe(entityDocumentation);
  });

  it('should have one property', () => {
    expect(getChoice(metaEd.entity, expectedName).properties).toHaveLength(1);
  });

  it('should have integer property', () => {
    const property = getChoice(metaEd.entity, expectedName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.metaEdId).toBe(propertyMetaEdId);
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building choice with no documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const propertyMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartChoice(entityName, entityMetaEdId)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, null, null, null, propertyMetaEdId)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should be found in entity repository', () => {
    expect(getChoice(metaEd.entity, entityName)).toBeDefined();
    expect(getChoice(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getChoice(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getChoice(metaEd.entity, entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(getChoice(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getChoice(metaEd.entity, entityName).documentation).toBe('');
  });

  it('should have one property', () => {
    expect(getChoice(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', () => {
    const property = getChoice(metaEd.entity, entityName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.metaEdId).toBe(propertyMetaEdId);
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building choice with no property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartChoice(entityName, entityMetaEdId)
      .withDocumentation(entityDocumentation)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should be found in entity repository', () => {
    expect(getChoice(metaEd.entity, entityName)).toBeDefined();
    expect(getChoice(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getChoice(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getChoice(metaEd.entity, entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(getChoice(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getChoice(metaEd.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have no property', () => {
    expect(getChoice(metaEd.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building choice with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const entityDocumentation: string = 'EntityDocumentation';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const propertyMetaEdId: string = '2';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartChoice(entityName, entityMetaEdId)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, null, null, null, propertyMetaEdId)
      .withTrailingText(trailingText)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should be found in entity repository', () => {
    expect(getChoice(metaEd.entity, entityName)).toBeDefined();
    expect(getChoice(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getChoice(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getChoice(metaEd.entity, entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(getChoice(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getChoice(metaEd.entity, entityName).documentation).toBe(entityDocumentation);
  });

  it('should have one property', () => {
    expect(getChoice(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have integer property', () => {
    const property = getChoice(metaEd.entity, entityName).properties[0];

    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.metaEdId).toBe(propertyMetaEdId);
    expect(property.isRequired).toBe(true);
    expect(property.documentation).toBe(propertyDocumentation);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building choice source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const propertyName: string = 'PropertyName';
  const propertyMetaEdId: string = '2';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const entityDocumentation: string = 'EntityDocumentation';

  beforeAll(() => {
    const builder = new ChoiceBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartChoice(entityName, entityMetaEdId)
      .withDocumentation(entityDocumentation)
      .withIntegerProperty(propertyName, propertyDocumentation, true, false, null, null, null, propertyMetaEdId)
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have a documentation property', () => {
    expect(getChoice(metaEd.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have a metaEdId property', () => {
    expect(getChoice(metaEd.entity, entityName).sourceMap.metaEdId).toBeDefined();
  });

  it('should have a metaEdName property', () => {
    expect(getChoice(metaEd.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have a type property', () => {
    expect(getChoice(metaEd.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map data', () => {
    expect(getChoice(metaEd.entity, entityName).sourceMap).toMatchSnapshot();
  });
});
