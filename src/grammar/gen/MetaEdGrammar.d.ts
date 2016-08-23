declare namespace MetaEdGrammar {
    export class ParserRuleContext {
        start : any;
    }
    export class AbstractEntityContext extends ParserRuleContext {}
    export class AbstractEntityNameContext extends ParserRuleContext {}
    export class AssociationContext extends ParserRuleContext {}
    export class CommonDecimalContext extends ParserRuleContext {}
}

declare module "MetaEdGrammar" {
    export = MetaEdGrammar;
}
