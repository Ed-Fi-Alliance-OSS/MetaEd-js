// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EntityProperty, MetaEdPropertyPath, TopLevelEntity } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../../model/EntityApiSchemaData';
import type { RelationalTableNode, RelationalTablePath } from '../../model/relational/RelationalTableNode';
import { buildRelationalPropertyChains } from './RelationalPropertyChainBuilder';
import type { RelationalPropertyChain } from '../../model/relational/RelationalPropertyChain';
import { isRelationalTableProperty } from './RelationalNamingConventions';

/**
 * Root table path used for parent resolution.
 */
export const ROOT_RELATIONAL_TABLE_PATH: RelationalTablePath = '' as RelationalTablePath;

/**
 * Builds a dotted MetaEd path for the provided property chain.
 */
function propertyChainPath(chain: EntityProperty[]): MetaEdPropertyPath {
  return chain.map((property) => property.fullPropertyName).join('.') as MetaEdPropertyPath;
}

/**
 * Collects relational table nodes for the entity, recording property paths and parent relationships.
 */
export function collectRelationalTableNodes(entity: TopLevelEntity): Map<MetaEdPropertyPath, RelationalTableNode> {
  const tableNodesByPath: Map<MetaEdPropertyPath, RelationalTableNode> = new Map();
  const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const { allJsonPathsMapping } = apiSchemaData;
  const propertyChains: RelationalPropertyChain[] = buildRelationalPropertyChains(entity);

  // Traverse each property chain and materialize table nodes for collection properties.
  propertyChains.forEach((chain) => {
    const pathProperties: EntityProperty[] = [];
    // Track the current table ancestry so nested collections can attach to the right parent.
    const tableStack: RelationalTablePath[] = [ROOT_RELATIONAL_TABLE_PATH];

    chain.propertyChain.forEach((property) => {
      pathProperties.push(property);
      if (!isRelationalTableProperty(property)) return;

      const propertyPath: MetaEdPropertyPath = propertyChainPath(pathProperties);
      const parentPath: RelationalTablePath = tableStack[tableStack.length - 1];

      // Build or reuse the table node for this collection path.
      // - Key by MetaEd property path so repeated chains collapse into one table node.
      // - Capture the current parent table from the stack to preserve the hierarchy.
      // - Snapshot the property chain so downstream naming has full context.
      // - Reuse existing table nodes so later passes can enrich JSONPath data without losing prior state.
      let node: RelationalTableNode | undefined = tableNodesByPath.get(propertyPath);
      if (node == null) {
        node = {
          tablePath: propertyPath,
          property,
          parentPath,
          propertyChain: [...pathProperties],
          collectionJsonPath: null,
        };
        tableNodesByPath.set(propertyPath, node);
      }

      // Prefer explicit collection JSON paths discovered during property chain building.
      if (
        chain.owningCollection != null &&
        chain.owningCollection.collectionJsonPath != null &&
        chain.owningCollection.propertyPath === propertyPath
      ) {
        node.collectionJsonPath = chain.owningCollection.collectionJsonPath;
      }

      // Use direct allJsonPathsMapping when no explicit collection path is present.
      if (node.collectionJsonPath == null) {
        const mappingEntry = allJsonPathsMapping[propertyPath];
        if (mappingEntry?.collectionContainerJsonPath != null) {
          node.collectionJsonPath = mappingEntry.collectionContainerJsonPath;
        }
      }

      // Some table paths (inline/choice containers, common collections, merged/extension overrides)
      // do not get a direct allJsonPathsMapping entry, so infer the container from descendants.
      if (node.collectionJsonPath == null) {
        const prefix = propertyPath === '' ? '' : `${propertyPath}.`;
        if (prefix !== '') {
          Object.entries(allJsonPathsMapping).forEach(([candidatePath, candidateInfo]) => {
            if (node.collectionJsonPath != null) return;
            if (!candidatePath.startsWith(prefix)) return;

            const containerPath = candidateInfo.collectionContainerJsonPath;
            if (containerPath == null) return;

            node.collectionJsonPath = containerPath;
          });
        }
      }

      // Track current table so deeper collections correctly reference their parent table.
      if (tableStack[tableStack.length - 1] !== propertyPath) {
        tableStack.push(propertyPath);
      }
    });
  });

  return tableNodesByPath;
}

/**
 * Counts the number of ancestor table-defining properties for the node.
 */
function tableDepth(node: RelationalTableNode): number {
  if (node.propertyChain.length === 0) return 0;
  return node.propertyChain.slice(0, -1).filter((candidate) => isRelationalTableProperty(candidate)).length;
}

/**
 * Sorts table nodes from shallowest to deepest to facilitate table traversal.
 */
export function sortRelationalTableNodes(nodes: Map<MetaEdPropertyPath, RelationalTableNode>): RelationalTableNode[] {
  return Array.from(nodes.values()).sort((left, right) => {
    const leftDepth = tableDepth(left);
    const rightDepth = tableDepth(right);
    if (leftDepth !== rightDepth) return leftDepth - rightDepth;
    return left.tablePath.localeCompare(right.tablePath);
  });
}
