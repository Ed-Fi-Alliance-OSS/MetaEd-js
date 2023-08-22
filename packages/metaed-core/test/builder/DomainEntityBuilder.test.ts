import { DomainEntityBuilder } from '../../src/builder/DomainEntityBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';

import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getDomainEntity } from '../TestHelper';
import { DomainEntitySourceMap } from '../../src/model/DomainEntity';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';
import { StringProperty } from '../../src/model/property/StringProperty';
import { DomainEntityProperty } from '../../src/model/property/DomainEntityProperty';
import { AssociationProperty } from '../../src/model/property/AssociationProperty';

describe('when building simple domain entity in extension namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const maxLength = '10';
  const minLength = '2';
  const projectExtension = 'ProjectExtension';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  const documentation = 'Doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, maxLength, minLength)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomainEntity(namespace.entity, entityName)).toBeDefined();
    expect(getDomainEntity(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have correct namespace', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have correct project extension', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should not be abstract', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).isAbstract).toBe(false);
  });

  it('should not have updates set', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).allowPrimaryKeyUpdates).toBe(false);
  });

  it('should have correct documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have two properties', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', (): void => {
    const property = getDomainEntity(namespace.entity, entityName).properties[0];
    expect(property.metaEdName).toBe(propertyName);
    expect(property.type).toBe('integer');
    expect(property.namespace.namespaceName).toBe(namespaceName);
    expect(property.namespace.projectExtension).toBe(projectExtension);
  });

  it('should have string property', (): void => {
    const property: StringProperty = getDomainEntity(namespace.entity, entityName).properties[1] as StringProperty;
    expect(property.metaEdName).toBe(stringPropertyName);
    expect(property.type).toBe('string');
    expect(property.namespace.namespaceName).toBe(namespaceName);
    expect(property.namespace.projectExtension).toBe(projectExtension);
    expect(property.minLength).toBe(minLength);
    expect(property.maxLength).toBe(maxLength);
  });

  it('should not have queryable fields', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).queryableFields).toHaveLength(0);
  });
});

describe('when building deprecated domain entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'Doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getDomainEntity(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building duplicate domain entities', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  const documentation = 'Doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()

      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomainEntity(namespace.entity, entityName)).toBeDefined();
    expect(getDomainEntity(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Domain Entity named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 16,
              "line": 15,
              "tokenText": "EntityName",
            }
        `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Domain Entity named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 16,
              "line": 2,
              "tokenText": "EntityName",
            }
        `);
  });
});

describe('when building duplicate property names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  const documentation = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each property', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Property named StringPropertyName is a duplicate declaration of that name. Use 'role name' keyword to avoid naming collisions."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 11,
              "line": 15,
              "tokenText": "StringPropertyName",
            }
        `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Property named StringPropertyName is a duplicate declaration of that name.  Use 'role name' keyword to avoid naming collisions."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 11,
              "line": 9,
              "tokenText": "StringPropertyName",
            }
        `);
  });
});

describe('when building duplicate property names with different role name names', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  const documentation = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2', 'Context1')
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2', 'Context2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });
});

describe('when building duplicate property names with same role name name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  const documentation = 'Doc';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2', 'Context')
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2', 'Context')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each property', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Property named StringPropertyName is a duplicate declaration of that name. Use 'role name' keyword to avoid naming collisions."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 11,
              "line": 16,
              "tokenText": "StringPropertyName",
            }
        `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Property named StringPropertyName is a duplicate declaration of that name.  Use 'role name' keyword to avoid naming collisions."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
            Object {
              "column": 11,
              "line": 9,
              "tokenText": "StringPropertyName",
            }
        `);
  });
});

describe('when building domain entity without extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const stringPropertyName = 'StringPropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomainEntity(namespace.entity, entityName)).toBeDefined();
    expect(getDomainEntity(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have correct namespace', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have no project extension', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.projectExtension).toBe('');
  });

  it('should not be abstract', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).isAbstract).toBe(false);
  });

  it('should not have updates set', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).allowPrimaryKeyUpdates).toBe(false);
  });

  it('should have one property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
  });

  it('should have string property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('string');
  });
});

describe('when building domain entity with a role name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const roleNameName = 'RoleNameName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonProperty(propertyName, 'doc', true, false, roleNameName)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have common property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('common');
  });

  it('should have role name', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].roleName).toBe(roleNameName);
  });
});

describe('when building domain entity with a role name and shorten to', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const roleNameName = 'RoleNameName';
  const shortenToName = 'ShortenToName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCommonProperty(propertyName, 'doc', true, false, roleNameName, shortenToName)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have common property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('common');
  });

  it('should have role name', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].roleName).toBe(roleNameName);
  });

  it('should have shorten to', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].shortenTo).toBe(shortenToName);
  });
});

