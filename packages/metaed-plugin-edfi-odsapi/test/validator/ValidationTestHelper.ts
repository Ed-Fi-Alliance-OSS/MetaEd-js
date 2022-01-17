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
