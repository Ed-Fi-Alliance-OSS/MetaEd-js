"use strict";
let antlr4 = require('antlr4');
let BaseLexer = require('../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../src/grammar/gen/MetaEdGrammar');
describe('HowToGetRuleNames', () => {
    describe('Domain Entity', () => {
        it('should get correctly', () => {
            const grammar = MetaEdGrammar.MetaEdGrammar;
            const ruleIndex = grammar.RULE_abstractEntity;
            console.log(ruleIndex);
        });
    });
});
//# sourceMappingURL=HowToGetRuleNamesTypescriptTest.js.map