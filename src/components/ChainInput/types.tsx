import { Chain } from '@oceanswapdefi/sdk';
import * as React from 'react';
import { ButtonStyleProps } from '../Button/types';

export type ChainInputProps = {
  chain?: Chain | null;
  buttonStyle?: ButtonStyleProps;
  onChainClick?: () => void;
};
