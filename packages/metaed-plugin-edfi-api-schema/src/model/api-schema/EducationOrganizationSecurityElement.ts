import { JsonPath } from './JsonPath';

export type EducationOrganizationSecurityElement = {
  /**
   * The MetaEd property name for the security element
   */
  metaEdName: string;

  /**
   * The JsonPath in the API document for the security element
   */
  jsonPath: JsonPath;
};
