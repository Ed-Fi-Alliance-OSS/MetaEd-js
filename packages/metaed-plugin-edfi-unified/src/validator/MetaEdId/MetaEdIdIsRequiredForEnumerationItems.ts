import { Enumeration, SchoolYearEnumeration, MetaEdEnvironment, ValidationFailure, Namespace } from 'metaed-core';
import { getEntitiesOfTypeForNamespaces, asEnumeration } from 'metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  const namespaces: Namespace[] = Array.from(metaEd.namespace.values()).filter((n) => !n.isExtension);
  getEntitiesOfTypeForNamespaces(namespaces, 'enumeration', 'schoolYearEnumeration').forEach((entity) => {
    const domain: Enumeration | SchoolYearEnumeration = asEnumeration(entity);
    if (domain.enumerationItems.length === 0) return;
    domain.enumerationItems.forEach((enumerationItem) => {
      if (enumerationItem.metaEdId) return;
      failures.push({
        validatorName: 'MetaEdIdIsRequiredForEnumerationItems',
        category: 'warning',
        message: `${enumerationItem.typeHumanizedName} ${enumerationItem.metaEdName} is missing a MetaEdId value.`,
        sourceMap: enumerationItem.sourceMap.type,
        fileMap: null,
      });
    });
  });
  return failures;
}
