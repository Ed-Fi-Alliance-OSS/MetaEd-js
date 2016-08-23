namespace MetaEd.Core.Validator
{
    public abstract class ValidationRuleBase<TContext> : IValidationRule<TContext>
    {
        public ValidationLevel Level { get { return ValidationLevel.Error; } }

        public abstract bool IsValid(TContext context);
        public abstract string GetFailureMessage(TContext context);
    }
}
