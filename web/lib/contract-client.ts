import { SecretVaultContract } from '../managed/secret_vault/contract';

export function getVaultClient(providers: any, contractAddress: string) {
  return SecretVaultContract.at(contractAddress, providers);
}

export async function revealSecret(client: any, value: bigint, nonce: Uint8Array) {
  console.log('[contract] Sending reveal tx with value:', value);
  const tx = await client.reveal({
    secretValue: value,
    secretNonce: nonce
  });
  console.log('[contract] Reveal tx successful:', tx);
  return tx;
}

export async function commitSecret(providers: any, commitBytes: Uint8Array) {
  console.log('[contract] Deploying vault contract with commitment:', commitBytes);
  const client = await SecretVaultContract.deploy(providers, commitBytes);
  console.log('[contract] Vault deployed at:', client.deployTxData.public.contractAddress);
  return client;
}
