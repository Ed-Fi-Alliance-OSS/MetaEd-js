using System.Collections.Generic;
using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator
{
    public class PropertySymbolTable
    {
        public PropertySymbolTable(EntityContext parentEntityContext)
        {
            _parentEntityContext = parentEntityContext;
        }

        private readonly EntityContext _parentEntityContext;
        private readonly Dictionary<string, IPropertyWithComponents> _symbolTable = new Dictionary<string, IPropertyWithComponents>();

        public EntityContext Parent { get { return _parentEntityContext; } }

        // name should be prefixed by a 'with context' value if one exists for property
        public bool TryAdd(string name, IPropertyWithComponents context)
        {
            if (_symbolTable.ContainsKey(name))
                return false;

            _symbolTable.Add(name, context);
            return true;
        }

        // name should be prefixed by a 'with context' value if one exists for property
        public IPropertyWithComponents Get(string name)
        {
            IPropertyWithComponents result;
            _symbolTable.TryGetValue(name, out result);
            return result;
        }

        // results are prefixed by a 'with context' value if one exists for property
        public IEnumerable<string> Identifiers()
        {
            return _symbolTable.Keys.AsEnumerable();
        }

        public IEnumerable<IPropertyWithComponents> Values()
        {
            return _symbolTable.Values.AsEnumerable();
        }

        // candidate identifiers should be prefixed by a 'with context' value if one exists for property
        public IEnumerable<IPropertyWithComponents> ContextsForMatchingIdentifiers(ICollection<string> candidateIdentifiers)
        {
            return _symbolTable.Where(x => candidateIdentifiers.Contains(x.Key)).Select(x => x.Value);
        }

        public IEnumerable<IPropertyWithComponents> GetWithoutContext(string name)
        {
            return _symbolTable.Where(x => x.Value.IdNode().GetText() == name).Select(x => x.Value);
        }
    }
}