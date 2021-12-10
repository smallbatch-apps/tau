const fs = require("fs");
const chalk = require("chalk");
// const path = require('path');

const extractFiles = (fileName, key, cmd) => {
  const stripWhitespace = typeof cmd.W !== "undefined";
  const escapeString = typeof cmd.E !== "undefined";
  const silentMode = typeof cmd.S !== "undefined";
  const toClipBoard = typeof cmd.C !== "undefined";

  const fileExt = fileName.substring(fileName.length - 5, fileName.length);

  if (fileExt !== ".json") {
    fileName = `${fileName}.json`;
  }

  if (process.platform !== "darwin" && silentMode) {
    console.log(
      chalk.red(
        "This will not return anything, as your OS cannot use the clipboard and silent mode will prevent output."
      )
    );
    return;
  }

  console.log(
    "Getting element %s from %s",
    chalk.cyan(key),
    chalk.cyan(fileName)
  );

  if (!fs.existsSync(fileName)) {
    console.log(chalk.red("Error: The requested file does not exist"));
    return;
  }

  if (toClipBoard && process.platform !== "darwin") {
    console.log(
      chalk.red("Clipboard access currently only available on MacOS")
    );
    return;
  }

  const fileContent = fs.readFileSync(fileName);

  const fileJson = JSON.parse(fileContent);

  if (key === "api") {
    let { abi, contractName, bytecode } = fileJson;

    const apiBody = {
      contractName,
      description: `${contractName} Contract`,
      identifier: contractName.toLowerCase(),
      abi: JSON.stringify(abi),
      bytecode,
    };

    if (toClipBoard) {
      var proc = require("child_process").spawn("pbcopy");
      proc.stdin.write(JSON.stringify(apiBody, null, 2));
      proc.stdin.end();
      console.log(chalk.green("API request body copied to clipboard"));
    }
    if (!silentMode) {
      console.log(
        chalk.whiteBright(JSON.stringify({ contract: apiBody }, null, 2))
      );
    }

    return;
  }

  const returnValue = key
    .split(".")
    .reduce((jsObject, fragment) => jsObject[fragment], fileJson);

  if (!returnValue) {
    console.log(chalk.red(`The element ${key} does not exist in this file.`));
    console.log("Valid elements are:");
    Object.keys(fileJson).forEach((e) => console.log("  ", e));
    return;
  }

  let stringValue = JSON.stringify(returnValue);

  if (escapeString) {
    stringValue = stringValue.replace(/[\\$'"]/g, "\\$&");
    console.log("Escaping string");
  }

  if (stripWhitespace) {
    stringValue = stringValue.replace(/\s/g, "");
    console.log("Removing whitespace");
  }

  if (toClipBoard && process.platform === "darwin") {
    var proc = require("child_process").spawn("pbcopy");
    proc.stdin.write(stringValue);
    proc.stdin.end();

    console.log(chalk.green(`${key} value copied to clipboard`));
  }

  if (!silentMode) {
    console.log(chalk.whiteBright(stringValue));
  }
};

module.exports = { extractFiles };
