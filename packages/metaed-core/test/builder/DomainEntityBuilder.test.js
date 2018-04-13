// @flow
import { DomainEntityBuilder } from '../../src/builder/DomainEntityBuilder';
import { NamespaceInfoBuilder } from '../../src/builder/NamespaceInfoBuilder';

import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getDomainEntity } from '../TestHelper';
import type { DomainEntitySourceMap } from '../../src/model/DomainEntity';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building simple domain entity in extension namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const metaEdId: string = '1';
  const projectExtension: string = 'ProjectExtension';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomainEntity(metaEd.entity, entityName)).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have correct namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have correct metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have correct project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should not be abstract', () => {
    expect(getDomainEntity(metaEd.entity, entityName).isAbstract).toBe(false);
  });

  it('should not have updates set', () => {
    expect(getDomainEntity(metaEd.entity, entityName).allowPrimaryKeyUpdates).toBe(false);
  });

  it('should have correct documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    const property = getDomainEntity(metaEd.entity, entityName).properties[0];
    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.namespaceInfo.namespace).toBe(namespace);
    expect(property.namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have string property', () => {
    const property = getDomainEntity(metaEd.entity, entityName).properties[1];
    expect(property.metaEdName).toBe(stringPropertyName);
    expect(property.type).toBe('string');
    expect(property.namespaceInfo.namespace).toBe(namespace);
    expect(property.namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should not have queryable fields', () => {
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields).toHaveLength(0);
  });
});

describe('when building duplicate domain entities', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const metaEdId: string = '1';
  const projectExtension: string = 'ProjectExtension';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()

      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomainEntity(metaEd.entity, entityName)).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate domain entities should have validation failures for each entity -> DE 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate domain entities should have validation failures for each entity -> DE 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate domain entities should have validation failures for each entity -> DE 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate domain entities should have validation failures for each entity -> DE 2 sourceMap',
    );
  });
});

describe('when building duplicate property names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const metaEdId: string = '1';
  const projectExtension: string = 'ProjectExtension';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each property', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate property names should have validation failures for each property -> property 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate property names should have validation failures for each property -> property 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate property names should have validation failures for each property -> property 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate property names should have validation failures for each property -> property 2 sourceMap',
    );
  });
});

describe('when building duplicate property names with different with context names', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const metaEdId: string = '1';
  const projectExtension: string = 'ProjectExtension';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2', 'Context1')
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2', 'Context2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building duplicate property names with same with context name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const metaEdId: string = '1';
  const projectExtension: string = 'ProjectExtension';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2', 'Context')
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2', 'Context')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each property', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate property names with same with context name should have validation failures for each property -> property 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate property names with same with context name should have validation failures for each property -> property 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate property names with same with context name should have validation failures for each property -> property 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate property names with same with context name should have validation failures for each property -> property 2 sourceMap',
    );
  });
});

describe('when building domain entity without extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const metaEdId: string = '1';
  const entityName: string = 'EntityName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation('doc')
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomainEntity(metaEd.entity, entityName)).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have correct namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have correct metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have no project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe('');
  });

  it('should not be abstract', () => {
    expect(getDomainEntity(metaEd.entity, entityName).isAbstract).toBe(false);
  });

  it('should not have updates set', () => {
    expect(getDomainEntity(metaEd.entity, entityName).allowPrimaryKeyUpdates).toBe(false);
  });

  it('should have one property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('string');
  });
});

describe('when building domain entity with a with context', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const withContextName: string = 'WithContextName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonProperty(propertyName, 'doc', true, false, withContextName)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have common property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('common');
  });

  it('should have with context', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].withContext).toBe(withContextName);
  });
});

describe('when building domain entity with a with context and shorten to', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const withContextName: string = 'WithContextName';
  const shortenToName: string = 'ShortenToName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonProperty(propertyName, 'doc', true, false, withContextName, null, shortenToName)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have common property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('common');
  });

  it('should have with context', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].withContext).toBe(withContextName);
  });

  it('should have shorten to', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].shortenTo).toBe(shortenToName);
  });
});

