export interface IProviderHelper {
    getProvider(): any
    connect(callback?: (params: CallBackParams) => void): void
    disconnect(): Promise<any>
    isConnected(): Promise<boolean>
}

export interface CallBackParams {
    accounts?: string[]
    err?: any
}

export interface EventHandler {
    accountsChanged: (accounts: string[]) => void
}