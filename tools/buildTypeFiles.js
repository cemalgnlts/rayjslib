import { readFileSync, writeFileSync } from "node:fs";

const api = JSON.parse(readFileSync("tools/api/raylib.json"));
const exportedFuncs = JSON.parse(readFileSync("tools/exportedFunctions.json"));

// exportedFuncs.shift(); // skip _malloc

const functions = api.functions.filter(fun => exportedFuncs.includes("_" + fun.name));

console.time("BuildTypeFiles")

const types = buildTypes();
writeFileSync("build/rayjslib.d.ts", types);

console.timeEnd("BuildTypeFiles");

function buildTypes() {
  const data = [];

  for (const { name, description, returnType, params = [] } of functions) {
    const args = params.map(({ name, type }) => name + ": " + typeCheck(type));

    const parts = [];
    parts.push("  /** ", description, " */\n"); // // description
    parts.push("  ", name, "(",); // name(
    parts.push(args.join(", ")); // p1: string, p2: number
    parts.push("): ", typeCheck(returnType), ";"); // ): void;

    data.push(parts.join(""));
  }

  const template = `export function setupRaylib({
  canvas: HTMLCanvasElement
}): Promise<RayJSlib>;

type Pointer = number;
type Color = Pointer;
type Vector2 = Pointer;

declare class RayJSlib {
  stackSave(): Pointer;
  stackAlloc(size: number): void;
  stackRestore(pointer: Pointer): void;
  stringToUTF8OnStack(text: string): Pointer;
  writeArrayToMemory(array: ArrayBuffer, buffer: Pointer): void;

${data.join("\n\n")}
}`;

  return template;
}

function typeCheck(type) {
  switch (type) {
    case "const char *":
      return "string";
    case "bool":
      return "boolean";
    case "int":
    case "double":
    case "float":
    case "unsigned int":
      return "number";
    case "void":
    case "Color":
    case "Vector2":
      return type;
  }

  throw Error("Unimplemented type: " + type);
}