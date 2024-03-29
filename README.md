# τ tau

The Truffle Artifact Utilities are a set of four pieces of functionality designed to work with Truffle output. They are two command line utilities, and two pieces of application code.

## Command Line Utilities

There are two commands that can be run from the shell - extract and compress.

### Extract

The extract command is intended to pull out a specific field from the `MyContract.json` file. Note that it doesn't actually need a truffle file, it will work with any json file. The utility was something I wrote at a time I needed to routinely copy and paste out ABI, AST and similar contract data.

### Compress

The artifacts generated by Truffle are very inefficient in terms of space. Not only do they generate an AST, a compilation structure that is used by only a tiny fraction of niche applications, but they actually duplicate it. Of approximately 1.8 megabytes of `MyContract.json` code, the vast majority of it is actually AST.

Stripping out the AST code as well as whitespace can reduce the file size by more than 90%.

## Application Code

Two modules are included to allow you to import and investigate either the AST or the ABI, flattening them into a more human-readable and simplistic structure.

The AST is not used directly by a very large number of applications, but it **does** include critical information about internal structs that are not exposed by the ABI.

## The tau API and Usage

### tau-cli compress

Intended to squash down the Truffle artifact for web application usage in a web3 app by removing object keys that are large and typically not useful for web apps. These include bytecode (which is only needed for deployment) and large AST and source keys.

Note that this is intended to run on **a directory** not on a single file.

| Flag                           | Description                                      | Default                           |
| ------------------------------ | ------------------------------------------------ | --------------------------------- |
| `-i`, `--input` `<inputDir>`   | Input directory - source directory for contracts | `/build/contracts`                |
| `-o`, `--output` `<outputDir>` | Output directory - directory to save files to    | Same as input                     |
| `-k`, `--keep` `<keysToKeep>`  | Keys in the truffle artifact you wish to keep    | `contractName`, `networks`, `abi` |

The truffle artifact object keys listed above (abi, etc) are not deleted under any circumstances. The intent of the `keep` flag is to prevent it otherwise deleting the `bytecode` element, as an example.

If the output directory is not found, tau will make it.

> :warning: The default input and output are the same. Using this on a standard truffle project with default values **will** "damage" the truffle build files - that is the point.

Note that tau does not actually care whether they are truffle output files, it will compress **any** JSON files it finds in the same way. The only exception is that it has been explicitly told to ignore `package.json` and `package-lock.json` files as a precaution against horrible accidents.

**Usage Examples**

(In root directory of the truffle project)

`npx tau-cli compress` - Will compress all truffle build files to much smaller equivalents

`npx tau-cli compress -k bytecode,source` - Will compress all truffle build files, but retain `bytecode` and `source` keys. Note there is **no space** after the comma separation of the fields.

(In build/contracts directory)

`npx tau-cli compress -i ./ -o compressed` - Will compress all truffle build files, but retain the original and put new versions in `/build/contracts/compressed`

### tau-cli extract \<filename\> \<key\>

The extract command pulls out whatever object keys are required from the artifact. This is a good way to grab the abi of a contract, for example. It is only suitable for usage on a single file.

| Flag  | Description                             |
| ----- | --------------------------------------- |
| `-c`  | Copy to clipboard (Probably MacOS only) |
| `-w`, | Strip whitespace                        |
| `-e`  | Escape string                           |
| `-s`  | Silent output - do not display value    |

An interesting feature is that the extract command actually doesn't care if it's a truffle output. You can use the same commands to get the values from a package.json file if you like.

**Usage Examples**

`npx tau-cli extract TokenCoin abi -c` - Copy the ABI from tokencoin contract to the clipboard.

`npx tau-cli extract MonkeyMinter.json bytecode -wcs` - Copy the bytecode from the monkey minter contract and strip whitespace and escape the string. This may be needed for pasting into - for example - a validator. Unlike above this will not show the extracted output on the screen, useful for long values like this.

> Note that the .json part of the file is optional

_The seeder key_

There is an internal use flag of `seeder`. This will return an object consisting of the contract name, a description ("contractName + Contract"), an identifier (lowercase contractName), the ABI and the bytecode.

```
{
    contractName: "TokenCoin",
    description: "TokenCoin Contract",
    identifier: "tokencoin",
    abi: "[{"inputs": [{"internalType": "string","name":...",
    bytecode: "0x60806040523480156200001157600080fd5...",
}
```

Again, this is made for personal, internal use, but may be of value and is documented for that reason. Note that the standard whitespace and escape flags for output are defaulted on for this request.

For example: `npx tau-cli extract OrderBook api -cs`

## Installation

The simplest way to set up is to use npx.

The documented commands above can be used in the format `npx tau-cli <command>`. This will install the package and then run the comands.

Another option that does not require the NPM package is to use `npm link`. To do this, check out this repository and in the local directory run the command `npm link`. This command will install the package as a global command, so you can run as `tau-cli <command>` instead of `npx tau-cli`.
