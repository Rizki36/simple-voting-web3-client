import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Settings, Plus } from "lucide-react";

const Header = () => {
	return (
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
	);
};

export default Header;
