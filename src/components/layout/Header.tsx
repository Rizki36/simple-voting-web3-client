import { Search, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type HeaderProps = {
	className?: string;
};

const Header = ({ className }: HeaderProps) => {
	const handleCreateProposal = () => {
		console.log("Create proposal clicked");
	};

	const handleSearchClick = () => {
		console.log("Search clicked");
	};

	const handleSettingsClick = () => {
		console.log("Settings clicked");
	};

	return (
		<header
			className={cn(
				"h-16 border-b border-slate-800 flex items-center justify-between px-4 md:px-6",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				<span className="text-sm text-slate-400 hidden md:inline">
					Connected to
				</span>
				<div className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded-lg">
					<Avatar className="w-6 h-6">
						<AvatarImage
							src="https://github.com/shadcn.png"
							alt="User avatar"
						/>
						<AvatarFallback>JD</AvatarFallback>
					</Avatar>
					<span className="text-sm font-medium hidden sm:inline">
						Irvin Crawford
					</span>
					<span className="text-xs text-slate-400 hidden sm:inline">•</span>
				</div>
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
				<div className="flex items-center gap-1 bg-slate-800 rounded-full p-1 pr-1 md:pr-2">
					<div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
						1
					</div>
					<span className="text-sm hidden md:inline">0.4 ETH</span>
				</div>
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
