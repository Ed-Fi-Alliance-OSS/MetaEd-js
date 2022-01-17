import { MetaEdEnvironment, ValidationFailure, Interchange, InterchangeItem, InterchangeExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';

function addFailure(
  interchange: Interchange | InterchangeExtension,
  item: InterchangeItem,
  failures: ValidationFailure[],
): void {
  failures.push({
    validatorName: 'DeprecatedInterchangeItemReferenceWarning',
    category: 'warning',
    message: `${interchange.typeHumanizedName} ${interchange.metaEdName} references deprecated entity ${item.metaEdName}.`,
    sourceMap: item.sourceMap.metaEdName,
    fileMap: null,
  });
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  (getAllEntitiesOfType(metaEd, 'interchange', 'interchangeExtension') as (Interchange | InterchangeExtension)[]).forEach(
    (interchange) => {
      // ignore data standard interchange item deprecations unless in alliance mode
      if (!interchange.namespace.isExtension && !metaEd.allianceMode) return;

      interchange.elements.forEach((item: InterchangeItem) => {
        if (item.referencedEntityDeprecated) addFailure(interchange, item, failures);
      });
      interchange.identityTemplates.forEach((item: InterchangeItem) => {
        if (item.referencedEntityDeprecated) addFailure(interchange, item, failures);
      });
    },
  );
  return failures;
}
