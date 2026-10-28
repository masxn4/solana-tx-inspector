import test from "node:test";import assert from "node:assert/strict";import {parseInvocations} from "./logs.js";
test("parses invocation depth, compute and success",()=>{const out=parseInvocations(["Program ABC invoke [1]","Program ABC consumed 120 of 200000 compute units","Program ABC success"]);assert.deepEqual(out,[{programId:"ABC",depth:1,status:"success",units:120}]);});
test("marks failed programs",()=>assert.equal(parseInvocations(["Program XYZ invoke [2]","Program XYZ failed: custom program error: 0x1"])[0].status,"failed"));
