// @flow

// Test helper -- *** where should this go? ***
export { MetaEdTextBuilder } from './test/MetaEdTextBuilder';


// Functions

export { deepFreeze, deepFreezeAssign, prependIndefiniteArticle } from './src/Utility';
export { startingFromFileLoadP, build } from './src/task/Pipeline';
export { createMetaEdFile } from './src/task/MetaEdFile';
export { loadCoreBufferedFiles, loadExtensionBufferedFiles } from './src/task/BufferFileLoader';
export { loadFiles } from './src/task/FileSystemFilenameLoader';
export { newState } from './src/State';
export { addEntity, getAllEntities, getAllTopLevelEntities, getEntity, getTopLevelCoreEntity, getEntitiesOfType, getAllEntitiesNoSimpleTypes } from './src/model/EntityRepository';
export { addProperty, getAllProperties, getPropertiesOfType, newPropertyIndex } from './src/model/property/PropertyRepository';
export { isReferenceProperty, isSharedProperty, allPropertyTypes } from './src/model/property/PropertyType';
export { allEntityModelTypes, allTopLevelEntityModelTypes, topLevelCoreEntityModelTypes } from './src/model/ModelType';

// Builders

export { AssociationBuilder } from './src/builder/AssociationBuilder';
export { AssociationExtensionBuilder } from './src/builder/AssociationExtensionBuilder';
export { AssociationSubclassBuilder } from './src/builder/AssociationSubclassBuilder';
export { ChoiceBuilder } from './src/builder/ChoiceBuilder';
export { CommonBuilder } from './src/builder/CommonBuilder';
export { CommonExtensionBuilder } from './src/builder/CommonExtensionBuilder';
export { DecimalTypeBuilder } from './src/builder/DecimalTypeBuilder';
export { DescriptorBuilder } from './src/builder/DescriptorBuilder';
export { DomainBuilder } from './src/builder/DomainBuilder';
export { DomainEntityBuilder } from './src/builder/DomainEntityBuilder';
export { DomainEntityExtensionBuilder } from './src/builder/DomainEntityExtensionBuilder';
export { DomainEntitySubclassBuilder } from './src/builder/DomainEntitySubclassBuilder';
export { EnumerationBuilder } from './src/builder/EnumerationBuilder';
export { IntegerTypeBuilder } from './src/builder/IntegerTypeBuilder';
export { InterchangeBuilder } from './src/builder/InterchangeBuilder';
export { NamespaceInfoBuilder } from './src/builder/NamespaceInfoBuilder';
export { SharedDecimalBuilder } from './src/builder/SharedDecimalBuilder';
export { SharedIntegerBuilder } from './src/builder/SharedIntegerBuilder';
export { SharedStringBuilder } from './src/builder/SharedStringBuilder';
export { StringTypeBuilder } from './src/builder/StringTypeBuilder';

// Flow types

export type { State } from './src/State';
export type { InputDirectory } from './src/task/FileSystemFilenameLoader';
export type { FileSet, MetaEdFile } from './src/task/MetaEdFile';
export type { FileIndex } from './src/task/FileIndex';
export type { Validator } from './src/validator/Validator';
export type { ValidationFailure } from './src/validator/ValidationFailure';
export type { Enhancer } from './src/enhancer/Enhancer';
export type { EnhancerResult } from './src/enhancer/EnhancerResult';
export type { Generator } from './src/generator/Generator';
export type { GeneratorResult } from './src/generator/GeneratorResult';
export type { GeneratedOutput } from './src/generator/GeneratedOutput';
export type { MetaEdEnvironment, PluginEnvironment, SemVer } from './src/MetaEdEnvironment';
export type { MetaEdPlugin, PluginManifest } from './src/plugin/PluginTypes';

