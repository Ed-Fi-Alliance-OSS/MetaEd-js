// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ForeignKey, Table, EnumerationRow, SchoolYearEnumerationRow } from '@edfi/metaed-plugin-edfi-ods-relational';

export interface SchemaContainer {
  tables: Table[];
  foreignKeys: ForeignKey[];
  enumerationRows: EnumerationRow[];
  schoolYearEnumerationRows: SchoolYearEnumerationRow[];
}

export function newSchemaContainer(): SchemaContainer {
  return {
    tables: [],
    foreignKeys: [],
    enumerationRows: [],
    schoolYearEnumerationRows: [],
  };
}
