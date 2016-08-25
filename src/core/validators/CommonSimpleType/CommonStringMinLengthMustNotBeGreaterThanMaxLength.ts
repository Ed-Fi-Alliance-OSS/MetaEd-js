import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonStringMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase<MetaEdGrammar.CommonStringContext>
{
    public isValid(context: MetaEdGrammar.CommonStringContext): boolean {
        if (context.minLength() == null)
            return true;
        var minLength = Number(context.minLength().MinLength());
        var maxLength = Number(context.maxLength().MaxLength());
        return minLength <= maxLength;
    }
    public getFailureMessage(context: MetaEdGrammar.CommonStringContext): string {
        return `Common String '${context.commonStringName().GetText()}' has min length greater than max length.`;
    }
}
