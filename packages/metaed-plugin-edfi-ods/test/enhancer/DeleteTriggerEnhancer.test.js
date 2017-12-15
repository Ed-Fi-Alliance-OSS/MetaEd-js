// @flow
import {
  addEntity,
  newAssociation,
  newAssociationSubclass,
  newDomainEntity,
  newDomainEntitySubclass,
  newMetaEdEnvironment,
  newNamespaceInfo,
} from 'metaed-core';
import type {
  Association,
  AssociationSubclass,
  DomainEntity,
  DomainEntitySubclass,
  MetaEdEnvironment,
} from 'metaed-core';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { newColumnNamePair } from '../../src/model/database/ColumnNamePair';
import { enhance } from '../../src/enhancer/DeleteTriggerEnhancer';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';

import type { Trigger } from '../../src/model/database/Trigger';
import type { Table } from '../../src/model/database/Table';


describe('when DeleteTriggerEnhancer enhances domain entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';

  beforeAll(() => {
    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
        },
      },
    });

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create a trigger', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`)).toBeDefined();
  });

  it('should have name and schema', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.name).toBe(`${entityName}_TR_DeleteEvent`);
    expect(trigger.schema).toBe(namespace);
  });

  it('should have table name and schema', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.tableName).toBe(entityName);
    expect(trigger.tableSchema).toBe(namespace);
  });

  it('should have isAfter set to true', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.isAfter).toBe(true);
  });

  it('should have onDelete set to true', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.onDelete).toBe(true);
  });

  it('should have body that matches snapshot', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.body).toMatchSnapshot();
  });
});

describe('when DeleteTriggerEnhancer enhances association', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const entityName: string = 'EntityName';

  beforeAll(() => {
    const entity: Association = Object.assign(newAssociation(), {
      metaEdName: entityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
      }),
      data: {
        edfiOds: {
          ods_TableName: entityName,
        },
      },
    });

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entity);
    enhance(metaEd);
  });

  it('should create a trigger', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`)).toBeDefined();
  });

  it('should have name and schema', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.name).toBe(`${entityName}_TR_DeleteEvent`);
    expect(trigger.schema).toBe(namespace);
  });

  it('should have table name and schema', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.tableName).toBe(entityName);
    expect(trigger.tableSchema).toBe(namespace);
  });

  it('should have isAfter set to true', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.isAfter).toBe(true);
  });

  it('should have onDelete set to true', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.onDelete).toBe(true);
  });

  it('should have body that matches snapshot', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entityName}_TR_DeleteEvent`);
    expect(trigger.body).toMatchSnapshot();
  });
});

describe('when DeleteTriggerEnhancer enhances domain entity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const entitySubclassName: string = 'EntitySubclassName';

  beforeAll(() => {
    const baseEntityName: string = 'BaseEntityName';
    const baseEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: baseEntityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
      }),
      data: {
        edfiOds: {
          ods_TableName: baseEntityName,
        },
      },
    });
    const entitySubclass: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
      metaEdName: entitySubclassName,
      baseEntity,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
      }),
      data: {
        edfiOds: {
          ods_TableName: entitySubclassName,
        },
      },
    });
    const entitySubclassTable: Table = Object.assign(newTable(), {
      foreignKeys: [
        Object.assign(newForeignKey(), {
          parentTableSchema: namespace,
          parentTableName: entitySubclassName,
          foreignTableSchema: namespace,
          foreignTableName: baseEntityName,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              foreignTableColumnName: 'PropertyName',
              parentTableColumnName: 'PropertyRename',
            }),
          ],
        }),
      ],
    });
    entitySubclass.data.edfiOds.ods_EntityTable = entitySubclassTable;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entitySubclass);
    enhance(metaEd);
  });

  it('should create a trigger', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`)).toBeDefined();
  });

  it('should have name and schema', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.name).toBe(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.schema).toBe(namespace);
  });

  it('should have table name and schema', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.tableName).toBe(entitySubclassName);
    expect(trigger.tableSchema).toBe(namespace);
  });

  it('should have isAfter set to true', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.isAfter).toBe(true);
  });

  it('should have onDelete set to true', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.onDelete).toBe(true);
  });

  it('should have body that matches snapshot', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.body).toMatchSnapshot();
  });
});

describe('when DeleteTriggerEnhancer enhances association subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: string = 'namespace';
  const entitySubclassName: string = 'EntitySubclassName';

  beforeAll(() => {
    const baseEntityName: string = 'BaseEntityName';
    const baseEntity: Association = Object.assign(newAssociation(), {
      metaEdName: baseEntityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
      }),
      data: {
        edfiOds: {
          ods_TableName: baseEntityName,
        },
      },
    });
    const entitySubclass: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: entitySubclassName,
      baseEntity,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
      }),
      data: {
        edfiOds: {
          ods_TableName: entitySubclassName,
        },
      },
    });
    const entitySubclassTable: Table = Object.assign(newTable(), {
      foreignKeys: [
        Object.assign(newForeignKey(), {
          parentTableSchema: namespace,
          parentTableName: entitySubclassName,
          foreignTableSchema: namespace,
          foreignTableName: baseEntityName,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              foreignTableColumnName: 'PropertyName1',
              parentTableColumnName: 'PropertyName1',
            }),
            Object.assign(newColumnNamePair(), {
              foreignTableColumnName: 'PropertyName2',
              parentTableColumnName: 'PropertyName2',
            }),
          ],
        }),
      ],
    });
    entitySubclass.data.edfiOds.ods_EntityTable = entitySubclassTable;

    initializeEdFiOdsEntityRepository(metaEd);
    addEntity(metaEd.entity, entitySubclass);
    enhance(metaEd);
  });

  it('should create a trigger', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.size).toBe(1);
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`)).toBeDefined();
  });

  it('should have name and schema', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.name).toBe(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.schema).toBe(namespace);
  });

  it('should have table name and schema', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.tableName).toBe(entitySubclassName);
    expect(trigger.tableSchema).toBe(namespace);
  });

  it('should have isAfter set to true', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.isAfter).toBe(true);
  });

  it('should have onDelete set to true', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.onDelete).toBe(true);
  });

  it('should have body that matches snapshot', () => {
    const trigger: Trigger = (metaEd.plugin.get('edfiOds'): any).entity.trigger.get(`${entitySubclassName}_TR_DeleteEvent`);
    expect(trigger.body).toMatchSnapshot();
  });
});
