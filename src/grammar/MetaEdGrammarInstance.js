// @flow
import antlr4 from 'antlr4';
import { BaseLexer } from '../../src/grammar/gen/BaseLexer';
import { MetaEdGrammar } from '../../src/grammar/gen/MetaEdGrammar';

const instance = new MetaEdGrammar(new antlr4.CommonTokenStream(new BaseLexer(new antlr4.InputStream('')), undefined));
export { instance as default };
