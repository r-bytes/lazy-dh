import React from 'react';

interface NoNavigationLayoutProps {
  children: React.ReactNode;
}

const NoNavigationLayout: React.FC<NoNavigationLayoutProps> = ({ children }) => {
  return <main>{children}</main>;
};

export default NoNavigationLayout;