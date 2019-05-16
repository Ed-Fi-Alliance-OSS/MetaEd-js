import { MetaEdEnvironment, ValidationFailure, Interchange, InterchangeItem, ModelType } from 'metaed-core';
import { getAllEntitiesOfType, getEntityFromNamespaceChain } from 'metaed-core';

const validTypes: ModelType[] = ['association', 'associationSubclass', 'descriptor', 'domainEntity', 'domainEntitySubclass'];

const validTypeNames: string = [
  'Abstract Entity',
  'Association',
  'Association Subclass',
  'Descriptor',
  'Domain Entity',
  'Domain Entity Subclass',
].join(', ');

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  (getAllEntitiesOfType(metaEd, 'interchange') as Interchange[]).forEach((interchange: Interchange) => {
    if (interchange.identityTemplates.length === 0) return;
    interchange.identityTemplates.forEach((item: InterchangeItem) => {
      const foundEntity = getEntityFromNamespaceChain(
        item.metaEdName,
        item.referencedNamespaceName,
        interchange.namespace,
        ...validTypes,
      );
      if (foundEntity != null) return;
      failures.push({
        validatorName: 'InterchangeIdentityMustMatchADomainEntityOrAssociationOrSubclass',
        category: 'error',
        message: `Interchange identity template ${item.metaEdName} does not match any declared ${validTypeNames}`,
        sourceMap: item.sourceMap.metaEdName,
        fileMap: null,
      });
    });
  });
  return failures;
}
