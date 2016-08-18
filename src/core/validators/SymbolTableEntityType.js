"use strict";
let antlr4 = require('antlr4');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');
class SymbolTableEntityType {
    constructor() {
        this.metaEdGrammar = MetaEdGrammar.MetaEdGrammar;
        // must instantiate dummy MetaEdGrammar to get at literal name string array
        this.literalNames = new MetaEdGrammar.MetaEdGrammar(new antlr4.CommonTokenStream(new BaseLexer.BaseLexer(new antlr4.InputStream("")), undefined)).literalNames;
    }
    literal(name) {
        const s = this.literalNames[name];
        return s.slice(1, s.length - 1);
    }
    domainEntityEntityType() {
        return this.literal(this.metaEdGrammar.DOMAIN_ENTITY);
    }
    domainEntityExtensionEntityType() {
        return this.literal(this.metaEdGrammar.DOMAIN_ENTITY) + this.literal(this.metaEdGrammar.ADDITIONS);
    }
    domainEntitySubclassEntityType() {
        return this.literal(this.metaEdGrammar.DOMAIN_ENTITY) + this.literal(this.metaEdGrammar.BASED_ON);
    }
    associationEntityType() {
        return this.literal(this.metaEdGrammar.ASSOCIATION);
    }
    associationExtensionEntityType() {
        return this.literal(this.metaEdGrammar.ASSOCIATION) + this.literal(this.metaEdGrammar.ADDITIONS);
    }
    associationSubclassEntityType() {
        return this.literal(this.metaEdGrammar.ASSOCIATION) + this.literal(this.metaEdGrammar.BASED_ON);
    }
    abstractEntityEntityType() {
        return this.literal(this.metaEdGrammar.ABSTRACT_ENTITY);
    }
    commonTypeEntityType() {
        return this.literal(this.metaEdGrammar.COMMON_TYPE);
    }
    commonTypeExtensionEntityType() {
        return this.literal(this.metaEdGrammar.COMMON_TYPE) + this.literal(this.metaEdGrammar.ADDITIONS);
    }
    enumerationEntityType() {
        return this.literal(this.metaEdGrammar.ENUMERATION_ENTITY);
    }
    inlineCommonTypeEntityType() {
        return this.literal(this.metaEdGrammar.INLINE_COMMON_TYPE);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SymbolTableEntityType;
//# sourceMappingURL=SymbolTableEntityType.js.map