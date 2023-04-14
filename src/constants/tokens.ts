import { CHAINS, ChainId, Token } from '@oceanswapdefi/sdk';

export const PNG: { [chainId in ChainId]: Token } = {
  [ChainId.PULSE_TESTNET]: new Token(
    ChainId.PULSE_TESTNET,
    CHAINS[ChainId.PULSE_TESTNET].contracts!.png,
    18,
    CHAINS[ChainId.PULSE_TESTNET].png_symbol,
    'Oceanswap',
  ),
};
