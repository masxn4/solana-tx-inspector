import type { VersionedTransactionResponse } from "@solana/web3.js";

export type BalanceChange = {
  accountIndex: number;
  beforeLamports: number;
  afterLamports: number;
  deltaLamports: number;
};

export type TokenBalanceChange = {
  accountIndex: number;
  mint: string;
  owner?: string;
  before: string;
  after: string;
};

export function getBalanceChanges(tx: VersionedTransactionResponse): BalanceChange[] {
  const pre = tx.meta?.preBalances ?? [];
  const post = tx.meta?.postBalances ?? [];
  return pre.map((beforeLamports, accountIndex) => {
    const afterLamports = post[accountIndex] ?? beforeLamports;
    return { accountIndex, beforeLamports, afterLamports, deltaLamports: afterLamports - beforeLamports };
  }).filter(change => change.deltaLamports !== 0);
}

export function getTokenBalanceChanges(tx: VersionedTransactionResponse): TokenBalanceChange[] {
  const pre = new Map((tx.meta?.preTokenBalances ?? []).map(x => [`${x.accountIndex}:${x.mint}`, x]));
  const post = new Map((tx.meta?.postTokenBalances ?? []).map(x => [`${x.accountIndex}:${x.mint}`, x]));
  const keys = new Set([...pre.keys(), ...post.keys()]);
  return [...keys].map(key => {
    const before = pre.get(key);
    const after = post.get(key);
    const source = after ?? before!;
    return {
      accountIndex: source.accountIndex,
      mint: source.mint,
      owner: after?.owner ?? before?.owner,
      before: before?.uiTokenAmount.uiAmountString ?? "0",
      after: after?.uiTokenAmount.uiAmountString ?? "0"
    };
  }).filter(x => x.before !== x.after);
}
