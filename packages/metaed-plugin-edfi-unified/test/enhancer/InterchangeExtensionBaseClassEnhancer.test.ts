// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newInterchange, newInterchangeExtension, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Interchange, InterchangeExtension, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/InterchangeExtensionBaseClassEnhancer';

describe('when enhancing interchange extension referring to interchange', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const parentEntityName = 'ParentEntityName';
  let parentEntity: Interchange;
  let childEntity: InterchangeExtension;

  beforeAll(() => {
    parentEntity = Object.assign(newInterchange(), {
      metaEdName: parentEntityName,
      namespace,
    });
    namespace.entity.interchange.set(parentEntity.metaEdName, parentEntity);

    childEntity = Object.assign(newInterchangeExtension(), {
      metaEdName: parentEntityName,
      baseEntityName: parentEntityName,
      baseEntityNamespaceName: parentEntity.namespace.namespaceName,
      namespace: extensionNamespace,
    });
    extensionNamespace.entity.interchangeExtension.set(childEntity.metaEdName, childEntity);

    enhance(metaEd);
  });

  it('should have no validation failures()', (): void => {
    expect(childEntity.baseEntity).toBe(parentEntity);
  });
});
