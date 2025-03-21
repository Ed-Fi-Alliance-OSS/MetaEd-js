// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';

export const findDuplicates = R.memoizeWith(
  R.identity,
  R.compose(
    R.map(R.head),
    R.filter((x) => x.length > 1),
    R.values,
    R.groupBy(R.identity),
  ),
);
