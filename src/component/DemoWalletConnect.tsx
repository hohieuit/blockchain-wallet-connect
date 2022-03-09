import React, { useEffect, useState } from 'react';
import useApplicationProviders from '../hook/provider/useApplicationProviders';
import { useWeb3Provider } from '../hook/provider/useWeb3Provider';

export default function DemoWalletConnect() {
  const { supportProviders } = useApplicationProviders();
  const { isConnected, web3Provider, provider: provider, connect, disconnect, changeProvider } = useWeb3Provider({
    supportProviders,
    events: {
      accountsChanged: (accounts) =>{console.log(accounts)},
      chainChanged: (chainId) => console.log(chainId),
    },
  });
  const [state, setState] = useState<State>({ address: '' });
  console.log({web3Provider});
  

  useEffect(() => {
    getAccount();
  }, [isConnected]);

  const getAccount = async () => {
    if (isConnected && web3Provider) {
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();
      console.log('get account', { address });
      setState({ address });
    } else setState({ address: '' });
  };

  return (
    <div>
      <div>
        <p>Provider: {provider?.name}</p>
        <p>Address: {state.address}</p>
      </div>
      <button onClick={async (e) => changeProvider('walletconnect')}>wallet connect</button>
      <button onClick={async (e) => changeProvider('metamask')}>meta mask</button>
      <button onClick={(e) => disconnect?.()}>Disconnect</button>
    </div>
  );
}

interface State {
  address: string;
}
