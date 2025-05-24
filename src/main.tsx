import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { sepolia, type AppKitNetwork } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// 0. Setup queryClient
const queryClient = new QueryClient();

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
const networks: [AppKitNetwork] = [sepolia];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
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

// Create a new router instance
const router = createRouter({ routeTree });

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
