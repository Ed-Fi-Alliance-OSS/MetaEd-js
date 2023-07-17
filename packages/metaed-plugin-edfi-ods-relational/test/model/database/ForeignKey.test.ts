import { DomainEntityProperty } from '@edfi/metaed-core';
import { newDomainEntityProperty } from '@edfi/metaed-core';
import { addColumnPair, newForeignKey, foreignKeySourceReferenceFrom } from '../../../src/model/database/ForeignKey';
import { newColumnPair } from '../../../src/model/database/ColumnPair';
import { ForeignKey, ForeignKeySourceReference } from '../../../src/model/database/ForeignKey';

describe('when using add column name pair to a foreign key with no existing duplicates', (): void => {
  const parentTableColumnId = 'ParentTableColumnName';
  const foreignTableColumnId = 'ForeignTableColumnName';
  let foreignKey: ForeignKey;

  beforeAll(() => {
    foreignKey = { ...newForeignKey(), name: 'ForeignKeyName' };
    addColumnPair(foreignKey, { ...newColumnPair(), parentTableColumnId, foreignTableColumnId });
  });

  it('should successfully add column name pair', (): void => {
    expect(foreignKey.columnPairs).toHaveLength(1);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(parentTableColumnId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(foreignTableColumnId);
  });
});

describe('when using add column name pair to a foreign key with existing duplicate', (): void => {
  const parentTableColumnId = 'ParentTableColumnName';
  const foreignTableColumnId = 'ForeignTableColumnName';
  let foreignKey: ForeignKey;

  beforeAll(() => {
    foreignKey = { ...newForeignKey(), name: 'ForeignKeyName' };
    addColumnPair(foreignKey, { ...newColumnPair(), parentTableColumnId, foreignTableColumnId });
    addColumnPair(foreignKey, { ...newColumnPair(), parentTableColumnId, foreignTableColumnId });
  });

  it('should reject incoming column name pair', (): void => {
    expect(foreignKey.columnPairs).toHaveLength(1);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(parentTableColumnId);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(foreignTableColumnId);
  });
});

describe('when creating foreign key sourceReference from identity property', (): void => {
  const entityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
    isPartOfIdentity: true,
    data: { edfiOdsRelational: { odsIsReferenceToSuperclass: false, odsIsReferenceToExtensionParent: false } },
  });
  const sourceReference: ForeignKeySourceReference = foreignKeySourceReferenceFrom(entityProperty, {
    isSubtableRelationship: false,
  });

  it('should create correct source reference', (): void => {
    expect(sourceReference.isPartOfIdentity).toBe(true);
    expect(sourceReference.isRequired).toBe(true);
    expect(sourceReference.isOptional).toBe(false);
    expect(sourceReference.isRequiredCollection).toBe(false);
    expect(sourceReference.isOptionalCollection).toBe(false);
    expect(sourceReference.isSubclassRelationship).toBe(false);
    expect(sourceReference.isExtensionRelationship).toBe(false);
    expect(sourceReference.isSyntheticRelationship).toBe(false);
  });
});

describe('when creating foreign key sourceReference from required property', (): void => {
  const entityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
    isRequired: true,
    data: { edfiOdsRelational: { odsIsReferenceToSuperclass: false, odsIsReferenceToExtensionParent: false } },
  });
  const sourceReference: ForeignKeySourceReference = foreignKeySourceReferenceFrom(entityProperty, {
    isSubtableRelationship: false,
  });

  it('should create correct source reference', (): void => {
    expect(sourceReference.isPartOfIdentity).toBe(false);
    expect(sourceReference.isRequired).toBe(true);
    expect(sourceReference.isOptional).toBe(false);
    expect(sourceReference.isRequiredCollection).toBe(false);
    expect(sourceReference.isOptionalCollection).toBe(false);
    expect(sourceReference.isSubclassRelationship).toBe(false);
    expect(sourceReference.isExtensionRelationship).toBe(false);
    expect(sourceReference.isSyntheticRelationship).toBe(false);
  });
});

