import { Toaster } from "@/components/ui/sonner";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header";
import ProposalList from "../dashboard/ProposalList";
import ConnectWallet from "../dashboard/ConnectWallet";
import InvestmentPeriod from "../dashboard/InvestmentPeriod";
import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "../ThemeProvider";
import ProposalDetails from "../dashboard/ProposalDetails";

const RootLayout = () => {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="bg-slate-900 text-white min-h-screen flex">
				{/* Left Sidebar */}
				<Sidebar />

				{/* Main Content Area */}
				<div className="flex-1 flex flex-col">
					{/* Header */}
					<Header />

					{/* Main Content */}
					<main className="flex-1 p-6 flex">
						{/* Left Content */}
						<div className="flex-1">
							<ProposalList />
							<ProposalDetails />
							<Outlet />
						</div>

						{/* Right Sidebar */}
						<div className="w-72 ml-6">
							<ConnectWallet />
							<InvestmentPeriod />
						</div>
					</main>
				</div>

				<Toaster />
				<TanStackRouterDevtools />
			</div>
		</ThemeProvider>
	);
};

export default RootLayout;
