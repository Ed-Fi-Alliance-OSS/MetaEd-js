import {ValidationRuleBase} from "../ValidationRuleBase";

export class AbstractEntityMustContainAnIdentity extends ValidationRuleBase<MetaEdGrammar.AbstractEntityContext> {
    public isValid(context: MetaEdGrammar.AbstractEntityContext) : boolean {
        return context.property().some(x => this.getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
    }

    public getFailureMessage(context: MetaEdGrammar.AbstractEntityContext) : string {
        return `Abstract Entity ${context.abstractEntityName().ID().getText()} does not have an identity specified.`;
    }
}
