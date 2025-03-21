// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ModelBase, TopLevelEntity } from '@edfi/metaed-core';

export function metaEdNameWithExtension(extensionEntity: ModelBase): () => string {
  return () => {
    const { projectExtension }: { projectExtension: string } = extensionEntity.namespace;
    return projectExtension ? `${projectExtension}-${extensionEntity.metaEdName}` : extensionEntity.metaEdName;
  };
}

export function metaEdNameWithExtensionIncludingSuffix(extensionEntity: TopLevelEntity): () => string {
  return () => {
    const baseName = extensionEntity.metaEdName + extensionEntity.namespace.extensionEntitySuffix;
    const { projectExtension }: { projectExtension: string } = extensionEntity.namespace;
    return projectExtension ? `${projectExtension}-${baseName}` : baseName;
  };
}
