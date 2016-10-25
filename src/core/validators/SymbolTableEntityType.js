// @flow
import { MetaEdGrammar } from '../../../src/grammar/gen/MetaEdGrammar';
import grammarInstance from '../../../src/grammar/MetaEdGrammarInstance';

// Static strings for top level entity types, taken from generated grammar, used for hashtable keys

function literal(name: string) {
  const s = grammarInstance.literalNames[name];
  // generated static strings are surrounded by single quotes, so remove
  return s.slice(1, s.length - 1);
}

export default class SymbolTableEntityType {
  static abstractEntity(): string {
    return literal(MetaEdGrammar.ABSTRACT_ENTITY);
  }

  static association(): string {
    return literal(MetaEdGrammar.ASSOCIATION);
  }

  static associationExtension(): string {
    return literal(MetaEdGrammar.ASSOCIATION) + literal(MetaEdGrammar.ADDITIONS);
  }

  static associationSubclass(): string {
    return literal(MetaEdGrammar.ASSOCIATION) + literal(MetaEdGrammar.BASED_ON);
  }

  static commonDecimalType(): string {
    return literal(MetaEdGrammar.COMMON_DECIMAL);
  }

  static commonIntegerType(): string {
    return literal(MetaEdGrammar.COMMON_INTEGER);
  }

  static commonShortType(): string {
    return literal(MetaEdGrammar.COMMON_SHORT);
  }

  static commonStringType(): string {
    return literal(MetaEdGrammar.COMMON_STRING);
  }

  static commonType(): string {
    return literal(MetaEdGrammar.COMMON_TYPE);
  }

  static commonTypeExtension(): string {
    return literal(MetaEdGrammar.COMMON_TYPE) + literal(MetaEdGrammar.ADDITIONS);
  }

  static descriptorEntity(): string {
    return literal(MetaEdGrammar.DESCRIPTOR_ENTITY);
  }

  static domainEntity(): string {
    return literal(MetaEdGrammar.DOMAIN_ENTITY);
  }

  static domainEntityExtension(): string {
    return literal(MetaEdGrammar.DOMAIN_ENTITY) + literal(MetaEdGrammar.ADDITIONS);
  }

  static domainEntitySubclass(): string {
    return literal(MetaEdGrammar.DOMAIN_ENTITY) + literal(MetaEdGrammar.BASED_ON);
  }

  static enumeration(): string {
    return literal(MetaEdGrammar.ENUMERATION_ENTITY);
  }

  static inlineCommonType(): string {
    return literal(MetaEdGrammar.INLINE_COMMON_TYPE);
  }
}

export const topLevelEntityTypes: string[] =
  [
    SymbolTableEntityType.abstractEntity(),
    SymbolTableEntityType.association(),
    SymbolTableEntityType.associationSubclass(),
    SymbolTableEntityType.domainEntity(),
    SymbolTableEntityType.domainEntitySubclass(),
    SymbolTableEntityType.commonType(),
    SymbolTableEntityType.inlineCommonType(),
  ];

export const commonSimpleEntityTypes: string[] =
  [
    SymbolTableEntityType.commonDecimalType(),
    SymbolTableEntityType.commonIntegerType(),
    SymbolTableEntityType.commonShortType(),
    SymbolTableEntityType.commonStringType(),
  ];
