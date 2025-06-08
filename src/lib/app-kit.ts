import {
    sepolia,
    type AppKitNetwork,
    defineChain,
} from "@reown/appkit/networks";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { http } from "wagmi";
import { getPublicClient } from '@wagmi/core'
import { createAppKit } from "@reown/appkit/react";

// Define Hardhat local network
const localhost = defineChain({
    id: 31337,
    name: "Localhost",
    nativeCurrency: {
        decimals: 18,
        name: "Ethereum",
        symbol: "ETH",
    },
    rpcUrls: {
        default: { http: ["http://localhost:8545"] },
        public: { http: ["http://localhost:8545"] },
    },
    blockExplorers: {
        default: { name: "Hardhat Explorer", url: "http://localhost:8545" },
    },
    testnet: true,
    caipNetworkId: "eip155:31337",
    chainNamespace: "eip155",
});

// 1. Get projectId from https://cloud.reown.com
const projectId = "adbb42665f4cc1367b8db7159b631cfb";

// 2. Create a metadata object - optional
const metadata = {
    name: "VoteChain",
    description: "AppKit Example",
    url: "https://reown.com/appkit", // origin must match your domain & subdomain
    icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

// 3. Set the networks
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [sepolia, localhost];

// 4. Create Wagmi Adapter with Hardhat support
export const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true,
});

// 5. Create modal
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        analytics: true, // Optional - defaults to your Cloud configuration
        email: false,
        socials: false,
        swaps: false,
        send: false,
        onramp: false,
        history: false,
    },
});

