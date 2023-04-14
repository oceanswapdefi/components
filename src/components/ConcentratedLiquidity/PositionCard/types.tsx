import { Currency } from '@oceanswapdefi/sdk';

export type PositionCardProps = {
  currency0: Currency;
  currency1: Currency;
  onClick: () => void;
};