// Properties
export type { AssociationProperty } from './src/model/property/AssociationProperty';
export type { BooleanProperty } from './src/model/property/BooleanProperty';
export type { ChoiceProperty } from './src/model/property/ChoiceProperty';
export type { CommonProperty } from './src/model/property/CommonProperty';
export type { CurrencyProperty } from './src/model/property/CurrencyProperty';
export type { DateProperty } from './src/model/property/DateProperty';
export type { DecimalProperty } from './src/model/property/DecimalProperty';
export type { DescriptorProperty } from './src/model/property/DescriptorProperty';
export type { DomainEntityProperty } from './src/model/property/DomainEntityProperty';
export type { DurationProperty } from './src/model/property/DurationProperty';
export type { EntityProperty, HasReferencedEntity } from './src/model/property/EntityProperty';
export type { EnumerationProperty } from './src/model/property/EnumerationProperty';
export type { InlineCommonProperty } from './src/model/property/InlineCommonProperty';
export type { IntegerProperty } from './src/model/property/IntegerProperty';
export type { MergedProperty } from './src/model/property/MergedProperty';
export type { PercentProperty } from './src/model/property/PercentProperty';
export type { PropertyIndex } from './src/model/property/PropertyRepository';
export type { PropertyType } from './src/model/property/PropertyType';
export type { ReferentialProperty } from './src/model/property/ReferentialProperty';
export type { SchoolYearEnumerationProperty } from './src/model/property/SchoolYearEnumerationProperty';
export type { SharedDecimalProperty } from './src/model/property/SharedDecimalProperty';
export type { SharedIntegerProperty } from './src/model/property/SharedIntegerProperty';
export type { SharedShortProperty } from './src/model/property/SharedShortProperty';
export type { SharedStringProperty } from './src/model/property/SharedStringProperty';
export type { ShortProperty } from './src/model/property/ShortProperty';
export type { SimpleProperty } from './src/model/property/SimpleProperty';
export type { SharedSimple } from './src/model/SharedSimple';
export type { StringProperty } from './src/model/property/StringProperty';
export type { TimeProperty } from './src/model/property/TimeProperty';
export type { YearProperty } from './src/model/property/YearProperty';

// Entities
export type { AbstractEntity } from './src/model/AbstractEntity';
export type { Association } from './src/model/Association';
export type { AssociationExtension } from './src/model/AssociationExtension';
export type { AssociationSubclass } from './src/model/AssociationSubclass';
export type { Choice } from './src/model/Choice';
export type { Common } from './src/model/Common';
export type { CommonExtension } from './src/model/CommonExtension';
export type { DecimalType } from './src/model/DecimalType';
export type { Descriptor } from './src/model/Descriptor';
export type { Domain } from './src/model/Domain';
export type { DomainEntity } from './src/model/DomainEntity';
export type { DomainEntityExtension } from './src/model/DomainEntityExtension';
export type { DomainEntitySubclass } from './src/model/DomainEntitySubclass';
export type { DomainItem } from './src/model/DomainItem';
export type { EntityRepository } from './src/model/EntityRepository';
export type { Enumeration } from './src/model/Enumeration';
export type { EnumerationItem } from './src/model/EnumerationItem';
export type { IntegerType } from './src/model/IntegerType';
export type { Interchange } from './src/model/Interchange';
export type { InterchangeExtension } from './src/model/InterchangeExtension';
export type { InterchangeItem } from './src/model/InterchangeItem';
export type { MapTypeEnumeration } from './src/model/MapTypeEnumeration';
export type { ModelBase } from './src/model/ModelBase';
export type { ModelType } from './src/model/ModelType';
export type { NamespaceInfo } from './src/model/NamespaceInfo';
export type { SchoolYearEnumeration } from './src/model/SchoolYearEnumeration';
export type { SharedDecimal } from './src/model/SharedDecimal';
export type { SharedInteger } from './src/model/SharedInteger';
export type { SharedString } from './src/model/SharedString';
export type { SourceMap } from './src/model/SourceMap';
export type { StringType } from './src/model/StringType';
export type { Subdomain } from './src/model/Subdomain';
export type { TopLevelEntity } from './src/model/TopLevelEntity';

