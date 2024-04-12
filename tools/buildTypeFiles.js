import { readFileSync, writeFileSync } from "node:fs";

const api = JSON.parse(readFileSync("tools/api/raylib.json"));
const exportedFuncs = JSON.parse(readFileSync("tools/exportedFunctions.json"));
const requireAllocTypes = ["Ray", "Vector2", "RayCollision"];

exportedFuncs.shift(); // skip _malloc
exportedFuncs.shift(); // skip _free

const functions = api.functions.filter(fun => exportedFuncs.includes("_" + fun.name));

console.time("BuildTypeFiles")

const types = buildTypes();
writeFileSync("build/rayjslib.d.ts", types);

console.timeEnd("BuildTypeFiles");

function buildTypes() {
  const data = [];

  for (const { name, description, returnType, params = [] } of functions) {
    const args = params.map(({ name, type }) => name + ": " + typeCorrection(type));

    const parts = [];
    parts.push("  /** ", description, " */\n"); // /* description */
    parts.push("  ", name, "(",); // name(

    // Stack should be allocated for such returns.
    if (requireAllocTypes.includes(returnType)) {
      args.unshift("address: Pointer");
    }

    parts.push(args.join(", ")); // p1: string, p2: number

    parts.push("): ", typeCorrection(returnType), ";"); // ): void;

    data.push(parts.join(""));
  }

  const template = `export function setupRaylib({
  canvas: HTMLCanvasElement
}): Promise<RayJSlib>;

type Pointer = number;
type Color = Pointer;
type Vector2 = Pointer;
type Vector3 = Pointer;
type Camera3D = Pointer;
type Ray = Pointer;
type RayCollision = Pointer;
type BoundingBox = Pointer;
type Mesh = Pointer;
type Model = Pointer;
type Matrix = Pointer;

declare class RayJSlib {
  _malloc(size: number): Pointer;
  _free(point: Pointer): void;
  stackSave(): Pointer;
  stackAlloc(size: number): Pointer;
  stackRestore(pointer: Pointer): void;
  setValue(ptr: number, value: number, type: "i8" | "i16" | "i32" | "i64" | "float" | "double" | "*"): void;
  getValue(ptr: number, type: "i8" | "i16" | "i32" | "i64" | "float" | "double" | "*"): number;
  stringToUTF8OnStack(text: string): Pointer;
  writeArrayToMemory(array: ArrayBuffer, buffer: Pointer): void;

${data.join("\n\n")}
}`;

  return template;
}

function typeCorrection(type) {
  switch (type) {
    case "const char *":
      return "Pointer";
    case "bool":
      return "boolean";
    case "int":
    case "double":
    case "float":
    case "unsigned int":
      return "number";
    case "Camera *":
    case "Camera":
      return "Camera3D";
    case "void":
    case "Color":
    case "Vector2":
    case "Vector3":
    case "Camera3D":
    case "Ray":
    case "RayCollision":
    case "BoundingBox":
    case "Mesh":
    case "Model":
    case "Matrix":
      return type;
  }

  throw Error("Unimplemented type: " + type);
}