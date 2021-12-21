import winston from 'winston';
import { uniq, sortWith, prop } from 'ramda';
import {
  isReferentialProperty,
  asInlineCommonProperty,
  asChoiceProperty,
  asReferentialProperty,
  NoInterchangeItem,
} from 'metaed-core';
import {
  ChoiceProperty,
  EnhancerResult,
  EntityProperty,
  InlineCommonProperty,
  InterchangeItem,
  MetaEdEnvironment,
  Namespace,
  ReferentialProperty,
  TopLevelEntity,
} from 'metaed-core';
import { EdFiXsdEntityRepository, MergedInterchange } from 'metaed-plugin-edfi-xsd';
import { edfiXsdRepositoryForNamespace } from 'metaed-plugin-edfi-xsd';
import graphlib, { Graph } from '@dagrejs/graphlib';

winston.configure({ transports: [new winston.transports.Console()], format: winston.format.cli() });

const enhancerName = 'InterchangeOrderMetadataEnhancer';

interface Edge {
  target: string;
  isRequired: boolean;
}

interface Dependency {
  vertex: string;
  edges: Edge[];
}

function getDependencies(entity: TopLevelEntity, includeExtensions: boolean, parentIsRequired: boolean = true): Edge[] {
  if (!includeExtensions && entity.namespace.isExtension) return [];

  const result: Edge[] = [];

  if (entity.baseEntity != null) result.push({ target: entity.baseEntity.metaEdName, isRequired: true });
  if (entity.baseEntity != null) result.push(...getDependencies(entity.baseEntity, includeExtensions));

  const referenceProperties: ReferentialProperty[] = entity.properties
    .filter((property: EntityProperty) => isReferentialProperty(property))
    .map((property: EntityProperty) => asReferentialProperty(property));

  if (referenceProperties.length === 0) return result;

  const otherProperties: ReferentialProperty[] = [];
  const choiceProperties: ChoiceProperty[] = [];
  const inlineCommonProperties: InlineCommonProperty[] = [];

  referenceProperties.forEach((property: ReferentialProperty) => {
    if (property.type === 'choice') choiceProperties.push(asChoiceProperty(property));
    else if (property.type === 'inlineCommon') inlineCommonProperties.push(asInlineCommonProperty(property));
    else otherProperties.push(property);
  });

  otherProperties.forEach((property: ReferentialProperty) =>
    result.push({
      target: property.referencedEntity.metaEdName,
      isRequired: parentIsRequired && (property.isRequired || property.isRequiredCollection),
    }),
  );
  choiceProperties.forEach((property: ChoiceProperty) =>
    result.push(...getDependencies(property.referencedEntity, includeExtensions, false)),
  );
  inlineCommonProperties.forEach((property: InlineCommonProperty) =>
    result.push(
      ...getDependencies(
        property.referencedEntity,
        includeExtensions,
        parentIsRequired && (property.isRequired || property.isRequiredCollection),
      ),
    ),
  );

  return sortWith([prop('target'), prop('isRequired')])(result);
}

function addDependenciesToGraph(graph: Graph, elementDependencies: Dependency[]): Graph {
  elementDependencies.forEach((dependency: Dependency) => {
    if (dependency.edges.length === 0) graph.setNode(dependency.vertex);
    else
      uniq(dependency.edges).forEach((edge: Edge) =>
        graph.setEdge(dependency.vertex, edge.target, { isRequired: edge.isRequired }),
      );
  });

  return graph;
}

