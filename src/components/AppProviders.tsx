import React from 'react';
import { useBackButton } from '@/hooks/useBackButton';
import { useSingleDeviceLogin } from '@/hooks/useSingleDeviceLogin';

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  // Handle Android back button
  useBackButton();
  
  // Handle single device login
  useSingleDeviceLogin();

  return <>{children}</>;
};

export default AppProviders;
