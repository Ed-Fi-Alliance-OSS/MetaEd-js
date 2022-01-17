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
