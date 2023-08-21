import { HandbookMergeProperty } from './HandbookMergeProperty';

// A row in the "References" table on an Entity Handbook page
export type HandbookEntityReferenceProperty = {
  propertyUuid: string;
  targetPropertyId: string;
  referenceUniqueIdentifier: string;
  name: string;
  deprecationText: string;
  deprecationReason: string;
  extensionParentName: string;
  extensionParentNamespaceName: string;
  umlDatatype: string;
  jsonDatatype: string;
  jsonElementName: string;
  metaEdDatatype: string;
  sqlDatatype: string;
  isIdentity: boolean;
  isOdsApiIdentity: boolean;
  cardinality: string;
  definition: string;
  mergeDirectives?: HandbookMergeProperty[];
};
