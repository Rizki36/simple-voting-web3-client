import SidebarItem from "./SidebarItem";
import { Link, useRouterState } from "@tanstack/react-router";
import {
	LayoutDashboard,
	FileText,
	Vote,
	PenSquare,
	CheckCircle,
	type LucideIcon,
	Loader2,
} from "lucide-react";
import ActiveVoteItem from "./ActiveVoteItem";
import { useAccount } from "wagmi";
import useActiveVoteListQuery from "@/hooks/useActiveVoteListQuery";

type SidebarItemType = {
	icon: LucideIcon;
	label: string;
	path: string;
	badge?: string;
	badgeType?: "New" | "Count" | "None";
};

const Sidebar = () => {
	const { isConnected } = useAccount();
	const { data: activeVotes = [], isLoading } = useActiveVoteListQuery();
	const currentPath = useRouterState({
		select: (state) => state.location.pathname,
	});

	// Update side navigation with active votes count
	const sidebarItems: SidebarItemType[] = [
		{
			icon: LayoutDashboard,
			label: "Dashboard",
			path: "/",
		},
		{
			icon: FileText,
			label: "Proposals",
			path: "/proposals",
		},
		{
			icon: Vote,
			label: "My Votes",
			path: "/my-votes",
		},
		{
			icon: PenSquare,
			label: "Create Proposal",
			path: "/create-proposal",
		},
		{
			icon: CheckCircle,
			label: "Active Votes",
			path: "/active-votes",
			badge:
				activeVotes?.length > 0 ? activeVotes.length.toString() : undefined,
			badgeType: "Count",
		},
	];

	// Check if a path is active, including handling nested paths
	const isPathActive = (path: string) => {
		if (path === "/") {
			return currentPath === path;
		}
		return currentPath.startsWith(path);
	};

	return (
		<aside className="h-full w-60 md:w-60 sm:w-16 xs:w-16 bg-slate-950 border-r border-slate-800 flex flex-col">
			{/* Logo */}
			<div className="p-4 flex items-center gap-2">
				<Link
					to="/"
					className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center"
					aria-label="Go to home page"
				>
					<span className="font-bold text-white">V3</span>
				</Link>
				<span className="font-semibold text-lg md:block sm:hidden xs:hidden">
					VoteChain<sup>®</sup>
				</span>
			</div>

			{/* Navigation */}
			<nav className="mt-6 flex-1">
				{sidebarItems.map((item) => (
					<SidebarItem
						key={item.label}
						icon={item.icon}
						label={item.label}
						path={item.path}
						active={isPathActive(item.path)}
						badge={item.badge}
						badgeType={item.badgeType}
					/>
				))}
			</nav>

			{/* User Assets Section */}
			<div className="p-4 border-t border-slate-800 space-y-3">
				<div className="text-sm text-slate-400 md:block sm:hidden xs:hidden">
					Your Active Votes
				</div>

				{!isConnected ? (
					<div className="text-xs text-slate-500 text-center py-2">
						Connect wallet to see your votes
					</div>
				) : isLoading ? (
					<div className="flex justify-center items-center py-4">
						<Loader2 className="h-4 w-4 animate-spin text-slate-400" />
					</div>
				) : activeVotes.length === 0 ? (
					<div className="text-xs text-slate-500 text-center py-2">
						No active votes found
					</div>
				) : (
					activeVotes
						.slice(0, 3)
						.map((vote) => (
							<ActiveVoteItem
								key={vote.id}
								id={vote.id}
								title={vote.title}
								optionText={vote.optionText}
								endTime={vote.endTime}
							/>
						))
				)}

				{activeVotes.length > 3 && (
					<Link
						to="/my-votes"
						className="text-xs text-blue-400 hover:text-blue-300 block text-center mt-2"
					>
						View all ({activeVotes.length})
					</Link>
				)}
			</div>
		</aside>
	);
};

export default Sidebar;
