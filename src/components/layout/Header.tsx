import { Plus, Copy, Check, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatBalance } from "@/lib/utils";
import { useAppKitAccount, useAppKitBalance } from "@reown/appkit/react";
import { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { AdapterBlueprint } from "@reown/appkit/adapters";
import { Link, useRouterState } from "@tanstack/react-router";

type HeaderProps = {
	className?: string;
};

const Header = ({ className }: HeaderProps) => {
	const currentPath = useRouterState({
		select: (state) => state.location.pathname,
	});

	const isCreateProposalPage = currentPath === "/create-proposal";

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
				{/* Only show Create Proposal button if NOT on create proposal page */}
				{!isCreateProposalPage && (
					<Link to="/create-proposal">
						<Button
							size="sm"
							variant="secondary"
							className="rounded-full bg-slate-800 hover:bg-slate-700 gap-1 px-2 md:px-3"
							aria-label="Create new proposal"
						>
							<span className="text-sm font-medium hidden sm:inline">
								Create Proposal
							</span>
							<Plus className="h-4 w-4" />
						</Button>
					</Link>
				)}
			</div>

			<div className="flex items-center gap-2 md:gap-4">
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

				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center gap-1 bg-slate-800 rounded-full p-1">
								<div
									className={`w-6 h-6 ${getTokenColor(balance?.symbol)} rounded-full flex items-center justify-center text-xs`}
								>
									<Coins className="h-3 w-3 text-white" />
								</div>

								{balance ? (
									<span className="text-sm hidden md:inline mr-1 md:mr-2">{`${formatBalance(
										balance.balance,
									)} ${balance.symbol}`}</span>
								) : (
									""
								)}
							</div>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Your balance</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</header>
	);
};

export default Header;
