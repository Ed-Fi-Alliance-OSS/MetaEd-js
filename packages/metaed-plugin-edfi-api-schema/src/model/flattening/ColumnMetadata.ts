// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ColumnType } from './ColumnType';

/**
 * Metadata for a single column in a flattened table.
 * Includes information about the source JSON path, column properties,
 * and relationships to other tables.
 */
export type ColumnMetadata = {
  /**
   * JSON path relative to the table's jsonPath.
   * Optional for generated columns like parent references.
   */
  jsonPath?: string;

  /**
   * Column name in PascalCase format.
   * Will be transformed per database conventions downstream.
   */
  columnName: string;

  /**
   * Abstract column type that maps to database-specific SQL types.
   */
  columnType: ColumnType;

  /**
   * Maximum length for string columns (e.g., "100", "255", "max").
   */
  maxLength?: string;

  /**
   * Total number of digits for decimal columns (e.g., "10").
   */
  precision?: string;

  /**
   * Number of decimal places for decimal columns (e.g., "4").
   */
  scale?: string;

  /**
   * Indicates this column is part of the natural key for the table.
   */
  isNaturalKey?: boolean;

  /**
   * Indicates this column is required (NOT NULL).
   */
  isRequired?: boolean;

  /**
   * Indicates this is a foreign key to the parent table.
   * Used for collection tables to reference their parent entity.
   */
  isParentReference?: boolean;

  /**
   * References a key in documentPathsMapping for document references.
   * Used to resolve foreign keys to referenced resources.
   */
  fromReferencePath?: string;

  /**
   * Indicates this reference can point to multiple resource types.
   * Example: EducationOrganization references that can be School, LocalEducationAgency, etc.
   */
  isPolymorphicReference?: boolean;

  /**
   * Specifies which superclass hierarchy for polymorphic references.
   * Example: 'EducationOrganization', 'GeneralStudentProgramAssociation'
   */
  polymorphicType?: string;

  /**
   * Marks this column as a discriminator for polymorphic references.
   * Stores the concrete type name when referencing polymorphic entities.
   */
  isDiscriminator?: boolean;

  /**
   * Indicates this is a natural key that maps to superclass identity.
   * Used in subclass resources to identify columns that correspond to
   * the parent class identity.
   */
  isSuperclassIdentity?: boolean;
};
