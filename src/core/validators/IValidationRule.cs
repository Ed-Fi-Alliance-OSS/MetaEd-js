namespace MetaEd.Core.Validator
{
    public enum ValidationLevel
    {
        Warning,
        Error
    }

    public interface IValidationRule<in TContext>
    {
        ValidationLevel Level { get; }
        bool IsValid(TContext context);
        string GetFailureMessage(TContext context);
    }
}
