import React from 'react';
import { TabListProps } from 'react-tabs';
import { STabList } from '../styles';

const TabList: React.FC<TabListProps> = (props: any) => {
  return <STabList {...props} />;
};

export default TabList;
