using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.ReferenceProperty
{
    public class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract : ValidationRuleBase<MetaEdGrammar.ReferencePropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.ReferencePropertyContext context)
        {
            var identifierToMatch = context.propertyName().GetText();

            return _symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.ReferencePropertyContext context)
        {
            return string.Format("Reference property '{0}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.", context.propertyName().GetText());
        }
    }
}
