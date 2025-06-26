// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Interchange } from './Interchange';
import { newInterchange } from './Interchange';

/**
 *
 */
export type InterchangeExtension = Interchange;

/**
 *
 */
export function newInterchangeExtension(): InterchangeExtension {
  return {
    ...newInterchange(),
    type: 'interchangeExtension',
    typeHumanizedName: 'Interchange Extension',
  };
}
