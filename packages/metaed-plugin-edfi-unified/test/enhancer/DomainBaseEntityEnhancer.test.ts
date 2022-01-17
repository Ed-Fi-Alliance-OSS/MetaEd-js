import {
  newMetaEdEnvironment,
  newDomain,
  newSubdomain,
  newDomainItem,
  newDomainEntity,
  newDomainEntitySubclass,
  newAssociation,
  newAssociationSubclass,
  addEntityForNamespace,
  newNamespace,
} from '@edfi/metaed-core';

import {
  MetaEdEnvironment,
  Domain,
  Subdomain,
  DomainEntity,
  DomainEntitySubclass,
  Association,
  AssociationSubclass,
  Namespace,
} from '@edfi/metaed-core';

import { enhance } from '../../src/enhancer/DomainBaseEntityEnhancer';

describe('when enhancing domain', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);

  const domainEntity1MetaEdName = 'DomainEntity1Name';
  const domainEntity2MetaEdName = 'DomainEntity2Name';

  const domainEntitySubclass1MetaEdName = 'DomainEntitySubclass1Name';
  const domainEntitySubclass2MetaEdName = 'DomainEntitySubclass2Name';

  const association1MetaEdName = 'Association1Name';
  const association2MetaEdName = 'Association2Name';

  const associationSubclass1MetaEdName = 'AssociationSubclass1Name';
  const associationSubclass2MetaEdName = 'AssociationSubclass2Name';

  const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity1MetaEdName, namespace });
  const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity2MetaEdName, namespace });

  const domainEntitySubclass1: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
    metaEdName: domainEntitySubclass1MetaEdName,
    namespace,
  });
  const domainEntitySubclass2: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
    metaEdName: domainEntitySubclass2MetaEdName,
    namespace,
  });

  const association1: Association = Object.assign(newAssociation(), { metaEdName: association1MetaEdName, namespace });
  const association2: Association = Object.assign(newAssociation(), { metaEdName: association2MetaEdName, namespace });

  const associationSubclass1: AssociationSubclass = Object.assign(newAssociationSubclass(), {
    metaEdName: associationSubclass1MetaEdName,
    namespace,
  });
  const associationSubclass2: AssociationSubclass = Object.assign(newAssociationSubclass(), {
    metaEdName: associationSubclass2MetaEdName,
    namespace,
  });

  const domainMetaEdName = 'domainMetaEdName';

  beforeAll(() => {
    const domain: Domain = Object.assign(newDomain(), { metaEdName: domainMetaEdName, namespace });
    addEntityForNamespace(domain);
    addEntityForNamespace(domainEntity1);
    addEntityForNamespace(domainEntity2);
    addEntityForNamespace(domainEntitySubclass1);
    addEntityForNamespace(domainEntitySubclass2);
    addEntityForNamespace(association1);
    addEntityForNamespace(association2);
    addEntityForNamespace(associationSubclass1);
    addEntityForNamespace(associationSubclass2);

    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntity1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntity2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntitySubclass1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntitySubclass2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: association1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: association2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: associationSubclass1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: associationSubclass2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );

    enhance(metaEd);
  });

  it('should have references to domain entities', (): void => {
    const domain: any = namespace.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(domainEntity1);
    expect(domain.entities).toContain(domainEntity2);

    expect(domain.domainItems[0].referencedEntity).toBe(domainEntity1);
    expect(domain.domainItems[1].referencedEntity).toBe(domainEntity2);
  });

  it('should have references to domain subclasses', (): void => {
    const domain: any = namespace.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(domainEntitySubclass1);
    expect(domain.entities).toContain(domainEntitySubclass2);

    expect(domain.domainItems[2].referencedEntity).toBe(domainEntitySubclass1);
    expect(domain.domainItems[3].referencedEntity).toBe(domainEntitySubclass2);
  });

  it('should have references to associations', (): void => {
    const domain: any = namespace.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(association1);
    expect(domain.entities).toContain(association2);

    expect(domain.domainItems[4].referencedEntity).toBe(association1);
    expect(domain.domainItems[5].referencedEntity).toBe(association2);
  });

  it('should have references to association subclasses', (): void => {
    const domain: any = namespace.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(associationSubclass1);
    expect(domain.entities).toContain(associationSubclass2);

    expect(domain.domainItems[6].referencedEntity).toBe(associationSubclass1);
    expect(domain.domainItems[7].referencedEntity).toBe(associationSubclass2);
  });
});

