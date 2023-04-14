import { CHAINS, ChainId, Token } from '@oceanswapdefi/sdk';
import { ComponentStory } from '@storybook/react';
import React from 'react';
import { CurrencyInput } from '.';

export default {
  component: CurrencyInput,
  title: 'Components/CurrencyInputs',
};

const TemplateCurrencyInput: ComponentStory<typeof CurrencyInput> = (args: any) => <CurrencyInput {...args} />;

export const Default = TemplateCurrencyInput.bind({});
Default.args = {
  label: 'To',
  currency: new Token(
    ChainId.PULSE_TESTNET,
    CHAINS[ChainId.PULSE_TESTNET].contracts!.png,
    18,
    CHAINS[ChainId.PULSE_TESTNET].png_symbol!,
    'Pangolin',
  ),
};
