let antlr4 = require('antlr4');
let BaseLexer = require('../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../src/grammar/gen/MetaEdGrammar').MetaEdGrammar;

class MetaEdGrammarSingleton {
    public instance = new MetaEdGrammar(new antlr4.CommonTokenStream(new BaseLexer.BaseLexer(new antlr4.InputStream("")), undefined));
}

export let MetaEdGrammarInstance = new MetaEdGrammarSingleton();
