import type { MetaEdPlugin } from '@edfi/metaed-core';
import { initialize as edfiUnified } from '../../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [edfiUnified()];
}
