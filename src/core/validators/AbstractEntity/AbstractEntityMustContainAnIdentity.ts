import {ValidationRuleBase} from "../ValidationRuleBase";

let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class AbstractEntityMustContainAnIdentity extends ValidationRuleBase {
    public handlesContext(context) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_abstractEntity;
    }

    public isValid(context) : boolean {
        return context.property().some(x => this.getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
    }

    public getFailureMessage(context) : string {
        return `Abstract Entity {context.abstractEntityName().ID().getText()} does not have an identity specified.`;
    }
}