describe('when building domain entity with choice', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'Documentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withChoiceProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have choice property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('choice');
  });

  it('should have correct documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].documentation).toBe(documentation);
  });
});

describe('when building domain entity with inline common reference', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'Documentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withInlineCommonProperty(propertyName, documentation, true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have inline common property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('inlineCommon');
  });

  it('should have correct documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].documentation).toBe(documentation);
  });
});

describe('when building domain entity with queryable field', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringPropertyAsQueryableField(propertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have string property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('string');
  });

  it('should have queryable field', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).queryableFields).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).queryableFields[0].metaEdName).toBe(propertyName);
  });
});

describe('when building domain entity with queryable only property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const queryableOnlyName = 'QueryableOnlyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withStringProperty(propertyName, 'doc', true, false, '10', '2')
      .withQueryableOnlyDomainEntityProperty(queryableOnlyName, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have string property only', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('string');
  });

  it('should have queryable field separate', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).queryableFields).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).queryableFields[0].metaEdName).toBe(queryableOnlyName);
    expect(getDomainEntity(namespace.entity, entityName).queryableFields[0].type).toBe('domainEntity');
  });
});

describe('when building domain entity with shared decimal reference', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedDecimalProperty(sharedPropertyType, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared decimal property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedDecimal');
  });

  it('should have correct referenced type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared decimal reference without name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedDecimalProperty(sharedPropertyType, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared decimal property named after type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(sharedPropertyType);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedDecimal');
  });

  it('should have correct referenced type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared integer reference', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(sharedPropertyType, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared integer property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedInteger');
  });

  it('should have correct referenced type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });

  it('should have correct sourcemap', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "baseKeyName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 6,
          "line": 6,
          "tokenText": "documentation",
        },
        "documentationInherited": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "fullPropertyName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "hasRestriction": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isCollection": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isIdentityRename": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isOptional": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isOptionalCollection": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isPartOfIdentity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isQueryableOnly": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isRequired": Object {
          "column": 6,
          "line": 8,
          "tokenText": "is required",
        },
        "isRequiredCollection": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "maxValue": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "mergeDirectives": Array [],
        "mergeTargetedBy": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 44,
          "line": 5,
          "tokenText": "PropertyName",
        },
        "minValue": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "namespace": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "parentEntity": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Domain Entity",
        },
        "parentEntityName": Object {
          "column": 16,
          "line": 2,
          "tokenText": "EntityName",
        },
        "referencedEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "referencedEntityDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "referencedNamespaceName": Object {
          "column": 19,
          "line": 5,
          "tokenText": "SharedPropertyType",
        },
        "referencedType": Object {
          "column": 19,
          "line": 5,
          "tokenText": "SharedPropertyType",
        },
        "roleName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "shortenTo": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "type": Object {
          "column": 4,
          "line": 5,
          "tokenText": "shared integer",
        },
      }
    `);
  });
});

describe('when building domain entity with shared integer reference without name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedIntegerProperty(sharedPropertyType, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared integer property named after type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(sharedPropertyType);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedInteger');
  });

  it('should have correct referenced type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });

  it('should have correct sourcemap', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "baseKeyName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 6,
          "line": 6,
          "tokenText": "documentation",
        },
        "documentationInherited": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "fullPropertyName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "hasRestriction": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isCollection": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isIdentityRename": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isOptional": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isOptionalCollection": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isPartOfIdentity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isQueryableOnly": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isRequired": Object {
          "column": 6,
          "line": 8,
          "tokenText": "is required",
        },
        "isRequiredCollection": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "maxValue": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "mergeDirectives": Array [],
        "mergeTargetedBy": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 19,
          "line": 5,
          "tokenText": "SharedPropertyType",
        },
        "minValue": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "namespace": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "parentEntity": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Domain Entity",
        },
        "parentEntityName": Object {
          "column": 16,
          "line": 2,
          "tokenText": "EntityName",
        },
        "referencedEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "referencedEntityDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "referencedNamespaceName": Object {
          "column": 19,
          "line": 5,
          "tokenText": "SharedPropertyType",
        },
        "referencedType": Object {
          "column": 19,
          "line": 5,
          "tokenText": "SharedPropertyType",
        },
        "roleName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "shortenTo": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "type": Object {
          "column": 4,
          "line": 5,
          "tokenText": "shared integer",
        },
      }
    `);
  });
});

