/* eslint-disable max-lines */
import { Currency, CurrencyAmount, Position } from '@pangolindex/sdk';
import React, { useContext } from 'react';
import { AlertTriangle } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import { Box, Button, CurrencyLogo, DoubleCurrencyLogo, Loader, Text, TransactionCompleted } from 'src/components';
import Drawer from 'src/components/Drawer';
import { Bound, Field } from 'src/state/pmint/concentratedLiquidity/atom';
import { formatTickPrice } from 'src/utils/formatTickPrice';
import { ErrorBox, ErrorWrapper, Footer, Header, Root } from './styled';

interface Props {
  isOpen: boolean;
  attemptingTxn: boolean;
  txHash: string | undefined;
  poolErrorMessage: string | undefined;
  onClose: () => void;
  noLiquidity?: boolean;
  currencies: { [field in Field]?: Currency };
  parsedAmounts: { [field in Field]?: CurrencyAmount };
  onAdd: () => void;
  position: Position | undefined;
  ticksAtLimit: { [bound: string]: boolean | undefined };
}

const ConfirmDrawer: React.FC<Props> = (props) => {
  const {
    isOpen,
    onClose,
    attemptingTxn,
    poolErrorMessage,
    txHash,
    noLiquidity,
    currencies,
    parsedAmounts,
    onAdd,
    position,
    ticksAtLimit,
  } = props;

  const theme = useContext(ThemeContext);
  const { t } = useTranslation();

  const currency0 = currencies[Field.CURRENCY_A];
  const currency1 = currencies[Field.CURRENCY_B];

  // const currency0 = unwrappedToken(position.pool.token0)
  // const currency1 = unwrappedToken(position.pool.token1)

  const baseCurrency = currency0;
  const sorted = baseCurrency === currency0;
  const quoteCurrency = sorted ? currency1 : currency0;

  const price = sorted ? position?.pool.priceOf(position?.pool?.token0) : position?.pool.priceOf(position?.pool.token1);

  const priceLower = sorted ? position?.token0PriceLower : position?.token0PriceUpper.invert();
  const priceUpper = sorted ? position?.token0PriceUpper : position?.token0PriceLower.invert();

  const pendingText = `${t('pool.supplying')} ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)} ${
    currencies[Field.CURRENCY_A]?.symbol
  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)} ${currencies[Field.CURRENCY_B]?.symbol}`;

  function renderDetailConfirmContentButton() {
    return (
      <Button variant="primary" onClick={onAdd}>
        {noLiquidity ? t('addLiquidity.createPoolSupply') : t('addLiquidity.confirmSupply')}
      </Button>
    );
  }

  const DetailConfirmContent = (
    <Root>
      <Header>
        <Box display="flex">
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={24}
          />

          <Text fontSize={['26px', '22px']} fontWeight={500} lineHeight="42px" marginRight={10} color="text1">
            {currencies[Field.CURRENCY_A]?.symbol + '/' + currencies[Field.CURRENCY_B]?.symbol}
          </Text>
        </Box>

        <Box mt={20}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex">
              <CurrencyLogo currency={currencies[Field.CURRENCY_A]} size={24} />
              <Text fontSize="12px" color="text1" ml="10px">
                {currencies[Field.CURRENCY_A]?.symbol}
              </Text>
            </Box>

            <Text fontSize="14px" color="text1">
              {position?.amount0?.toSignificant(4)}
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt="5px">
            <Box display="flex">
              <CurrencyLogo currency={currencies[Field.CURRENCY_B]} size={24} />
              <Text fontSize="12px" color="text1" ml="10px">
                {currencies[Field.CURRENCY_B]?.symbol}
              </Text>
            </Box>

            <Text fontSize="14px" color="text1">
              {position?.amount1?.toSignificant(4)}
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt="5px">
            <Text fontSize="12px" color="text1">
              Fee Tier
            </Text>

            <Text fontSize="14px" color="text1" ml="10px">
              {position?.pool?.fee ?? 0 / 10000}%
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt="5px">
            <Text fontSize="12px" color="text1">
              Min Price
            </Text>
            <Box>
              <Text fontSize="14px" color="text1" ml="10px">
                {formatTickPrice({
                  price: priceLower,
                  atLimit: ticksAtLimit,
                  direction: Bound.LOWER,
                })}
              </Text>

              <Text fontSize="12px" color="text1" ml="10px">
                {quoteCurrency?.symbol} per {baseCurrency?.symbol}
              </Text>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt="5px">
            <Text fontSize="12px" color="text1">
              Max Price
            </Text>
            <Box>
              <Text fontSize="14px" color="text1" ml="10px">
                {formatTickPrice({
                  price: priceUpper,
                  atLimit: ticksAtLimit,
                  direction: Bound.UPPER,
                })}
              </Text>

              <Text fontSize="12px" color="text1" ml="10px">
                {quoteCurrency?.symbol} per {baseCurrency?.symbol}
              </Text>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" mt="5px">
            <Text fontSize="12px" color="text1">
              Current Price
            </Text>
            <Box>
              <Text fontSize="14px" color="text1" ml="10px">
                {`${price ? price.toSignificant(5) : 0} `}
              </Text>

              <Text fontSize="12px" color="text1" ml="10px">
                {quoteCurrency?.symbol} per {baseCurrency?.symbol}
              </Text>
            </Box>
          </Box>
        </Box>
      </Header>
      <Footer>
        <Box my={'10px'}>{renderDetailConfirmContentButton()}</Box>
      </Footer>
    </Root>
  );

  const PendingContent = <Loader size={100} label={pendingText} />;

  const ErrorContent = (
    <ErrorWrapper>
      <ErrorBox>
        <AlertTriangle color={theme.red1} style={{ strokeWidth: 1.5 }} size={64} />
        <Text fontWeight={500} fontSize={[16, 14]} color={'red1'} style={{ textAlign: 'center', width: '85%' }}>
          {poolErrorMessage}
        </Text>
      </ErrorBox>
      <Button variant="primary" onClick={onClose}>
        {t('transactionConfirmation.dismiss')}
      </Button>
    </ErrorWrapper>
  );

  const SubmittedContent = (
    <Box padding="10px" height="100%">
      <TransactionCompleted
        submitText={t('pool.liquidityAdded')}
        isShowButtton={true}
        onButtonClick={() => {
          onClose();
        }}
        buttonText={t('transactionConfirmation.close')}
      />
    </Box>
  );

  const renderBody = () => {
    if (txHash) {
      return SubmittedContent;
    }

    if (attemptingTxn) {
      return PendingContent;
    }

    if (poolErrorMessage) {
      return ErrorContent;
    }

    return DetailConfirmContent;
  };

  function getTitle() {
    if (noLiquidity) {
      return t('addLiquidity.creatingPool');
    }

    if (txHash) {
      return undefined;
    }

    return t('addLiquidity.willReceive');
  }

  return (
    <Drawer
      title={getTitle()}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      backgroundColor={'bg2'}
    >
      {renderBody()}
    </Drawer>
  );
};
export default ConfirmDrawer;
/* eslint-enable max-lines */
