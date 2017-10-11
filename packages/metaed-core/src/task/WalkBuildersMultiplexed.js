// @flow
import antlr4 from 'antlr4';
import { MetaEdGrammarListener } from '../grammar/gen/MetaEdGrammarListener';
import type { State } from '../State';
import type { MetaEdEnvironment } from '../MetaEdEnvironment';
import type { ValidationFailure } from '../validator/ValidationFailure';
import { AssociationBuilder } from '../builder/AssociationBuilder';
import { AssociationExtensionBuilder } from '../builder/AssociationExtensionBuilder';
import { AssociationSubclassBuilder } from '../builder/AssociationSubclassBuilder';
import { ChoiceBuilder } from '../builder/ChoiceBuilder';
import { CommonBuilder } from '../builder/CommonBuilder';
import { CommonExtensionBuilder } from '../builder/CommonExtensionBuilder';
import { DecimalTypeBuilder } from '../builder/DecimalTypeBuilder';
import { DescriptorBuilder } from '../builder/DescriptorBuilder';
import { DomainBuilder } from '../builder/DomainBuilder';
import { DomainEntityBuilder } from '../builder/DomainEntityBuilder';
import { DomainEntityExtensionBuilder } from '../builder/DomainEntityExtensionBuilder';
import { DomainEntitySubclassBuilder } from '../builder/DomainEntitySubclassBuilder';
import { EnumerationBuilder } from '../builder/EnumerationBuilder';
import { IntegerTypeBuilder } from '../builder/IntegerTypeBuilder';
import { InterchangeBuilder } from '../builder/InterchangeBuilder';
import { NamespaceInfoBuilder } from '../builder/NamespaceInfoBuilder';
import { SharedDecimalBuilder } from '../builder/SharedDecimalBuilder';
import { SharedIntegerBuilder } from '../builder/SharedIntegerBuilder';
import { SharedStringBuilder } from '../builder/SharedStringBuilder';
import { StringTypeBuilder } from '../builder/StringTypeBuilder';

type ListenerEvent = string;
type InterestedBuilders = Map<ListenerEvent, Array<MetaEdGrammarListener>>;

const exitListenerMethodWhitelist = new Set([
  // AssociationBuilder
  'exitAssociation',
  'exitFirstDomainEntity',
  'exitSecondDomainEntity',

  // AssociationExtensionBuilder
  'exitAssociationExtension',

  // AssociationSubclassBuilder
  'exitAssociationSubclass',

  // ChoiceBuilder
  'exitChoice',

  // CommonBuilder
  'exitCommon',
  'exitInlineCommon',

  // CommonExtensionBuilder
  'exitCommonExtension',

  // DecimalTypeBuilder
  'exitDecimalProperty',
  'exitSharedDecimal',

  // DescriptorBuilder
  'exitDescriptor',
  'exitWithMapType',
  'exitEnumerationItem',

  // DomainBuilder
  'exitDomain',
  'exitSubdomain',
  'exitDomainItem',

  // DomainEntityBuilder
  'exitAbstractEntity',
  'exitDomainEntity',

  // DomainEntityExtensionBuilder
  'exitDomainEntityExtension',

  // DomainEntitySubclassBuilder
  'exitDomainEntitySubclass',

  // EnumerationBuilder
  'exitEnumeration',
  'exitEnumerationItem',

  // IntegerTypeBuilder
  'exitIntegerProperty',
  'exitSharedInteger',
  'exitShortProperty',
  'exitSharedShort',

  // InterchangeBuilder
  'exitInterchange',
  'exitInterchangeExtension',
  'exitInterchangeElement',
  'exitInterchangeIdentity',

  // SharedDecimal
  'exitSharedDecimal',

  // SharedIntegerBuilder
  'exitSharedInteger',
  'exitSharedShort',

  // SharedStringBuilder
  'exitSharedString',

  // StringTypeBuilder
  'exitStringProperty',
  'exitSharedString',

  // TopLevelEntityBuilder
  'exitProperty',
  'exitMergePartOfReference',
]);

