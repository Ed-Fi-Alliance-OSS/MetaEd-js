import type { MetaEdPlugin } from '@edfi/metaed-core';

import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiApiSchema } from '@edfi/metaed-plugin-edfi-api-schema';
import { initialize } from '../../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [edfiUnified(), edfiApiSchema(), initialize()];
}
