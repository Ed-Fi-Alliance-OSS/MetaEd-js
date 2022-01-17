import { Interchange, ValidationFailure } from '@edfi/metaed-core';

export function failInterchangeExtensionPropertyRedeclarations(
  validatorName: string,
  interchangeItemType: 'elements' | 'identityTemplates',
  extensionEntity: Interchange,
  baseEntity: Interchange,
  failures: ValidationFailure[],
) {
  extensionEntity[interchangeItemType].forEach((extensionItem) => {
    baseEntity[interchangeItemType].forEach((baseItem) => {
      if (extensionItem.metaEdName !== baseItem.metaEdName) return;
      failures.push({
        validatorName,
        category: 'error',
        message: `Interchange additions ${extensionEntity.metaEdName} redeclares property ${extensionItem.metaEdName} of base Interchange.`,
        sourceMap: extensionItem.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
}
