// Remove underscore from function names.

import { readFileSync, writeFileSync } from "node:fs";

const outputFile = readFileSync("build/raylib.js", "utf-8");
const exportedFuncs = JSON.parse(readFileSync("tools/exportedFunctions.json"));

exportedFuncs.shift(); // Remove _malloc
exportedFuncs.shift(); // Remove _free

const funcNames = exportedFuncs.join("|");

const regexp = RegExp(`(${funcNames})`, "gm");

const modifiedFile = outputFile.replace(regexp, name => name.slice(1));
writeFileSync("build/raylib.js", modifiedFile);

// for (const name of exportedFuncs) {
//     const newName = name.slice(1); // Remove underscore.

//     outputFile.replace(`Module["${name}"]`, `Module["${newName}"]`);
// }