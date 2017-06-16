// @flow
import { Repository } from '../../model/Repository';
import type { ValidationFailure } from '../ValidationFailure';
import { Association } from '../../model/Association';
import { AssociationSubclass } from '../../model/AssociationSubclass';
import { Choice } from '../../model/Choice';
import { Common } from '../../model/Common';
import { DomainEntity } from '../../model/DomainEntity';
import { DomainEntitySubclass } from '../../model/DomainEntitySubclass';
import { SharedDecimal } from '../../model/SharedDecimal';
import { SharedInteger } from '../../model/SharedInteger';
import { SharedString } from '../../model/SharedString';

type MostEntities =
  Association |
  AssociationSubclass |
  Choice |
  Common |
  DomainEntity |
  DomainEntitySubclass |
  SharedDecimal |
  SharedInteger |
  SharedString;

// Domains, Subdomains, Interchanges, Enumerations and Descriptors don't have standard cross entity naming issues
// and extension entities don't define a new identifier
function entitiesNeedingDuplicateChecking(repository: Repository): Array<MostEntities> {
  const result: Array<MostEntities> = [];
  result.push(...repository.entity.association.values());
  result.push(...repository.entity.associationSubclass.values());
  result.push(...repository.entity.choice.values());
  result.push(...repository.entity.common.values());
  result.push(...repository.entity.domainEntity.values());
  result.push(...repository.entity.domainEntitySubclass.values());
  result.push(...repository.entity.sharedDecimal.values());
  result.push(...repository.entity.sharedInteger.values());
  result.push(...repository.entity.sharedString.values());
  return result;
}

function groupByMetaEdName(entities: Array<MostEntities>): Map<string, Array<MostEntities>> {
  return entities.reduce((structure: Map<string, Array<MostEntities>>, entity: MostEntities) => {
    if (!structure.has(entity.metaEdName)) structure.set(entity.metaEdName, []);
    // $FlowIgnore - we ensure the key is in the map above
    structure.get(entity.metaEdName).push(entity);
    return structure;
  }, new Map());
}

export function validate(repository: Repository): Array<ValidationFailure> {
  const failures: Array<ValidationFailure> = [];

  groupByMetaEdName(entitiesNeedingDuplicateChecking(repository)).forEach((entities, metaEdName) => {
    if (entities.length > 1) {
      entities.forEach(entity => {
        failures.push({
          validatorName: 'MostEntitiesCannotHaveSameName',
          category: 'error',
          message: `${entity.typeGroupHumanizedName} named ${metaEdName} is a duplicate declaration of that name.`,
          sourceMap: entity.sourceMap.type,
        });
      });
    }
  });

  return failures;
}
