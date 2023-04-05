import type { MetaEdPlugin } from '@edfi/metaed-core';
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';

import { initialize as edfiXsd } from '../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [edfiUnified(), edfiUnifiedAdvanced(), edfiXsd()];
}
