# Validators in the generation process

## Validators

A validator is basically a file named with the rule that it validates, which exports a single function named validate, that
receives an instance of MetaEdEnvironment as parameter, and returns an array of ValidationFailure objects. If the returned
array is empty, validation was successful. Validators can push both validation warnings and errors.

It is a good practice to have validators in the plugins, so that you as a developer can make sure that the plugin will run as
expected and it is supported.

Each error/warning pushed to the array will include information about the original .metaed file, and possibly the line and
character where the error was found.

![validator diagram](images/validators_diagram.png)

## How does a validator gets integrated into the metaed-core?

Inside of metaed-core, you will find a directory named pipeline, and inside of it is a file named Pipeline.ts. In that file
is method named executePipeline which runs the full MetaEd process. Every plugin exports a function named initialize which
returns, among other things, an array of validator functions for the pipeline to execute in order.  The validator functions
for each plugin are executed one-by-one in RunValidator.ts.

After running the validators, any error/warning found, will be logged by collecting all of the resulting ValidationFailure
objects.  These include information on the error itself and the file where the error/warning is present.

## Plugins that require a valid model

A plugin can set `requiresValidModel: true` in its initializer when its enhancers or generators
require valid model input. The pipeline checks accumulated validation errors after running that
plugin's validators. If errors exist, it skips the plugin's enhancers and generators, marks the
pipeline result as failed, and continues to subsequent plugins. This preserves later diagnostics
when `stopOnValidationFailure` is false, as it is during IDE linting. A failed pipeline does not
write generated output or replace previously generated files.

Warnings do not trigger the requirement. Omitting the flag or setting it to false preserves
existing processing behavior. `stopOnValidationFailure: true` still stops at the first plugin
validation stage with errors. The requirement does not run validators when `runValidators` is
disabled; it checks any errors already accumulated in the state.
