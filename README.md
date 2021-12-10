# TAU

The Truffle Artifact Utilities are a set of four pieces of functionality designed to work with Truffle output. They are two command line utilities, and two pieces of application code.

## Command Line Utilities

There are two commands that can be run from the shell - extract and compress.

### Extract

The extract command is intended to pull out a specific field from the `MyContract.json` file. Note that it doesn't actually need a truffle file, it will work with any json file. The utility was something I wrote at a time I needed to routinely copy and paste out ABI, AST and similar contract data.

### Compress