// Null Objects
export { NoMapTypeEnumeration } from './src/model/MapTypeEnumeration';
export { NoTopLevelEntity } from './src/model/TopLevelEntity';

// Factories
export { newMetaEdEnvironment, newPluginEnvironment } from './src/MetaEdEnvironment';
export { newMetaEdPlugin } from './src/plugin/PluginTypes';

export { newAssociationProperty } from './src/model/property/AssociationProperty';
export { newBooleanProperty } from './src/model/property/BooleanProperty';
export { newChoiceProperty } from './src/model/property/ChoiceProperty';
export { newCommonProperty } from './src/model/property/CommonProperty';
export { newCurrencyProperty } from './src/model/property/CurrencyProperty';
export { newDateProperty } from './src/model/property/DateProperty';
export { newDecimalProperty } from './src/model/property/DecimalProperty';
export { newDescriptorProperty } from './src/model/property/DescriptorProperty';
export { newDomainEntityProperty } from './src/model/property/DomainEntityProperty';
export { newDurationProperty } from './src/model/property/DurationProperty';
export { newEnumerationProperty } from './src/model/property/EnumerationProperty';
export { newInlineCommonProperty } from './src/model/property/InlineCommonProperty';
export { newIntegerProperty } from './src/model/property/IntegerProperty';
export { newMergedProperty } from './src/model/property/MergedProperty';
export { newPercentProperty } from './src/model/property/PercentProperty';
export { newSchoolYearEnumerationProperty } from './src/model/property/SchoolYearEnumerationProperty';
export { newSharedDecimalProperty } from './src/model/property/SharedDecimalProperty';
export { newSharedIntegerProperty } from './src/model/property/SharedIntegerProperty';
export { newSharedShortProperty } from './src/model/property/SharedShortProperty';
export { newSharedStringProperty } from './src/model/property/SharedStringProperty';
export { newShortProperty } from './src/model/property/ShortProperty';
export { newSimpleProperty } from './src/model/property/SimpleProperty';
export { newStringProperty } from './src/model/property/StringProperty';
export { newTimeProperty } from './src/model/property/TimeProperty';
export { newYearProperty } from './src/model/property/YearProperty';

export { newAbstractEntity } from './src/model/AbstractEntity';
export { newAssociation } from './src/model/Association';
export { newAssociationExtension } from './src/model/AssociationExtension';
export { newAssociationSubclass } from './src/model/AssociationSubclass';
export { newChoice } from './src/model/Choice';
export { newCommon } from './src/model/Common';
export { newCommonExtension } from './src/model/CommonExtension';
export { newDecimalType } from './src/model/DecimalType';
export { newDescriptor } from './src/model/Descriptor';
export { newDomain } from './src/model/Domain';
export { newDomainEntity } from './src/model/DomainEntity';
export { newDomainEntityExtension } from './src/model/DomainEntityExtension';
export { newDomainEntitySubclass } from './src/model/DomainEntitySubclass';
export { newDomainItem } from './src/model/DomainItem';
export { newEnumeration } from './src/model/Enumeration';
export { newEnumerationItem } from './src/model/EnumerationItem';
export { newInlineCommon } from './src/model/Common';
export { newIntegerType } from './src/model/IntegerType';
export { newInterchange } from './src/model/Interchange';
export { newInterchangeExtension } from './src/model/InterchangeExtension';
export { newInterchangeItem } from './src/model/InterchangeItem';
export { newMapTypeEnumeration } from './src/model/MapTypeEnumeration';
export { newNamespaceInfo } from './src/model/NamespaceInfo';
export { newSchoolYearEnumeration } from './src/model/SchoolYearEnumeration';
export { newSharedDecimal } from './src/model/SharedDecimal';
export { newSharedInteger } from './src/model/SharedInteger';
export { newSharedString } from './src/model/SharedString';
export { newSourceMap } from './src/model/SourceMap';
export { newStringType } from './src/model/StringType';
export { newSubdomain } from './src/model/Subdomain';
export { asTopLevelEntity, newTopLevelEntity } from './src/model/TopLevelEntity';
