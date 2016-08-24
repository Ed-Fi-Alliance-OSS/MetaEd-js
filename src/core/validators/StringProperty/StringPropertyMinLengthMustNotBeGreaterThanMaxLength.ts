import { ValidationRuleBase } from "../ValidationRuleBase";
export class StringPropertyMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase<MetaEdGrammar.StringPropertyContext>
{
    public isValid(context: MetaEdGrammar.StringPropertyContext): boolean {
        if (context.minLength() == null)
            return true;
        var minLength = Convert.ToInt32(context.minLength().MinLength());
        var maxLength = Convert.ToInt32(context.maxLength().MaxLength());
        return minLength <= maxLength;
    }
    public getFailureMessage(context: MetaEdGrammar.StringPropertyContext): string {
        return string.Format("String Property '{0}' in {1} '{2}' has min length greater than max length.",
            context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
    }
}
