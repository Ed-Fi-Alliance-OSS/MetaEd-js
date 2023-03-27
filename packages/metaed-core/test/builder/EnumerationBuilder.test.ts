import { EnumerationBuilder } from '../../src/builder/EnumerationBuilder';
import { NamespaceBuilder } from '../../src/builder/NamespaceBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getEnumeration, getSchoolYearEnumeration } from '../TestHelper';
import { EnumerationSourceMap } from '../../src/model/Enumeration';
import { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building single enumeration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '1';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  const itemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getEnumeration(namespace.entity, entityName)).toBeDefined();
    expect(getEnumeration(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getEnumeration(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have project extension', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should not be deprecated', (): void => {
    expect(getEnumeration(namespace.entity, entityName).isDeprecated).toBe(false);
  });

  it('should have no properties', (): void => {
    expect(getEnumeration(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have one enumeration item', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].shortDescription).toBe(itemShortDescription);
  });

  it('should have enumeration item with documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].documentation).toBe(itemDocumentation);
  });

  it('should have enumeration item with metaEdId ', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].metaEdId).toBe(itemMetaEdId);
  });
});

describe('when building deprecated enumeration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';
  const deprecationReason = 'reason';
  const entityName = 'EntityName';

  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName)
      .withDeprecated(deprecationReason)
      .withDocumentation('doc')
      .withEnumerationItem('SD', 'doc')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(1);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should be deprecated', (): void => {
    expect(getEnumeration(namespace.entity, entityName).isDeprecated).toBe(true);
    expect(getEnumeration(namespace.entity, entityName).deprecationReason).toBe(deprecationReason);
  });
});

describe('when building school year enumeration', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityType = 'schoolYearEnumeration';
  const entityName = 'SchoolYear';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one school year enumeration', (): void => {
    expect(namespace.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getSchoolYearEnumeration(namespace.entity, entityName)).toBeDefined();
    expect(getSchoolYearEnumeration(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have type', (): void => {
    expect(getSchoolYearEnumeration(namespace.entity, entityName).type).toBe(entityType);
  });

  it('should have source map for type', (): void => {
    expect(getSchoolYearEnumeration(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map with line, column, text', (): void => {
    expect(getSchoolYearEnumeration(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
        "enumerationItems": Array [
          Object {
            "column": 4,
            "line": 5,
            "tokenText": "item",
          },
        ],
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdId": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdName": Object {
          "column": 14,
          "line": 2,
          "tokenText": "SchoolYear",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 14,
          "line": 2,
          "tokenText": "SchoolYear",
        },
      }
    `);
  });
});

describe('when building duplicate enumerations', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '1';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  const itemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()

      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getEnumeration(namespace.entity, entityName)).toBeDefined();
    expect(getEnumeration(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', (): void => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', (): void => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchInlineSnapshot(
      `"Enumeration named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[0].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 14,
        "line": 8,
        "tokenText": "EntityName",
      }
    `);

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchInlineSnapshot(
      `"Enumeration named EntityName is a duplicate declaration of that name."`,
    );
    expect(validationFailures[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "column": 14,
        "line": 2,
        "tokenText": "EntityName",
      }
    `);
  });
});

describe('when building enumeration without item documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have enumeration item with short description', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].shortDescription).toBe(itemShortDescription);
  });

  it('should have enumeration item with no documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].documentation).toBe('');
  });
});

describe('when building multiple enumerations', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName1 = 'EntityName1';
  const metaEdId1 = '1';
  const entityName2 = 'EntityName2';
  const metaEdId2 = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName1, metaEdId1)
      .withDocumentation('doc')
      .withEnumerationItem('sd1')
      .withEndEnumeration()

      .withStartEnumeration(entityName2, metaEdId2)
      .withDocumentation('doc')
      .withEnumerationItem('sd2')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build two enumerations', (): void => {
    expect(namespace.entity.enumeration.size).toBe(2);
  });

  it('should both be found in entityRepository', (): void => {
    expect(getEnumeration(namespace.entity, entityName1)).toBeDefined();
    expect(getEnumeration(namespace.entity, entityName1).metaEdName).toBe(entityName1);

    expect(getEnumeration(namespace.entity, entityName2)).toBeDefined();
    expect(getEnumeration(namespace.entity, entityName2).metaEdName).toBe(entityName2);
  });

  it('should both have metaEdIds', (): void => {
    expect(getEnumeration(namespace.entity, entityName1).metaEdId).toBe(metaEdId1);
    expect(getEnumeration(namespace.entity, entityName2).metaEdId).toBe(metaEdId2);
  });
});

