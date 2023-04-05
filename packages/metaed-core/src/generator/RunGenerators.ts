import { State } from '../State';
import { MetaEdPlugin } from '../plugin/MetaEdPlugin';

export async function execute(metaEdPlugin: MetaEdPlugin, state: State): Promise<void> {
  if (state.metaEd.namespace == null || state.metaEd.propertyIndex == null) return;

  // eslint-disable-next-line no-restricted-syntax
  for (const generator of metaEdPlugin.generator) {
    state.generatorResults.push(await generator(state.metaEd));
  }
}
