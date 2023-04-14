import { Token } from '@oceanswapdefi/sdk';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from 'src/components';
import Drawer from 'src/components/Drawer';
import { useChainId } from 'src/hooks';
import { unwrappedToken } from 'src/utils/wrappedCurrency';
import RemoveLiquidity from '../RemoveLiquidity';

type Props = {
  isOpen: boolean;
  clickedLpTokens: Array<Token>;
  onClose: () => void;
  backgroundColor?: string;
};

const RemoveLiquidityDrawer: React.FC<Props> = ({ isOpen, onClose, clickedLpTokens, backgroundColor }) => {
  const { t } = useTranslation();
  const chainId = useChainId();

  const token0 = clickedLpTokens?.[0];
  const token1 = clickedLpTokens?.[1];

  const currencyA = token0 && unwrappedToken(token0, chainId);
  const currencyB = token1 && unwrappedToken(token1, chainId);

  return (
    <Drawer
      title={t('navigationTabs.removeLiquidity')}
      isOpen={isOpen}
      onClose={onClose}
      backgroundColor={backgroundColor}
    >
      {isOpen && (
        <Box padding="10px" display="flex" flexDirection="column" flex="1">
          <RemoveLiquidity currencyA={currencyA} currencyB={currencyB} />
        </Box>
      )}
    </Drawer>
  );
};

export default RemoveLiquidityDrawer;
