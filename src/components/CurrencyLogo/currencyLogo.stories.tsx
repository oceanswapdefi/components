import { CAVAX, ChainId } from '@oceanswapdefi/sdk';
import { ComponentStory } from '@storybook/react';
import React from 'react';
import CurrencyLogo from '.';

export default {
  component: CurrencyLogo,
  title: 'Components/CurrencyLogo',
};

const TemplateBox: ComponentStory<typeof CurrencyLogo> = (args: any) => <CurrencyLogo {...args} />;

export const DoubleLogo = TemplateBox.bind({});
DoubleLogo.args = {
  size: 24,
  currency: CAVAX[ChainId.PULSE_TESTNET],
};
