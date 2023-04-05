import { State } from '../State';
import { Validator } from './Validator';
import { MetaEdPlugin } from '../plugin/MetaEdPlugin';

export function execute(metaEdPlugin: MetaEdPlugin, state: State): void {
  if (state.metaEd.namespace == null || state.metaEd.propertyIndex == null) return;

  metaEdPlugin.validator.forEach((validator: Validator) => {
    state.validationFailure.push(...validator(state.metaEd));
  });
}
