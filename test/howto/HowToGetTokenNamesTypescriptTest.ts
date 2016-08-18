import SymbolTableEntityType from "../../src/core/validators/SymbolTableEntityType";
let antlr4 = require('antlr4');
let BaseLexer = require('../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../src/grammar/gen/MetaEdGrammar');

describe('HowToGetTokenNames', () => {
    describe('Domain Entity', () => {
        it('should get correctly', () => {

            const grammar = MetaEdGrammar.MetaEdGrammar;
            const grammarInstance = new MetaEdGrammar.MetaEdGrammar(new antlr4.CommonTokenStream(new BaseLexer.BaseLexer(new antlr4.InputStream("")), undefined));

            const literalNames = grammarInstance.literalNames;

            console.log(literalNames[grammar.ABSTRACT_ENTITY]);
            console.log(literalNames[grammar.DOMAIN_ENTITY]);


            const t = new SymbolTableEntityType();
            console.log(t.domainEntityEntityType());
        });
    });
});
