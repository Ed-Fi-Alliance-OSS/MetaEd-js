// @flow
import deepFreeze from 'deep-freeze';

export type SchemaDefinition = {
  logicalName: string,
  physicalName: string,
  version?: string, // only used in 3.1.1+
};

// Allow anything that would be valid for a projectName, except strip out the spaces
export const deriveLogicalNameFromProjectName = (projectName: string): string => projectName.replace(/\s/g, '');

export const NoSchemaDefinition: SchemaDefinition = deepFreeze({
  logicalName: '',
  physicalName: '',
});
