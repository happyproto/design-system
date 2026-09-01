// The ".js" specifier (not ".ts") is deliberate: this file compiles to real
// Node ESM in dist/, where relative imports must resolve to the emitted
// filename. tsconfig.build.json's "nodenext" resolution enforces this at
// typecheck time — an extensionless or ".ts" specifier here fails the build
// instead of silently emitting output Node's resolver would reject.
export { tokens } from "./tokens.js";
export type { Tokens } from "./tokens.js";
