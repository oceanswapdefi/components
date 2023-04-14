import { Token, TokenAmount } from '@oceanswapdefi/sdk';

export interface TokenInfoProps {
  token: Token;
  logo?: string;
  unclaimedAmount?: TokenAmount;
  circulationSupply?: TokenAmount;
  totalSupply?: TokenAmount;
  // if is animaneted
  animatedLogo?: boolean;
}

export interface TokenInfoModalProps extends TokenInfoProps {
  open: boolean;
  closeModal: () => void;
}
