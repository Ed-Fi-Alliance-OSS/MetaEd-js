import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntityMustContainAnIdentity extends ValidationRuleBase<MetaEdGrammar.DomainEntityContext>
{
    public isValid(context: MetaEdGrammar.DomainEntityContext): boolean {
        return context.property().Any(x => getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntityContext): string {
        return `Domain Entity ${context.entityName().ID().getText()} does not have an identity specified.`;
    }
}
