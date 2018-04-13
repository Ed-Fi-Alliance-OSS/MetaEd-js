// @flow
import { newMetaEdEnvironment, newNamespaceInfo, NoNamespaceInfo } from 'metaed-core';
import type { MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { enhance } from '../../../src/diminisher/domainMetadata/AbstractGeneralStudentProgramAssociationDiminisher';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { EntityTable } from '../../../src/model/domainMetadata/EntityTable';
import type { NamespaceInfoEdfiOdsApi } from '../../../src/model/NamespaceInfo';

describe('when diminishing with no matching entity tables', () => {
  const entityName: string = 'EntityName';
  const namespace: string = 'edfi';

  let aggregate: Aggregate = NoAggregate;
  let namespaceInfo: NamespaceInfo = NoNamespaceInfo;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    aggregate = {
      root: entityName,
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: entityName,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: 'edfi',
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    namespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    enhance(metaEd);
  });

  it('should not change aggregates in namespace', () => {
    const aggregates = ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates;
    expect(aggregates).toHaveLength(1);
    expect(aggregates[0]).toBe(aggregate);
    expect(aggregates[0].entityTables[0].isAbstract).toBe(false);
  });
});

describe('when diminishing with matching entity tables', () => {
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  const entityName3: string = 'EntityName3';
  const generalStudentProgramAssociation: string = 'GeneralStudentProgramAssociation';
  const studentProgramAssociation: string = 'StudentProgramAssociation';
  const namespace: string = 'edfi';

  let generalStudentProgramAssociationAggregate: Aggregate = NoAggregate;
  let studentProgramAssociationAggregate: Aggregate = NoAggregate;
  let aggregate3: Aggregate = NoAggregate;
  let namespaceInfo: NamespaceInfo = NoNamespaceInfo;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.dataStandardVersion = '3.0.0';

    generalStudentProgramAssociationAggregate = {
      root: generalStudentProgramAssociation,
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: generalStudentProgramAssociation,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
        {
          table: entityName1,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    studentProgramAssociationAggregate = {
      root: studentProgramAssociation,
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: studentProgramAssociation,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
        {
          table: entityName2,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    aggregate3 = {
      root: entityName3,
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: studentProgramAssociation,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
        {
          table: entityName2,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespace,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    namespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      data: {
        edfiOdsApi: {
          aggregates: [generalStudentProgramAssociationAggregate, studentProgramAssociationAggregate, aggregate3],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    enhance(metaEd);
  });

  it('should only set GeneralStudentProgramAssociation isAbstract', () => {
    const abstractEntityTables = ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates
      .map((aggregate: Aggregate) => aggregate.entityTables)
      .reduce((accumulator: Array<EntityTable>, entityTables: Array<EntityTable>) => accumulator.concat(entityTables))
      .filter((entityTable: EntityTable) => entityTable.isAbstract === true);
    expect(abstractEntityTables).toHaveLength(1);
    expect(abstractEntityTables[0].isAbstract).toBe(true);
  });
});
