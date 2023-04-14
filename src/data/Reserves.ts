import { Interface } from '@ethersproject/abi';
import IPangolinPair from '@pangolindex/exchange-contracts/artifacts/contracts/pangolin-core/interfaces/IPangolinPair.sol/IPangolinPair.json';
import { ChainId, Currency, Pair, TokenAmount } from '@oceanswapdefi/sdk';
import { useMemo } from 'react';
import { useChainId } from 'src/hooks';
import { useMultipleContractSingleData } from '../state/pmulticall/hooks';
import { wrappedCurrency } from '../utils/wrappedCurrency';
import { usePairsHook } from './multiChainsHooks';

const PAIR_INTERFACE = new Interface(IPangolinPair.abi);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const chainId = useChainId();

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  );

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB)
          ? Pair.getAddress(tokenA, tokenB, chainId ? chainId : ChainId.PULSE_TESTNET)
          : undefined;
      }),
    [tokens, chainId],
  );

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result;
      const tokenA = tokens[i][0];
      const tokenB = tokens[i][1];

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(
          new TokenAmount(token0, reserve0.toString()),
          new TokenAmount(token1, reserve1.toString()),
          chainId ? chainId : ChainId.PULSE_TESTNET,
        ),
      ];
    });
  }, [results, tokens, chainId]);
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  const chainId = useChainId();
  const usePairs_ = usePairsHook[chainId];
  return usePairs_([[tokenA, tokenB]])[0];
}
