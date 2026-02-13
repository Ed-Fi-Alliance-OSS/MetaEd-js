// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { DomainRow, EntityRow, ElementRow } from './DataStandardListingRow';

/**
 * Data Catalog plugin data stored on each Namespace
 */
export type NamespaceDataCatalogData = {
  /**
   * Domain rows for this namespace
   */
  domainRows: DomainRow[];

  /**
   * Entity rows for this namespace
   */
  entityRows: EntityRow[];

  /**
   * Element rows for this namespace
   */
  elementRows: ElementRow[];
};
