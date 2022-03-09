import { CallBackParams, EventHandler, IProviderHelper } from "./IProviderHelper";
import { WalletLinkProvider } from "walletlink";
import { ethers } from "ethers";

export class MetaMaskHelper implements IProviderHelper {
    private provider: WalletLinkProvider | undefined

    constructor() {
        const provider = window.ethereum;
        this.provider = provider;
    }
    
    async isConnected(): Promise<boolean> {
        const web3Provider = new ethers.providers.Web3Provider(this.provider as any);
        const accounts = await web3Provider.listAccounts().catch(err => []);
        return accounts.length > 0
    }

    getProvider(): any {
        return this.provider;
    }

    connect(callback: (params: CallBackParams) => void) {
        return this.provider?.send('eth_requestAccounts').then(accounts => callback({ accounts })).catch(err => callback(err))
    }

    disconnect(): Promise<void> {
        return Promise.resolve()
    }
}