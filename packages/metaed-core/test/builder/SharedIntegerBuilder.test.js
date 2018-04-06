// @flow
import { SharedIntegerBuilder } from '../../src/builder/SharedIntegerBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getSharedInteger } from '../TestHelper';
import type { SharedIntegerSourceMap } from '../../src/model/SharedInteger';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building shared integer in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one shared integer', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSharedInteger(metaEd.entity, entityName)).toBeDefined();
    expect(getSharedInteger(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should not be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(false);
  });
});

describe('when building duplicate shared integers', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()

      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one shared integer', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSharedInteger(metaEd.entity, entityName)).toBeDefined();
    expect(getSharedInteger(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('SharedSimpleBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate shared integers should have validation failures for each entity -> SI 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate shared integers should have validation failures for each entity -> SI 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('SharedSimpleBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate shared integers should have validation failures for each entity -> SI 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate shared integers should have validation failures for each entity -> SI 2 sourceMap',
    );
  });
});

describe('when building shared short in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one shared short', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSharedInteger(metaEd.entity, entityName)).toBeDefined();
    expect(getSharedInteger(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(true);
  });
});

describe('when building shared integer with no shared integer name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = '';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should not build shared integer', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(0);
  });

  it('should have missing id error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared integer with lowercase shared integer name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'entityName';
  const expectedName: string = 'Name';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one shared short', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should be found in entity repository but with lowercase prefix ignored', () => {
    expect(getSharedInteger(metaEd.entity, expectedName)).toBeDefined();
    expect(getSharedInteger(metaEd.entity, expectedName).metaEdName).toBe(expectedName);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).maxValue).toBe(maxValue);
  });

  it('should not be a short', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).isShort).toBe(false);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared integer with no documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe('');
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should not be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(false);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared integer with no min value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have a min value because max value token was ignored', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(`max value${maxValue}`);
  });

  it('should not have max value because it was consumed by min value', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe('');
  });

  it('should not be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(false);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared integer with no max value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(minValue);
  });

  it('should not have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe('');
  });

  it('should not be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(false);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared integer with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withTrailingText(trailingText)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should not be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(false);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared short with no shared short name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = '';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should not build shared short', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(0);
  });

  it('should have missing id error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared short with lowercase shared short name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'entityName';
  const expectedName: string = 'Name';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should build one shared short', () => {
    expect(metaEd.entity.sharedInteger.size).toBe(1);
  });

  it('should be found in entity repository but with lowercase prefix ignored', () => {
    expect(getSharedInteger(metaEd.entity, expectedName)).toBeDefined();
    expect(getSharedInteger(metaEd.entity, expectedName).metaEdName).toBe('Name');
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).maxValue).toBe(maxValue);
  });

  it('should be a short', () => {
    expect(getSharedInteger(metaEd.entity, expectedName).isShort).toBe(true);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared short with no documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should not have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe('');
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(true);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared short with no min value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have a min value because max value token was ignored', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(`max value${maxValue}`);
  });

  it('should not have max value because it was consumed by min value', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe('');
  });

  it('should be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(true);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared short with no max value', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should not have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(minValue);
  });

  it('should not have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe('');
  });

  it('should be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(true);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared short with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'doc';
  const minValue = '2';
  const maxValue = '100';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withTrailingText(trailingText)
      .withEndSharedShort()
      .withEndNamespace()
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension', () => {
    expect(getSharedInteger(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaed id', () => {
    expect(getSharedInteger(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should not have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have minValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).minValue).toBe(minValue);
  });

  it('should have maxValue', () => {
    expect(getSharedInteger(metaEd.entity, entityName).maxValue).toBe(maxValue);
  });

  it('should be a short', () => {
    expect(getSharedInteger(metaEd.entity, entityName).isShort).toBe(true);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building shared integer source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'documentation';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedInteger(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  // SharedSimpleSourceMap
  it('should have type', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have metaEdName', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  it('should have metaEdId', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.metaEdId).toBeDefined();

    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.metaEdId.tokenText).toBe(`[${metaEdId}]`);
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have namespaceInfo', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.namespaceInfo).toBeDefined();
  });

  // SharedIntegerSourceMap
  it('should have isShort', () => {
    expect(((getSharedInteger(metaEd.entity, entityName).sourceMap: any): SharedIntegerSourceMap).isShort).toBeDefined();
  });

  it('should have minValue', () => {
    expect(((getSharedInteger(metaEd.entity, entityName).sourceMap: any): SharedIntegerSourceMap).minValue).toBeDefined();
  });

  it('should have maxValue', () => {
    expect(((getSharedInteger(metaEd.entity, entityName).sourceMap: any): SharedIntegerSourceMap).maxValue).toBeDefined();
  });

  it('should have line, column, text for each property', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap).toMatchSnapshot();
  });
});

describe('when building shared short source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '123';
  const documentation = 'documentation';
  const minValue = '2';
  const maxValue = '100';

  beforeAll(() => {
    const builder = new SharedIntegerBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartSharedShort(entityName, metaEdId)
      .withDocumentation(documentation)
      .withNumericRestrictions(minValue, maxValue)
      .withEndSharedInteger()
      .withEndNamespace()
      .sendToListener(builder);
  });

  // SharedSimpleSourceMap
  it('should have type', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  it('should have metaEdId', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.metaEdId).toBeDefined();
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.metaEdId.tokenText).toBe(`[${metaEdId}]`);
  });

  it('should have namespaceInfo', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap.namespaceInfo).toBeDefined();
  });

  // SharedIntegerSourceMap
  it('should have isShort', () => {
    expect(((getSharedInteger(metaEd.entity, entityName).sourceMap: any): SharedIntegerSourceMap).isShort).toBeDefined();
  });

  it('should have minValue', () => {
    expect(((getSharedInteger(metaEd.entity, entityName).sourceMap: any): SharedIntegerSourceMap).minValue).toBeDefined();
  });

  it('should have maxValue', () => {
    expect(((getSharedInteger(metaEd.entity, entityName).sourceMap: any): SharedIntegerSourceMap).maxValue).toBeDefined();
  });

  it('should have line, column, text for each property', () => {
    expect(getSharedInteger(metaEd.entity, entityName).sourceMap).toMatchSnapshot();
  });
});
