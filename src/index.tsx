import { GelatoProvider } from '@gelatonetwork/limit-orders-react';
import { CHAINS, ChainId } from '@oceanswapdefi/sdk';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import SelectTokenDrawer from 'src/components/SwapWidget/SelectTokenDrawer';
import { usePair } from 'src/data/Reserves';
import { PangolinWeb3Provider, useLibrary } from 'src/hooks';
import { useAllTokens } from 'src/hooks/Tokens';
import { useActivePopups, useAddPopup, useRemovePopup } from 'src/state/papplication/hooks';
import {
  LimitOrderInfo,
  useDerivedSwapInfo,
  useGelatoLimitOrderDetail,
  useGelatoLimitOrderList,
  useSwapActionHandlers,
} from 'src/state/pswap/hooks';
import { useAllTransactions } from 'src/state/ptransactions/hooks';
import { useAccountBalanceHook } from 'src/state/pwallet/multiChainsHooks';
import { shortenAddress } from 'src/utils';
import useUSDCPrice from 'src/utils/useUSDCPrice';
import { wrappedCurrency } from 'src/utils/wrappedCurrency';
import { PANGOLIN_PERSISTED_KEYS, pangolinReducers } from './state';
import ApplicationUpdater from './state/papplication/updater';
import ListsUpdater from './state/plists/updater';
import MulticallUpdater from './state/pmulticall/updater';
import * as transactionActions from './state/ptransactions/actions';
import TransactionUpdater from './state/ptransactions/updater';
import { default as ThemeProvider } from './theme';
const queryClient = new QueryClient();

export function PangolinProvider({
  chainId = ChainId.PULSE_TESTNET,
  library,
  children,
  account,
  theme,
}: {
  chainId: number | undefined;
  library: any | undefined;
  account: string | undefined;
  children?: React.ReactNode;
  theme?: any;
}) {
  return (
    <PangolinWeb3Provider chainId={chainId} library={library} account={account}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <ListsUpdater />
          <ApplicationUpdater />
          <MulticallUpdater />
          <TransactionUpdater />
          {CHAINS[chainId]?.evm ? (
            <GelatoProvider
              library={library}
              chainId={chainId}
              account={account ?? undefined}
              useDefaultTheme={false}
              handler={'pangolin'}
            >
              {children}
            </GelatoProvider>
          ) : (
            children
          )}
        </QueryClientProvider>
      </ThemeProvider>
    </PangolinWeb3Provider>
  );
}

export * from './constants';
export * from './connectors';
export * from './components';

export * from '@gelatonetwork/limit-orders-react';
export type { LimitOrderInfo };

// components
export { SelectTokenDrawer };

// galeto hooks
export { useGelatoLimitOrderDetail, useGelatoLimitOrderList };

// hooks
export {
  useDerivedSwapInfo,
  useUSDCPrice,
  useAllTokens,
  useActivePopups,
  useRemovePopup,
  useAddPopup,
  usePair,
  useSwapActionHandlers,
  useLibrary,
  shortenAddress,
  useAllTransactions,
  useAccountBalanceHook,
};

//Actions
export { transactionActions };

// misc
export { pangolinReducers, PANGOLIN_PERSISTED_KEYS, wrappedCurrency };
