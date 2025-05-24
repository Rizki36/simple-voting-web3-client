import SidebarItem from "./SidebarItem";
import ActiveVoteItem from "./ActiveVoteItem";

type SidebarIcon =
	| "dashboard"
	| "assets"
	| "staking"
	| "calculator"
	| "api"
	| "liquid"
	| "active";

type BadgeType = "New" | "Count" | "None";

type SidebarItemType = {
	icon: SidebarIcon;
	label: string;
	active?: boolean;
	badge?: string;
	badgeType?: BadgeType;
};

const sidebarItems: SidebarItemType[] = [
	{ icon: "dashboard", label: "Dashboard", active: true },
	{ icon: "assets", label: "Proposals", active: false },
	{ icon: "staking", label: "My Votes", active: false },
	{ icon: "calculator", label: "Create Proposal", active: false },
	{ icon: "api", label: "API", active: false },
	{
		icon: "liquid",
		label: "Analytics",
		active: false,
		badge: "New",
		badgeType: "New",
	},
	{
		icon: "active",
		label: "Active Votes",
		active: false,
		badge: "3",
		badgeType: "Count",
	},
];

const Sidebar = () => {
	const handleNavItemClick = (label: string) => {
		console.log(`Navigating to ${label}`);
	};

	const handleActiveVoteClick = (index: number) => {
		console.log(`Opening vote #${index} details`);
	};

	return (
		<aside className="w-60 md:w-60 sm:w-16 xs:w-16 bg-slate-950 border-r border-slate-800 flex flex-col">
			{/* Logo */}
			<div className="p-4 flex items-center gap-2">
				<div className="w-8 h-8 bg-slate-700 rounded-md flex items-center justify-center">
					<span className="font-bold text-white">V3</span>
				</div>
				<span className="font-semibold text-lg sm:hidden xs:hidden">
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
						active={item.active}
						badge={item.badge}
						badgeType={item.badgeType}
						onClick={() => handleNavItemClick(item.label)}
					/>
				))}
			</nav>

			{/* User Assets Section */}
			<div className="p-4 border-t border-slate-800 space-y-3">
				<div className="text-sm text-slate-400 sm:hidden xs:hidden">
					Your Active Votes
				</div>
				{[1, 2, 3].map((i) => (
					<ActiveVoteItem
						key={i}
						index={i}
						onClick={() => handleActiveVoteClick(i)}
					/>
				))}
			</div>
		</aside>
	);
};

export default Sidebar;
