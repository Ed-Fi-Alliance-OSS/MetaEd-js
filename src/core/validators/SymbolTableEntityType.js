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
  static domainEntityEntityType(): string {
    return literal(MetaEdGrammar.DOMAIN_ENTITY);
  }

  static domainEntityExtensionEntityType(): string {
    return literal(MetaEdGrammar.DOMAIN_ENTITY) + literal(MetaEdGrammar.ADDITIONS);
  }

  static domainEntitySubclassEntityType(): string {
    return literal(MetaEdGrammar.DOMAIN_ENTITY) + literal(MetaEdGrammar.BASED_ON);
  }

  static associationEntityType(): string {
    return literal(MetaEdGrammar.ASSOCIATION);
  }

  static associationExtensionEntityType(): string {
    return literal(MetaEdGrammar.ASSOCIATION) + literal(MetaEdGrammar.ADDITIONS);
  }

  static associationSubclassEntityType(): string {
    return literal(MetaEdGrammar.ASSOCIATION) + literal(MetaEdGrammar.BASED_ON);
  }

  static abstractEntityEntityType(): string {
    return literal(MetaEdGrammar.ABSTRACT_ENTITY);
  }

  static commonTypeEntityType(): string {
    return literal(MetaEdGrammar.COMMON_TYPE);
  }

  static commonTypeExtensionEntityType(): string {
    return literal(MetaEdGrammar.COMMON_TYPE) + literal(MetaEdGrammar.ADDITIONS);
  }

  static enumerationEntityType(): string {
    return literal(MetaEdGrammar.ENUMERATION_ENTITY);
  }

  static inlineCommonTypeEntityType(): string {
    return literal(MetaEdGrammar.INLINE_COMMON_TYPE);
  }
}

