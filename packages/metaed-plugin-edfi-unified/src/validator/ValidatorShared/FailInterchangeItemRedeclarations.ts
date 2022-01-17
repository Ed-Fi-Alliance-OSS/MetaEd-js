import { Interchange, InterchangeItem, ValidationFailure } from '@edfi/metaed-core';
import { findDuplicates } from './FindDuplicates';

export function failInterchangeItemRedeclarations(
  validatorName: string,
  duplicateItemName: string,
  entity: Interchange,
  interchangeItems: InterchangeItem[],
  failures: ValidationFailure[],
) {
  const itemNames: string[] = interchangeItems.map((x) => x.metaEdName);
  const duplicates: string[] = findDuplicates(itemNames);

  duplicates.forEach((duplicate) => {
    const interchangeItem: InterchangeItem | void = interchangeItems.find((x) => x.metaEdName === duplicate);
    if (!interchangeItem) return;

    failures.push({
      validatorName,
      category: 'error',
      message: `Interchange ${entity.metaEdName} redeclares ${duplicateItemName} ${duplicate}.`,
      sourceMap: interchangeItem.sourceMap.metaEdName,
      fileMap: null,
    });
  });
}
