// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';

export function initializeNamespaceDependencies(
  metaEd: MetaEdEnvironment,
  namespaceName: string,
  extensionNamespaceName: string,
) {
  const coreNamespace: Namespace | undefined = metaEd.namespace.get(namespaceName);
  if (coreNamespace == null) throw new Error();
  const extensionNamespace: Namespace | undefined = metaEd.namespace.get(extensionNamespaceName);
  if (extensionNamespace == null) throw new Error();
  extensionNamespace.dependencies.push(coreNamespace);
}
