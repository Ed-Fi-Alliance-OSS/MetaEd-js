import { newMetaEdEnvironment, newNamespace, newAssociation } from 'metaed-core';
import { MetaEdEnvironment, Namespace, Association } from 'metaed-core';
import { enhance } from '../../src/diminisher/AbstractGeneralStudentProgramAssociationDiminisher';

describe('when diminishing with no matching entity', () => {
  const entityName = 'EntityName';
  const namespaceName = 'edfi';

  let association: Association;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName };
    const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.0.0' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    association = { ...newAssociation(), namespace, metaEdName: entityName };
    namespace.entity.association.set(association.metaEdName, association);

    enhance(metaEd);
  });

  it('should not change associations in namespace', () => {
    expect(association.isAbstract).toBe(false);
  });
});

describe('when diminishing with matching entity', () => {
  const entityName = 'EntityName';
  const generalStudentProgramAssociationName = 'GeneralStudentProgramAssociation';
  const studentProgramAssociationName = 'StudentProgramAssociation';
  const namespaceName = 'edfi';

  let association1: Association;
  let association2: Association;
  let association3: Association;

  beforeAll(() => {
    const namespace: Namespace = { ...newNamespace(), namespaceName };
    const metaEd: MetaEdEnvironment = { ...newMetaEdEnvironment(), dataStandardVersion: '3.0.0' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    association1 = { ...newAssociation(), namespace, metaEdName: generalStudentProgramAssociationName };
    namespace.entity.association.set(association1.metaEdName, association1);

    association2 = { ...newAssociation(), namespace, metaEdName: studentProgramAssociationName };
    namespace.entity.association.set(association2.metaEdName, association2);

    association3 = Object.assign(newAssociation(), { namespace, metaEdName: entityName });
    namespace.entity.association.set(association3.metaEdName, association3);

    enhance(metaEd);
  });

  it('should only set GeneralStudentProgramAssociation isAbstract', () => {
    expect(association1.isAbstract).toBe(true);
    expect(association2.isAbstract).toBe(false);
    expect(association3.isAbstract).toBe(false);
  });
});
