import { Currency } from '@oceanswapdefi/sdk';

export type DetailModalProps = {
  isOpen: boolean;
  currency0: Currency;
  currency1: Currency;
  onClose: () => void;
};

export type StatItemProps = {
  title: string;
  stat: string;
};
