// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  ValidationFailure,
  TopLevelEntity,
  ReferentialProperty,
  SimpleProperty,
  ModelBase,
  isSharedProperty,
} from '@edfi/metaed-core';

function allPropertiesAfterTheFirstAreIdentity(outPath: (ReferentialProperty | SimpleProperty)[]): boolean {
  // eslint-disable-next-line no-restricted-syntax
  for (const [index, propertyOnPath] of outPath.entries()) {
    // skip first property
    if (index > 0) {
      if (!propertyOnPath.isPartOfIdentity && !propertyOnPath.isIdentityRename) return false;
    }
  }

  return true;
}

function roleNameOnFirstProperty(outPath: (ReferentialProperty | SimpleProperty)[]): boolean {
  const property = outPath[0];
  return property != null && property.roleName != null && property.roleName !== '';
}

function noMergeDirectives(
  outPaths: (ReferentialProperty | SimpleProperty)[][],
): (ReferentialProperty | SimpleProperty)[][] {
  const result: (ReferentialProperty | SimpleProperty)[][] = [];
  outPaths.forEach((outPath) => {
    if (outPath.every((property) => (property as ReferentialProperty).mergeDirectives.length === 0)) result.push(outPath);
  });
  return result;
}

function addOutPathsForEntitiesWithSharedSimples(
  outPaths: (ReferentialProperty | SimpleProperty)[][],
): (ReferentialProperty | SimpleProperty)[][] {
  const result: (ReferentialProperty | SimpleProperty)[][] = [...outPaths];
  outPaths.forEach((outPath) => {
    const outPathEndpoint = outPath[outPath.length - 1];
    if (isSharedProperty(outPathEndpoint)) result.push(outPath.slice(0, outPath.length - 1));
  });
  return result;
}

function roleNameOnAtLeastAllButOnePath(outPaths: (ReferentialProperty | SimpleProperty)[][]) {
  const countOfPathsWithRoleName: number = outPaths.reduce(
    (count, outPath) => (roleNameOnFirstProperty(outPath) ? count + 1 : count),
    0,
  );
  return countOfPathsWithRoleName >= outPaths.length - 1;
}

function targetDiffersByFullNameOnDirectReference(
  outPaths: (ReferentialProperty | SimpleProperty)[][],
): (ReferentialProperty | SimpleProperty)[][] {
  const fullNamesMap: Map<string, (ReferentialProperty | SimpleProperty)[][]> = new Map();

  outPaths.forEach((outPath) => {
    const { fullPropertyName } = outPath[outPath.length - 1];
    if (!fullNamesMap.has(fullPropertyName)) fullNamesMap.set(fullPropertyName, []);
    (fullNamesMap.get(fullPropertyName) as (ReferentialProperty | SimpleProperty)[][]).push(outPath);
  });

  // Ramda unnest === flatten a single level
  return R.unnest(Array.from(fullNamesMap.values()).filter((outPathArray) => outPathArray.length > 1));
}

function startOfPathIsIdentity(outPath: (ReferentialProperty | SimpleProperty)[]): boolean {
  if (outPath.length === 0) return false; // something is wrong
  return outPath[0].isIdentityRename || outPath[0].isPartOfIdentity;
}

function mergeOutReferenceEntityEndpointsMap(
  baseMap: Map<ModelBase, (ReferentialProperty | SimpleProperty)[][]>,
  targetMap: Map<ModelBase, (ReferentialProperty | SimpleProperty)[][]>,
) {
  baseMap.forEach((listOfOutReferencePathsFromBase, entityAsKey) => {
    if (!targetMap.has(entityAsKey)) {
      targetMap.set(entityAsKey, []);
    }
    (targetMap.get(entityAsKey) as (ReferentialProperty | SimpleProperty)[][]).push(...listOfOutReferencePathsFromBase);
  });
}

const pathStringReducer = (finalString, currentOutPath) =>
  `${finalString} [${currentOutPath.map((p) => p.metaEdName).join('.')}]`;

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];

  // TODO: limited to direct sourcing from A/DEs and sub/extensions - doesn't look at Commons to traverse back to parent A/DE
  getAllEntitiesOfType(
    metaEd,
    'association',
    'associationExtension',
    'associationSubclass',
    'domainEntity',
    'domainEntityExtension',
    'domainEntitySubclass',
  ).forEach((entity) => {
    // combine outReferenceEntityEndpointsMaps if this entity has a base
    const outReferenceEntityEndpointsMap: Map<ModelBase, (ReferentialProperty | SimpleProperty)[][]> = new Map(
      (entity as TopLevelEntity).outReferenceEntityEndpointsMap,
    );
    const { baseEntity } = entity as TopLevelEntity;
    if (baseEntity !== null) {
      mergeOutReferenceEntityEndpointsMap(baseEntity.outReferenceEntityEndpointsMap, outReferenceEntityEndpointsMap);
    }

    outReferenceEntityEndpointsMap.forEach((listOfOutPaths, entityAtEndpoint) => {
      // quick exit if there are not multiple paths
      if (listOfOutPaths.length < 2) return;

      // only paths with identities after the initial element are problems
      const possibleProblemOutPaths: (ReferentialProperty | SimpleProperty)[][] = [...listOfOutPaths].filter(
        allPropertiesAfterTheFirstAreIdentity,
      );

      // quick exit if there are not still multiple paths
      if (possibleProblemOutPaths.length < 2) return;

      // then ignore any path with any merge directive (targeting along the path to endpoint is what should be done)
      const possibleProblemOutPaths2 = noMergeDirectives(possibleProblemOutPaths);

      // quick exit if there are not still multiple paths
      if (possibleProblemOutPaths2.length < 2) return;

      // of these paths, there must be one that starts with identity
      if (!possibleProblemOutPaths2.some(startOfPathIsIdentity)) return;

      // of these paths, we'll say they are fine if there is a role name on all or all but one
      // (not entirely sufficient - e.g. role name might not have an effect)
      if (roleNameOnAtLeastAllButOnePath(possibleProblemOutPaths2)) return;

      // of these paths, we'll say they are fine if the property at the
      // end of the path referenced it with differing full names
      const possibleProblemOutPaths3 = targetDiffersByFullNameOnDirectReference(possibleProblemOutPaths2);

      // exit if there are not still multiple paths
      if (possibleProblemOutPaths3.length < 2) return;

      // Running this to get additional out paths, but they are duplicates of error messages
      const possibleProblemOutPaths4 = addOutPathsForEntitiesWithSharedSimples(possibleProblemOutPaths3);

      const problemPathsAsString = possibleProblemOutPaths4.reduce(pathStringReducer, '');

      // Using outpaths 3 for individual errors but outpaths 4 for path listing
      possibleProblemOutPaths3.forEach((outPath) => {
        failures.push({
          validatorName: 'OutPathsToSameEntityMustHaveMergeDirectiveOrRoleName',
          category: 'error',
          message: `Ambiguous merge paths exist from ${outPath[0].parentEntityName}.${outPath[0].metaEdName} to ${entityAtEndpoint.metaEdName}. Paths are${problemPathsAsString}.  Either add a merge directive, use 'role name', or change the model.`,
          sourceMap: outPath[0].sourceMap.metaEdName,
          fileMap: null,
        });
      });
    });
  });

  return failures;
}
