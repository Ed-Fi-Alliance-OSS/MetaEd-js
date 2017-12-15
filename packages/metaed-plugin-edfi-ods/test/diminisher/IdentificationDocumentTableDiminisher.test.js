// @flow
import R from 'ramda';
import type { DomainEntity, MetaEdEnvironment } from 'metaed-core';
import { newDomainEntity, newMetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/IdentificationDocumentTableDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when IdentificationDocumentTableDiminisher diminishes matching table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  const identificationDocument: string = 'IdentificationDocument';
  let identificationDocumentTable: Table;

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    identificationDocumentTable = Object.assign(newTable(), {
      name: `${domainEntityName}Schema${identificationDocument}`,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          parentTableName: `${domainEntityName}Schema${identificationDocument}`,
        }),
        Object.assign(newForeignKey(), {
          parentTableName: `${domainEntityName}Schema${identificationDocument}`,
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(identificationDocumentTable.name, identificationDocumentTable);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_Tables: [
            identificationDocumentTable,
          ],
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should rename table in repository', () => {
    const table: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(`${domainEntityName}Schema${identificationDocument}`);
    expect(table).toBeUndefined();

    const targetTable: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityName + identificationDocument);
    expect(targetTable).toBeDefined();
    expect(targetTable).toBe(identificationDocumentTable);
  });

  it('should rename table in the domain entity ods tables', () => {
    const odsTables: Table = (metaEd.entity.domainEntity.get(domainEntityName): any).data.edfiOds.ods_Tables;
    expect(odsTables).toHaveLength(1);
    expect(R.head(odsTables)).toBe(identificationDocumentTable);
  });

  it('should update foreign key parent table name', () => {
    const foreignKeys: Array<ForeignKey> = (metaEd.plugin.get('edfiOds'): any).entity.table
      .get(domainEntityName + identificationDocument).foreignKeys;
    expect(foreignKeys.every(fk => fk.parentTableName === domainEntityName + identificationDocument)).toBe(true);
  });
});

describe('when IdentificationDocumentTableDiminisher diminishes multiple matching tables', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  const identificationDocument: string = 'IdentificationDocument';
  let identificationDocumentTable1: Table;
  let identificationDocumentTable2: Table;

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    identificationDocumentTable1 = Object.assign(newTable(), {
      name: `${domainEntityName}Schema${identificationDocument}`,
    });
    pluginEnvironment(metaEd).entity.table.set(identificationDocumentTable1.name, identificationDocumentTable1);
    identificationDocumentTable2 = Object.assign(newTable(), {
      name: `${domainEntityName}OtherSchema${identificationDocument}`,
    });
    pluginEnvironment(metaEd).entity.table.set(identificationDocumentTable2.name, identificationDocumentTable2);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_Tables: [
            identificationDocumentTable1,
            identificationDocumentTable2,
          ],
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should rename tables in repository', () => {
    const table1: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(`${domainEntityName}Schema${identificationDocument}`);
    expect(table1).toBeUndefined();

    const targetTable1: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityName + identificationDocument);
    expect(targetTable1).toBeDefined();
    expect(targetTable1).toBe(identificationDocumentTable1);

    const table2: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(`${domainEntityName}OtherSchema${identificationDocument}`);
    expect(table2).toBeUndefined();
  });

  it('should rename table in the domain entity ods tables', () => {
    const odsTables: Table = (metaEd.entity.domainEntity.get(domainEntityName): any).data.edfiOds.ods_Tables;
    expect(odsTables).toHaveLength(1);
    expect(R.head(odsTables)).toBe(identificationDocumentTable1);
  });
});

describe('when IdentificationDocumentTableDiminisher diminishes non matching tables', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const domainEntityName: string = 'DomainEntityName';
  const identificationDocument: string = 'IdentificationDocument';
  let identificationDocumentTable1: Table;
  let identificationDocumentTable2: Table;

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    identificationDocumentTable1 = Object.assign(newTable(), {
      name: `${domainEntityName}Schema${identificationDocument}1`,
    });
    pluginEnvironment(metaEd).entity.table.set(identificationDocumentTable1.name, identificationDocumentTable1);
    identificationDocumentTable2 = Object.assign(newTable(), {
      name: `${domainEntityName}OtherSchema${identificationDocument}2`,
    });
    pluginEnvironment(metaEd).entity.table.set(identificationDocumentTable2.name, identificationDocumentTable2);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName,
      data: {
        edfiOds: {
          ods_Tables: [
            identificationDocumentTable1,
            identificationDocumentTable2,
          ],
        },
      },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should not modify tables in repository', () => {
    const table1: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(`${domainEntityName}Schema${identificationDocument}1`);
    expect(table1).toBeDefined();
    expect(table1).toBe(identificationDocumentTable1);

    const targetTable1: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(domainEntityName + identificationDocument);
    expect(targetTable1).toBeUndefined();

    const table2: Table = (metaEd.plugin.get('edfiOds'): any).entity.table.get(`${domainEntityName}OtherSchema${identificationDocument}2`);
    expect(table2).toBeDefined();
    expect(table2).toBe(identificationDocumentTable2);
  });

  it('should not modify table in the domain entity ods tables', () => {
    const odsTables: Table = (metaEd.entity.domainEntity.get(domainEntityName): any).data.edfiOds.ods_Tables;
    expect(odsTables).toHaveLength(2);
    expect(R.head(odsTables)).toBe(identificationDocumentTable1);
    expect(R.last(odsTables)).toBe(identificationDocumentTable2);
  });
});
