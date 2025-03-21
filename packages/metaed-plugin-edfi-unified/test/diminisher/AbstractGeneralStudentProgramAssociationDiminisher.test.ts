// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newNamespace, newAssociation } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace, Association } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/AbstractGeneralStudentProgramAssociationDiminisher';

describe('when diminishing with no matching entity', (): void => {
  const entityName = 'EntityName';
  const namespaceName = 'EdFi';

  let association: Association;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName };
    const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.2.0-c' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    association = { ...newAssociation(), namespace, metaEdName: entityName };
    namespace.entity.association.set(association.metaEdName, association);

    enhance(metaEd);
  });

  it('should not change associations in namespace', (): void => {
    expect(association.isAbstract).toBe(false);
  });
});

describe('when diminishing with matching entity', (): void => {
  const entityName = 'EntityName';
  const generalStudentProgramAssociationName = 'GeneralStudentProgramAssociation';
  const studentProgramAssociationName = 'StudentProgramAssociation';
  const namespaceName = 'EdFi';

  let association1: Association;
  let association2: Association;
  let association3: Association;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName };
    const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.2.0-c' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    association1 = { ...newAssociation(), namespace, metaEdName: generalStudentProgramAssociationName };
    namespace.entity.association.set(association1.metaEdName, association1);

    association2 = { ...newAssociation(), namespace, metaEdName: studentProgramAssociationName };
    namespace.entity.association.set(association2.metaEdName, association2);

    association3 = Object.assign(newAssociation(), { namespace, metaEdName: entityName });
    namespace.entity.association.set(association3.metaEdName, association3);

    enhance(metaEd);
  });

  it('should only set GeneralStudentProgramAssociation isAbstract', (): void => {
    expect(association1.isAbstract).toBe(true);
    expect(association2.isAbstract).toBe(false);
    expect(association3.isAbstract).toBe(false);
  });
});
