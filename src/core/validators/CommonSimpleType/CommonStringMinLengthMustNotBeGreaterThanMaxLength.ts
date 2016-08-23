module MetaEd.Core.Validator.CommonSimpleType {
    export class CommonStringMinLengthMustNotBeGreaterThanMaxLength extends ValidationRuleBase<MetaEdGrammar.CommonStringContext>
    {
        public isValid(context: MetaEdGrammar.CommonStringContext): boolean {
            if (context.minLength() == null)
                return true;
            var minLength = Convert.ToInt32(context.minLength().MinLength());
            var maxLength = Convert.ToInt32(context.maxLength().MaxLength());
            return minLength <= maxLength;
        }
        public getFailureMessage(context: MetaEdGrammar.CommonStringContext): string {
            return string.Format("Common String '{0}' has min length greater than max length.", context.commonStringName().GetText());
        }
    }
}