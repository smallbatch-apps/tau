const fs = require("fs");
const path = require("path");

const objectKeys = [
  "source",
  "ast",
  "legacyAST",
  "sourceMap",
  "deployedSourceMap",
  "bytecode",
  "deployedBytecode",
  "metadata",
  "generatedSources",
  "deployedGeneratedSources",
  "immutableReferences",
  "sourcePath",
  "compiler",
];

const compressFiles = ({ input, output, keep }) => {
  const readPath = path.resolve(process.cwd(), input);
  fs.readdir(readPath, (err, files) => {
    const jsonFilesArray = files.filter((fileName) => {
      return (
        fileName.substring(fileName.length - 5, fileName.length) === ".json" &&
        fileName !== "package.json" &&
        fileName !== "package-lock.json"
      );
    });

    if (!jsonFilesArray.length) {
      throw Error("No json files found");
    }

    output = !output ? readPath : output;

    jsonFilesArray.forEach((file) => {
      const inputFile = path.resolve(process.cwd(), input, file);
      const outputFile = path.resolve(process.cwd(), output, file);
      compress(inputFile, outputFile, keep);
    });
  });
};

const resolveFile = (file) => {
  const filePath = path.resolve(process.cwd(), file);
  const fileContents = fs.readFileSync(filePath, { encoding: "utf8" });
  return JSON.parse(fileContents);
};

const compress = (inputFile, outputFile, keepKeys) => {
  const artifactObject = resolveFile(inputFile);

  objectKeys
    .filter((key) => !keepKeys.includes(key))
    .forEach((key) => delete artifactObject[key]);

  fs.writeFileSync(outputFile, JSON.stringify(artifactObject, null, 0));
};

module.exports = { compress, compressFiles };
