import { Connection, PublicKey, VersionedTransactionResponse } from "@solana/web3.js";

export type TxReport = {
  signature: string;
  slot: number;
  status: "success" | "failed";
  feeLamports: number;
  computeUnits?: number;
  accountCount: number;
  signerCount: number;
  programIds: string[];
  logMessages: string[];
  error: unknown | null;
};

export function summarizeTransaction(signature: string, tx: VersionedTransactionResponse): TxReport {
  const keys = tx.transaction.message.getAccountKeys();
  const staticKeys = tx.transaction.message.staticAccountKeys;
  const signerCount = tx.transaction.message.header.numRequiredSignatures;
  const programIds = new Set<string>();

  for (const ix of tx.transaction.message.compiledInstructions) {
    const key = keys.get(ix.programIdIndex);
    if (key) programIds.add(key.toBase58());
  }

  return {
    signature,
    slot: tx.slot,
    status: tx.meta?.err ? "failed" : "success",
    feeLamports: tx.meta?.fee ?? 0,
    computeUnits: tx.meta?.computeUnitsConsumed ?? undefined,
    accountCount: keys.length,
    signerCount: Math.min(signerCount, staticKeys.length),
    programIds: [...programIds],
    logMessages: tx.meta?.logMessages ?? [],
    error: tx.meta?.err ?? null
  };
}

export async function inspectTransaction(
  signature: string,
  endpoint = "https://api.mainnet-beta.solana.com"
): Promise<TxReport> {
  if (!signature || signature.length < 32) throw new Error("A Solana transaction signature is required.");
  const connection = new Connection(endpoint, "confirmed");
  const tx = await connection.getTransaction(signature, { maxSupportedTransactionVersion: 0 });
  if (!tx) throw new Error("Transaction not found at the selected RPC endpoint.");
  return summarizeTransaction(signature, tx);
}