describe('when building domain entity with choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation: string = 'Documentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withChoiceProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have choice property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('choice');
  });

  it('should have correct documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentation).toBe(documentation);
  });
});

describe('when building domain entity with inline common reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const documentation: string = 'Documentation';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withInlineCommonProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have inline common property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('inlineCommon');
  });

  it('should have correct documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentation).toBe(documentation);
  });
});

describe('when building domain entity with queryable field', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringPropertyAsQueryableField(propertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('string');
  });

  it('should have queryable field', () => {
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields[0].metaEdName).toBe(propertyName);
  });
});

describe('when building domain entity with queryable only property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const queryableOnlyName: string = 'QueryableOnlyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '10', '2')
      .withQueryableOnlyDomainEntityProperty(queryableOnlyName, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have string property only', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('string');
  });

  it('should have queryable field separate', () => {
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields[0].metaEdName).toBe(queryableOnlyName);
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields[0].type).toBe('domainEntity');
  });
});

describe('when building domain entity with shared decimal reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedDecimalProperty(sharedPropertyType, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared decimal property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedDecimal');
  });

  it('should have correct referenced type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared decimal reference without name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedDecimalProperty(sharedPropertyType, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared decimal property named after type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(sharedPropertyType);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedDecimal');
  });

  it('should have correct referenced type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared integer reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(sharedPropertyType, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedInteger');
  });

  it('should have correct referenced type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });

  it('should have correct sourcemap', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap).toMatchSnapshot();
  });
});

describe('when building domain entity with shared integer reference without name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(sharedPropertyType, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared integer property named after type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(sharedPropertyType);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedInteger');
  });

  it('should have correct referenced type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });

  it('should have correct sourcemap', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].sourceMap).toMatchSnapshot();
  });
});

describe('when building domain entity with shared short reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(sharedPropertyType, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared short property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedShort');
  });

  it('should have correct referenced type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared short reference without name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(sharedPropertyType, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared short property named after type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(sharedPropertyType);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedShort');
  });

  it('should have correct referenced type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared string reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedStringProperty(sharedPropertyType, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedString');
  });

  it('should have correct referenced type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared string reference without name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedStringProperty(sharedPropertyType, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared string property named after type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(sharedPropertyType);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedString');
  });

  it('should have correct referenced type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared string reference inheriting documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const sharedPropertyType: string = 'SharedPropertyType';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedStringProperty(sharedPropertyType, propertyName, 'inherited', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have shared string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('sharedString');
  });

  it('should have inherited flag set instead of documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentationInherited).toBe(true);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentation).toBe('');
  });
});

describe('when building domain entity with domain entity reference inheriting documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, 'inherited', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have domain entity property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('domainEntity');
  });

  it('should have inherited flag set instead of documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentationInherited).toBe(true);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].documentation).toBe('');
  });
});

describe('when building domain entity with cascading updates', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCascadeUpdate()
      .withDomainEntityProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have updates set', () => {
    expect(getDomainEntity(metaEd.entity, entityName).allowPrimaryKeyUpdates).toBe(true);
  });
});

describe('when building abstract entity in extension namespace', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const metaEdId: string = '1';
  const projectExtension: string = 'ProjectExtension';
  const entityName: string = 'EntityName';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartAbstractEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one abstract entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomainEntity(metaEd.entity, entityName)).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have correct namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have correct metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have correct project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should be abstract', () => {
    expect(getDomainEntity(metaEd.entity, entityName).isAbstract).toBe(true);
  });

  it('should not have updates set', () => {
    expect(getDomainEntity(metaEd.entity, entityName).allowPrimaryKeyUpdates).toBe(false);
  });

  it('should have correct documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].type).toBe('string');
  });

  it('should not have queryable fields', () => {
    expect(getDomainEntity(metaEd.entity, entityName).queryableFields).toHaveLength(0);
  });
});

