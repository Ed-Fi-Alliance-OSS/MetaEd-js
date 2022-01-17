import { MetaEdEnvironment, ValidationFailure, CommonPropertySourceMap, ModelBase } from '@edfi/metaed-core';
import { getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.common.forEach((property) => {
    if (!property.isExtensionOverride) return;
    const referencedEntity: ModelBase | null = getEntityFromNamespaceChain(
      property.metaEdName,
      // implicitly we reference Common Extension declared in same namespace as property using it
      property.namespace.namespaceName,
      property.namespace,
      'commonExtension',
    );

    if (referencedEntity == null) {
      failures.push({
        validatorName: 'CommonPropertyWithExtensionOverrideMustReferenceCommonTypeExtension',
        category: 'error',
        message: `No common extension named ${property.metaEdName} is declared in namespace ${property.referencedNamespaceName}.`,
        sourceMap: (property.sourceMap as CommonPropertySourceMap).isExtensionOverride,
        fileMap: null,
      });
    }
  });
  return failures;
}
