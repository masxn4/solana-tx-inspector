import test from "node:test";
import assert from "node:assert/strict";
import { describeProgram, programLabel } from "./programs.js";

test("labels the System Program", () => {
  assert.equal(programLabel("11111111111111111111111111111111"), "System Program");
});

test("keeps unknown program ids readable", () => {
  assert.equal(describeProgram("Unknown111"), "Unknown111");
});