function proxyMethodFactory(
  listenerMethodName: string,
  activeListeners: Set<MetaEdGrammarListener>,
  allBuilders: Array<MetaEdGrammarListener>,
  activateBuilders: InterestedBuilders,
  deactivateBuilders: InterestedBuilders) {
  return (...args) => {
    // Everybody gets the four namespace info events
    if (listenerMethodName === 'enterNamespace' ||
      listenerMethodName === 'enterNamespaceName' ||
      listenerMethodName === 'enterNamespaceType' ||
      listenerMethodName === 'exitNamespace') {
      allBuilders.forEach(builder => builder[listenerMethodName](...args));
      return;
    }

    // Ignore these frequent but never used events
    if (listenerMethodName === 'enterEveryRule' || listenerMethodName === 'visitTerminal' || listenerMethodName === 'exitEveryRule') return;

    // Ignore these container rules that we currently don't use and are unlikely to
    if (listenerMethodName === 'enterTopLevelEntity' || listenerMethodName === 'exitTopLevelEntity' || listenerMethodName === 'enterEntityConfiguration' ||
      listenerMethodName === 'exitEntityConfiguration' || listenerMethodName === 'enterInterchangeComponent' || listenerMethodName === 'exitInterchangeComponent' ||
    listenerMethodName === 'enterInterchangeExtensionComponent' || listenerMethodName === 'exitInterchangeExtensionComponent' || listenerMethodName === 'enterPropertyComponents' ||
    listenerMethodName === 'exitPropertyComponents' || listenerMethodName === 'enterPropertyAnnotation' || listenerMethodName === 'exitPropertyAnnotation') return;

    // Ignore non-whitelisted exit events.  (Exit events are used by builders far less often than enter events are.)
    if (listenerMethodName.startsWith('exit') && !exitListenerMethodWhitelist.has(listenerMethodName)) return;

    // Any activateBuilders for this event get added to active list
    const activate = activateBuilders.get(listenerMethodName);
    if (activate) activate.forEach(activeListeners.add, activeListeners);

    // All active builders get events
    activeListeners.forEach(builder => builder[listenerMethodName](...args));

    // Any deactivateBuilders for this event get removed from active list
    const deactivate = deactivateBuilders.get(listenerMethodName);
    if (deactivate) deactivate.forEach(activeListeners.delete, activeListeners);
  };
}

// takes builder list and returns a MetaEdGrammarListener proxy that forwards events
// based on whether events indicate a builder should be active
function multiplex(allBuilders: Array<MetaEdGrammarListener>, activateBuilders: InterestedBuilders, deactivateBuilders: InterestedBuilders): MetaEdGrammarListener {
  const activeListeners: Set<MetaEdGrammarListener> = new Set();

  // proxy the "get" method, because method invocation "step one" is to get the function itself
  return new Proxy(new MetaEdGrammarListener(), {
    get: (target, listenerMethodName) => proxyMethodFactory(listenerMethodName, activeListeners, allBuilders, activateBuilders, deactivateBuilders),
  });
}

