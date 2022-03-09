import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers';
import { localStorageHelper } from '../../helper/LocalStorageHelper';
import { IProviderHelper } from '../../helper/provider/IProviderHelper';

const KEY_PROVIDER = 'connected_provider';

export function useWeb3Provider({ supportProviders, events }: Props) {
  const [state, setState] = useState<State>({ isConnected: false });

  useEffect(() => {
    preloadProvider();
  }, [supportProviders]);

  const preloadProvider = async () => {
    const connectedProvider = localStorageHelper.get<{ type: ProviderType }>(KEY_PROVIDER);
    if (!connectedProvider) return;
    const provider = supportProviders.get(connectedProvider.type);
    if(!provider) return;
    const isConnected = await provider.helper.isConnected();
    const web3Provider = new ethers.providers.Web3Provider(provider?.helper.getProvider());
    initListeners(provider.helper.getProvider());
    setState((prev) => ({ ...prev, isConnected, provider: provider, web3Provider }));
  };

  const initListeners = (provider: any) => {
    provider?.on('accountsChanged', events?.accountsChanged);
    provider?.on('chainChanged', (chainId: any) => {
      console.log(typeof chainId);
      if (typeof chainId == 'string') events?.chainChanged?.(parseInt(String(chainId), 16));
      else events?.chainChanged?.(chainId);
    });
  };

  const connect = async (provider: Provider) => {
    const isConnected = await provider.helper.isConnected();
    const updateConnectedProvider = () => {
      const web3Provider = new ethers.providers.Web3Provider(provider.helper.getProvider());
      setState((prev) => ({ ...prev, isConnected: true, web3Provider, provider: provider }));
      initListeners(provider.helper.getProvider());
      localStorageHelper.set<{ type: ProviderType }>(KEY_PROVIDER, { type: state.provider?.type || 'metamask' });
    };
    if (isConnected) {
      updateConnectedProvider();
    } else
      provider.helper.connect(({ accounts, err }) => {
        updateConnectedProvider();
      });
  };

  const disconnect = async () => {
    const provider = state.provider?.helper;
    const isConnected = await provider?.isConnected();
    if (isConnected) await provider?.disconnect();
    localStorageHelper.remove(KEY_PROVIDER);
    setState({ isConnected: false, provider: undefined });
  };

  const changeProvider = async (type: ProviderType) => {
    if (state.provider?.type == type) return;
    await disconnect();
    const provider = supportProviders.get(type);
    console.log('changeProvider', { type, provider });
    if (provider) {
      connect(provider);
    }
  };

  return { ...state, connect, disconnect, changeProvider };
}

interface Props {
  supportProviders: Map<ProviderType, Provider>;
  events?: {
    accountsChanged?: (accounts: string[]) => void;
    chainChanged?: (chainId: number) => void;
  };
}

export interface State {
  provider?: Provider;
  web3Provider?: Web3Provider;
  isConnected: boolean;
}

export type ProviderType = 'metamask' | 'walletconnect';

export interface Provider {
  type: ProviderType;
  name: string;
  logo: string;
  helper: IProviderHelper;
}
