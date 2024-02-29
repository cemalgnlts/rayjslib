import { readFileSync, writeFileSync } from "node:fs";

const api = JSON.parse(readFileSync("tools/api/raylib.json"));
const exportedFuncs = JSON.parse(readFileSync("tools/exportedFunctions.json"));

const KNOWN_TYPES = ["void", "Color", "Vector2"];

exportedFuncs.shift(); // skip _malloc

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
    parts.push("  // ", description, "\n"); // // description
    parts.push("  ", name, "(",); // name(
    parts.push(args.join(", ")); // p1: string, p2: number
    parts.push("): ", typeCheck(returnType), ";"); // ): void;

    data.push(parts.join(""));
  }

  const template = `export async function setupRaylib({
  canvas: HTMLCanvasElement
}): Promise<RayJSlib>;

export function Color({ r: number = 0, g: number = 0, b: number = 0, a: number = 255 }): number;

interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Vector2 {
  x: number;
  y: number;
}

declare class RayJSlib {
${data.join("\n\n")}
}`;

  return template;
}

function typeCheck(type) {
  // const type = type_.includes("unsingned ") ? type_.replace("unsigned ", "") : type_;

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
  }

  if (KNOWN_TYPES.includes(type)) return type;

  throw Error("Unimplemented type: " + type);
}