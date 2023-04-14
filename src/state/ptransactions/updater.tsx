import { ChainId } from '@oceanswapdefi/sdk';
import { AnyAction } from '@reduxjs/toolkit';
import { Dispatch, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useChainId, useLibrary } from '../../hooks';
import { AppDispatch, AppState } from '../index';
import { useAddPopup, useBlockNumber } from '../papplication/hooks';
import { addTransaction, checkedTransaction, finalizeTransaction } from './actions';
import { TransactionDetails } from './reducer';

export function shouldCheck(
  lastBlockNumber: number,
  tx: {
    addedTime: number;
    receipt?: {
      /* */
    };
    lastCheckedBlockNumber?: number;
  },
): boolean {
  if (tx.receipt) return false;
  if (!tx.lastCheckedBlockNumber) return true;
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber;
  if (blocksSinceCheck < 1) return false;
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60;
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9;
  } else if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2;
  } else {
    // otherwise every block
    return true;
  }
}

type TxCheckerProps = {
  transactions: {
    [txHash: string]: TransactionDetails;
  };
  dispatch: Dispatch<AnyAction>;
  chainId: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const txChecker = (_params: TxCheckerProps) => {
  // This is intentional as this is just dummy function to support for evm chains
};

const txCheckerMapping: { [chainId in ChainId]: (params: TxCheckerProps) => void } = {
  [ChainId.PULSE_TESTNET]: txChecker,
};

export default function Updater(): null {
  const chainId = useChainId();
  const { library, provider } = useLibrary();

  const lastBlockNumber = useBlockNumber();

  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector<AppState, AppState['ptransactions']>((state) => state.ptransactions);

  const transactions = chainId ? state[chainId] ?? {} : {}; // eslint-disable-line react-hooks/exhaustive-deps

  const txCheckerFn = txCheckerMapping[chainId as ChainId];

  // as of now this is specific to Near chain, we are checking user is coming to pangolin after completing tx or not
  useEffect(() => {
    if (txCheckerFn) {
      txCheckerFn({ transactions, chainId, dispatch });
    }
  }, [transactions, chainId, dispatch]);

  // show popup on confirm
  const addPopup = useAddPopup();

  useEffect(() => {
    if (!chainId || !library || !lastBlockNumber) return;

    Object.keys(transactions)
      .filter((hash) => shouldCheck(lastBlockNumber, transactions[hash]))
      .forEach(async (hash) => {
        try {
          const receipt = await (provider as any).getTransactionReceipt(hash);

          const status = receipt.status;
          if (receipt) {
            dispatch(
              finalizeTransaction({
                chainId,
                hash,
                receipt: {
                  blockHash: receipt.blockHash,
                  blockNumber: receipt.blockNumber,
                  // contractAddress: receipt.contractAddress,
                  contractAddress: '',
                  from: receipt.from,
                  status,
                  to: receipt.to,
                  // transactionHash: receipt.transactionHash,
                  transactionHash: receipt.hash,
                  transactionIndex: receipt.transactionIndex,
                },
              }),
            );

            addPopup(
              {
                txn: {
                  hash,
                  success: status === 1,
                  summary: transactions[hash]?.summary,
                },
              },
              hash,
            );
          } else {
            dispatch(checkedTransaction({ chainId, hash, blockNumber: lastBlockNumber }));
          }
        } catch (error) {
          console.error(`failed to check transaction hash: ${hash}`, error);
        }
      });
  }, [chainId, library, transactions, lastBlockNumber, dispatch, addPopup]);

  return null;
}
