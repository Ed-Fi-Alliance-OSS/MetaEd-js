Coding Style Guide
======

* Use ES2018 language features, anything stage 4 is also fine, discuss before introducing anything stage 3.
* Use Flow.
* Use ESLint with Airbnb presets.
* Use Prettier.
* Only Builders can be classes, Models are JS objects, the rest (Validators, Enhancers, etc.) are simply functions.
* No abbreviations, no truncations of variable/method/file names.
* Validator, Enhancer and Diminisher file names must be descriptive. Be as verbose as necessary.
* Validators, Enhancers and Diminishers must do only one thing - truly SRP.
* Minimize plurals.
* Minimize temp variables.
* Extract small pure functions to name behaviors. Be as verbose as necessary.
* Pure functions belong outside of classes.
* Strongly prefer pure functions to those with side effects.
* You almost never need private class methods.
* Never ever mutate data at the module level.
* Type annotations everywhere.
* Never suppress Flow errors unless you can prove you know better than Flow, document why.
* Minimize use of ESLint ignore
  * Example where it is ok is unused method parameters for methods called by third-party libraries.
* Tests are the documentation, make sure they are clear.
* We'll start failing builds with poor coverage soon.
* Snapshots in tests should be used only where there is complex text comparison going on.
* Snapshots should always be accompanied with regular test case assertions.
* In tests, strings for MetaEdNames should be the same as the variable name.
