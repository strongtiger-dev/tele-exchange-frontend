export type Crypto = {
    symbol: string;
    name: string;
    iconUrl?: string; // Optional: link to SVG or local image
    network?: string; // Optional: e.g. "ERC20", "BEP20"
    decimals?: number;
  };
  
  export const SUPPORTED_CRYPTOS: Crypto[] = [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      iconUrl: '/assets/icons/btc.svg',
      network: 'Bitcoin',
      decimals: 8,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      iconUrl: '/assets/icons/eth.svg',
      network: 'ERC20',
      decimals: 18,
    },
    {
      symbol: 'XMR',
      name: 'Monero',
      iconUrl: '/assets/icons/xmr.svg',
      network: 'Monero',
      decimals: 12,
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      iconUrl: '/assets/icons/bnb.svg',
      network: 'BEP20',
      decimals: 18,
    },
    // Add more as needed
  ];
  
  // Helper: Get by symbol
  export const getCryptoBySymbol = (symbol: string): Crypto | undefined =>
    SUPPORTED_CRYPTOS.find((c) => c.symbol === symbol);