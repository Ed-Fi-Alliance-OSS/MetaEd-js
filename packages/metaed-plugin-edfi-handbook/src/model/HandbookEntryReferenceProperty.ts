import { HandbookMergeProperty } from './HandbookMergeProperty';

export interface HandbookEntityReferenceProperty {
  metaEdId: string;
  targetPropertyId: string;
  referenceUniqueIdentifier: string;
  name: string;
  deprecationText: string;
  deprecationReason: string;
  extensionParentName: string;
  extensionParentNamespaceName: string;
  umlDatatype: string;
  jsonDatatype: string;
  metaEdDatatype: string;
  sqlDatatype: string;
  isIdentity: boolean;
  isOdsApiIdentity: boolean;
  cardinality: string;
  definition: string;
  mergeDirectives?: HandbookMergeProperty[];
}