export function sortGraph(graph: Graph, removeRequiredCycles: boolean = false): string[] {
  if (graphlib.alg.isAcyclic(graph)) return graphlib.alg.topsort(graph);

  graphlib.alg.findCycles(graph).forEach((cycle) => {
    cycle.reverse().forEach((vertex) => {
      if (graphlib.alg.isAcyclic(graph)) return;

      graph.outEdges(vertex).forEach((edge) => {
        if (graphlib.alg.isAcyclic(graph)) return;

        if (!graph.edge(edge).isRequired || removeRequiredCycles) graph.removeEdge(edge);
      });
    });
  });

  // Unable to sort after removing all optional edges, try again and remove required edges
  if (!graphlib.alg.isAcyclic(graph) && !removeRequiredCycles) sortGraph(graph, true);

  if (graphlib.alg.isAcyclic(graph)) return graphlib.alg.topsort(graph);

  winston.error('Unable to sort interchange metadata');
  return [];
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const entityGraph: Graph = new Graph();
    const interchangeGraph: Graph = new Graph();
    const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
    if (edFiXsdEntityRepository == null) return;

    edFiXsdEntityRepository.mergedInterchange.forEach((mergedInterchange: MergedInterchange) => {
      if (mergedInterchange.namespace.namespaceName !== namespace.namespaceName) return;

      const elementDependencies: Dependency[] = mergedInterchange.elements.map((element: InterchangeItem) => ({
        vertex: element.referencedEntity.metaEdName,
        edges: getDependencies(element.referencedEntity, mergedInterchange.namespace.isExtension).filter(
          (edge: Edge) => element.referencedEntity.metaEdName !== edge.target,
        ),
      }));
      addDependenciesToGraph(entityGraph, elementDependencies);

      const interchangeDependencies: Dependency = {
        vertex: mergedInterchange.metaEdName,
        edges: Array.from(edFiXsdEntityRepository.mergedInterchange.values())
          .filter(
            (interchange: MergedInterchange) =>
              mergedInterchange.metaEdName !== interchange.metaEdName &&
              interchange.elements.some((element: InterchangeItem) =>
                elementDependencies.some((dependency: Dependency) =>
                  dependency.edges.some((edge: Edge) => edge.target === element.referencedEntity.metaEdName),
                ),
              ),
          )
          .map(
            (interchange: MergedInterchange): Edge => ({
              target: interchange.metaEdName,
              isRequired: interchange.elements.some((element: InterchangeItem) =>
                elementDependencies.some((dependency: Dependency) =>
                  dependency.edges.some(
                    (edge: Edge) => edge.target === element.referencedEntity.metaEdName && edge.isRequired,
                  ),
                ),
              ),
            }),
          ),
      };
      addDependenciesToGraph(interchangeGraph, [interchangeDependencies]);
    });

    const sortedEntities: { name: string; globalDependencyOrder: number }[] = sortGraph(entityGraph)
      .reverse()
      .map((name: string, index: number) => ({ name, globalDependencyOrder: index + 1 }));

    const sortedInterchanges: { name: string; apiOrder: number }[] = sortGraph(interchangeGraph)
      .reverse()
      .map((name: string, index: number) => ({ name, apiOrder: (index + 1) * 10 }));

    sortedInterchanges.forEach((sortedInterchange: { name: string; apiOrder: number }) => {
      const interchange: MergedInterchange | undefined = Array.from(edFiXsdEntityRepository.mergedInterchange.values()).find(
        (mergedInterchange: MergedInterchange) =>
          mergedInterchange.metaEdName === sortedInterchange.name &&
          mergedInterchange.namespace.namespaceName === namespace.namespaceName,
      );

      if (interchange == null) return;

      interchange.data.edfiOdsApi.apiOrder = sortedInterchange.apiOrder;
      interchange.data.edfiOdsApi.apiOrderedElements = sortedEntities
        .map((entity) => ({
          element:
            interchange.elements.find((element) => element.referencedEntity.metaEdName === entity.name) || NoInterchangeItem,
          globalDependencyOrder: entity.globalDependencyOrder,
        }))
        .filter((entity) => entity.element != null && entity.element !== NoInterchangeItem)
        .map((entity) => ({ name: entity.element.metaEdName, globalDependencyOrder: entity.globalDependencyOrder }));
    });
  });

  return {
    enhancerName,
    success: true,
  };
}