describe('when enhancing domain with reference to deprecated domain entity', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);

  const domainEntity1MetaEdName = 'DomainEntity1Name';
  const domainEntity2MetaEdName = 'DomainEntity2Name';

  const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: domainEntity1MetaEdName,
    namespace,
    isDeprecated: true,
  });
  const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
    metaEdName: domainEntity2MetaEdName,
    namespace,
    isDeprecated: false,
  });

  const domainMetaEdName = 'domainMetaEdName';

  beforeAll(() => {
    const domain: Domain = Object.assign(newDomain(), { metaEdName: domainMetaEdName, namespace });
    addEntityForNamespace(domain);
    addEntityForNamespace(domainEntity1);
    addEntityForNamespace(domainEntity2);

    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntity1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntity2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    enhance(metaEd);
  });

  it('should have references to domain entities', (): void => {
    const domain: any = namespace.entity.domain.get(domainMetaEdName);

    expect(domain.domainItems[0].referencedEntityDeprecated).toBe(true);
    expect(domain.domainItems[1].referencedEntityDeprecated).toBe(false);
  });
});

describe('when enhancing domain with references across namespaces', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  metaEd.namespace.set(namespace.namespaceName, namespace);

  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

  const domainEntity1MetaEdName = 'DomainEntity1Name';
  const domainEntity2MetaEdName = 'DomainEntity2Name';

  const domainEntitySubclass1MetaEdName = 'DomainEntitySubclass1Name';
  const domainEntitySubclass2MetaEdName = 'DomainEntitySubclass2Name';

  const association1MetaEdName = 'Association1Name';
  const association2MetaEdName = 'Association2Name';

  const associationSubclass1MetaEdName = 'AssociationSubclass1Name';
  const associationSubclass2MetaEdName = 'AssociationSubclass2Name';

  const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity1MetaEdName, namespace });
  const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity2MetaEdName, namespace });

  const domainEntitySubclass1: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
    metaEdName: domainEntitySubclass1MetaEdName,
    namespace,
  });
  const domainEntitySubclass2: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
    metaEdName: domainEntitySubclass2MetaEdName,
    namespace,
  });

  const association1: Association = Object.assign(newAssociation(), { metaEdName: association1MetaEdName, namespace });
  const association2: Association = Object.assign(newAssociation(), { metaEdName: association2MetaEdName, namespace });

  const associationSubclass1: AssociationSubclass = Object.assign(newAssociationSubclass(), {
    metaEdName: associationSubclass1MetaEdName,
    namespace,
  });
  const associationSubclass2: AssociationSubclass = Object.assign(newAssociationSubclass(), {
    metaEdName: associationSubclass2MetaEdName,
    namespace,
  });

  const domainMetaEdName = 'domainMetaEdName';

  beforeAll(() => {
    const domain: Domain = Object.assign(newDomain(), { metaEdName: domainMetaEdName, namespace: extensionNamespace });
    addEntityForNamespace(domain);
    addEntityForNamespace(domainEntity1);
    addEntityForNamespace(domainEntity2);
    addEntityForNamespace(domainEntitySubclass1);
    addEntityForNamespace(domainEntitySubclass2);
    addEntityForNamespace(association1);
    addEntityForNamespace(association2);
    addEntityForNamespace(associationSubclass1);
    addEntityForNamespace(associationSubclass2);

    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntity1MetaEdName,
        namespace: extensionNamespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntity2MetaEdName,
        namespace: extensionNamespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntitySubclass1MetaEdName,
        namespace: extensionNamespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntitySubclass2MetaEdName,
        namespace: extensionNamespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: association1MetaEdName,
        namespace: extensionNamespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: association2MetaEdName,
        namespace: extensionNamespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: associationSubclass1MetaEdName,
        namespace: extensionNamespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    domain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: associationSubclass2MetaEdName,
        namespace: extensionNamespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );

    enhance(metaEd);
  });

  it('should have references to domain entities', (): void => {
    const domain: any = extensionNamespace.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(domainEntity1);
    expect(domain.entities).toContain(domainEntity2);
  });

  it('should have references to domain subclasses', (): void => {
    const domain: any = extensionNamespace.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(domainEntitySubclass1);
    expect(domain.entities).toContain(domainEntitySubclass2);
  });

  it('should have references to associations', (): void => {
    const domain: any = extensionNamespace.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(association1);
    expect(domain.entities).toContain(association2);
  });

  it('should have references to association subclasses', (): void => {
    const domain: any = extensionNamespace.entity.domain.get(domainMetaEdName);
    expect(domain.entities).toContain(associationSubclass1);
    expect(domain.entities).toContain(associationSubclass2);
  });
});

