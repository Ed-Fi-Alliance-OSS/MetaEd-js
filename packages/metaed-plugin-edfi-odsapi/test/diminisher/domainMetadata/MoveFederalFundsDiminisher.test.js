// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newNamespaceInfo, NoNamespaceInfo } from 'metaed-core';
import type { MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { enhance } from '../../../src/diminisher/domainMetadata/MoveFederalFundsDiminisher';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
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

    metaEd.entity.namespaceInfo.set(namespace, namespaceInfo);
    enhance(metaEd);
  });

  it('should not change aggregates in namespace', () => {
    const aggregates = ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates;
    expect(aggregates).toHaveLength(1);
    expect(aggregates[0]).toBe(aggregate);
  });
});

describe('when diminishing with matching entity tables', () => {
  const entityName1: string = 'EntityName1';
  const entityName2: string = 'EntityName2';
  const localEducationAgencyFederalFunds: string = 'LocalEducationAgencyFederalFunds';
  const stateEducationAgencyFederalFunds: string = 'StateEducationAgencyFederalFunds';
  const namespace: string = 'edfi';

  let aggregate1: Aggregate = NoAggregate;
  let aggregate2: Aggregate = NoAggregate;
  let namespaceInfo: NamespaceInfo = NoNamespaceInfo;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.dataStandardVersion = '2.0.0';

    aggregate1 = {
      root: entityName1,
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: entityName1,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: 'edfi',
          hasIsA: false,
          requiresSchema: false,
        },
        {
          table: localEducationAgencyFederalFunds,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: 'edfi',
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    aggregate2 = {
      root: entityName2,
      schema: namespace,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: entityName2,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: 'edfi',
          hasIsA: false,
          requiresSchema: false,
        },
        {
          table: stateEducationAgencyFederalFunds,
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
          aggregates: [aggregate1, aggregate2],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    enhance(metaEd);
  });

  it('should remove matching entity tables', () => {
    expect(aggregate1.entityTables).toHaveLength(1);
    expect(aggregate1.entityTables[0].table).toBe(entityName1);
    expect(aggregate2.entityTables).toHaveLength(1);
    expect(aggregate2.entityTables[0].table).toBe(entityName2);
  });

  it('should add fake aggregates', () => {
    const aggregates = ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates;
    expect(aggregates).toHaveLength(4);

    const localEducationAgencyFederalFundsAggregate: Aggregate = R.head(
      aggregates.filter((a: Aggregate) => a.root === localEducationAgencyFederalFunds),
    );
    expect(localEducationAgencyFederalFundsAggregate).toBeDefined();
    expect(localEducationAgencyFederalFundsAggregate.isExtension).toBe(false);
    expect(localEducationAgencyFederalFundsAggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(localEducationAgencyFederalFundsAggregate.entityTables).toHaveLength(1);
    expect(localEducationAgencyFederalFundsAggregate.entityTables[0].table).toBe(localEducationAgencyFederalFunds);

    const stateEducationAgencyFederalFundsAggregate: Aggregate = R.head(
      aggregates.filter((a: Aggregate) => a.root === stateEducationAgencyFederalFunds),
    );
    expect(stateEducationAgencyFederalFundsAggregate).toBeDefined();
    expect(stateEducationAgencyFederalFundsAggregate.isExtension).toBe(false);
    expect(stateEducationAgencyFederalFundsAggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(stateEducationAgencyFederalFundsAggregate.entityTables).toHaveLength(1);
    expect(stateEducationAgencyFederalFundsAggregate.entityTables[0].table).toBe(stateEducationAgencyFederalFunds);
  });
});
