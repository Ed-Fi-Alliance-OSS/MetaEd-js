// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// Returns an array of duplicate values found in the input array
export function findDuplicates(arr: string[]): string[] {
  // Group items by their value
  const grouped: { [key: string]: string[] } = {};
  arr.forEach((item) => {
    if (!grouped[item]) {
      grouped[item] = [];
    }
    grouped[item].push(item);
  });

  // Filter groups with more than one item and take the first item from each group
  const duplicates = Object.values(grouped)
    .filter((group) => group.length > 1)
    .map((group) => group[0]);

  return duplicates;
}
