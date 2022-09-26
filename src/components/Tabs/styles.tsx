import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import styled from 'styled-components';

export const STabs = styled(Tabs)`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
`;

export const STabPanel = styled(TabPanel)`
  display: none;
  min-height: 40vh;
  border-top: 1px solid ${({ theme }) => theme.color9};
  padding: 4px;
  margin-top: -5px;

  &.is-selected {
    display: block;
  }
`;
STabPanel['tabsRole'] = 'TabPanel';

export const STabList = styled(TabList)`
  color: ${({ theme }) => theme.color11}
  list-style-type: none;
  padding-bottom: 5px;
  padding-left: 0px;
  display: flex;
  justify-content: flex-start;
  gap: 2.5rem;
  margin: 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    overflow: auto;
    white-space: nowrap;
  `};
  &::-webkit-scrollbar {
    display: none !important;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
STabList['tabsRole'] = 'TabList';

export const STab = styled(Tab)`
  padding: 4px;
  user-select: none;
  cursor: arrow;

  &:hover {
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
  }

  &.react-tabs__tab--disabled {
    color: ${({ theme }) => theme.color9};
    cursor: not-allowed;
    &:hover {
      color: ${({ theme }) => theme.color9};
      cursor: default;
    }
  }

  &.is-selected {
    border-bottom: 3px solid ${({ theme }) => theme.primary};
  }

  &:focus {
    outline: none;
  }
`;
STab['tabsRole'] = 'Tab';
