import type { Enhancer, MetaEdPlugin } from '@edfi/metaed-core';
import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiUnifiedAdvanced } from '@edfi/metaed-plugin-edfi-unified-advanced';

import { initialize as edfiOdsRelational } from '../../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [edfiUnified(), edfiUnifiedAdvanced(), edfiOdsRelational()];
}

export function metaEdPluginEnhancers(): Enhancer[] {
  return [...edfiUnified().enhancer, ...edfiUnifiedAdvanced().enhancer, ...edfiOdsRelational().enhancer];
}
