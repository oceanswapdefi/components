import { ChainId } from '@oceanswapdefi/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useChainId, useLibrary, usePangolinWeb3 } from 'src/hooks';
import useDebounce from 'src/hooks/useDebounce';
import useIsWindowVisible from 'src/hooks/useIsWindowVisible';
import { updateBlockNumber } from './actions';

export const EvmApplicationUpdater = () => {
  const { chainId } = usePangolinWeb3();
  const { library, provider } = useLibrary();
  const dispatch = useDispatch();

  const windowVisible = useIsWindowVisible();

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null,
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((_state) => {
        if (chainId === _state.chainId) {
          if (typeof _state.blockNumber !== 'number') return { chainId, blockNumber };
          return { chainId, blockNumber: Math.max(blockNumber, _state.blockNumber) };
        }
        return _state;
      });
    },
    [chainId, setState],
  );

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined;

    setState({ chainId, blockNumber: null });

    provider
      ?.getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error));

    library.on && library.on('block', blockNumberCallback);
    return () => {
      library.removeListener && library.removeListener('block', blockNumberCallback);
    };
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return;
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }));
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId]);

  return null;
};

const updaterMapping: { [chainId in ChainId]: () => null } = {
  [ChainId.PULSE_TESTNET]: EvmApplicationUpdater,
};

export default function ApplicationUpdater() {
  const chainId = useChainId();

  const Updater = updaterMapping[chainId];

  return <Updater />;
}
