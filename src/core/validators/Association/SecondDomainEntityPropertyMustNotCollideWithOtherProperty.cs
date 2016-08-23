using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Association
{
    public class SecondDomainEntityPropertyMustNotCollideWithOtherProperty : ValidationRuleBase<MetaEdGrammar.SecondDomainEntityContext>
    {
        private readonly ISymbolTable _symbolTable;

        public SecondDomainEntityPropertyMustNotCollideWithOtherProperty(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.SecondDomainEntityContext context)
        {
            var identifierToMatch = context.IdText();
            var withContextContext = context.withContext();
            var withContextPrefix = withContextContext == null ? string.Empty : withContextContext.withContextName().ID().GetText();

            var associationName = ((MetaEdGrammar.AssociationContext)context.parent).associationName().IdText();
            var associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
            var entitySymbolTable = _symbolTable.Get(associationType, associationName);
            return entitySymbolTable.PropertySymbolTable.Get(withContextPrefix + identifierToMatch) == null;
        }

        public override string GetFailureMessage(MetaEdGrammar.SecondDomainEntityContext context)
        {
            var associationName = ((MetaEdGrammar.AssociationContext)context.parent).associationName().IdText();
            return string.Format("Entity {0} has duplicate properties named {1}", associationName, context.IdText());
        }
    }
}