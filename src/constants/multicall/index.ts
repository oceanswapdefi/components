import { ChainId } from '@oceanswapdefi/sdk';
import MULTICALL_ABI from './abi.json';

const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.PULSE_TESTNET]: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
};

export { MULTICALL_ABI, MULTICALL_NETWORKS };
