import WalletConnect from "@walletconnect/web3-provider";
import { CallBackParams, IProviderHelper } from "./IProviderHelper";

export class WalletConnectHelper implements IProviderHelper {
    provider: WalletConnect
    rpc: IRPCMap

    constructor(rpc: IRPCMap) {
        this.rpc = rpc;
        const provider = new WalletConnect({ rpc })
        if (provider.wc.connected) provider.enable()
        this.provider = provider
    }

    async isConnected(): Promise<boolean> {
        return Promise.resolve(this.provider.wc.connected || false)
    }

    getProvider() {
        return this.provider;
    }

    connect(callback: (params: CallBackParams) => void) {
        this.provider = new WalletConnect({ rpc: this.rpc })
        this.provider.onConnect(async () => {
            callback({ accounts: this.provider.accounts })
        })
        this.provider.enable()
    }

    disconnect(): Promise<void> {
        return this.provider?.disconnect() || Promise.resolve()
    }
}

export interface IRPCMap {
    [chainId: number]: string;
}