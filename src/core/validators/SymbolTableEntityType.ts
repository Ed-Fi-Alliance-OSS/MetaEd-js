let antlr4 = require('antlr4');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');

export default class SymbolTableEntityType {
    private metaEdGrammar;
    private literalNames;

    constructor() {
        this.metaEdGrammar = MetaEdGrammar.MetaEdGrammar;
        // must instantiate dummy MetaEdGrammar to get at literal name string array
        this.literalNames = new MetaEdGrammar.MetaEdGrammar(new antlr4.CommonTokenStream(new BaseLexer.BaseLexer(new antlr4.InputStream("")), undefined)).literalNames;
    }

    private literal(name) : string {
        const s = this.literalNames[name];
        return s.slice(1, s.length - 1);
    }

    domainEntityEntityType() : string {
        return this.literal(this.metaEdGrammar.DOMAIN_ENTITY);
    }

    domainEntityExtensionEntityType() : string {
        return this.literal(this.metaEdGrammar.DOMAIN_ENTITY) + this.literal(this.metaEdGrammar.ADDITIONS);
    }

    domainEntitySubclassEntityType() : string {
        return this.literal(this.metaEdGrammar.DOMAIN_ENTITY) + this.literal(this.metaEdGrammar.BASED_ON);
    }

    associationEntityType() : string {
        return this.literal(this.metaEdGrammar.ASSOCIATION);
    }

    associationExtensionEntityType() : string {
        return this.literal(this.metaEdGrammar.ASSOCIATION) + this.literal(this.metaEdGrammar.ADDITIONS);
    }

    associationSubclassEntityType() : string {
        return this.literal(this.metaEdGrammar.ASSOCIATION) + this.literal(this.metaEdGrammar.BASED_ON);
    }

    abstractEntityEntityType() : string {
        return this.literal(this.metaEdGrammar.ABSTRACT_ENTITY);
    }

    commonTypeEntityType() : string {
        return this.literal(this.metaEdGrammar.COMMON_TYPE);
    }

    commonTypeExtensionEntityType() : string {
        return this.literal(this.metaEdGrammar.COMMON_TYPE) + this.literal(this.metaEdGrammar.ADDITIONS);
    }

    enumerationEntityType() : string {
        return this.literal(this.metaEdGrammar.ENUMERATION_ENTITY);
    }

    inlineCommonTypeEntityType() : string {
        return this.literal(this.metaEdGrammar.INLINE_COMMON_TYPE);
    }
}
