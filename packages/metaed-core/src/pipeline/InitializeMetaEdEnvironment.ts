import path from 'path';
import { State } from '../State';
import { Logger } from '../Logger';

export function initializeMetaEdEnvironment(state: State): State {
  // set alliance mode given from configuration
  state.metaEd.allianceMode = state.metaEdConfiguration.allianceMode;

  // set MetaEd version pulled from package.json
  const metaEdCorePackageJson = require(path.resolve(__dirname, '../../package.json')); // eslint-disable-line
  if (metaEdCorePackageJson.version != null) state.metaEd.metaEdVersion = metaEdCorePackageJson.version;

  Logger.info(`  Running MetaEd version ${state.metaEd.metaEdVersion}`);
  return state;
}
