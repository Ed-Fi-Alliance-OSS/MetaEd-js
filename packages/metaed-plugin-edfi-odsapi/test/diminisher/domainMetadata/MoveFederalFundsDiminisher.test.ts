import * as R from 'ramda';
import { newMetaEdEnvironment, newNamespace, NoNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../../src/diminisher/domainMetadata/MoveFederalFundsDiminisher';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import { NamespaceEdfiOdsApi } from '../../../src/model/Namespace';

describe('when diminishing with no matching entity tables', (): void => {
  const entityName = 'EntityName';
  const namespaceName = 'EdFi';

  let aggregate: Aggregate = NoAggregate;
  let namespace: Namespace = NoNamespace;

  beforeAll(() => {
    namespace = {
      ...newNamespace(),
      namespaceName,
    };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    metaEd.dataStandardVersion = '2.0.0';

    aggregate = {
      root: entityName,
      schema: namespaceName,
      allowPrimaryKeyUpdates: false,
      isExtension: false,
      entityTables: [
        {
          table: entityName,
          isA: null,
          isAbstract: false,
          isRequiredCollection: false,
          schema: namespaceName,
          hasIsA: false,
          requiresSchema: false,
        },
      ],
    };

    Object.assign(namespace, {
      data: {
        edfiOdsApi: {
          aggregates: [aggregate],
        },
      },
    });

    enhance(metaEd);
  });

  it('should not change aggregates in namespace', (): void => {
    const { aggregates } = namespace.data.edfiOdsApi as NamespaceEdfiOdsApi;
    expect(aggregates).toHaveLength(1);
    expect(aggregates[0]).toBe(aggregate);
  });
});

describe('when diminishing with matching entity tables', (): void => {
  const entityName1 = 'EntityName1';
  const entityName2 = 'EntityName2';
  const localEducationAgencyFederalFunds = 'LocalEducationAgencyFederalFunds';
  const stateEducationAgencyFederalFunds = 'StateEducationAgencyFederalFunds';
  const namespaceName = 'EdFi';

  let aggregate1: Aggregate = NoAggregate;
  let aggregate2: Aggregate = NoAggregate;
  let namespace: Namespace = NoNamespace;

  beforeAll(() => {
    namespace = {
      ...newNamespace(),
      namespaceName,
    };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    metaEd.dataStandardVersion = '2.0.0';

    aggregate1 = {
      root: entityName1,
      schema: namespaceName,
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
      schema: namespaceName,
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

    Object.assign(namespace, {
      data: {
        edfiOdsApi: {
          aggregates: [aggregate1, aggregate2],
        },
      },
    });

    enhance(metaEd);
  });

  it('should remove matching entity tables', (): void => {
    expect(aggregate1.entityTables).toHaveLength(1);
    expect(aggregate1.entityTables[0].table).toBe(entityName1);
    expect(aggregate2.entityTables).toHaveLength(1);
    expect(aggregate2.entityTables[0].table).toBe(entityName2);
  });

  it('should add fake aggregates', (): void => {
    const { aggregates } = namespace.data.edfiOdsApi as NamespaceEdfiOdsApi;
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
