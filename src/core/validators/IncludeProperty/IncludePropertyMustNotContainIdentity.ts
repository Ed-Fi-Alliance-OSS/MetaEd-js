import { ValidationRuleBase } from "../ValidationRuleBase";
export class IncludePropertyMustNotContainIdentity extends ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
{
    public isValid(context: MetaEdGrammar.IncludePropertyContext): boolean {
        return context.propertyComponents().propertyAnnotation().identity() == null;
    }
    public getFailureMessage(context: MetaEdGrammar.IncludePropertyContext): string {
        var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        return `Include property '${context.propertyName().GetText()}' is invalid to be used for the identity of ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'`;
    }
}
