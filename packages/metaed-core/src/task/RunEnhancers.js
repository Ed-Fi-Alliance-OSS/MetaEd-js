// @flow
import winston from 'winston';
import type { State } from '../State';
import type { Enhancer } from '../enhancer/Enhancer';

export function execute(state: State): State {
  state.pluginManifest.filter(plugin => plugin.enabled).forEach(pluginManifest => {
    try {
      pluginManifest.metaEdPlugin.enhancer.forEach((enhancer: Enhancer) => {
        if (state.metaEd.entity != null && state.metaEd.propertyIndex != null) {
          state.enhancerResults.push(enhancer(state.metaEd));
        }
      });
    } catch (err) {
      winston.error(`Plugin ${pluginManifest.displayName} threw an exception, and will be disabled. ${err.stack}`);
      pluginManifest.enabled = false;
    }
  });

  return state;
}
