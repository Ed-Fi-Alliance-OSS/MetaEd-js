// @flow
import { EnumerationBuilder } from '../../src/builder/EnumerationBuilder';
import { NamespaceInfoBuilder } from '../../src/builder/NamespaceInfoBuilder';
import { MetaEdTextBuilder } from '../../src/grammar/MetaEdTextBuilder';
import { newMetaEdEnvironment } from '../../src/MetaEdEnvironment';
import { getEnumeration, getSchoolYearEnumeration } from '../TestHelper';
import type { EnumerationSourceMap } from '../../src/model/Enumeration';
import type { MetaEdEnvironment } from '../../src/MetaEdEnvironment';
import type { ValidationFailure } from '../../src/validator/ValidationFailure';

describe('when building single enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Documentation';
  const itemShortDescription: string = 'ItemShortDescription';
  const itemDocumentation: string = 'ItemDocumentation';
  const itemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getEnumeration(metaEd.entity, entityName)).toBeDefined();
    expect(getEnumeration(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getEnumeration(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have project extension', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', () => {
    expect(getEnumeration(metaEd.entity, entityName).properties).toHaveLength(0);
  });

  it('should have one enumeration item', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].shortDescription).toBe(itemShortDescription);
  });

  it('should have enumeration item with documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].documentation).toBe(itemDocumentation);
  });

  it('should have enumeration item with metaEdId ', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].metaEdId).toBe(itemMetaEdId);
  });
});

describe('when building school year enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityType: string = 'schoolYearEnumeration';
  const entityName: string = 'SchoolYear';
  const documentation: string = 'Documentation';
  const itemShortDescription: string = 'ItemShortDescription';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one school year enumeration', () => {
    expect(metaEd.entity.schoolYearEnumeration.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getSchoolYearEnumeration(metaEd.entity, entityName)).toBeDefined();
    expect(getSchoolYearEnumeration(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have type', () => {
    expect(getSchoolYearEnumeration(metaEd.entity, entityName).type).toBe(entityType);
  });

  it('should have source map for type', () => {
    expect(getSchoolYearEnumeration(metaEd.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have source map for namespaceInfo', () => {
    expect(getSchoolYearEnumeration(metaEd.entity, entityName).sourceMap.namespaceInfo).toBeDefined();
  });

  it('should have source map with line, column, text', () => {
    expect(getSchoolYearEnumeration(metaEd.entity, entityName).sourceMap).toMatchSnapshot();
  });
});

describe('when building duplicate enumerations', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Documentation';
  const itemShortDescription: string = 'ItemShortDescription';
  const itemDocumentation: string = 'ItemDocumentation';
  const itemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()

      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getEnumeration(metaEd.entity, entityName)).toBeDefined();
    expect(getEnumeration(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have two validation failures', () => {
    expect(validationFailures).toHaveLength(2);
  });

  it('should have validation failures for each entity', () => {
    expect(validationFailures[0].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[0].category).toBe('error');
    expect(validationFailures[0].message).toMatchSnapshot(
      'when building duplicate enumerations should have validation failures for each entity -> Enumeration 1 message',
    );
    expect(validationFailures[0].sourceMap).toMatchSnapshot(
      'when building duplicate enumerations should have validation failures for each entity -> Enumeration 1 sourceMap',
    );

    expect(validationFailures[1].validatorName).toBe('TopLevelEntityBuilder');
    expect(validationFailures[1].category).toBe('error');
    expect(validationFailures[1].message).toMatchSnapshot(
      'when building duplicate enumerations should have validation failures for each entity -> Enumeration 2 message',
    );
    expect(validationFailures[1].sourceMap).toMatchSnapshot(
      'when building duplicate enumerations should have validation failures for each entity -> Enumeration 2 sourceMap',
    );
  });
});

describe('when building enumeration without item documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const documentation: string = 'Documentation';
  const itemShortDescription: string = 'ItemShortDescription';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have enumeration item with short description', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].shortDescription).toBe(itemShortDescription);
  });

  it('should have enumeration item with no documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].documentation).toBe('');
  });
});

describe('when building multiple enumerations', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName1: string = 'EntityName1';
  const metaEdId1: string = '1';
  const entityName2: string = 'EntityName2';
  const metaEdId2: string = '2';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName1, metaEdId1)
      .withDocumentation('doc')
      .withEnumerationItem('sd1')
      .withEndEnumeration()

      .withStartEnumeration(entityName2, metaEdId2)
      .withDocumentation('doc')
      .withEnumerationItem('sd2')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build two enumerations', () => {
    expect(metaEd.entity.enumeration.size).toBe(2);
  });

  it('should both be found in entityRepository', () => {
    expect(getEnumeration(metaEd.entity, entityName1)).toBeDefined();
    expect(getEnumeration(metaEd.entity, entityName1).metaEdName).toBe(entityName1);

    expect(getEnumeration(metaEd.entity, entityName2)).toBeDefined();
    expect(getEnumeration(metaEd.entity, entityName2).metaEdName).toBe(entityName2);
  });

  it('should both have metaEdIds', () => {
    expect(getEnumeration(metaEd.entity, entityName1).metaEdId).toBe(metaEdId1);
    expect(getEnumeration(metaEd.entity, entityName2).metaEdId).toBe(metaEdId2);
  });
});

