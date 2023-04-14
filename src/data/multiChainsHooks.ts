import { ChainId } from '@oceanswapdefi/sdk';
import { usePairs } from './Reserves';

export const usePairsHook = {
  [ChainId.PULSE_TESTNET]: usePairs,
};
