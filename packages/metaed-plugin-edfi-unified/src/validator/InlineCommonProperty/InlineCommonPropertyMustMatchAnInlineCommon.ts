import { MetaEdEnvironment, ValidationFailure, ModelBase, Common, getEntityFromNamespaceChain } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  metaEd.propertyIndex.inlineCommon.forEach((property) => {
    const referencedEntity: ModelBase | null = getEntityFromNamespaceChain(
      property.metaEdName,
      property.referencedNamespaceName,
      property.namespace,
      'common',
    );

    if (referencedEntity == null || !(referencedEntity as Common).inlineInOds) {
      failures.push({
        validatorName: 'InlineCommonPropertyMustMatchAnInlineCommon',
        category: 'error',
        message: `Inline Common property '${property.metaEdName}' does not match any declared Inline Common in namespace ${property.referencedNamespaceName}.`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
