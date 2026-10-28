import test from "node:test";
import assert from "node:assert/strict";
import { getBalanceChanges, getTokenBalanceChanges } from "./analysis.js";

test("reports only changed SOL balances", () => {
  const tx = { meta: { preBalances: [100, 200], postBalances: [90, 200] } } as any;
  assert.deepEqual(getBalanceChanges(tx), [
    { accountIndex: 0, beforeLamports: 100, afterLamports: 90, deltaLamports: -10 }
  ]);
});

test("reports token amount changes", () => {
  const token = (accountIndex:number, amount:string) => ({
    accountIndex, mint:"Mint111", owner:"Owner111",
    uiTokenAmount:{uiAmountString:amount}
  });
  const tx = { meta: { preTokenBalances:[token(2,"1")], postTokenBalances:[token(2,"3")] } } as any;
  assert.deepEqual(getTokenBalanceChanges(tx), [{
    accountIndex:2, mint:"Mint111", owner:"Owner111", before:"1", after:"3"
  }]);
});
