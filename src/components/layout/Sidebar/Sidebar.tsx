import SidebarItem from "./SidebarItem";
import { Link, useRouterState } from "@tanstack/react-router";
import {
	LayoutDashboard,
	FileText,
	Vote,
	PenSquare,
	Code,
	BarChart2,
	CheckCircle,
	type LucideIcon,
} from "lucide-react";
import ActiveVoteItem from "./ActiveVoteItem";

type SidebarItemType = {
	icon: LucideIcon;
	label: string;
	path: string;
	badge?: string;
	badgeType?: "New" | "Count" | "None";
};

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
		icon: Code,
		label: "API",
		path: "/api",
	},
	{
		icon: BarChart2,
		label: "Analytics",
		path: "/analytics",
		badge: "New",
		badgeType: "New",
	},
	{
		icon: CheckCircle,
		label: "Active Votes",
		path: "/active-votes",
		badge: "3",
		badgeType: "Count",
	},
];

const Sidebar = () => {
	const currentPath = useRouterState({
		select: (state) => state.location.pathname,
	});

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
				{[1, 2, 3].map((i) => (
					<ActiveVoteItem key={i} index={i} />
				))}
			</div>
		</aside>
	);
};

export default Sidebar;