describe('when enhancing subdomain', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);

  const domainEntity1MetaEdName = 'DomainEntity1Name';
  const domainEntity2MetaEdName = 'DomainEntity2Name';

  const domainEntitySubclass1MetaEdName = 'DomainEntitySubclass1Name';
  const domainEntitySubclass2MetaEdName = 'DomainEntitySubclass2Name';

  const association1MetaEdName = 'Association1Name';
  const association2MetaEdName = 'Association2Name';

  const associationSubclass1MetaEdName = 'AssociationSubclass1Name';
  const associationSubclass2MetaEdName = 'AssociationSubclass2Name';

  const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity1MetaEdName, namespace });
  const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), { metaEdName: domainEntity2MetaEdName, namespace });

  const domainEntitySubclass1: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
    metaEdName: domainEntitySubclass1MetaEdName,
    namespace,
  });
  const domainEntitySubclass2: DomainEntitySubclass = Object.assign(newDomainEntitySubclass(), {
    metaEdName: domainEntitySubclass2MetaEdName,
    namespace,
  });

  const association1: Association = Object.assign(newAssociation(), { metaEdName: association1MetaEdName, namespace });
  const association2: Association = Object.assign(newAssociation(), { metaEdName: association2MetaEdName, namespace });

  const associationSubclass1: AssociationSubclass = Object.assign(newAssociationSubclass(), {
    metaEdName: associationSubclass1MetaEdName,
    namespace,
  });
  const associationSubclass2: AssociationSubclass = Object.assign(newAssociationSubclass(), {
    metaEdName: associationSubclass2MetaEdName,
    namespace,
  });

  const subdomainMetaEdName = 'domainMetaEdName';

  beforeAll(() => {
    const subdomain: Subdomain = Object.assign(newSubdomain(), { metaEdName: subdomainMetaEdName, namespace });
    addEntityForNamespace(subdomain);
    addEntityForNamespace(domainEntity1);
    addEntityForNamespace(domainEntity2);
    addEntityForNamespace(domainEntitySubclass1);
    addEntityForNamespace(domainEntitySubclass2);
    addEntityForNamespace(association1);
    addEntityForNamespace(association2);
    addEntityForNamespace(associationSubclass1);
    addEntityForNamespace(associationSubclass2);

    subdomain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntity1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    subdomain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntity2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    subdomain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntitySubclass1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    subdomain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: domainEntitySubclass2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    subdomain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: association1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    subdomain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: association2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    subdomain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: associationSubclass1MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );
    subdomain.domainItems.push(
      Object.assign(newDomainItem(), {
        metaEdName: associationSubclass2MetaEdName,
        namespace,
        referencedNamespaceName: namespace.namespaceName,
      }),
    );

    enhance(metaEd);
  });

  it('should have references to domain entities', (): void => {
    const subdomain: any = namespace.entity.subdomain.get(subdomainMetaEdName);
    expect(subdomain.entities).toContain(domainEntity1);
    expect(subdomain.entities).toContain(domainEntity2);
  });

  it('should have references to domain subclasses', (): void => {
    const subdomain: any = namespace.entity.subdomain.get(subdomainMetaEdName);
    expect(subdomain.entities).toContain(domainEntitySubclass1);
    expect(subdomain.entities).toContain(domainEntitySubclass2);
  });

  it('should have references to associations', (): void => {
    const subdomain: any = namespace.entity.subdomain.get(subdomainMetaEdName);
    expect(subdomain.entities).toContain(association1);
    expect(subdomain.entities).toContain(association2);
  });

  it('should have references to association subclasses', (): void => {
    const subdomain: any = namespace.entity.subdomain.get(subdomainMetaEdName);
    expect(subdomain.entities).toContain(associationSubclass1);
    expect(subdomain.entities).toContain(associationSubclass2);
  });
});
