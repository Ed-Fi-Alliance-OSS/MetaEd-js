import { Interchange, InterchangeExtension, MetaEdEnvironment, ValidationFailure, Namespace } from '@edfi/metaed-core';
import { getEntitiesOfTypeForNamespaces, asInterchange } from '@edfi/metaed-core';

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  const namespaces: Namespace[] = Array.from(metaEd.namespace.values()).filter((n) => !n.isExtension);
  getEntitiesOfTypeForNamespaces(namespaces, 'interchange', 'interchangeExtension').forEach((entity) => {
    const interchange: Interchange | InterchangeExtension = asInterchange(entity);
    if (interchange.elements.length === 0 && interchange.identityTemplates.length === 0) return;
    [...interchange.elements, ...interchange.identityTemplates].forEach((interchangeItem) => {
      if (interchangeItem.metaEdId) return;
      failures.push({
        validatorName: 'MetaEdIdIsRequiredForInterchangeItems',
        category: 'warning',
        message: `${interchangeItem.typeHumanizedName} ${interchangeItem.metaEdName} is missing a MetaEdId value.`,
        sourceMap: interchangeItem.sourceMap.referencedType,
        fileMap: null,
      });
    });
  });
  return failures;
}