describe('when building enumeration with no enumeration name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = '';
  const documentation: string = 'Documentation';
  const itemShortDescription: string = 'ItemShortDescription';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should not build enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(0);
  });

  it('should have missing id error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building enumeration with lowercase enumeration name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'entityName';
  const expectedName: string = 'Name';
  const entityMetaEdId: string = '1';
  const documentation: string = 'Documentation';
  const itemShortDescription: string = 'ItemShortDescription';
  const itemDocumentation: string = 'ItemDocumentation';
  const itemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName, entityMetaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getEnumeration(metaEd.entity, expectedName)).toBeDefined();
    expect(getEnumeration(metaEd.entity, expectedName).metaEdName).toBe(expectedName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getEnumeration(metaEd.entity, expectedName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getEnumeration(metaEd.entity, expectedName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(getEnumeration(metaEd.entity, expectedName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getEnumeration(metaEd.entity, expectedName).documentation).toBe(documentation);
  });

  it('should have no properties', () => {
    expect(getEnumeration(metaEd.entity, expectedName).properties).toHaveLength(0);
  });

  it('should have one enumeration item', () => {
    expect(getEnumeration(metaEd.entity, expectedName).enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', () => {
    expect(getEnumeration(metaEd.entity, expectedName).enumerationItems[0].shortDescription).toBe(itemShortDescription);
  });

  it('should have enumeration item with documentation', () => {
    expect(getEnumeration(metaEd.entity, expectedName).enumerationItems[0].documentation).toBe(itemDocumentation);
  });

  it('should have enumeration item with metaEdId ', () => {
    expect(getEnumeration(metaEd.entity, expectedName).enumerationItems[0].metaEdId).toBe(itemMetaEdId);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building enumeration with no documentation', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const itemShortDescription: string = 'ItemShortDescription';
  const itemDocumentation: string = 'ItemDocumentation';
  const itemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName, entityMetaEdId)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getEnumeration(metaEd.entity, entityName)).toBeDefined();
    expect(getEnumeration(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getEnumeration(metaEd.entity, entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have no documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).documentation).toBe('');
  });

  it('should have no properties', () => {
    expect(getEnumeration(metaEd.entity, entityName).properties).toHaveLength(0);
  });

  it('should have one enumeration item', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].shortDescription).toBe(itemShortDescription);
  });

  it('should have enumeration item with documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].documentation).toBe(itemDocumentation);
  });

  it('should have enumeration item with metaEdId ', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].metaEdId).toBe(itemMetaEdId);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building enumeration with no enumeration item', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const entityMetaEdId: string = '1';
  const documentation: string = 'Documentation';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName, entityMetaEdId)
      .withDocumentation(documentation)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getEnumeration(metaEd.entity, entityName)).toBeDefined();
    expect(getEnumeration(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getEnumeration(metaEd.entity, entityName).metaEdId).toBe(entityMetaEdId);
  });

  it('should have project extension', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', () => {
    expect(getEnumeration(metaEd.entity, entityName).properties).toHaveLength(0);
  });

  it('should have no enumeration item', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems).toHaveLength(0);
  });

  it('should have mismatched input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building enumeration with empty enumeration item description', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Documentation';
  const itemDocumentation: string = 'ItemDocumentation';
  const itemMetaEdId: string = '2';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withTrailingText(`\r\nitem  [${itemMetaEdId}]`)
      .withTrailingText(`documentation "${itemDocumentation}"`)
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getEnumeration(metaEd.entity, entityName)).toBeDefined();
    expect(getEnumeration(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getEnumeration(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have project extension', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', () => {
    expect(getEnumeration(metaEd.entity, entityName).properties).toHaveLength(0);
  });

  it('should have one enumeration item', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with no short description', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].shortDescription).toBe('');
  });

  it('should have enumeration item with documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].documentation).toBe(itemDocumentation);
  });

  it('should have enumeration item with metaEdId ', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].metaEdId).toBe(itemMetaEdId);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });

  it('should have missing text error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building enumeration with invalid trailing text', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const textBuilder: MetaEdTextBuilder = MetaEdTextBuilder.build();
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Documentation';
  const itemShortDescription: string = 'ItemShortDescription';
  const itemDocumentation: string = 'ItemDocumentation';
  const itemMetaEdId: string = '2';
  const trailingText: string = '\r\nTrailingText';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    textBuilder
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withTrailingText(trailingText)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should build one enumeration', () => {
    expect(metaEd.entity.enumeration.size).toBe(1);
  });

  it('should be found in entity repository', () => {
    expect(getEnumeration(metaEd.entity, entityName)).toBeDefined();
    expect(getEnumeration(metaEd.entity, entityName).metaEdName).toBe(entityName);
  });

  it('should have no validation failures', () => {
    expect(validationFailures).toHaveLength(0);
  });

  it('should have namespace', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.namespace).toBe(namespace);
  });

  it('should have metaEdId', () => {
    expect(getEnumeration(metaEd.entity, entityName).metaEdId).toBe(metaEdId);
  });

  it('should have project extension', () => {
    expect(getEnumeration(metaEd.entity, entityName).namespaceInfo.projectExtension).toBe(projectExtension);
  });

  it('should have documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).documentation).toBe(documentation);
  });

  it('should have no properties', () => {
    expect(getEnumeration(metaEd.entity, entityName).properties).toHaveLength(0);
  });

  it('should have one enumeration item', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems).toHaveLength(1);
  });

  it('should have enumeration item with short description', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].shortDescription).toBe(itemShortDescription);
  });

  it('should have enumeration item with documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].documentation).toBe(itemDocumentation);
  });

  it('should have enumeration item with metaEdId ', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].metaEdId).toBe(itemMetaEdId);
  });

  it('should have extraneous input error', () => {
    expect(textBuilder.errorMessages).toMatchSnapshot();
  });
});

