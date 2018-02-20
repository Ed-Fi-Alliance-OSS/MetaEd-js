// @flow
import type { ApiFullName } from './ApiFullName';
import type { ApiProperty } from './ApiProperty';

export type AssociationDefinitionCardinality =
  | 'OneToOne'
  | 'OneToOneInheritance'
  | 'OneToOneExtension'
  | 'OneToOneOrMore'
  | 'OneToZeroOrMore'
  | 'Unknown';

export type AssociationDefinition = {
  fullName: ApiFullName,
  cardinality: AssociationDefinitionCardinality,
  primaryEntityFullName: ApiFullName,
  primaryEntityProperties: Array<ApiProperty>,
  secondaryEntityFullName: ApiFullName,
  secondaryEntityProperties: Array<ApiProperty>,
  isIdentifying: boolean,
  isRequired: boolean,
};
