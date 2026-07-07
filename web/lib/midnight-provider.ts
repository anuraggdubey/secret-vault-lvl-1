/**
 * Midnight wallet provider utilities.
 * 
 * Uses the v4 DApp Connector API:
 * - window.midnight contains UUID-keyed wallet entries (CAIP-372 compatible)
 * - Also supports legacy window.midnight.mnLace
 * - Connection uses connect(networkId) instead of enable()
 */

const NETWORK_ID = process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK || 'preview';

export async function connectWallet() {
  if (typeof window === 'undefined') {
    throw new Error('Cannot connect wallet in server environment');
  }

  const midnight = (window as any).midnight;
  if (!midnight) {
    throw new Error('Lace wallet not detected — install it to continue');
  }

  // Try legacy mnLace first, then UUID-keyed entries
  let wallet = midnight.mnLace;
  if (!wallet) {
    const keys = Object.keys(midnight);
    if (keys.length === 0) {
      throw new Error('No Midnight wallets available');
    }
    wallet = midnight[keys[0]];
  }

  // v4 API uses connect(networkId), legacy uses enable()
  if (typeof wallet.connect === 'function') {
    return await wallet.connect(NETWORK_ID);
  } else if (typeof wallet.enable === 'function') {
    return await wallet.enable();
  } else {
    throw new Error('Wallet API not compatible');
  }
}

export function isWalletAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const midnight = (window as any).midnight;
  if (!midnight) return false;
  if (midnight.mnLace) return true;
  return Object.keys(midnight).length > 0;
}