describe('when creating foreign key sourceReference from optional property', (): void => {
  const entityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
    isOptional: true,
    data: { edfiOdsRelational: { odsIsReferenceToSuperclass: false, odsIsReferenceToExtensionParent: false } },
  });
  const sourceReference: ForeignKeySourceReference = foreignKeySourceReferenceFrom(entityProperty, {
    isSubtableRelationship: false,
  });

  it('should create correct source reference', (): void => {
    expect(sourceReference.isPartOfIdentity).toBe(false);
    expect(sourceReference.isRequired).toBe(false);
    expect(sourceReference.isOptional).toBe(true);
    expect(sourceReference.isRequiredCollection).toBe(false);
    expect(sourceReference.isOptionalCollection).toBe(false);
    expect(sourceReference.isSubclassRelationship).toBe(false);
    expect(sourceReference.isExtensionRelationship).toBe(false);
    expect(sourceReference.isSyntheticRelationship).toBe(false);
  });
});

describe('when creating foreign key sourceReference from required collection property', (): void => {
  const entityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
    isRequiredCollection: true,
    data: { edfiOdsRelational: { odsIsReferenceToSuperclass: false, odsIsReferenceToExtensionParent: false } },
  });
  const sourceReference: ForeignKeySourceReference = foreignKeySourceReferenceFrom(entityProperty, {
    isSubtableRelationship: false,
  });

  it('should create correct source reference', (): void => {
    expect(sourceReference.isPartOfIdentity).toBe(false);
    expect(sourceReference.isRequired).toBe(false);
    expect(sourceReference.isOptional).toBe(false);
    expect(sourceReference.isRequiredCollection).toBe(true);
    expect(sourceReference.isOptionalCollection).toBe(false);
    expect(sourceReference.isSubclassRelationship).toBe(false);
    expect(sourceReference.isExtensionRelationship).toBe(false);
    expect(sourceReference.isSyntheticRelationship).toBe(false);
  });
});

describe('when creating foreign key sourceReference from optional collection property', (): void => {
  const entityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
    isOptionalCollection: true,
    data: { edfiOdsRelational: { odsIsReferenceToSuperclass: false, odsIsReferenceToExtensionParent: false } },
  });
  const sourceReference: ForeignKeySourceReference = foreignKeySourceReferenceFrom(entityProperty, {
    isSubtableRelationship: false,
  });

  it('should create correct source reference', (): void => {
    expect(sourceReference.isPartOfIdentity).toBe(false);
    expect(sourceReference.isRequired).toBe(false);
    expect(sourceReference.isOptional).toBe(false);
    expect(sourceReference.isRequiredCollection).toBe(false);
    expect(sourceReference.isOptionalCollection).toBe(true);
    expect(sourceReference.isSubclassRelationship).toBe(false);
    expect(sourceReference.isExtensionRelationship).toBe(false);
    expect(sourceReference.isSyntheticRelationship).toBe(false);
  });
});

describe('when creating foreign key sourceReference from subclass relationship property', (): void => {
  const entityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
    isPartOfIdentity: true,
    data: { edfiOdsRelational: { odsIsReferenceToSuperclass: true, odsIsReferenceToExtensionParent: false } },
  });
  const sourceReference: ForeignKeySourceReference = foreignKeySourceReferenceFrom(entityProperty, {
    isSubtableRelationship: false,
  });

  it('should create correct source reference', (): void => {
    expect(sourceReference.isPartOfIdentity).toBe(true);
    expect(sourceReference.isRequired).toBe(true);
    expect(sourceReference.isOptional).toBe(false);
    expect(sourceReference.isRequiredCollection).toBe(false);
    expect(sourceReference.isOptionalCollection).toBe(false);
    expect(sourceReference.isSubclassRelationship).toBe(true);
    expect(sourceReference.isExtensionRelationship).toBe(false);
    expect(sourceReference.isSyntheticRelationship).toBe(false);
  });
});

describe('when creating foreign key sourceReference from extension relationship property', (): void => {
  const entityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
    isPartOfIdentity: true,
    data: { edfiOdsRelational: { odsIsReferenceToSuperclass: false, odsIsReferenceToExtensionParent: true } },
  });
  const sourceReference: ForeignKeySourceReference = foreignKeySourceReferenceFrom(entityProperty, {
    isSubtableRelationship: false,
  });

  it('should create correct source reference', (): void => {
    expect(sourceReference.isPartOfIdentity).toBe(true);
    expect(sourceReference.isRequired).toBe(true);
    expect(sourceReference.isOptional).toBe(false);
    expect(sourceReference.isRequiredCollection).toBe(false);
    expect(sourceReference.isOptionalCollection).toBe(false);
    expect(sourceReference.isSubclassRelationship).toBe(false);
    expect(sourceReference.isExtensionRelationship).toBe(true);
    expect(sourceReference.isSyntheticRelationship).toBe(false);
  });
});
