import { State } from '../State';
import { MetaEdPlugin } from './MetaEdPlugin';
import { newPluginEnvironment } from './PluginEnvironment';
import { Logger } from '../Logger';

export function setupPlugins(state: State): void {
  state.metaEdPlugins.forEach((metaEdPlugin: MetaEdPlugin) => {
    const targetTechnologyVersion = state.metaEdConfiguration.defaultPluginTechVersion;
    Logger.info(`- ${metaEdPlugin.shortName}, tech version ${targetTechnologyVersion}`);

    state.metaEd.plugin.set(metaEdPlugin.shortName, {
      ...newPluginEnvironment(),
      shortName: metaEdPlugin.shortName,
      targetTechnologyVersion,
    });
  });
}
