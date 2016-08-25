import {ValidationRuleBase} from "../ValidationRuleBase";

export class AbstractEntityMustContainAnIdentity extends ValidationRuleBase<MetaEdGrammar.AbstractEntityContext> {
    public isValid(context) : boolean {
        return context.property().some(x => this.getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
    }

    public getFailureMessage(context) : string {
        return `Abstract Entity ${context.abstractEntityName().ID().getText()} does not have an identity specified.`;
    }
}
