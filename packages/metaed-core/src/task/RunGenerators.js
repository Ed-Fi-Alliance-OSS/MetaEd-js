// @flow
import winston from 'winston';
import type { State } from '../State';
import type { Generator } from '../generator/Generator';

export function execute(state: State): State {
  state.pluginManifest.filter(plugin => plugin.enabled).forEach(pluginManifest => {
    try {
      pluginManifest.metaEdPlugin.generator.forEach((generator: Generator) => {
        if (state.metaEd.entity != null && state.metaEd.propertyIndex != null) {
          state.generatorResults.push(generator(state.metaEd));
        }
      });
    } catch (err) {
      winston.error(`Plugin ${pluginManifest.displayName} threw an exception, and will be disabled.`);
      pluginManifest.enabled = false;
    }
  });

  return state;
}
