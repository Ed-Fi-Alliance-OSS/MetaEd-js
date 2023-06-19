import type { MetaEdPlugin } from '@edfi/metaed-core';

import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize } from '../../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [edfiUnified(), initialize()];
}
