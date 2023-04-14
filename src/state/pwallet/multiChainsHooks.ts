import { ChainId } from '@oceanswapdefi/sdk';
import { useETHBalances, useTokenBalances } from './hooks';

export const useTokenBalancesHook = {
  [ChainId.PULSE_TESTNET]: useTokenBalances,
};

export const useAccountBalanceHook = {
  [ChainId.PULSE_TESTNET]: useETHBalances,
};