describe('when building enumeration with no enumeration name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = '';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should not build enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(0);
  });

  it('should have missing id error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "missing ID at 'documentation', column: 4, line: 3, token: documentation",
        "missing ID at 'documentation', column: 4, line: 3, token: documentation",
      ]
    `);
  });
});

describe('when building enumeration with lowercase enumeration name', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'entityName';
  const entityMetaEdId = '1';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  const itemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName, entityMetaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build no enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(0);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'e' expecting ID, column: 14, line: 2, token: e",
        "mismatched input 'e' expecting ID, column: 14, line: 2, token: e",
      ]
    `);
  });
});

describe('when building enumeration with no documentation', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityMetaEdId = '1';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  const itemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName, entityMetaEdId)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getEnumeration(namespace.entity, entityName)).toBeDefined();
    expect(getEnumeration(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getEnumeration(namespace.entity, entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).documentation).toBe('');
  });

  it('should have no properties', (): void => {
    expect(getEnumeration(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have no enumeration items', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'item' expecting {'deprecated', 'documentation'}, column: 4, line: 3, token: item",
        "mismatched input 'item' expecting {'deprecated', 'documentation'}, column: 4, line: 3, token: item",
      ]
    `);
  });
});

describe('when building enumeration with no enumeration item', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const entityMetaEdId = '1';
  const documentation = 'Documentation';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName, entityMetaEdId)
      .withDocumentation(documentation)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getEnumeration(namespace.entity, entityName)).toBeDefined();
    expect(getEnumeration(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getEnumeration(namespace.entity, entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', (): void => {
    expect(getEnumeration(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have no enumeration item', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems).toHaveLength(0);
  });

  it('should have mismatched input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "mismatched input 'End Namespace' expecting 'item', column: 0, line: 5, token: End Namespace",
        "mismatched input 'End Namespace' expecting 'item', column: 0, line: 5, token: End Namespace",
      ]
    `);
  });
});

describe('when building enumeration with empty enumeration item description', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '1';
  const documentation = 'Documentation';
  const itemDocumentation = 'ItemDocumentation';
  const itemMetaEdId = '2';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withTrailingText(`\r\nitem  [${itemMetaEdId}]`)
      .withTrailingText(`documentation "${itemDocumentation}"`)
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getEnumeration(namespace.entity, entityName)).toBeDefined();
    expect(getEnumeration(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getEnumeration(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have project extension', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', (): void => {
    expect(getEnumeration(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have one enumeration item', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with no short description', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].shortDescription).toBe('');
  });

  it('should have enumeration item with documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].documentation).toBe(itemDocumentation);
  });

  it('should have enumeration item with metaEdId ', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].metaEdId).toBe(itemMetaEdId);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "missing TEXT at '[2]', column: 6, line: 5, token: [2]",
        "missing TEXT at '[2]', column: 6, line: 5, token: [2]",
      ]
    `);
  });

  it('should have missing text error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "missing TEXT at '[2]', column: 6, line: 5, token: [2]",
        "missing TEXT at '[2]', column: 6, line: 5, token: [2]",
      ]
    `);
  });
});

describe('when building enumeration with invalid trailing text', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '1';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  const itemMetaEdId = '2';
  const trailingText = '\r\nTrailingText';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withTrailingText(trailingText)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should build one enumeration', (): void => {
    expect(namespace.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', (): void => {
    expect(getEnumeration(namespace.entity, entityName)).toBeDefined();
    expect(getEnumeration(namespace.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', (): void => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.namespaceName).toBe(namespaceName);
  });

  it('should have metaEdId', (): void => {
    expect(getEnumeration(namespace.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have project extension', (): void => {
    expect(getEnumeration(namespace.entity, entityName).namespace.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', (): void => {
    expect(getEnumeration(namespace.entity, entityName).properties).toHaveLength(0);
  });

  it('should have one enumeration item', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].shortDescription).toBe(itemShortDescription);
  });

  it('should have enumeration item with documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].documentation).toBe(itemDocumentation);
  });

  it('should have enumeration item with metaEdId ', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].metaEdId).toBe(itemMetaEdId);
  });

  it('should have extraneous input error', (): void => {
    expect(textBuilder.errorMessages).toMatchInlineSnapshot(`
      Array [
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 8, token: TrailingText",
        "extraneous input 'TrailingText' expecting {'Abstract Entity', 'Association', 'End Namespace', 'Choice', 'Common', 'Descriptor', 'Domain', 'Domain Entity', 'Enumeration', 'Interchange', 'Inline Common', 'Shared Decimal', 'Shared Integer', 'Shared Short', 'Shared String', 'Subdomain'}, column: 0, line: 8, token: TrailingText",
      ]
    `);
  });
});

