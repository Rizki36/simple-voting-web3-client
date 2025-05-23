import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Search, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarItems = [
	{ icon: "dashboard", label: "Dashboard", active: true },
	{ icon: "assets", label: "Proposals", active: false },
	{ icon: "staking", label: "My Votes", active: false },
	{ icon: "calculator", label: "Create Proposal", active: false },
	{ icon: "api", label: "API", active: false },
	{ icon: "liquid", label: "Analytics", active: false, badge: "New" },
	{ icon: "active", label: "Active Votes", active: false, badge: "3" },
];

const RootLayout = () => {
	return (
		<div className="bg-slate-900 text-white min-h-screen flex">
			{/* Left Sidebar */}
			<aside className="w-60 bg-slate-950 border-r border-slate-800 flex flex-col">
				{/* Logo */}
				<div className="p-4 flex items-center gap-2">
					<div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center">
						<span className="font-bold text-white">V3</span>
					</div>
					<span className="font-semibold text-lg">
						VoteChain<sup>®</sup>
					</span>
				</div>

				{/* Navigation */}
				<nav className="mt-6 flex-1">
					{sidebarItems.map((item) => (
						<div
							key={item.label}
							className={cn(
								"flex items-center gap-3 px-4 py-3 cursor-pointer",
								item.active ? "bg-slate-800" : "hover:bg-slate-800/50",
							)}
						>
							<div className="w-6 h-6 flex items-center justify-center">
								<div className="w-5 h-5 bg-slate-600 rounded-md"></div>
							</div>
							<span>{item.label}</span>
							{item.badge && (
								<span
									className={`text-xs px-2 py-0.5 ml-auto rounded-full ${item.badge === "New" ? "bg-blue-600" : "bg-slate-700"}`}
								>
									{item.badge}
								</span>
							)}
						</div>
					))}
				</nav>

				{/* User Assets Section */}
				<div className="p-4 border-t border-slate-800 space-y-3">
					<div className="text-sm text-slate-400">Your Active Votes</div>
					{[1, 2, 3].map((i) => (
						<div key={i} className="flex items-center gap-3">
							<div
								className={`w-6 h-6 rounded-full bg-${["blue", "orange", "purple"][i - 1]}-600 flex items-center justify-center text-xs`}
							>
								{i}
							</div>
							<div className="flex-1">
								<div className="text-sm">Vote #{i}</div>
								<div className="text-xs text-slate-400">Cast {i} day ago</div>
							</div>
						</div>
					))}
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col">
				{/* Header */}
				<header className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
					<div className="flex items-center gap-2">
						<span className="text-sm text-slate-400">Connected to</span>
						<div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-lg">
							<Avatar className="w-6 h-6">
								<AvatarImage src="https://github.com/shadcn.png" />
								<AvatarFallback>JD</AvatarFallback>
							</Avatar>
							<span className="text-sm font-medium">Irvin Crawford</span>
							<span className="text-xs text-slate-400">•</span>
						</div>
					</div>

					<div className="flex items-center gap-4">
						<Button
							size="sm"
							variant="secondary"
							className="rounded-full bg-slate-800 hover:bg-slate-700 gap-1 text-background/60"
						>
							<span className="text-sm font-medium">Create Proposal</span>
							<Plus className="h-4 w-4" />
						</Button>
						<div className="flex items-center gap-2 bg-slate-800 rounded-full p-1 pr-2">
							<div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
								1
							</div>
							<span className="text-sm">0.4 ETH</span>
						</div>
						<Button size="icon" variant="ghost">
							<Search className="h-5 w-5" />
						</Button>
						<Button size="icon" variant="ghost">
							<Settings className="h-5 w-5" />
						</Button>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-1 p-6 flex">
					{/* Left Content */}
					<div className="flex-1">
						{/* Top section - Heading & Filters */}
						<div className="flex justify-between items-center mb-6">
							<div>
								<h2 className="text-2xl font-medium">Top Active Proposals</h2>
							</div>
							<div className="flex gap-2">
								<Button
									size="sm"
									variant="outline"
									className="rounded-full text-xs"
								>
									24H
								</Button>
								<Button
									size="sm"
									variant="outline"
									className="rounded-full border-slate-700 text-xs"
								>
									Result of Vote
								</Button>
								<Button
									size="sm"
									variant="outline"
									className="rounded-full border-slate-700 text-xs"
								>
									Date
								</Button>
							</div>
						</div>

						{/* Proposal Cards Grid */}
						<div className="grid grid-cols-3 gap-4">
							{[
								{
									title: "Ethereum (ETH)",
									percentage: "13.62%",
									change: "+2.55%",
									changeColor: "green",
									value: "+$2,955",
								},
								{
									title: "BNB Chain",
									percentage: "12.72%",
									change: "+5.87%",
									changeColor: "green",
									value: "+$2,078",
								},
								{
									title: "Polygon (Matic)",
									percentage: "6.29%",
									change: "-1.89%",
									changeColor: "red",
									value: "+$1,187",
								},
							].map((card, index) => (
								<div
									key={index}
									className="bg-slate-800 rounded-lg p-4 relative overflow-hidden"
								>
									{/* Top section */}
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-2">
											<div
												className={`w-8 h-8 rounded-full bg-${index === 0 ? "blue" : index === 1 ? "yellow" : "purple"}-600 flex items-center justify-center`}
											>
												{index + 1}
											</div>
											<div>
												<div className="text-xs text-slate-400">
													Proposal of Vote
												</div>
												<div className="text-sm">{card.title}</div>
											</div>
										</div>
										<Button size="icon" variant="ghost" className="h-6 w-6">
											<span className="sr-only">Details</span>
											<svg
												width="15"
												height="15"
												viewBox="0 0 15 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<title>Arrow Icon</title>
												<path
													d="M3.5 7.5L7.5 3.5L11.5 7.5M3.5 11.5L7.5 7.5L11.5 11.5"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
											</svg>
										</Button>
									</div>

									{/* Percentage */}
									<div className="text-2xl font-semibold mb-2">
										{card.percentage}
									</div>

									{/* Change */}
									<div
										className={`inline-flex items-center gap-1 text-xs text-${card.changeColor === "green" ? "green" : "red"}-500`}
									>
										<span>{card.change}</span>
									</div>

									{/* Chart (placeholder) */}
									<div className="h-10 mt-2 relative">
										<div
											className={`absolute bottom-0 left-0 w-full h-6 bg-${card.changeColor === "green" ? "green" : "red"}-500/10 rounded`}
										></div>
										{/* Line representation */}
										<div
											className={`absolute bottom-0 left-0 right-0 h-[1px] bg-${card.changeColor === "green" ? "green" : "red"}-500`}
										></div>
									</div>

									{/* Value */}
									<div className="text-xs text-slate-400 mt-2 text-right">
										{card.value}
									</div>
								</div>
							))}
						</div>

						{/* Bottom Section */}
						<div className="mt-8 bg-slate-800 rounded-lg p-6">
							<div className="flex justify-between items-center mb-4">
								<div>
									<div className="text-sm text-slate-400">
										Last update - 46 minutes ago
									</div>
									<h3 className="text-xl font-medium flex items-center gap-2">
										Vote Proposal #1
										<span className="text-xs px-1 bg-red-600 rounded">4</span>
									</h3>
								</div>
								<div className="flex gap-2">
									<Button size="sm" variant="outline">
										View Profile
									</Button>
									<Button size="sm" variant="default">
										Unstake
									</Button>
								</div>
							</div>

							<div className="flex border-b border-slate-700 pb-4">
								<h2 className="text-4xl font-bold">31.39686</h2>
							</div>

							{/* Metrics Grid */}
							<div className="grid grid-cols-4 gap-4 mt-6">
								<div>
									<div className="flex justify-between">
										<div className="text-sm text-slate-400">Momentum</div>
										<Button size="sm" variant="ghost" className="h-6 w-6 p-0">
											<span className="sr-only">Details</span>
											<svg
												width="15"
												height="15"
												viewBox="0 0 15 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M3.5 7.5L7.5 3.5L11.5 7.5M3.5 11.5L7.5 7.5L11.5 11.5"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
											</svg>
										</Button>
									</div>
									<div className="mt-4">
										<div className="text-2xl font-semibold">-0.82%</div>
										<div className="text-sm text-slate-400">7-day dynamics</div>
									</div>
								</div>

								<div>
									<div className="flex justify-between">
										<div className="text-sm text-slate-400">Price</div>
										<Button size="sm" variant="ghost" className="h-6 w-6 p-0">
											<span className="sr-only">Details</span>
											<svg
												width="15"
												height="15"
												viewBox="0 0 15 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M3.5 7.5L7.5 3.5L11.5 7.5M3.5 11.5L7.5 7.5L11.5 11.5"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
											</svg>
										</Button>
									</div>
									<div className="mt-4">
										<div className="text-2xl font-semibold flex items-center">
											$41.99
											<span className="text-xs text-red-500 ml-2">-1.09%</span>
										</div>
									</div>
								</div>

								<div>
									<div className="flex justify-between">
										<div className="text-sm text-slate-400">Voting Rate</div>
										<Button size="sm" variant="ghost" className="h-6 w-6 p-0">
											<span className="sr-only">Details</span>
											<svg
												width="15"
												height="15"
												viewBox="0 0 15 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M3.5 7.5L7.5 3.5L11.5 7.5M3.5 11.5L7.5 7.5L11.5 11.5"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
											</svg>
										</Button>
									</div>
									<div className="mt-4">
										<div className="text-2xl font-semibold">60.6%</div>
									</div>
								</div>

								<div>
									<div className="flex justify-between">
										<div className="text-sm text-slate-400">Reward Rate</div>
										<Button size="sm" variant="ghost" className="h-6 w-6 p-0">
											<span className="sr-only">Details</span>
											<svg
												width="15"
												height="15"
												viewBox="0 0 15 15"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M3.5 7.5L7.5 3.5L11.5 7.5M3.5 11.5L7.5 7.5L11.5 11.5"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												></path>
											</svg>
										</Button>
									</div>
									<div className="mt-4">
										<div className="text-2xl font-semibold">2.23%</div>
										<div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
											<div
												className="h-full bg-blue-500"
												style={{ width: "20%" }}
											></div>
										</div>
										<div className="text-xs text-slate-400 mt-1 flex justify-between">
											<span>1.45%</span>
											<span>3.12%</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Sidebar */}
					<div className="w-72 ml-6">
						<div className="bg-slate-800 rounded-lg p-5 mb-6">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
										<span className="text-xs font-bold text-white">V3</span>
									</div>
									<span className="font-semibold">
										VoteChain<sup>®</sup>
									</span>
								</div>
								<span className="text-xs bg-blue-600 px-2 py-0.5 rounded-full">
									New
								</span>
							</div>

							<h3 className="text-xl font-medium mb-1">
								Liquid Voting Portfolio
							</h3>
							<p className="text-sm text-slate-400 mb-6">
								Apply AI algorithms to help you make smarter investments with
								Ethereum Liquid Staking
							</p>

							<Button className="w-full mb-3" variant="outline">
								Connect with Wallet
							</Button>

							<Button className="w-full" variant="ghost">
								Enter a Wallet Address
							</Button>
						</div>

						<div className="bg-slate-800 rounded-lg p-5">
							<h3 className="text-lg font-medium mb-4">Investment Period</h3>
							<div className="flex justify-between items-center mb-2">
								<div className="text-sm text-slate-400">
									Contribution Period (Month)
								</div>
								<div className="bg-slate-700 rounded-full px-2 py-0.5 text-xs">
									6 Month
								</div>
							</div>

							<div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden relative">
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-slate-800"></div>
								<div
									className="h-full bg-blue-500"
									style={{ width: "50%" }}
								></div>
							</div>

							<div className="flex justify-between items-center">
								<div className="text-sm text-slate-400">
									Contribution Period (Month)
								</div>
								<div className="bg-slate-700 rounded-full px-2 py-0.5 text-xs">
									4 Month
								</div>
							</div>

							<div className="h-2 bg-slate-700 rounded-full mt-2 mb-2 overflow-hidden relative">
								<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-slate-800"></div>
								<div
									className="h-full bg-blue-500"
									style={{ width: "40%" }}
								></div>
							</div>
						</div>
					</div>
				</main>
			</div>

			<Toaster />
			<TanStackRouterDevtools />
		</div>
	);
};

export default RootLayout;
