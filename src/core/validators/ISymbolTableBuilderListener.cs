using Antlr4.Runtime;
using Antlr4.Runtime.Tree;
using MetaEd.Core.Tasks;

namespace MetaEd.Core.Validator
{
    public interface ISymbolTableBuilderListener
    {
        void WithContext(IMetaEdContext context);

        /// <summary>
        /// A callback to be invoked before the AddEntity operation of the SymbolTableBuilder
        /// </summary>
        /// <returns>true if the AddEntity operation can proceed</returns>
        bool BeforeAddEntity(string entityType, ITerminalNode entityName, ParserRuleContext context);
    }
}
