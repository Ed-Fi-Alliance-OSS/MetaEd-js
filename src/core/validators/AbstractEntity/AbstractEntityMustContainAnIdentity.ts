import {ValidationRuleBase} from "../ValidationRuleBase";

export class AbstractEntityMustContainAnIdentity extends ValidationRuleBase {
    public isValid(context) : boolean {
        return context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identity() != null);
    }

    public getFailureMessage(context) : string {
        return `Abstract Entity {context.abstractEntityName().ID().getText()} does not have an identity specified.`;
    }
}