export function multiplexedBuilder(metaEd: MetaEdEnvironment, validationFailure: Array<ValidationFailure>): MetaEdGrammarListener {
  const associationBuilder = new AssociationBuilder(metaEd, validationFailure);
  const associationExtensionBuilder = new AssociationExtensionBuilder(metaEd, validationFailure);
  const associationSubclassBuilder = new AssociationSubclassBuilder(metaEd, validationFailure);
  const choiceBuilder = new ChoiceBuilder(metaEd, validationFailure);
  const commonBuilder = new CommonBuilder(metaEd, validationFailure);
  const commonExtensionBuilder = new CommonExtensionBuilder(metaEd, validationFailure);
  const decimalTypeBuilder = new DecimalTypeBuilder(metaEd, validationFailure);
  const descriptorBuilder = new DescriptorBuilder(metaEd, validationFailure);
  const domainBuilder = new DomainBuilder(metaEd, validationFailure);
  const domainEntityBuilder = new DomainEntityBuilder(metaEd, validationFailure);
  const domainEntityExtensionBuilder = new DomainEntityExtensionBuilder(metaEd, validationFailure);
  const domainEntitySubclassBuilder = new DomainEntitySubclassBuilder(metaEd, validationFailure);
  const enumerationBuilder = new EnumerationBuilder(metaEd, validationFailure);
  const integerTypeBuilder = new IntegerTypeBuilder(metaEd, validationFailure);
  const interchangeBuilder = new InterchangeBuilder(metaEd, validationFailure);
  const namespaceInfoBuilder = new NamespaceInfoBuilder(metaEd, validationFailure);
  const sharedDecimalBuilder = new SharedDecimalBuilder(metaEd, validationFailure);
  const sharedIntegerBuilder = new SharedIntegerBuilder(metaEd, validationFailure);
  const sharedStringBuilder = new SharedStringBuilder(metaEd, validationFailure);
  const stringTypeBuilder = new StringTypeBuilder(metaEd, validationFailure);

  const allBuilders: Array<MetaEdGrammarListener> = [
    associationBuilder,
    associationExtensionBuilder,
    associationSubclassBuilder,
    choiceBuilder,
    commonBuilder,
    commonExtensionBuilder,
    decimalTypeBuilder,
    descriptorBuilder,
    domainBuilder,
    domainEntityBuilder,
    domainEntityExtensionBuilder,
    domainEntitySubclassBuilder,
    enumerationBuilder,
    integerTypeBuilder,
    interchangeBuilder,
    namespaceInfoBuilder,
    sharedDecimalBuilder,
    sharedIntegerBuilder,
    sharedStringBuilder,
    stringTypeBuilder,
  ];

  const activateBuilders: InterestedBuilders = new Map();
  const deactivateBuilders: InterestedBuilders = new Map();

  activateBuilders.set('enterAssociation', [associationBuilder]);
  deactivateBuilders.set('exitAssociation', [associationBuilder]);

  activateBuilders.set('enterAssociationExtension', [associationExtensionBuilder]);
  deactivateBuilders.set('exitAssociationExtension', [associationExtensionBuilder]);

  activateBuilders.set('enterAssociationSubclass', [associationSubclassBuilder]);
  deactivateBuilders.set('exitAssociationSubclass', [associationSubclassBuilder]);

  activateBuilders.set('enterChoice', [choiceBuilder]);
  deactivateBuilders.set('exitChoice', [choiceBuilder]);

  activateBuilders.set('enterCommon', [commonBuilder]);
  deactivateBuilders.set('exitCommon', [commonBuilder]);
  activateBuilders.set('enterInlineCommon', [commonBuilder]);
  deactivateBuilders.set('exitInlineCommon', [commonBuilder]);

  activateBuilders.set('enterCommonExtension', [commonExtensionBuilder]);
  deactivateBuilders.set('exitCommonExtension', [commonExtensionBuilder]);

  activateBuilders.set('enterSharedDecimal', [decimalTypeBuilder, sharedDecimalBuilder]);
  deactivateBuilders.set('exitSharedDecimal', [decimalTypeBuilder, sharedDecimalBuilder]);
  activateBuilders.set('enterDecimalProperty', [decimalTypeBuilder]);
  deactivateBuilders.set('exitDecimalProperty', [decimalTypeBuilder]);

  activateBuilders.set('enterDescriptor', [descriptorBuilder]);
  deactivateBuilders.set('exitDescriptor', [descriptorBuilder]);

  activateBuilders.set('enterDomain', [domainBuilder]);
  deactivateBuilders.set('exitDomain', [domainBuilder]);
  activateBuilders.set('enterSubdomain', [domainBuilder]);
  deactivateBuilders.set('exitSubdomain', [domainBuilder]);

  activateBuilders.set('enterDomainEntity', [domainEntityBuilder]);
  deactivateBuilders.set('exitDomainEntity', [domainEntityBuilder]);
  activateBuilders.set('enterAbstractEntity', [domainEntityBuilder]);
  deactivateBuilders.set('exitAbstractEntity', [domainEntityBuilder]);

  activateBuilders.set('enterDomainEntityExtension', [domainEntityExtensionBuilder]);
  deactivateBuilders.set('exitDomainEntityExtension', [domainEntityExtensionBuilder]);

  activateBuilders.set('enterDomainEntitySubclass', [domainEntitySubclassBuilder]);
  deactivateBuilders.set('exitDomainEntitySubclass', [domainEntitySubclassBuilder]);

  activateBuilders.set('enterEnumeration', [enumerationBuilder]);
  deactivateBuilders.set('exitEnumeration', [enumerationBuilder]);

  activateBuilders.set('enterSharedInteger', [integerTypeBuilder, sharedIntegerBuilder]);
  deactivateBuilders.set('exitSharedInteger', [integerTypeBuilder, sharedIntegerBuilder]);
  activateBuilders.set('enterIntegerProperty', [integerTypeBuilder]);
  deactivateBuilders.set('exitIntegerProperty', [integerTypeBuilder]);
  activateBuilders.set('enterSharedShort', [integerTypeBuilder, sharedIntegerBuilder]);
  deactivateBuilders.set('exitSharedShort', [integerTypeBuilder, sharedIntegerBuilder]);
  activateBuilders.set('enterIntegerShort', [integerTypeBuilder]);
  deactivateBuilders.set('exitIntegerShort', [integerTypeBuilder]);

  activateBuilders.set('enterInterchange', [interchangeBuilder]);
  deactivateBuilders.set('exitInterchange', [interchangeBuilder]);
  activateBuilders.set('enterInterchangeExtension', [interchangeBuilder]);
  deactivateBuilders.set('exitInterchangeExtension', [interchangeBuilder]);

  activateBuilders.set('enterSharedString', [stringTypeBuilder, sharedStringBuilder]);
  deactivateBuilders.set('exitSharedString', [stringTypeBuilder, sharedStringBuilder]);
  activateBuilders.set('enterStringProperty', [stringTypeBuilder]);
  deactivateBuilders.set('exitStringProperty', [stringTypeBuilder]);

  return multiplex(allBuilders, activateBuilders, deactivateBuilders);
}

export function execute(state: State): State {
  antlr4.tree.ParseTreeWalker.DEFAULT.walk(multiplexedBuilder(state.metaEd, state.validationFailure), state.parseTree);
  return state;
}
