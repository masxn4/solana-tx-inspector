# Solana Transaction Inspector

A TypeScript CLI that turns a Solana transaction signature into a developer-friendly debugging report.

It fetches a transaction through Solana JSON-RPC and summarizes status, slot, fees, compute units, account/signers, invoked programs, runtime logs, and transaction errors.

## Setup

Requires Node.js 20+.

```bash
npm install
npm run build
```

## Usage

```bash
node dist/cli.js <TRANSACTION_SIGNATURE>
node dist/cli.js <TRANSACTION_SIGNATURE> --json
node dist/cli.js <TRANSACTION_SIGNATURE> --rpc https://your-rpc.example
```

## Development

```bash
npm run check
npm test
```

The first version is intentionally narrow: fetch a transaction and expose the information most useful during debugging. Natural next steps include decoded instructions, SOL/token balance deltas, address lookup-table reporting, and broader tests.

## Why this exists

Raw Solana transaction responses contain useful debugging data but can be noisy to inspect manually. This tool provides a compact first-pass view while retaining the logs and errors needed for deeper investigation.

## License

MIT
