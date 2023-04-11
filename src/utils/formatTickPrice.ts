import { NumberType, Price, formatPrice } from '@pangolindex/sdk';
import { Bound } from 'src/state/pmint/concentratedLiquidity/atom';

interface FormatTickPriceArgs {
  price: Price | undefined;
  atLimit: { [bound in Bound]?: boolean | undefined };
  direction: Bound;
  placeholder?: string;
  numberType?: NumberType;
}

export function formatTickPrice({ price, atLimit, direction, placeholder, numberType }: FormatTickPriceArgs) {
  if (atLimit[direction]) {
    return direction === Bound.LOWER ? '0' : '∞';
  }

  if (!price && placeholder !== undefined) {
    return placeholder;
  }

  return formatPrice(price, numberType ?? NumberType.TokenNonTx);
}
