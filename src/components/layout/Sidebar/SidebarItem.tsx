import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";

type BadgeType = "New" | "Count" | "None";

type SidebarItemProps = {
	icon: LucideIcon;
	label: string;
	path: string;
	active?: boolean;
	badge?: string;
	badgeType?: BadgeType;
};

const SidebarItem = ({
	icon: Icon,
	label,
	path,
	active = false,
	badge,
	badgeType = "None",
}: SidebarItemProps) => {
	const badgeColorClass = badgeType === "New" ? "bg-blue-600" : "bg-slate-700";

	return (
		<Link
			to={path}
			className={cn(
				"flex items-center gap-3 px-4 py-3 cursor-pointer w-full",
				active ? "bg-slate-800" : "hover:bg-slate-800/50",
			)}
			aria-label={`Navigate to ${label}`}
		>
			<div className="w-6 h-6 flex items-center justify-center text-slate-400">
				<Icon size={20} />
			</div>
			<span className="md:block sm:hidden xs:hidden">{label}</span>
			{badge && (
				<span
					className={cn(
						"text-xs px-2 py-0.5 ml-auto rounded-full md:block sm:hidden xs:hidden",
						badgeColorClass,
					)}
				>
					{badge}
				</span>
			)}
		</Link>
	);
};

export default SidebarItem;
