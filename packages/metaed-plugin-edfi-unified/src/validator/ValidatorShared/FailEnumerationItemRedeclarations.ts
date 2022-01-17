import { Descriptor, Enumeration, EnumerationItem, ValidationFailure } from '@edfi/metaed-core';
import { findDuplicates } from './FindDuplicates';

export function failEnumerationItemRedeclarations(
  validatorName: string,
  entity: Descriptor | Enumeration,
  enumerationItems: EnumerationItem[],
  failures: ValidationFailure[],
) {
  const shortDescriptions: string[] = enumerationItems.map((x) => x.shortDescription);
  const duplicates: string[] = findDuplicates(shortDescriptions);

  duplicates.forEach((duplicate) => {
    const enumerationItem = enumerationItems.find((x) => x.shortDescription === duplicate);
    if (enumerationItem == null) return;

    failures.push({
      validatorName,
      category: 'error',
      message: `${entity.typeHumanizedName} ${entity.metaEdName} redeclares item ${duplicate}.`,
      sourceMap: enumerationItem.sourceMap.shortDescription,
      fileMap: null,
    });
  });
}
