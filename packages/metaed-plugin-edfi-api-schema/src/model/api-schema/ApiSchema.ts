import { ProjectSchema } from './ProjectSchema';

/**
 * API information
 */
export type ApiSchema = {
  /**
   * A collection of MetaEd projects to materialize into an API.
   */
  projects: ProjectSchema[];
};

export function newApiSchema(): ApiSchema {
  return { projects: [] };
}
