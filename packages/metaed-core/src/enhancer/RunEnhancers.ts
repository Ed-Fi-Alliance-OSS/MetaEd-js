import { State } from '../State';
import { MetaEdPlugin } from '../plugin/MetaEdPlugin';
import { nextMacroTask } from '../Utility';

export async function execute(metaEdPlugin: MetaEdPlugin, state: State): Promise<void> {
  if (state.metaEd.namespace == null || state.metaEd.propertyIndex == null) return;

  // eslint-disable-next-line no-restricted-syntax
  for (const enhancer of metaEdPlugin.enhancer) {
    state.enhancerResults.push(enhancer(state.metaEd));
    await nextMacroTask();
  }
}
