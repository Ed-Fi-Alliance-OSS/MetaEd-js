// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  addEntityForNamespace,
  newMetaEdEnvironment,
  newAssociation,
  newInlineCommon,
  newInlineCommonProperty,
  newStringProperty,
  newNamespace,
  EntityProperty,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, Common, Association, Namespace } from '@edfi/metaed-core';
import { enhance as initializeTopLevelEntities } from '../../src/model/TopLevelEntity';
import { enhance } from '../../src/enhancer/AddInlineIdentityEnhancer';

describe('when enhancing association with inline string property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const inlineName = 'InlineName';
  const entityName = 'EntityName';
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';
  let association: Association;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    const properties = [
      { ...newStringProperty(), metaEdName: propertyName1, isPartOfIdentity: false },
      { ...newStringProperty(), metaEdName: propertyName2, isPartOfIdentity: true },
    ];

    const inlineCommon: Common = {
      ...newInlineCommon(),
      namespace,
      metaEdName: inlineName,
      inlineInOds: true,
      properties,
      data: {
        edfiXsd: {},
      },
    };
    addEntityForNamespace(inlineCommon);

    association = {
      ...newAssociation(),
      namespace,
      metaEdName: entityName,
      properties: [
        {
          ...newInlineCommonProperty(),
          metaEdName: inlineName,
          referencedNamespaceName: namespace.namespaceName,
          referencedEntity: inlineCommon,
        } as EntityProperty,
      ],
      data: {
        edfiXsd: {},
      },
    };
    addEntityForNamespace(association);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should add identity properties to association', (): void => {
    expect(association.properties[0].type).toBe('inlineCommon');
    expect(association.data.edfiXsd.xsdIdentityProperties.length).toBe(1);
    expect(association.data.edfiXsd.xsdIdentityProperties[0].metaEdName).toBe(propertyName2);
  });
});

describe('when enhancing association with inline nested string property', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const inline1Name = 'Inline1Name';
  const inline2Name = 'Inline2Name';
  const entityName = 'EntityName';
  const propertyName = 'PropertyName';
  let association: Association;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    const inlineCommon2: Common = {
      ...newInlineCommon(),
      namespace,
      metaEdName: inline2Name,
      inlineInOds: true,
      properties: [{ ...newStringProperty(), metaEdName: propertyName, isPartOfIdentity: true }],
      data: {
        edfiXsd: {},
      },
    };
    addEntityForNamespace(inlineCommon2);

    const inlineCommon1: Common = {
      ...newInlineCommon(),
      namespace,
      metaEdName: inline1Name,
      inlineInOds: true,
      properties: [
        {
          ...newInlineCommonProperty(),
          metaEdName: inline2Name,
          referencedNamespaceName: namespace.namespaceName,
          referencedEntity: inlineCommon2,
        } as EntityProperty,
      ],
      data: {
        edfiXsd: {},
      },
    };
    addEntityForNamespace(inlineCommon1);

    association = {
      ...newAssociation(),
      namespace,
      metaEdName: entityName,
      properties: [
        {
          ...newInlineCommonProperty(),
          metaEdName: inline1Name,
          referencedNamespaceName: namespace.namespaceName,
          referencedEntity: inlineCommon1,
        } as EntityProperty,
      ],
      data: {
        edfiXsd: {},
      },
    };
    addEntityForNamespace(association);

    initializeTopLevelEntities(metaEd);
    enhance(metaEd);
  });

  it('should add identity properties to association', (): void => {
    expect(association.properties[0].type).toBe('inlineCommon');
    expect(association.data.edfiXsd.xsdIdentityProperties.length).toBe(1);
    expect(association.data.edfiXsd.xsdIdentityProperties[0].metaEdName).toBe(propertyName);
  });
});
