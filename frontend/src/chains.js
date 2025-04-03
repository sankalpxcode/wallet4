const Ethereum = {
    hex: '0x1',
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/1e5c9f4896904c68818726f9785bae83',
    ticker: "ETH"
};

const MumbaiTestnet = {
    hex: '0x13881',
    name: 'Mumbai Testnet',
    rpcUrl: 'https://mainnet.infura.io/v3/1e5c9f4896904c68818726f9785bae83',
    ticker: "MATIC"
};

export const CHAINS_CONFIG = {
    "0x1": Ethereum,
    "0x13881": MumbaiTestnet,
};
