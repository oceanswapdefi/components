import { ChainId } from '@oceanswapdefi/sdk';
import { useToken } from './Tokens';
import { useApproveCallbackFromTrade } from './useApproveCallback';
import { useSwapCallback } from './useSwapCallback';
import { useWrapCallback } from './useWrapCallback';

export const useWrapCallbackHook = {
  [ChainId.PULSE_TESTNET]: useWrapCallback,
};

export const useTokenHook = {
  [ChainId.PULSE_TESTNET]: useToken,
};

export const useApproveCallbackFromTradeHook = {
  [ChainId.PULSE_TESTNET]: useApproveCallbackFromTrade,
};

export const useSwapCallbackHook = {
  [ChainId.PULSE_TESTNET]: useSwapCallback,
};
