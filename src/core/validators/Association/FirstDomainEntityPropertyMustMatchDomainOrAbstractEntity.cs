using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Association
{
    public class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity : ValidationRuleBase<MetaEdGrammar.FirstDomainEntityContext>
    {
        private readonly ISymbolTable _symbolTable;

        public FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.FirstDomainEntityContext context)
        {
            var identifierToMatch = context.IdText();

            return _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                _symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) ||
                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.FirstDomainEntityContext context)
        {
            return string.Format("Domain Entity property '{0}' does not match any declared domain or abstract entity.", context.IdText());
        }
    }
}
