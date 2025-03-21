// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { State } from '../State';
import { Validator } from './Validator';
import { MetaEdPlugin } from '../plugin/MetaEdPlugin';

export function execute(metaEdPlugin: MetaEdPlugin, state: State): void {
  if (state.metaEd.namespace == null || state.metaEd.propertyIndex == null) return;

  metaEdPlugin.validator.forEach((validator: Validator) => {
    state.validationFailure.push(...validator(state.metaEd));
  });
}
