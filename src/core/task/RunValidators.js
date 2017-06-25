// @flow
import winston from 'winston';
import type { State } from '../State';

export function execute(state: State): State {
  state.pluginManifest.filter(plugin => plugin.enabled).forEach(pluginManifest => {
    try {
      pluginManifest.plugin.validators.forEach(validator => {
        if (state.repository != null && state.propertyIndex != null) {
          state.validationFailure.push(...validator(state.repository, state.propertyIndex));
        }
      });
    } catch (err) {
      winston.error(`Plugin ${pluginManifest.displayName} threw an exception, and will be disabled.`);
      pluginManifest.enabled = false;
    }
  });

  return state;
}
