import deepFreeze from 'deep-freeze';

export interface SchemaDefinition {
  logicalName: string;
  physicalName: string;
  projectDescription?: string; // only used in 3.1.1+
  version?: string; // only used in 5.3+
}

// Allow anything that would be valid for a projectName, except strip out the spaces
export const deriveLogicalNameFromProjectName = (projectName: string): string => projectName.replace(/\s/g, '');

export const NoSchemaDefinition: SchemaDefinition = deepFreeze({
  logicalName: '',
  physicalName: '',
  projectDescription: '',
});

export const newSchemaDefinition = () => ({
  logicalName: '',
  physicalName: '',
  projectDescription: '',
});
