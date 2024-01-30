import { EntityProperty, MetaEdPropertyPath } from '@edfi/metaed-core';

/**
 * A flattened identity property is a simple property that is part of a reference identity for an
 * entity. It can come from a chain of identity references, in which case it is a "leaf" simple
 * property from the chain.
 *
 * propertyPaths is a list of all the reference property paths this "leaf" simple property
 * is a part of the identity for a given entity. For example, if it is a SchoolId on School,
 * in the context of a Section it is part of a Section's identity via this path of identity
 * references:
 *
 * Section.CourseOffering.Session.School.SchoolId
 *
 * It is also part of the identity of the paths of the higher level identity references:
 *
 * Section.CourseOffering.Session.School
 * Section.CourseOffering.Session
 * Section.CourseOffering
 * Section
 */
export type FlattenedIdentityProperty = {
  identityProperty: EntityProperty;
  propertyPaths: MetaEdPropertyPath[];
  propertyChain: EntityProperty[];
};
