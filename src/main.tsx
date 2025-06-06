import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import {
	sepolia,
	type AppKitNetwork,
	defineChain,
} from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { http } from "wagmi";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// 0. Setup queryClient
const queryClient = new QueryClient();

// Define Hardhat local network
const hardhat = defineChain({
	id: 31337,
	name: "Hardhat",
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

// 3. Set the networks - add Hardhat
const networks: [AppKitNetwork, AppKitNetwork] = [sepolia, hardhat];

// 4. Create Wagmi Adapter with Hardhat support
const wagmiAdapter = new WagmiAdapter({
	networks,
	projectId,
	ssr: true,
	transports: {
		[hardhat.id]: http("http://localhost:8545"),
	},
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

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
	},
	defaultPreload: "intent",
	// Since we're using React Query, we don't want loader calls to ever be stale
	// This will ensure that the loader is always called when the route is preloaded or visited
	defaultPreloadStaleTime: 0,
	scrollRestoration: true,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<WagmiProvider config={wagmiAdapter.wagmiConfig}>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</WagmiProvider>
		</StrictMode>,
	);
}
