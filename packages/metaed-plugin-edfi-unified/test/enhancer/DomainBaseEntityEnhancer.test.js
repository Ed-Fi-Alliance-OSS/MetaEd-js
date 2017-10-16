// @flow
import {
  newMetaEdEnvironment,
  newDomain,
  newSubdomain,
  newDomainItem,
  newDomainEntity,
  newDomainEntitySubclass,
  newAssociation,
  newAssociationSubclass,
  addEntity,
} from '../../../metaed-core/index';

import type {
  MetaEdEnvironment,
  Domain,
  Subdomain,
  DomainEntity,
  DomainEntitySubclass,
  Association,
  AssociationSubclass,
} from '../../../metaed-core/index';

import { enhance } from '../../src/enhancer/DomainBaseEntityEnhancer';

describe('when enhancing domain', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const domainEntity1MetaEdName = 'DomainEntity1Name';
  const domainEntity2MetaEdName = 'DomainEntity2Name';

  const domainEntitySubclass1MetaEdName = 'DomainEntitySubclass1Name';
  const domainEntitySubclass2MetaEdName = 'DomainEntitySubclass2Name';

  const association1MetaEdName = 'Association1Name';
  const association2MetaEdName = 'Association2Name';

  const associationSubclass1MetaEdName = 'AssociationSubclass1Name';
  const associationSubclass2MetaEdName = 'AssociationSubclass2Name';

  const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity1MetaEdName });
  const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity2MetaEdName });

  const domainEntitySubclass1: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), { metaEdName: domainEntitySubclass1MetaEdName });
  const domainEntitySubclass2: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), { metaEdName: domainEntitySubclass2MetaEdName });

  const association1: Association = Object.assign(newAssociation(), { metaEdName: association1MetaEdName });
  const association2: Association = Object.assign(newAssociation(), { metaEdName: association2MetaEdName });

  const associationSubclass1: AssociationSubclass = Object.assign(newAssociationSubclass(), { metaEdName: associationSubclass1MetaEdName });
  const associationSubclass2: AssociationSubclass = Object.assign(newAssociationSubclass(), { metaEdName: associationSubclass2MetaEdName });

  const domainMetaEdName = 'domainMetaEdName';

  beforeAll(() => {
    const domain: Domain = Object.assign(newDomain(), { metaEdName: domainMetaEdName });
    addEntity(metaEd.entity, domain);
    addEntity(metaEd.entity, domainEntity1);
    addEntity(metaEd.entity, domainEntity2);
    addEntity(metaEd.entity, domainEntitySubclass1);
    addEntity(metaEd.entity, domainEntitySubclass2);
    addEntity(metaEd.entity, association1);
    addEntity(metaEd.entity, association2);
    addEntity(metaEd.entity, associationSubclass1);
    addEntity(metaEd.entity, associationSubclass2);

    domain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: domainEntity1MetaEdName }));
    domain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: domainEntity2MetaEdName }));
    domain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: domainEntitySubclass1MetaEdName }));
    domain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: domainEntitySubclass2MetaEdName }));
    domain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: association1MetaEdName }));
    domain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: association2MetaEdName }));
    domain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: associationSubclass1MetaEdName }));
    domain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: associationSubclass2MetaEdName }));

    enhance(metaEd);
  });

  it('should have references to domain entities', () => {
    const domain: any = metaEd.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(domainEntity1);
    expect(domain.entities).toContain(domainEntity2);
  });

  it('should have references to domain subclasses', () => {
    const domain: any = metaEd.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(domainEntitySubclass1);
    expect(domain.entities).toContain(domainEntitySubclass2);
  });

  it('should have references to associations', () => {
    const domain: any = metaEd.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(association1);
    expect(domain.entities).toContain(association2);
  });

  it('should have references to association subclasses', () => {
    const domain: any = metaEd.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(associationSubclass1);
    expect(domain.entities).toContain(associationSubclass2);
  });
});

describe('when enhancing subdomain', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  const domainEntity1MetaEdName = 'DomainEntity1Name';
  const domainEntity2MetaEdName = 'DomainEntity2Name';

  const domainEntitySubclass1MetaEdName = 'DomainEntitySubclass1Name';
  const domainEntitySubclass2MetaEdName = 'DomainEntitySubclass2Name';

  const association1MetaEdName = 'Association1Name';
  const association2MetaEdName = 'Association2Name';

  const associationSubclass1MetaEdName = 'AssociationSubclass1Name';
  const associationSubclass2MetaEdName = 'AssociationSubclass2Name';

  const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity1MetaEdName });
  const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity2MetaEdName });

  const domainEntitySubclass1: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), { metaEdName: domainEntitySubclass1MetaEdName });
  const domainEntitySubclass2: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), { metaEdName: domainEntitySubclass2MetaEdName });

  const association1: Association = Object.assign(newAssociation(), { metaEdName: association1MetaEdName });
  const association2: Association = Object.assign(newAssociation(), { metaEdName: association2MetaEdName });

  const associationSubclass1: AssociationSubclass = Object.assign(newAssociationSubclass(), { metaEdName: associationSubclass1MetaEdName });
  const associationSubclass2: AssociationSubclass = Object.assign(newAssociationSubclass(), { metaEdName: associationSubclass2MetaEdName });

  const subdomainMetaEdName = 'domainMetaEdName';

  beforeAll(() => {
    const subdomain: Subdomain = Object.assign(newSubdomain(), { metaEdName: subdomainMetaEdName });
    addEntity(metaEd.entity, subdomain);
    addEntity(metaEd.entity, domainEntity1);
    addEntity(metaEd.entity, domainEntity2);
    addEntity(metaEd.entity, domainEntitySubclass1);
    addEntity(metaEd.entity, domainEntitySubclass2);
    addEntity(metaEd.entity, association1);
    addEntity(metaEd.entity, association2);
    addEntity(metaEd.entity, associationSubclass1);
    addEntity(metaEd.entity, associationSubclass2);

    subdomain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: domainEntity1MetaEdName }));
    subdomain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: domainEntity2MetaEdName }));
    subdomain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: domainEntitySubclass1MetaEdName }));
    subdomain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: domainEntitySubclass2MetaEdName }));
    subdomain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: association1MetaEdName }));
    subdomain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: association2MetaEdName }));
    subdomain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: associationSubclass1MetaEdName }));
    subdomain.domainItems.push(Object.assign(newDomainItem(), { metaEdName: associationSubclass2MetaEdName }));

    enhance(metaEd);
  });

  it('should have references to domain entities', () => {
    const subdomain: any = metaEd.entity.subdomain.get(subdomainMetaEdName);
    expect(subdomain.entities).toContain(domainEntity1);
    expect(subdomain.entities).toContain(domainEntity2);
  });

  it('should have references to domain subclasses', () => {
    const subdomain: any = metaEd.entity.subdomain.get(subdomainMetaEdName);
    expect(subdomain.entities).toContain(domainEntitySubclass1);
    expect(subdomain.entities).toContain(domainEntitySubclass2);
  });

  it('should have references to associations', () => {
    const subdomain: any = metaEd.entity.subdomain.get(subdomainMetaEdName);
    expect(subdomain.entities).toContain(association1);
    expect(subdomain.entities).toContain(association2);
  });

  it('should have references to association subclasses', () => {
    const subdomain: any = metaEd.entity.subdomain.get(subdomainMetaEdName);
    expect(subdomain.entities).toContain(associationSubclass1);
    expect(subdomain.entities).toContain(associationSubclass2);
  });
});
