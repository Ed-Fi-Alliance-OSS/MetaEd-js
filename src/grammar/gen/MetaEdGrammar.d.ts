declare namespace MetaEdGrammar {
    export type ParserRuleContext = any;
    export type AbstractEntityContext = ParserRuleContext;
    export type AbstractEntityNameContext = ParserRuleContext;
    export type AssociationContext = ParserRuleContext;
}

declare module "MetaEdGrammar" {
    export = MetaEdGrammar;
}
