using Antlr4.Runtime;

namespace MetaEd.Core.Validator
{
    public interface IRuleProvider
    {
        IValidationRule<TContext>[] GetAll<TContext>(ISymbolTable symbolTable) where TContext : ParserRuleContext;
    }
}
