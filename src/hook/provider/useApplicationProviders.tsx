import React, { useEffect, useState } from 'react';
import { appConfig } from '../../config/AppConfig';
import { MetaMaskHelper } from '../../helper/provider/MetaMaskHelper';
import { WalletConnectHelper } from '../../helper/provider/WalletConnectHelper';
import { Provider, ProviderType } from './useWeb3Provider';

export default function useApplicationProviders() {
  const [state, setState] = useState<State>({ supportProviders: new Map() });
  useEffect(() => {
    initsupportProviders();
  }, []);

  const initsupportProviders = () => {
    const supportProviders: Provider[] = [
      {
        name: 'Wallet connect',
        type: 'walletconnect',
        logo: '',
        helper: new WalletConnectHelper(appConfig.walletConnect),
      },
      { name: 'Metamask', logo: '', type: 'metamask', helper: new MetaMaskHelper() },
    ];
    setState((prev) => ({ ...prev, supportProviders: new Map(supportProviders.map((p) => [p.type, p])) }));
  };

  return { ...state };
}
interface State {
  supportProviders: Map<ProviderType, Provider>;
}
