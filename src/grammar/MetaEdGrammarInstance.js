"use strict";
let antlr4 = require('antlr4');
let BaseLexer = require('../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../src/grammar/gen/MetaEdGrammar').MetaEdGrammar;
class MetaEdGrammarSingleton {
    constructor() {
        this.instance = new MetaEdGrammar(new antlr4.CommonTokenStream(new BaseLexer.BaseLexer(new antlr4.InputStream("")), undefined));
    }
}
exports.MetaEdGrammarInstance = new MetaEdGrammarSingleton();
//# sourceMappingURL=MetaEdGrammarInstance.js.map