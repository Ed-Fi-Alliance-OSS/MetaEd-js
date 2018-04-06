// @flow
import type { Interchange, ValidationFailure } from 'metaed-core';

export function failInterchangeExtensionPropertyRedeclarations(
  validatorName: string,
  interchangeItemType: 'elements' | 'identityTemplates',
  extensionEntity: Interchange,
  baseEntity: Interchange,
  failures: Array<ValidationFailure>,
) {
  // $FlowIgnore - computed property
  extensionEntity[interchangeItemType].forEach(extensionItem => {
    // $FlowIgnore - computed property
    baseEntity[interchangeItemType].forEach(baseItem => {
      if (extensionItem.metaEdName !== baseItem.metaEdName) return;
      failures.push({
        validatorName,
        category: 'error',
        message: `Interchange additions ${extensionEntity.metaEdName} redeclares property ${
          extensionItem.metaEdName
        } of base Interchange.`,
        sourceMap: extensionItem.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
}
