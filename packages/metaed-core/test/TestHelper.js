// @flow
import antlr4 from 'antlr4';
import type { Association } from '../src/model/Association';
import type { AssociationExtension } from '../src/model/AssociationExtension';
import type { AssociationSubclass } from '../src/model/AssociationSubclass';
import type { Choice } from '../src/model/Choice';
import type { Common } from '../src/model/Common';
import type { CommonExtension } from '../src/model/CommonExtension';
import type { DecimalType } from '../src/model/DecimalType';
import type { Descriptor } from '../src/model/Descriptor';
import type { DomainEntity } from '../src/model/DomainEntity';
import type { DomainEntityExtension } from '../src/model/DomainEntityExtension';
import type { DomainEntitySubclass } from '../src/model/DomainEntitySubclass';
import type { Enumeration } from '../src/model/Enumeration';
import type { IntegerType } from '../src/model/IntegerType';
import type { Interchange } from '../src/model/Interchange';
import type { InterchangeExtension } from '../src/model/InterchangeExtension';
import type { MapTypeEnumeration } from '../src/model/MapTypeEnumeration';
import type { NamespaceInfo } from '../src/model/NamespaceInfo';
import type { SchoolYearEnumeration } from '../src/model/SchoolYearEnumeration';
import type { SharedDecimal } from '../src/model/SharedDecimal';
import type { SharedInteger } from '../src/model/SharedInteger';
import type { SharedString } from '../src/model/SharedString';
import type { StringType } from '../src/model/StringType';
import type { Domain } from '../src/model/Domain';
import type { Subdomain } from '../src/model/Subdomain';
import type { EntityRepository } from '../src/model/EntityRepository';
import { getEntity } from '../src/model/EntityRepository';


import { MetaEdGrammar } from '../src/grammar/gen/MetaEdGrammar';
import type { MetaEdGrammarListener } from '../src/grammar/gen/MetaEdGrammarListener';
import { BaseLexer } from '../src/grammar/gen/BaseLexer';

class TestErrorListener {
  errorMessages: string[];

  constructor() {
    antlr4.error.ErrorListener.call(this);
    this.errorMessages = [];
  }

  syntaxError(recognizer: any, offendingSymbol: any, line: number, column: number, message: string) {
    const tokenText = offendingSymbol && offendingSymbol.text ? offendingSymbol.text : '';
    this.errorMessages.push(`${message}, column: ${column}, line: ${line}, token: ${tokenText}`);
  }
}

export function listen(metaEdText: string, listener: MetaEdGrammarListener): string[] {
  const testErrorListener = new TestErrorListener();
  const lexer = new BaseLexer(new antlr4.InputStream(metaEdText));
  const parser = new MetaEdGrammar(new antlr4.CommonTokenStream(lexer, undefined));
  lexer.removeErrorListeners();
  lexer.addErrorListener(testErrorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(testErrorListener);
  const parserContext = parser.metaEd();
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, parserContext);
  return testErrorListener.errorMessages;
}

export function getUnknown(repository: EntityRepository, metaEdId: string): any {
  return ((getEntity(repository, metaEdId, 'unknown'): any): Association);
}

export function getAssociation(repository: EntityRepository, metaEdId: string): Association {
  return ((getEntity(repository, metaEdId, 'association'): any): Association);
}

export function getAssociationExtension(repository: EntityRepository, metaEdId: string): AssociationExtension {
  return ((getEntity(repository, metaEdId, 'associationExtension'): any): AssociationExtension);
}

export function getAssociationSubclass(repository: EntityRepository, metaEdId: string): AssociationSubclass {
  return ((getEntity(repository, metaEdId, 'associationSubclass'): any): AssociationSubclass);
}

export function getChoice(repository: EntityRepository, metaEdId: string): Choice {
  return ((getEntity(repository, metaEdId, 'choice'): any): Choice);
}

export function getCommon(repository: EntityRepository, metaEdId: string): Common {
  return ((getEntity(repository, metaEdId, 'common'): any): Common);
}

export function getCommonExtension(repository: EntityRepository, metaEdId: string): CommonExtension {
  return ((getEntity(repository, metaEdId, 'commonExtension'): any): CommonExtension);
}

export function getDecimalType(repository: EntityRepository, metaEdId: string): DecimalType {
  return ((getEntity(repository, metaEdId, 'decimalType'): any): DecimalType);
}

export function getDescriptor(repository: EntityRepository, metaEdId: string): Descriptor {
  return ((getEntity(repository, metaEdId, 'descriptor'): any): Descriptor);
}

export function getDomainEntity(repository: EntityRepository, metaEdId: string): DomainEntity {
  return ((getEntity(repository, metaEdId, 'domainEntity'): any): DomainEntity);
}

export function getDomainEntityExtension(repository: EntityRepository, metaEdId: string): DomainEntityExtension {
  return ((getEntity(repository, metaEdId, 'domainEntityExtension'): any): DomainEntityExtension);
}

export function getDomainEntitySubclass(repository: EntityRepository, metaEdId: string): DomainEntitySubclass {
  return ((getEntity(repository, metaEdId, 'domainEntitySubclass'): any): DomainEntitySubclass);
}

export function getEnumeration(repository: EntityRepository, metaEdId: string): Enumeration {
  return ((getEntity(repository, metaEdId, 'enumeration'): any): Enumeration);
}

export function getIntegerType(repository: EntityRepository, metaEdId: string): IntegerType {
  return ((getEntity(repository, metaEdId, 'integerType'): any): IntegerType);
}

export function getInterchange(repository: EntityRepository, metaEdId: string): Interchange {
  return ((getEntity(repository, metaEdId, 'interchange'): any): Interchange);
}

export function getInterchangeExtension(repository: EntityRepository, metaEdId: string): InterchangeExtension {
  return ((getEntity(repository, metaEdId, 'interchangeExtension'): any): InterchangeExtension);
}

export function getMapTypeEnumeration(repository: EntityRepository, metaEdId: string): MapTypeEnumeration {
  return ((getEntity(repository, metaEdId, 'mapTypeEnumeration'): any): MapTypeEnumeration);
}

export function getNamespaceInfo(repository: EntityRepository, metaEdId: string): NamespaceInfo {
  return ((getEntity(repository, metaEdId, 'namespaceInfo'): any): NamespaceInfo);
}

export function getSchoolYearEnumeration(repository: EntityRepository, metaEdId: string): SchoolYearEnumeration {
  return ((getEntity(repository, metaEdId, 'schoolYearEnumeration'): any): SchoolYearEnumeration);
}

export function getSharedDecimal(repository: EntityRepository, metaEdId: string): SharedDecimal {
  return ((getEntity(repository, metaEdId, 'sharedDecimal'): any): SharedDecimal);
}

export function getSharedInteger(repository: EntityRepository, metaEdId: string): SharedInteger {
  return ((getEntity(repository, metaEdId, 'sharedInteger'): any): SharedInteger);
}

export function getSharedString(repository: EntityRepository, metaEdId: string): SharedString {
  return ((getEntity(repository, metaEdId, 'sharedString'): any): SharedString);
}

export function getStringType(repository: EntityRepository, metaEdId: string): StringType {
  return ((getEntity(repository, metaEdId, 'stringType'): any): StringType);
}

export function getDomain(repository: EntityRepository, metaEdId: string): Domain {
  return ((getEntity(repository, metaEdId, 'domain'): any): Domain);
}

export function getSubdomain(repository: EntityRepository, metaEdId: string): Subdomain {
  return ((getEntity(repository, metaEdId, 'subdomain'): any): Subdomain);
}

