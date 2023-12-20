import type { Enhancer, MetaEdPlugin } from '@edfi/metaed-core';

import { initialize as edfiUnified } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as edfiOdsRelational } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize } from '../../src/index';

export function metaEdPlugins(): MetaEdPlugin[] {
  return [edfiUnified(), edfiOdsRelational(), initialize()];
}

export function metaEdPluginEnhancers(): Enhancer[] {
  return [...edfiUnified().enhancer, ...edfiOdsRelational().enhancer];
}
