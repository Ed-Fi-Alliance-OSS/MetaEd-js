// @flow
import type { State } from '../State';
import { validate as choicePropertyMustMatchAChoice } from '../../plugin/unified/validator/ChoiceProperty/ChoicePropertyMustMatchAChoice';
import { validate as commonPropertyMustMatchACommon } from '../../plugin/unified/validator/CommonProperty/CommonPropertyMustMatchACommon';
import { validate as mostEntitiesCannotHaveSameName } from '../../plugin/unified/validator/CrossEntity/MostEntitiesCannotHaveSameName';
import { validate as domainEntityMustContainAnIdentity } from '../../plugin/unified/validator/DomainEntity/DomainEntityMustContainAnIdentity';
import { validate as domainEntityMustContainNoMoreThanOneUniqueIdColumn } from '../../plugin/unified/validator/DomainEntity/DomainEntityMustContainNoMoreThanOneUniqueIdColumn';
import type { Validator } from '../validator/Validator';

export function execute(state: State): State {
  const validators: Array<Validator> = [];

  validators.push(choicePropertyMustMatchAChoice);
  validators.push(commonPropertyMustMatchACommon);
  validators.push(mostEntitiesCannotHaveSameName);
  validators.push(domainEntityMustContainAnIdentity);
  validators.push(domainEntityMustContainNoMoreThanOneUniqueIdColumn);

  validators.forEach(validator => {
    if (state.repository != null && state.propertyIndex != null) {
      state.validationFailure.push(...validator(state.repository, state.propertyIndex));
    }
  });

  return state;
}
