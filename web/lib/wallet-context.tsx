'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

// ─── App State ───

type WalletState = {
  connected: boolean;
  connecting: boolean;
  address: string | null;       // always a plain string
  coinPublicKey: string | null; // always a plain string
  balance: string | null;       // formatted tNIGHT
  rawBalance: bigint | null;
  error: string | null;
  walletApi: any | null;
  connector: any | null;
};

type WalletContextType = WalletState & {
  connect: () => Promise<void>;
  disconnect: () => void;
};

/**
 * Safely extract a string from a wallet API return value.
 * The API might return:
 *   - a plain string: "abc123..."
 *   - an object: { unshieldedAddress: "abc..." }
 *   - a Uint8Array / Buffer
 *   - something else entirely
 */
function extractString(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  // Object with a single meaningful key (e.g. { unshieldedAddress: "..." })
  if (typeof val === 'object' && !ArrayBuffer.isView(val)) {
    const keys = Object.keys(val);
    if (keys.length === 1 && typeof val[keys[0]] === 'string') {
      return val[keys[0]];
    }
    // Try common key names
    for (const key of ['address', 'unshieldedAddress', 'shieldedAddress', 'coinPublicKey', 'value']) {
      if (typeof val[key] === 'string') return val[key];
    }
    // Last resort: stringify
    try { return JSON.stringify(val); } catch { return String(val); }
  }
  // Uint8Array / Buffer → hex
  if (ArrayBuffer.isView(val)) {
    return Array.from(new Uint8Array(val.buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return String(val);
}

function truncateAddress(addr: any): string {
  const str = extractString(addr);
  if (!str || str.length <= 14) return str;
  return `${str.slice(0, 8)}...${str.slice(-4)}`;
}

function formatBalance(raw: bigint): string {
  if (raw === 0n) return '0';
  const str = raw.toString();
  if (str.length <= 6) return str;
  if (raw >= 1_000_000n) return `${(Number(raw) / 1_000_000).toFixed(2)}M`;
  if (raw >= 1_000n) return `${(Number(raw) / 1_000).toFixed(2)}K`;
  return str;
}

// ─── Context ───
const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet(): WalletContextType {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within <WalletProvider>');
  return ctx;
}

// ─── Provider ───
export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    connected: false,
    connecting: false,
    address: null,
    coinPublicKey: null,
    balance: null,
    rawBalance: null,
    error: null,
    walletApi: null,
    connector: null,
  });

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, connecting: true, error: null }));

    try {
      // ── 1. Discover wallet ──
      const midnight = typeof window !== 'undefined' ? (window as any).midnight : null;
      if (!midnight) {
        throw new Error('Lace wallet not detected — install it to continue');
      }

      let connector: any = midnight.mnLace || null;
      if (!connector) {
        const keys = Object.keys(midnight);
        if (keys.length > 0) connector = midnight[keys[0]];
      }
      if (!connector) throw new Error('No Midnight wallet found');

      console.log('[wallet] Connector:', connector.name, 'v' + connector.apiVersion);
      console.log('[wallet] Connector keys:', Object.keys(connector));

      // ── 2. Connect / Enable ──
      let walletApi: any;
      if (typeof connector.connect === 'function') {
        walletApi = await connector.connect('preview');
      } else if (typeof connector.enable === 'function') {
        walletApi = await connector.enable();
      } else {
        throw new Error('Wallet has no connect() or enable() method');
      }

      console.log('[wallet] API returned. Keys:', Object.keys(walletApi));
      console.log('[wallet] API raw value:', walletApi);

      // ── 3. Extract address ──
      let address = '';
      let coinPublicKey = '';

      // Try state() method (legacy API)
      if (typeof walletApi.state === 'function') {
        try {
          const ws = await walletApi.state();
          console.log('[wallet] state() returned:', ws);
          address = extractString(ws?.address || ws);
          coinPublicKey = extractString(ws?.coinPublicKey);
        } catch (e) {
          console.warn('[wallet] state() failed:', e);
        }
      }

      // If state() didn't give us an address, try granular methods
      if (!address) {
        for (const method of ['getUnshieldedAddress', 'getShieldedAddress', 'getAddress']) {
          if (typeof walletApi[method] === 'function') {
            try {
              const result = await walletApi[method]();
              console.log(`[wallet] ${method}() returned:`, result);
              address = extractString(result);
              if (address) break;
            } catch (e) {
              console.warn(`[wallet] ${method}() failed:`, e);
            }
          }
        }
      }

      // If walletApi itself has address-like properties (v4 might return state directly)
      if (!address) {
        address = extractString(walletApi.address || walletApi.unshieldedAddress || walletApi.shieldedAddress);
        console.log('[wallet] Extracted address from walletApi properties:', address);
      }

      console.log('[wallet] Final address:', address);
      console.log('[wallet] Final coinPublicKey:', coinPublicKey);

      // ── 4. Fetch balance ──
      let balance = '—';
      let rawBalance = 0n;

      // Method A: serviceUriConfig → indexer
      if (typeof connector.serviceUriConfig === 'function') {
        try {
          const uris = await connector.serviceUriConfig();
          console.log('[wallet] Service URIs:', uris);

          if (coinPublicKey && uris.indexerUri) {
            try {
              const res = await fetch(`${uris.indexerUri}/coins/${coinPublicKey}`);
              if (res.ok) {
                const data = await res.json();
                console.log('[wallet] Indexer coins response:', data);
                if (Array.isArray(data)) {
                  rawBalance = data.reduce((sum: bigint, c: any) => sum + BigInt(c.value || 0), 0n);
                } else if (data?.balance) {
                  rawBalance = BigInt(data.balance);
                }
              }
            } catch (e) {
              console.warn('[wallet] Indexer fetch failed:', e);
            }
          }
        } catch (e) {
          console.warn('[wallet] serviceUriConfig() failed:', e);
        }
      }

      // Method B: Direct balance methods on walletApi
      if (rawBalance === 0n) {
        for (const method of ['getShieldedBalances', 'getUnshieldedBalances', 'getBalances']) {
          if (typeof walletApi[method] === 'function') {
            try {
              const bals = await walletApi[method]();
              console.log(`[wallet] ${method}() returned:`, bals);
              if (bals && typeof bals === 'object') {
                for (const val of Object.values(bals)) {
                  rawBalance += BigInt(val as any);
                }
              }
              if (rawBalance > 0n) break;
            } catch (e) {
              console.warn(`[wallet] ${method}() failed:`, e);
            }
          }
        }
      }

      // Method C: walletApi might have balances property directly
      if (rawBalance === 0n && walletApi.balances && typeof walletApi.balances === 'object') {
        for (const val of Object.values(walletApi.balances)) {
          rawBalance += BigInt(val as any);
        }
        console.log('[wallet] Got balance from walletApi.balances:', rawBalance.toString());
      }

      if (rawBalance > 0n) {
        balance = formatBalance(rawBalance);
      }
      console.log('[wallet] Final balance:', balance, '(raw:', rawBalance.toString(), ')');

      // ── 5. Set state (all values guaranteed to be strings) ──
      setState({
        connected: true,
        connecting: false,
        address: address || 'Unknown',
        coinPublicKey: coinPublicKey || '',
        balance,
        rawBalance,
        error: null,
        walletApi,
        connector,
      });

    } catch (err: any) {
      console.error('[wallet] Connection failed:', err);
      setState(prev => ({
        ...prev,
        connecting: false,
        error: err?.message || 'Failed to connect wallet',
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      connected: false,
      connecting: false,
      address: null,
      coinPublicKey: null,
      balance: null,
      rawBalance: null,
      error: null,
      walletApi: null,
      connector: null,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export { truncateAddress };
