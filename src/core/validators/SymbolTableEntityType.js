// @flow
import R from 'ramda';
import { MetaEdGrammar } from '../../grammar/gen/MetaEdGrammar';
import grammarInstance from '../../grammar/MetaEdGrammarInstance';

// Static strings for top level entity types, taken from generated grammar, used for hashtable keys

const literal = R.memoize(
  (name: string): string => {
    const s = grammarInstance.literalNames[name];

    // generated static strings are surrounded by single quotes, so remove
    return s.slice(1, s.length - 1);
  });

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

  static choice(): string {
    return literal(MetaEdGrammar.CHOICE);
  }

  static sharedDecimal(): string {
    return literal(MetaEdGrammar.SHARED_DECIMAL);
  }

  static sharedInteger(): string {
    return literal(MetaEdGrammar.SHARED_INTEGER);
  }

  static sharedShort(): string {
    return literal(MetaEdGrammar.SHARED_SHORT);
  }

  static sharedString(): string {
    return literal(MetaEdGrammar.SHARED_STRING);
  }

  static common(): string {
    return literal(MetaEdGrammar.COMMON);
  }

  static commonExtension(): string {
    return literal(MetaEdGrammar.COMMON) + literal(MetaEdGrammar.ADDITIONS);
  }

  static descriptorEntity(): string {
    return literal(MetaEdGrammar.DESCRIPTOR);
  }

  static domain(): string {
    return literal(MetaEdGrammar.DOMAIN);
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
    return literal(MetaEdGrammar.ENUMERATION);
  }

  static inlineCommon(): string {
    return literal(MetaEdGrammar.INLINE_COMMON);
  }

  static interchange(): string {
    return literal(MetaEdGrammar.INTERCHANGE);
  }
}

export const topLevelEntityTypes: string[] =
  [
    SymbolTableEntityType.abstractEntity(),
    SymbolTableEntityType.association(),
    SymbolTableEntityType.associationSubclass(),
    SymbolTableEntityType.domainEntity(),
    SymbolTableEntityType.domainEntitySubclass(),
    SymbolTableEntityType.common(),
    SymbolTableEntityType.inlineCommon(),
  ];

export const sharedSimpleEntityTypes: string[] =
  [
    SymbolTableEntityType.sharedDecimal(),
    SymbolTableEntityType.sharedInteger(),
    SymbolTableEntityType.sharedShort(),
    SymbolTableEntityType.sharedString(),
  ];
