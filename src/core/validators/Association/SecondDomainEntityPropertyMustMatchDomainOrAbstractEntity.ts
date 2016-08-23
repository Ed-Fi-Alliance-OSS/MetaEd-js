using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Association
{
    public class SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity : ValidationRuleBase<MetaEdGrammar.SecondDomainEntityContext>
    {
        private readonly ISymbolTable _symbolTable;

        public SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.SecondDomainEntityContext context)
        {
            var identifierToMatch = context.IdText();

            return _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                _symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) ||
                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.SecondDomainEntityContext context)
        {
            return string.Format("Domain Entity property '{0}' does not match any declared domain or abstract entity.", context.IdText());
        }
    }
}
