#!/usr/bin/env node
import { inspectTransaction } from "./inspector.js";

function usage(): never {
  console.error("Usage: solana-tx-inspector <signature> [--rpc <url>] [--json]");
  process.exit(1);
}

const args = process.argv.slice(2);
const signature = args[0];
if (!signature || signature.startsWith("--")) usage();

const rpcIndex = args.indexOf("--rpc");
const endpoint = rpcIndex >= 0 ? args[rpcIndex + 1] : undefined;
if (rpcIndex >= 0 && !endpoint) usage();

try {
  const report = await inspectTransaction(signature, endpoint);
  if (args.includes("--json")) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`Transaction: ${report.signature}`);
    console.log(`Status:      ${report.status}`);
    console.log(`Slot:        ${report.slot}`);
    console.log(`Fee:         ${report.feeLamports} lamports`);
    console.log(`Compute:     ${report.computeUnits ?? "not reported"} CU`);
    console.log(`Accounts:    ${report.accountCount} (${report.signerCount} signer(s))`);
    if (report.balanceChanges.length) {
      console.log("SOL balance changes:");
      for (const x of report.balanceChanges) console.log(`  account[${x.accountIndex}]: ${x.deltaLamports > 0 ? "+" : ""}${x.deltaLamports} lamports`);
    }
    if (report.tokenBalanceChanges.length) {
      console.log("Token balance changes:");
      for (const x of report.tokenBalanceChanges) console.log(`  account[${x.accountIndex}] ${x.mint}: ${x.before} -> ${x.after}`);
    }
    console.log("Programs:");
    for (const id of report.programIds) console.log(`  - ${id}`);
    if (report.error) console.log(`Error:       ${JSON.stringify(report.error)}`);
    if (report.logMessages.length) {
      console.log("Logs:");
      for (const line of report.logMessages) console.log(`  ${line}`);
    }
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
