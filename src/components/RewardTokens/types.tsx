import { Token } from '@oceanswapdefi/sdk';
import { LogoSize } from 'src/constants';

export interface RewardTokensProps {
  size?: LogoSize;
  rewardTokens?: Array<Token | null | undefined> | null;
}
