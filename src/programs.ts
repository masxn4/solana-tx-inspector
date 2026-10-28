const KNOWN_PROGRAMS: Record<string, string> = {
  "11111111111111111111111111111111": "System Program",
  "ComputeBudget111111111111111111111111111111": "Compute Budget Program",
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA": "SPL Token Program",
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL": "Associated Token Program",
  "AddressLookupTab1e1111111111111111111111111": "Address Lookup Table Program",
  "Stake11111111111111111111111111111111111111": "Stake Program",
  "Vote111111111111111111111111111111111111111": "Vote Program"
};

export function programLabel(programId: string): string | undefined {
  return KNOWN_PROGRAMS[programId];
}

export function describeProgram(programId: string): string {
  const label = programLabel(programId);
  return label ? `${label} (${programId})` : programId;
}