describe('when building domain entity with no begin namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .sendToListener(builder);
  });

  it('should not build a domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with no project extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = '';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not build domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(0);
  });

  it('should have extraneous input and mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with uppercase namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'Namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomainEntity(metaEd.entity, entityName)).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should not have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe('');
  });

  it('should have a project extension that takes the namespace value', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].type).toBe('string');
  });

  it('should have missing namespace id and extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with lowercase project extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'projectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getDomainEntity(metaEd.entity, entityName)).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should note have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have project extension but with lowercase prefix ignored', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe('Extension');
  });

  it('should have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].type).toBe('string');
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with no namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = '';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe('');
  });

  it('should have incorrect project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].type).toBe('string');
  });

  it('should have missing namespace id error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with no end namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should not have project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should not have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].type).toBe('string');
  });

  it('should have extraneous input eof error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with no top level entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not build domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with no domain entity name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = '';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not build domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(0);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with lowercase domain entity name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'entityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not build domain entity', () => {
    expect(metaEd.entity.domainEntity.size).toBe(0);
  });

  it('should have no viable alternative error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with no metaed id', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should not have project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should not have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe('');
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].type).toBe('string');
  });

  it('should have token recognition error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with no documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should not have project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should not have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe('');
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].type).toBe('string');
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with no properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should not have project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should not have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });
  it('should not have any properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';
  const stringPropertyName: string = 'StringPropertyName';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withTrailingText(trailingText)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should not have project extension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should not have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(metaEd.entity, entityName).properties[1].type).toBe('string');
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building domain entity source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withCascadeUpdate()
      .withIntegerProperty(propertyName, 'Doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have namespaceInfo', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.namespaceInfo).toBeDefined();
  });

  it('should have type property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have metaEdName', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });
  it('should have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.metaEdId).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.metaEdId.tokenText).toBe(`[${metaEdId}]`);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have allowPrimaryKeyUpdates', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.allowPrimaryKeyUpdates).toBeDefined();
  });

  it('should have isAbstract', () => {
    expect(((getDomainEntity(metaEd.entity, entityName).sourceMap: any): DomainEntitySourceMap).isAbstract).toBeDefined();
  });

  it('should have line, column, text for each property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap).toMatchSnapshot();
  });
});

describe('when building domain entity namespace info source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Doc';
  const propertyName: string = 'PropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartDomainEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withCascadeUpdate()
      .withIntegerProperty(propertyName, 'Doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have namespaceInfo', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.namespaceInfo).toBeDefined();
  });

  it('should have source map', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap).toBeDefined();
  });

  it('should have type', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap.type).toBeDefined();
  });

  it('should have namespace', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap.namespace).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap.namespace.tokenText).toBe(namespace);
  });

  it('should have projectExtension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap.projectExtension).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap.projectExtension.tokenText).toBe(
      projectExtension,
    );
  });

  it('should have isExtension', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap.isExtension).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap.isExtension.tokenText).toBe(projectExtension);
  });

  it('should have line, column, text for each property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).namespaceInfo.sourceMap).toMatchSnapshot();
  });
});

describe('when building abstract entity source map', () => {
  const validationFailures: Array<ValidationFailure> = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const propertyName: string = 'PropertyName';
  const documentation: string = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartAbstractEntity(entityName, metaEdId)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'Doc', true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have namespaceInfo', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.namespaceInfo).toBeDefined();
  });

  it('should have type property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have metaEdName', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });
  it('should have metaEdId', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.metaEdId).toBeDefined();
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.metaEdId.tokenText).toBe(`[${metaEdId}]`);
  });

  it('should have documentation', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have allowPrimaryKeyUpdates', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap.allowPrimaryKeyUpdates).toBeDefined();
  });

  it('should have isAbstract', () => {
    expect(((getDomainEntity(metaEd.entity, entityName).sourceMap: any): DomainEntitySourceMap).isAbstract).toBeDefined();
  });

  it('should have line, column, text for each property', () => {
    expect(getDomainEntity(metaEd.entity, entityName).sourceMap).toMatchSnapshot();
  });
});
