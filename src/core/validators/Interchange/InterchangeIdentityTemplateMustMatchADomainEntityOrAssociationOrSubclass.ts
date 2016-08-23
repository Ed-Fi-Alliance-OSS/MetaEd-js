using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Interchange
{
    public class InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass : ValidationRuleBase<MetaEdGrammar.InterchangeIdentityTemplateContext>
    {
        private readonly ISymbolTable _symbolTable;

        public InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.InterchangeIdentityTemplateContext context)
        {
            var identifierToMatch = context.IdText();

            return _symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                   _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.InterchangeIdentityTemplateContext context)
        {
            return string.Format("Interchange identity template '{0}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.", context.IdText());
        }
    }
}
