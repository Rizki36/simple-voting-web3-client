import { Search, Settings, Plus, Copy, Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppKitAccount, useAppKitBalance } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AdapterBlueprint } from "@reown/appkit/adapters";

type HeaderProps = {
	className?: string;
};

const Header = ({ className }: HeaderProps) => {
	const { address, isConnected } = useAppKitAccount();
	const { fetchBalance } = useAppKitBalance();
	const [balance, setBalance] = useState<
		AdapterBlueprint.GetBalanceResult | undefined
	>();
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (isConnected) {
			fetchBalance().then((result) => {
				setBalance(result.data);
			});
		}
	}, [isConnected]);

	const handleCreateProposal = () => {
		console.log("Create proposal clicked");
	};

	const handleSearchClick = () => {
		console.log("Search clicked");
	};

	const handleSettingsClick = () => {
		console.log("Settings clicked");
	};

	const handleCopyAddress = () => {
		if (address) {
			navigator.clipboard.writeText(address);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	// Function to get token symbol color
	const getTokenColor = (symbol?: string) => {
		switch (symbol?.toUpperCase()) {
			case "ETH":
				return "bg-blue-600";
			case "BNB":
				return "bg-yellow-500";
			case "MATIC":
				return "bg-purple-600";
			default:
				return "bg-slate-700";
		}
	};

	return (
		<header
			className={cn(
				"h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-6",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				{isConnected && address && (
					<>
						<span className="text-sm text-slate-400 hidden md:inline">
							Connected to
						</span>
						<div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-lg">
							<span className="text-sm font-medium hidden sm:inline">
								{address.slice(0, 4)}...{address.slice(-4)}
							</span>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 p-0 ml-1 hover:bg-slate-700"
											onClick={handleCopyAddress}
										>
											{copied ? (
												<Check className="h-3 w-3 text-green-400" />
											) : (
												<Copy className="h-3 w-3" />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent side="bottom">
										<p>{copied ? "Copied!" : "Copy address"}</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</>
				)}
			</div>

			<div className="flex items-center gap-2 md:gap-4">
				<Button
					size="sm"
					variant="secondary"
					className="rounded-full bg-slate-800 hover:bg-slate-700 gap-1 text-background/60 px-2 md:px-3"
					onClick={handleCreateProposal}
					aria-label="Create new proposal"
				>
					<span className="text-sm font-medium hidden sm:inline">
						Create Proposal
					</span>
					<Plus className="h-4 w-4" />
				</Button>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-1 bg-slate-800 rounded-full p-1 pr-1 md:pr-2">
								<div
									className={`w-6 h-6 ${getTokenColor(balance?.symbol)} rounded-full flex items-center justify-center text-xs`}
								>
									<Coins className="h-3 w-3 text-white" />
								</div>
								<span className="text-sm hidden md:inline">
									{balance ? `${balance.balance} ${balance.symbol}` : "..."}
								</span>
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Your balance</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<Button
					size="icon"
					variant="ghost"
					onClick={handleSearchClick}
					aria-label="Search"
					className="hidden sm:flex"
				>
					<Search className="h-5 w-5" />
				</Button>
				<Button
					size="icon"
					variant="ghost"
					onClick={handleSettingsClick}
					aria-label="Settings"
				>
					<Settings className="h-5 w-5" />
				</Button>
			</div>
		</header>
	);
};

export default Header;