describe('when building domain entity with shared short reference', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(sharedPropertyType, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared short property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedShort');
  });

  it('should have correct referenced type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared short reference without name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedShortProperty(sharedPropertyType, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared short property named after type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(sharedPropertyType);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedShort');
  });

  it('should have correct referenced type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared string reference', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedStringProperty(sharedPropertyType, propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared string property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedString');
  });

  it('should have correct referenced type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared string reference without name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedStringProperty(sharedPropertyType, null, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared string property named after type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(sharedPropertyType);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedString');
  });

  it('should have correct referenced type', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].referencedType).toBe(sharedPropertyType);
  });
});

describe('when building domain entity with shared string reference inheriting documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const sharedPropertyType = 'SharedPropertyType';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withSharedStringProperty(sharedPropertyType, propertyName, 'inherited', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have shared string property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('sharedString');
  });

  it('should have inherited flag set instead of documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].documentationInherited).toBe(true);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].documentation).toBe('');
  });
});

describe('when building domain entity with domain entity reference inheriting documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, 'inherited', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have domain entity property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(1);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('domainEntity');
  });

  it('should have inherited flag set instead of documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].documentationInherited).toBe(true);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].documentation).toBe('');
  });
});

describe('when building domain entity with cascading updates', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withCascadeUpdate()
      .withDomainEntityProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have updates set', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).allowPrimaryKeyUpdates).toBe(true);
  });
});

describe('when building abstract entity in extension namespace', (): void => {
  const validationFailures: ValidationFailure[] = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  const documentation = 'Doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAbstractEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one abstract entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getDomainEntity(namespace.entity, entityName)).toBeDefined();
    expect(getDomainEntity(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have correct namespace', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have correct project extension', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should be abstract', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).isAbstract).toBe(true);
  });

  it('should not have updates set', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).allowPrimaryKeyUpdates).toBe(false);
  });

  it('should have correct documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[1].type).toBe('string');
  });

  it('should not have queryable fields', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).queryableFields).toHaveLength(0);
  });
});

describe('when building domain entity with no project extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = '';

  const entityName = 'EntityName';
  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have extraneous input and mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'Domain Entity' expecting {'core', ID}, column: 2, line: 2, token: Domain Entity",
        "mismatched input 'documentation' expecting {'Abstract Entity', 'Association', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 4, line: 3, token: documentation",
        "extraneous input 'Domain Entity' expecting {'core', ID}, column: 2, line: 2, token: Domain Entity",
        "mismatched input 'documentation' expecting {'Abstract Entity', 'Association', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building domain entity with lowercase project extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'projectExtension';

  const entityName = 'EntityName';
  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'p' expecting {'core', ID}, column: 26, line: 1, token: p",
              "mismatched input 'p' expecting {'core', ID}, column: 26, line: 1, token: p",
            ]
        `);
  });
});

describe('when building domain entity with no namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = '';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have missing namespace id error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'Domain Entity' expecting {'core', ID}, column: 2, line: 2, token: Domain Entity",
        "mismatched input 'documentation' expecting {'Abstract Entity', 'Association', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 4, line: 3, token: documentation",
        "extraneous input 'Domain Entity' expecting {'core', ID}, column: 2, line: 2, token: Domain Entity",
        "mismatched input 'documentation' expecting {'Abstract Entity', 'Association', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building domain entity with no end namespace', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have extraneous input eof error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "missing 'End Namespace' at '<EOF>', column: 19, line: 14, token: <EOF>",
              "missing 'End Namespace' at '<EOF>', column: 19, line: 14, token: <EOF>",
            ]
        `);
  });
});

describe('when building domain entity with no top level entity', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'documentation' expecting {'Abstract Entity', 'Association', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 2, line: 2, token: documentation",
              "mismatched input 'documentation' expecting {'Abstract Entity', 'Association', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 2, line: 2, token: documentation",
            ]
        `);
  });
});

describe('when building domain entity with no domain entity name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'Domain Entitydocumentation', column: 4, line: 3, token: documentation",
        "no viable alternative at input 'Domain Entitydocumentation', column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building domain entity with lowercase domain entity name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build domain entity', (): void => {
    expect(namespace.entity.domainEntity.size).toBe(0);
  });

  it('should have no viable alternative error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "no viable alternative at input 'Domain Entitye', column: 16, line: 2, token: e",
              "no viable alternative at input 'Domain Entitye', column: 16, line: 2, token: e",
            ]
        `);
  });
});

