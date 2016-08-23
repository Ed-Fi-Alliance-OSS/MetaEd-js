module MetaEd.Core.Validator.IntegerProperty {
    export class IntegerPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.IntegerPropertyContext>
    {
        public isValid(context: MetaEdGrammar.IntegerPropertyContext): boolean {
            if (context.minValue() == null || context.maxValue() == null)
                return true;
            var minValue = Convert.ToInt32(context.minValue().MinValue());
            var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
            return minValue <= maxValue;
        }
        public getFailureMessage(context: MetaEdGrammar.IntegerPropertyContext): string {
            return string.Format("Integer Property '{0}' in {1} '{2}' has min value greater than max value.",
                context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
        }
    }
}