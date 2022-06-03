#!/usr/bin/env node

const program = require("commander");

const { compressFiles } = require("./compress");
const { extractFiles } = require("./extract");

program
  .command("compress")
  .description("Compress artifact files")
  .option("-i, --input <inputDir>", "Input directory", "build/contracts")
  .option("-o, --output <outputDir>", "Output directory")
  .option("-k, --keep <keysToKeep>", "Keys that you want to keep")
  .action(function (cmd) {
    compressFiles(cmd);
  });

program
  .command("extract <file> <key>")
  .description("Extract element from truffle artifact")
  .option("-c", "Copy to clipboard (MacOS only)")
  .option("-w", "Strip whitespace")
  .option("-e", "Escape string")
  .option("-s", "Silent output - do not display value")
  .action(function (fileName, key, cmd) {
    extractFiles(fileName, key, cmd);
  });

program.parse(process.argv);
