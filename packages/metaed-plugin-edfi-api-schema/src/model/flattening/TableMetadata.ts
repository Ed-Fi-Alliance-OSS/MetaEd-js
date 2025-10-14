// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ColumnMetadata } from './ColumnMetadata';
import type { JsonPath } from '../api-schema/JsonPath';

/**
 * ResourceSchema metadata for representing flattened resource tables
 * Supports nested collections through the childTables property.
 */
export type TableMetadata = {
  /**
   * Base table name in PascalCase format.
   * Will be transformed per database conventions downstream.
   * Examples: 'Student', 'SchoolAddress', 'StudentAssessmentScoreResult'
   */
  baseName: string;

  /**
   * Absolute JsonPath to the object or array represented by this table.
   * Used downstream to align extension fragments and runtime metadata merges.
   */
  jsonPath: JsonPath;

  /**
   * Column definitions for this table.
   * Includes both data columns and foreign key references.
   */
  columns: ColumnMetadata[];

  /**
   * Nested tables for collection properties.
   * Enables recursive table structure for deeply nested collections.
   * Each child table will have a foreign key reference to this table.
   */
  childTables: TableMetadata[];

  /**
   * Indicates this table represents an extension.
   * Extension tables are created separately from core resource tables.
   */
  isExtensionTable?: boolean;

  /**
   * For subclass resources, the discriminator value for union views.
   * Example: 'School' for the School subclass of EducationOrganization.
   * Used to identify the concrete type in polymorphic union views.
   */
  discriminatorValue?: string;
};
