import { MetaEdProjectName } from '@edfi/metaed-core';
import { ProjectNamespace } from './ProjectNamespace';

/**
 * A collection of MetaEdProjectNames mapped to ProjectNamespaces.
 */
export type ProjectNameMapping = {
  [key: MetaEdProjectName]: ProjectNamespace;
};