describe('when building domain entity with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "no viable alternative at input 'Domain EntityEntityNameinteger', column: 4, line: 3, token: integer",
        "no viable alternative at input 'Domain EntityEntityNameinteger', column: 4, line: 3, token: integer",
      ]
    `);
  });
});

describe('when building domain entity with no properties', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should not have project extension', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).documentation).toBe(documentation);
  });
  it('should not have any properties', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "mismatched input 'End Namespace' expecting {'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'allow primary key updates'}, column: 0, line: 5, token: End Namespace",
              "mismatched input 'End Namespace' expecting {'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year', 'allow primary key updates'}, column: 0, line: 5, token: End Namespace",
            ]
        `);
  });
});

describe('when building domain entity with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  const stringPropertyName = 'StringPropertyName';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'doc', true, false)
      .withStringProperty(stringPropertyName, 'doc', true, false, '10', '2')
      .withTrailingText(trailingText)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have namespace', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should not have project extension', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have two properties', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties).toHaveLength(2);
  });

  it('should have integer property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[0].metaEdName).toBe(propertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[0].type).toBe('integer');
  });

  it('should have string property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).properties[1].metaEdName).toBe(stringPropertyName);
    expect(getDomainEntity(namespace.entity, entityName).properties[1].type).toBe('string');
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
            Array [
              "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year'}, column: 0, line: 15, token: TrailingText",
              "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain', 'association', 'bool', 'choice', 'common', 'common extension', 'currency', 'date', 'datetime', 'decimal', 'descriptor', 'domain entity', 'duration', 'enumeration', 'inline common', 'integer', 'percent', 'shared decimal', 'shared integer', 'shared short', 'shared string', 'short', 'string', 'time', 'year'}, column: 0, line: 15, token: TrailingText",
            ]
        `);
  });
});

describe('when building domain entity source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Doc';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartDomainEntity(entityName)
      .withDocumentation(documentation)
      .withCascadeUpdate()
      .withIntegerProperty(propertyName, 'Doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have type property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  it('should have documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have allowPrimaryKeyUpdates', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.allowPrimaryKeyUpdates).toBeDefined();
  });

  it('should have isAbstract', (): void => {
    expect((getDomainEntity(namespace.entity, entityName).sourceMap as DomainEntitySourceMap).isAbstract).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "allowPrimaryKeyUpdates": Object {
          "column": 4,
          "line": 5,
          "tokenText": "allow primary key updates",
        },
        "baseEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityNamespaceName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 4,
          "line": 3,
          "tokenText": "documentation",
        },
        "identityProperties": Array [],
        "isAbstract": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 16,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Domain Entity",
        },
      }
    `);
  });
});

describe('when building abstract entity source map', (): void => {
  const validationFailures: ValidationFailure[] = [];
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  const documentation = 'Doc';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartAbstractEntity(entityName)
      .withDocumentation(documentation)
      .withIntegerProperty(propertyName, 'Doc', true, false)
      .withEndAbstractEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have type property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.metaEdName.tokenText).toBe(entityName);
  });

  it('should have documentation', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have allowPrimaryKeyUpdates', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap.allowPrimaryKeyUpdates).toBeDefined();
  });

  it('should have isAbstract', (): void => {
    expect((getDomainEntity(namespace.entity, entityName).sourceMap as DomainEntitySourceMap).isAbstract).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getDomainEntity(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
      Object {
        "allowPrimaryKeyUpdates": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntity": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "baseEntityNamespaceName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 4,
          "line": 3,
          "tokenText": "documentation",
        },
        "identityProperties": Array [],
        "isAbstract": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Abstract Entity",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 18,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Abstract Entity",
        },
      }
    `);
  });
});

describe('when building domain entity with a potentially logical association property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withAssociationProperty(propertyName, 'doc', true, false, false, null, null, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be potentially logical', (): void => {
    expect((getDomainEntity(namespace.entity, entityName).properties[0] as AssociationProperty).potentiallyLogical).toBe(
      true,
    );
  });
});

describe('when building domain entity with a potentially logical domain entity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, 'doc', true, false, false, null, null, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be potentially logical', (): void => {
    expect((getDomainEntity(namespace.entity, entityName).properties[0] as DomainEntityProperty).potentiallyLogical).toBe(
      true,
    );
  });
});

describe('when building domain entity without a potentially logical association property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withAssociationProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not be potentially logical', (): void => {
    expect((getDomainEntity(namespace.entity, entityName).properties[0] as AssociationProperty).potentiallyLogical).toBe(
      false,
    );
  });
});

describe('when building domain entity without a potentially logical domain entity property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new DomainEntityBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withDomainEntityProperty(propertyName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not be potentially logical', (): void => {
    expect((getDomainEntity(namespace.entity, entityName).properties[0] as DomainEntityProperty).potentiallyLogical).toBe(
      false,
    );
  });
});
