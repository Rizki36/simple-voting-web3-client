import { cn } from "@/lib/utils";

type BadgeType = "New" | "Count" | "None";

type SidebarItemProps = {
	icon: string;
	label: string;
	active?: boolean;
	badge?: string;
	badgeType?: BadgeType;
	onClick?: () => void;
};

const SidebarItem = ({
	icon,
	label,
	active = false,
	badge,
	badgeType = "None",
	onClick,
}: SidebarItemProps) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onClick?.();
		}
	};

	const badgeColorClass = badgeType === "New" ? "bg-blue-600" : "bg-slate-700";

	return (
		<button
			type="button"
			tabIndex={0}
			aria-label={`Navigate to ${label}`}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			className={cn(
				"flex items-center gap-3 px-4 py-3 cursor-pointer w-full",
				active ? "bg-slate-800" : "hover:bg-slate-800/50",
			)}
		>
			<div className="w-6 h-6 flex items-center justify-center">
				<div className="w-5 h-5 bg-slate-600 rounded-md"></div>
			</div>
			<span>{label}</span>
			{badge && (
				<span
					className={cn(
						"text-xs px-2 py-0.5 ml-auto rounded-full",
						badgeColorClass,
					)}
				>
					{badge}
				</span>
			)}
		</button>
	);
};

export default SidebarItem;
