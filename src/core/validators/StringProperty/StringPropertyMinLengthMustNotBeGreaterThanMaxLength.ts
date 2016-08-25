import { ValidationRuleBase } from "../ValidationRuleBase";
export class StringPropertyMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase<MetaEdGrammar.StringPropertyContext>
{
    public isValid(context: MetaEdGrammar.StringPropertyContext): boolean {
        if (context.minLength() == null)
            return true;
        var minLength = Number(context.minLength().MinLength());
        var maxLength = Number(context.maxLength().MaxLength());
        return minLength <= maxLength;
    }
    public getFailureMessage(context: MetaEdGrammar.StringPropertyContext): string {
        return `String Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has min length greater than max length.`
    }
}
