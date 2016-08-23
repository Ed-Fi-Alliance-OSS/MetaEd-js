using System.Collections.Generic;
using System.Linq;
using Antlr4.Runtime;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator
{
    public interface ISymbolTable
    {
        bool TryAdd(string entityType, string name, ParserRuleContext context);
        EntityContext Get(string entityType, string name);
        bool IdentifierExists(string entityType, string identifier);
        IEnumerable<string> IdentifiersForEntityType(string entityType);
        IEnumerable<string> IdentifiersForEntityProperties(string entityType, string name);
        IEnumerable<IPropertyWithComponents> ContextsForMatchingPropertyIdentifiers(string entityType, string name, ICollection<string> candidatePropertyIdentifiers);
    }

    public class SymbolTable : ISymbolTable
    {
        private readonly Dictionary<string, Dictionary<string, EntityContext>> _symbolTable = new Dictionary<string, Dictionary<string, EntityContext>>();

        public bool TryAdd(string entityType, string name, ParserRuleContext context)
        {
            Dictionary<string, EntityContext> entityDictionary;

            if (!_symbolTable.TryGetValue(entityType, out entityDictionary))
            {
                entityDictionary = new Dictionary<string, EntityContext>();
                _symbolTable.Add(entityType, entityDictionary);
            }

            if (entityDictionary.ContainsKey(name))
                return false;

            var entityContext = new EntityContext
                                    {
                                        Name = name,
                                        Context = context
                                    };
            entityContext.PropertySymbolTable = new PropertySymbolTable(entityContext);
            entityDictionary.Add(name, entityContext);
            return true;
        }

        public EntityContext Get(string entityType, string name)
        {
            Dictionary<string, EntityContext> entityDictionary;
            if (!_symbolTable.TryGetValue(entityType, out entityDictionary))
                return null;

            EntityContext entityContext = null;
            entityDictionary.TryGetValue(name, out entityContext);
            return entityContext;
        }

        public bool IdentifierExists(string entityType, string identifier)
        {
            if (!_symbolTable.ContainsKey(entityType)) return false;
            return _symbolTable[entityType].ContainsKey(identifier);
        }

        public IEnumerable<string> IdentifiersForEntityType(string entityType)
        {
            Dictionary<string, EntityContext> entityDictionary;
            return _symbolTable.TryGetValue(entityType, out entityDictionary) ? entityDictionary.Keys.AsEnumerable() : Enumerable.Empty<string>();
        }

        // results are prefixed by a 'with context' value if one exists for property
        public IEnumerable<string> IdentifiersForEntityProperties(string entityType, string identifier)
        {
            var entityContext = Get(entityType, identifier);

            if (entityContext == null) return Enumerable.Empty<string>();
            return entityContext.PropertySymbolTable.Identifiers();
        }

        // candidate identifiers should be prefixed by a 'with context' value if one exists for property
        public IEnumerable<IPropertyWithComponents> ContextsForMatchingPropertyIdentifiers(string entityType, string identifier, ICollection<string> candidatePropertyIdentifiers)
        {
            var entityContext = Get(entityType, identifier);

            if (entityContext == null) return Enumerable.Empty<IPropertyWithComponents>();
            return entityContext.PropertySymbolTable.ContextsForMatchingIdentifiers(candidatePropertyIdentifiers);
        }
    }

    public class EntityContext
    {
        public string Name { get; set; }
        public ParserRuleContext Context { get; set; }
        public PropertySymbolTable PropertySymbolTable { get; set; }
    }
}