describe('when building enumeration source map', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: ValidationFailure[] = [];
  const namespaceName = 'Namespace';
  const projectExtension = 'ProjectExtension';

  const entityName = 'EntityName';
  const metaEdId = '1';
  const documentation = 'Documentation';
  const itemShortDescription = 'ItemShortDescription';
  const itemDocumentation = 'ItemDocumentation';
  const itemMetaEdId = '2';
  const itemShortDescription2 = 'ItemShortDescription2';
  const itemDocumentation2 = 'ItemDocumentation2';
  const itemMetaEdId2 = '3';
  let namespace: any = null;

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEnumerationItem(itemShortDescription2, itemDocumentation2, itemMetaEdId2)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, validationFailures))
      .sendToListener(builder);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should have type', (): void => {
    expect(getEnumeration(namespace.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', (): void => {
    expect(getEnumeration(namespace.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have metaEdId', (): void => {
    expect(getEnumeration(namespace.entity, entityName).sourceMap.metaEdId).toBeDefined();
  });

  it('should have for enumerationItems', (): void => {
    expect((getEnumeration(namespace.entity, entityName).sourceMap as EnumerationSourceMap).enumerationItems).toHaveLength(
      2,
    );
  });

  it('should have first enumeration item type', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].sourceMap.type).toBeDefined();
  });

  it('should have first enumeration item shortDescription', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].sourceMap.shortDescription).toBeDefined();
  });

  it('should have first enumeration item metaEdId', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].sourceMap.metaEdId).toBeDefined();
  });

  it('should have first enumeration item documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].sourceMap.documentation).toBeDefined();
  });

  it('should have second enumeration item type', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[1].sourceMap.type).toBeDefined();
  });

  it('should have second enumeration item shortDescription', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[1].sourceMap.shortDescription).toBeDefined();
  });

  it('should have second enumeration item metaEdId', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[1].sourceMap.metaEdId).toBeDefined();
  });

  it('should have second enumeration item documentation', (): void => {
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[1].sourceMap.documentation).toBeDefined();
  });

  it('should have line, column, text for each property', (): void => {
    expect(getEnumeration(namespace.entity, entityName).sourceMap).toMatchInlineSnapshot(`
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
        "enumerationItems": Array [
          Object {
            "column": 4,
            "line": 5,
            "tokenText": "item",
          },
          Object {
            "column": 4,
            "line": 8,
            "tokenText": "item",
          },
        ],
        "identityProperties": Array [],
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdId": Object {
          "column": 25,
          "line": 2,
          "tokenText": "[1]",
        },
        "metaEdName": Object {
          "column": 14,
          "line": 2,
          "tokenText": "EntityName",
        },
        "properties": Array [],
        "queryableFields": Array [],
        "type": Object {
          "column": 2,
          "line": 2,
          "tokenText": "Enumeration",
        },
      }
    `);
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[0].sourceMap).toMatchInlineSnapshot(`
      Object {
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
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdId": Object {
          "column": 32,
          "line": 5,
          "tokenText": "[2]",
        },
        "metaEdName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "shortDescription": Object {
          "column": 9,
          "line": 5,
          "tokenText": "\\"ItemShortDescription\\"",
        },
        "type": Object {
          "column": 4,
          "line": 5,
          "tokenText": "item",
        },
        "typeHumanizedName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
      }
    `);
    expect(getEnumeration(namespace.entity, entityName).enumerationItems[1].sourceMap).toMatchInlineSnapshot(`
      Object {
        "deprecationReason": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "documentation": Object {
          "column": 6,
          "line": 9,
          "tokenText": "documentation",
        },
        "isDeprecated": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "metaEdId": Object {
          "column": 33,
          "line": 8,
          "tokenText": "[3]",
        },
        "metaEdName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
        "shortDescription": Object {
          "column": 9,
          "line": 8,
          "tokenText": "\\"ItemShortDescription2\\"",
        },
        "type": Object {
          "column": 4,
          "line": 8,
          "tokenText": "item",
        },
        "typeHumanizedName": Object {
          "column": 0,
          "line": 0,
          "tokenText": "NoSourceMap",
        },
      }
    `);
  });
});
