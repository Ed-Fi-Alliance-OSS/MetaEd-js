import { Association } from '../src/model/Association';
import { AssociationExtension } from '../src/model/AssociationExtension';
import { AssociationSubclass } from '../src/model/AssociationSubclass';
import { Choice } from '../src/model/Choice';
import { Common } from '../src/model/Common';
import { CommonExtension } from '../src/model/CommonExtension';
import { DecimalType } from '../src/model/DecimalType';
import { Descriptor } from '../src/model/Descriptor';
import { DomainEntity } from '../src/model/DomainEntity';
import { DomainEntityExtension } from '../src/model/DomainEntityExtension';
import { DomainEntitySubclass } from '../src/model/DomainEntitySubclass';
import { Enumeration } from '../src/model/Enumeration';
import { IntegerType } from '../src/model/IntegerType';
import { Interchange } from '../src/model/Interchange';
import { InterchangeExtension } from '../src/model/InterchangeExtension';
import { MapTypeEnumeration } from '../src/model/MapTypeEnumeration';
import { SchoolYearEnumeration } from '../src/model/SchoolYearEnumeration';
import { SharedDecimal } from '../src/model/SharedDecimal';
import { SharedInteger } from '../src/model/SharedInteger';
import { SharedString } from '../src/model/SharedString';
import { StringType } from '../src/model/StringType';
import { Domain } from '../src/model/Domain';
import { Subdomain } from '../src/model/Subdomain';
import { ModelType } from '../src/model/ModelType';
import { EntityRepository } from '../src/model/EntityRepository';
import { CommonSubclass } from '../src/model/CommonSubclass';

function getEntity(repository: EntityRepository, entityName: string, modelType: ModelType): any {
  return repository[modelType].get(entityName);
}

export function getUnknown(repository: EntityRepository, entityName: string): any {
  return getEntity(repository, entityName, 'unknown') as Association;
}

export function getAssociation(repository: EntityRepository, entityName: string): Association {
  return getEntity(repository, entityName, 'association') as Association;
}

export function getAssociationExtension(repository: EntityRepository, entityName: string): AssociationExtension {
  return getEntity(repository, entityName, 'associationExtension') as AssociationExtension;
}

export function getAssociationSubclass(repository: EntityRepository, entityName: string): AssociationSubclass {
  return getEntity(repository, entityName, 'associationSubclass') as AssociationSubclass;
}

export function getChoice(repository: EntityRepository, entityName: string): Choice {
  return getEntity(repository, entityName, 'choice') as Choice;
}

export function getCommon(repository: EntityRepository, entityName: string): Common {
  return getEntity(repository, entityName, 'common') as Common;
}

export function getCommonExtension(repository: EntityRepository, entityName: string): CommonExtension {
  return getEntity(repository, entityName, 'commonExtension') as CommonExtension;
}

export function getCommonSubclass(repository: EntityRepository, entityName: string): CommonSubclass {
  return getEntity(repository, entityName, 'commonSubclass') as AssociationSubclass;
}

export function getDecimalType(repository: EntityRepository, entityName: string): DecimalType {
  return getEntity(repository, entityName, 'decimalType') as DecimalType;
}

export function getDescriptor(repository: EntityRepository, entityName: string): Descriptor {
  return getEntity(repository, entityName, 'descriptor') as Descriptor;
}

export function getDomainEntity(repository: EntityRepository, entityName: string): DomainEntity {
  return getEntity(repository, entityName, 'domainEntity') as DomainEntity;
}

export function getDomainEntityExtension(repository: EntityRepository, entityName: string): DomainEntityExtension {
  return getEntity(repository, entityName, 'domainEntityExtension') as DomainEntityExtension;
}

export function getDomainEntitySubclass(repository: EntityRepository, entityName: string): DomainEntitySubclass {
  return getEntity(repository, entityName, 'domainEntitySubclass') as DomainEntitySubclass;
}

export function getEnumeration(repository: EntityRepository, entityName: string): Enumeration {
  return getEntity(repository, entityName, 'enumeration') as Enumeration;
}

export function getIntegerType(repository: EntityRepository, entityName: string): IntegerType {
  return getEntity(repository, entityName, 'integerType') as IntegerType;
}

export function getInterchange(repository: EntityRepository, entityName: string): Interchange {
  return getEntity(repository, entityName, 'interchange') as Interchange;
}

export function getInterchangeExtension(repository: EntityRepository, entityName: string): InterchangeExtension {
  return getEntity(repository, entityName, 'interchangeExtension') as InterchangeExtension;
}

export function getMapTypeEnumeration(repository: EntityRepository, entityName: string): MapTypeEnumeration {
  return getEntity(repository, entityName, 'mapTypeEnumeration') as MapTypeEnumeration;
}

export function getSchoolYearEnumeration(repository: EntityRepository, entityName: string): SchoolYearEnumeration {
  return getEntity(repository, entityName, 'schoolYearEnumeration') as SchoolYearEnumeration;
}

export function getSharedDecimal(repository: EntityRepository, entityName: string): SharedDecimal {
  return getEntity(repository, entityName, 'sharedDecimal') as SharedDecimal;
}

export function getSharedInteger(repository: EntityRepository, entityName: string): SharedInteger {
  return getEntity(repository, entityName, 'sharedInteger') as SharedInteger;
}

export function getSharedString(repository: EntityRepository, entityName: string): SharedString {
  return getEntity(repository, entityName, 'sharedString') as SharedString;
}

export function getStringType(repository: EntityRepository, entityName: string): StringType {
  return getEntity(repository, entityName, 'stringType') as StringType;
}

export function getDomain(repository: EntityRepository, entityName: string): Domain {
  return getEntity(repository, entityName, 'domain') as Domain;
}

export function getSubdomain(repository: EntityRepository, entityName: string): Subdomain {
  return getEntity(repository, entityName, 'subdomain') as Subdomain;
}
