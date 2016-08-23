module MetaEd.Core.Validator.DecimalProperty {
    export class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
    {
        public isValid(context: MetaEdGrammar.DecimalPropertyContext): boolean {
            var decimalPlaces = context.decimalPlaces().DecimalPlaces();
            var totalDigits = context.totalDigits().TotalDigits();
            return Convert.ToInt32(decimalPlaces) <= Convert.ToInt32(totalDigits);
        }
        public getFailureMessage(context: MetaEdGrammar.DecimalPropertyContext): string {
            return string.Format("Decimal Property '{0}' in {1} '{2}' has decimal places greater than total digits.",
                context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
        }
    }
}