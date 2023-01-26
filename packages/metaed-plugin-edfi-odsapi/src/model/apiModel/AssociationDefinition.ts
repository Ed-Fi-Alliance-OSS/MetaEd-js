import { ApiFullName, NoApiFullName } from './ApiFullName';
import { ApiProperty } from './ApiProperty';
import { PhysicalNames } from './PhysicalNames';

export type AssociationDefinitionCardinality =
  | 'OneToOne'
  | 'OneToZeroOrOne'
  | 'OneToOneInheritance'
  | 'OneToOneExtension'
  | 'OneToOneOrMore'
  | 'OneToZeroOrMore'
  | 'Unknown';

export interface AssociationDefinition {
  fullName: ApiFullName;
  constraintNames?: PhysicalNames;
  cardinality: AssociationDefinitionCardinality;
  primaryEntityFullName: ApiFullName;
  primaryEntityProperties: ApiProperty[];
  secondaryEntityFullName: ApiFullName;
  secondaryEntityProperties: ApiProperty[];
  isIdentifying: boolean;
  isRequired: boolean;
  potentiallyLogical?: boolean;
}

export function newAssociationDefinition(): AssociationDefinition {
  return {
    fullName: NoApiFullName,
    cardinality: 'Unknown',
    primaryEntityFullName: NoApiFullName,
    primaryEntityProperties: [],
    secondaryEntityFullName: NoApiFullName,
    secondaryEntityProperties: [],
    isIdentifying: false,
    isRequired: false,
  };
}