describe('when building enumeration source map', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const validationFailures: Array<ValidationFailure> = [];
  const namespace: string = 'namespace';
  const projectExtension: string = 'ProjectExtension';

  const entityName: string = 'EntityName';
  const metaEdId: string = '1';
  const documentation: string = 'Documentation';
  const itemShortDescription: string = 'ItemShortDescription';
  const itemDocumentation: string = 'ItemDocumentation';
  const itemMetaEdId: string = '2';
  const itemShortDescription2: string = 'ItemShortDescription2';
  const itemDocumentation2: string = 'ItemDocumentation2';
  const itemMetaEdId2: string = '3';

  beforeAll(() => {
    const builder = new EnumerationBuilder(metaEd, validationFailures);

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace, projectExtension)
      .withStartEnumeration(entityName, metaEdId)
      .withDocumentation(documentation)
      .withEnumerationItem(itemShortDescription, itemDocumentation, itemMetaEdId)
      .withEnumerationItem(itemShortDescription2, itemDocumentation2, itemMetaEdId2)
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceInfoBuilder(metaEd, validationFailures))
      .sendToListener(builder);
  });

  it('should have type', () => {
    expect(getEnumeration(metaEd.entity, entityName).sourceMap.type).toBeDefined();
  });

  it('should have documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).sourceMap.documentation).toBeDefined();
  });

  it('should have metaEdName', () => {
    expect(getEnumeration(metaEd.entity, entityName).sourceMap.metaEdName).toBeDefined();
  });

  it('should have metaEdId', () => {
    expect(getEnumeration(metaEd.entity, entityName).sourceMap.metaEdId).toBeDefined();
  });

  it('should have namespaceInfo', () => {
    expect(getEnumeration(metaEd.entity, entityName).sourceMap.namespaceInfo).toBeDefined();
  });

  it('should have for enumerationItems', () => {
    expect(((getEnumeration(metaEd.entity, entityName).sourceMap: any): EnumerationSourceMap).enumerationItems).toHaveLength(
      2,
    );
  });

  it('should have first enumeration item type', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].sourceMap.type).toBeDefined();
  });

  it('should have first enumeration item shortDescription', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].sourceMap.shortDescription).toBeDefined();
  });

  it('should have first enumeration item metaEdId', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].sourceMap.metaEdId).toBeDefined();
  });

  it('should have first enumeration item documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].sourceMap.documentation).toBeDefined();
  });

  it('should have second enumeration item type', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[1].sourceMap.type).toBeDefined();
  });

  it('should have second enumeration item shortDescription', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[1].sourceMap.shortDescription).toBeDefined();
  });

  it('should have second enumeration item metaEdId', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[1].sourceMap.metaEdId).toBeDefined();
  });

  it('should have second enumeration item documentation', () => {
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[1].sourceMap.documentation).toBeDefined();
  });

  it('should have line, column, text for each property', () => {
    expect(getEnumeration(metaEd.entity, entityName).sourceMap).toMatchSnapshot();
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[0].sourceMap).toMatchSnapshot();
    expect(getEnumeration(metaEd.entity, entityName).enumerationItems[1].sourceMap).toMatchSnapshot();
  });
});
