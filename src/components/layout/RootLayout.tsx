import { Toaster } from "@/components/ui/sonner";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header";
import { Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "../ThemeProvider";
import ConnectWallet from "../dashboard/ConnectWallet";
import InvestmentPeriod from "../dashboard/InvestmentPeriod";
import { useState } from "react";
import { X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RootLayout = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="bg-slate-900 text-white min-h-screen relative flex flex-col md:flex-row">
				{/* Mobile sidebar backdrop */}
				{sidebarOpen && (
					// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
					<div
						className="fixed inset-0 bg-black/50 z-40 md:hidden"
						onClick={toggleSidebar}
						aria-hidden="true"
					/>
				)}

				{/* Mobile sidebar toggle button */}
				<Button
					variant="ghost"
					size="icon"
					className="absolute top-4 left-4 z-50 md:hidden"
					onClick={toggleSidebar}
					aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
				>
					{sidebarOpen ? (
						<X className="h-6 w-6" />
					) : (
						<Menu className="h-6 w-6" />
					)}
				</Button>

				{/* Left Sidebar - responsive */}
				<div
					className={cn(
						"fixed inset-y-0 left-0 z-40 w-60 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
						sidebarOpen ? "translate-x-0" : "-translate-x-full",
					)}
				>
					<Sidebar />
				</div>

				{/* Main Content Area */}
				<div className="flex-1 flex flex-col">
					{/* Header */}
					<Header className="pl-16 md:pl-6" />{" "}
					{/* Extra padding for mobile menu button */}
					{/* Main Content */}
					<main className="flex-1 p-4 md:p-6 flex flex-col lg:flex-row">
						{/* Left Content - Main Route Content */}
						<div className="flex-1 mb-6 lg:mb-0 overflow-auto">
							<Outlet />
						</div>

						{/* Right Sidebar - stacks below on mobile/tablet */}
						<div className="w-full lg:w-72 lg:ml-6 space-y-6">
							<ConnectWallet />
							<InvestmentPeriod />
						</div>
					</main>
				</div>

				<Toaster />
				{/* Hide DevTools on smaller screens */}
				<div className="hidden md:block">
					<TanStackRouterDevtools />
				</div>
			</div>
		</ThemeProvider>
	);
};

export default RootLayout;
