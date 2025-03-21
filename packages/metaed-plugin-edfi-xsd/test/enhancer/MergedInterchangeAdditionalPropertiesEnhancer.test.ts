// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newInterchangeItem, newInterchange, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, InterchangeItem, Interchange, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/MergedInterchangeAdditionalPropertiesEnhancer';
import { edfiXsdRepositoryForNamespace } from '../../src/enhancer/EnhancerHelper';
import { newMergedInterchange } from '../../src/model/MergedInterchange';
import { enhance as addModelBaseEdfiXsd } from '../../src/model/ModelBase';
import { addEdFiXsdEntityRepositoryTo } from '../../src/model/EdFiXsdEntityRepository';
import { EdFiXsdEntityRepository } from '../../src/model/EdFiXsdEntityRepository';

describe('when MergedInterchangeSchemaLocationEnhancer enhances MergedInterchange with no extension', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  const interchangeName = 'InterchangeName';
  const elementBaseName = 'InterchangeElement';
  let mergedInterchange;

  beforeAll(() => {
    const element: InterchangeItem = { ...newInterchangeItem(), metaEdName: elementBaseName };

    const interchange: Interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      elements: [element],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    mergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      elements: [element],
    };
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) throw new Error();
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsdName assigned', (): void => {
    expect(mergedInterchange.interchangeName).toBe(`Interchange${interchangeName}`);
  });

  it('should have xsdType value assigned', (): void => {
    expect(mergedInterchange.schemaLocation).toBe('Ed-Fi-Core.xsd');
  });
});

describe('when MergedInterchangeSchemaLocationEnhancer enhances MergedInterchange with extension', (): void => {
  const projectExtension = 'EXTENSION';
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', projectExtension, isExtension: true };
  metaEd.namespace.set(namespace.namespaceName, namespace);
  addEdFiXsdEntityRepositoryTo(metaEd);
  const interchangeName = 'InterchangeName';
  const elementBaseName = 'InterchangeElement';

  let mergedInterchange;

  beforeAll(() => {
    const element: InterchangeItem = { ...newInterchangeItem(), metaEdName: elementBaseName };

    const interchange: Interchange = {
      ...newInterchange(),
      metaEdName: interchangeName,
      namespace,
      elements: [element],
      data: {
        edfiXsd: {},
      },
    };
    namespace.entity.interchange.set(interchange.metaEdName, interchange);

    mergedInterchange = {
      ...newMergedInterchange(),
      metaEdName: interchangeName,
      repositoryId: interchangeName,
      namespace,
      elements: [element],
    };
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) throw new Error();
    edFiXsdEntityRepository.mergedInterchange.set(mergedInterchange.repositoryId, mergedInterchange);

    initializeTopLevelEntities(metaEd);
    addModelBaseEdfiXsd(metaEd);
    enhance(metaEd);
  });

  it('should have xsdName assigned', (): void => {
    expect(mergedInterchange.interchangeName).toBe(`Interchange${interchangeName}`);
  });

  it('should have xsdType value assigned with extension', (): void => {
    expect(mergedInterchange.schemaLocation).toBe(`${projectExtension}-Ed-Fi-Extended-Core.xsd`);
  });
});
