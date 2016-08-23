using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator
{
    public class SymbolTableEntityType
    {
        public static string DomainEntityEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN_ENTITY);
        }

        public static string DomainEntityExtensionEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN_ENTITY) + MetaEdGrammar.TokenName(MetaEdGrammar.ADDITIONS);
        }

        public static string DomainEntitySubclassEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN_ENTITY) + MetaEdGrammar.TokenName(MetaEdGrammar.BASED_ON);
        }

        public static string AssociationEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
        }

        public static string AssociationExtensionEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION) + MetaEdGrammar.TokenName(MetaEdGrammar.ADDITIONS);
        }

        public static string AssociationSubclassEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION) + MetaEdGrammar.TokenName(MetaEdGrammar.BASED_ON);
        }

        public static string AbstractEntityEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.ABSTRACT_ENTITY);
        }

        public static string CommonTypeEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE);
        }

        public static string CommonTypeExtensionEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE) + MetaEdGrammar.TokenName(MetaEdGrammar.ADDITIONS);
        }

        public static string EnumerationEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.ENUMERATION_ENTITY);
        }

        public static string InlineCommonTypeEntityType()
        {
            return MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE);
        }
    }
}