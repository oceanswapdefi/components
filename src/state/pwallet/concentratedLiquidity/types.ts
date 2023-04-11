import { Currency, CurrencyAmount, Position, Token } from '@pangolindex/sdk';
import { BigNumber } from 'ethers';

export interface PositionDetails {
  nonce?: BigNumber;
  tokenId: BigNumber;
  operator?: string;
  token0: Token;
  token1: Token;
  fee: number;
  tickLower?: number;
  tickUpper?: number;
  liquidity: BigNumber;
  feeGrowthInside0LastX128?: BigNumber;
  feeGrowthInside1LastX128?: BigNumber;
  tokensOwed0?: BigNumber;
  tokensOwed1?: BigNumber;
}
export interface UseConcentratedPositionResults {
  loading: boolean;
  position: PositionDetails | undefined;
}

export interface UseConcentratedPositionsResults {
  loading: boolean;
  positions: PositionDetails[] | undefined;
}

export interface AddLiquidityProps {
  parsedAmounts: {
    CURRENCY_A?: CurrencyAmount;
    CURRENCY_B?: CurrencyAmount;
  };
  deadline: BigNumber | undefined;
  noLiquidity: boolean | undefined;
  allowedSlippage: number;
  currencies: {
    CURRENCY_A?: Currency;
    CURRENCY_B?: Currency;
  };
  position?: Position;
}
