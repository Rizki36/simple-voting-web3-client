import { Button } from "@/components/ui/button";

type ChangeColorType = "green" | "red";

type ProposalCardProps = {
	title: string;
	percentage: string;
	change: string;
	changeColor: ChangeColorType;
	value: string;
	index: number;
	onClick?: () => void;
};

const ProposalCard = ({
	title,
	percentage,
	change,
	changeColor,
	value,
	index,
	onClick,
}: ProposalCardProps) => {
	const handleDetailsClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClick?.();
	};

	// Map index to background color class
	const bgColorClass =
		index === 0
			? "bg-blue-600"
			: index === 1
				? "bg-yellow-600"
				: "bg-purple-600";

	// Map change color to Tailwind class
	const changeTextColorClass =
		changeColor === "green" ? "text-green-500" : "text-red-500";

	// Map change color to background class for chart
	const chartBgClass =
		changeColor === "green" ? "bg-green-500/10" : "bg-red-500/10";

	const chartLineClass =
		changeColor === "green" ? "bg-green-500" : "bg-red-500";

	return (
		<div
			className="bg-slate-800 rounded-lg p-3 sm:p-4 relative overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.();
				}
			}}
			aria-label={`View ${title} proposal details`}
		>
			{/* Top section */}
			<div className="flex items-center justify-between mb-3 sm:mb-4">
				<div className="flex items-center gap-2">
					<div
						className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${bgColorClass} flex items-center justify-center text-xs sm:text-sm`}
					>
						{index + 1}
					</div>
					<div>
						<div className="text-xs text-slate-400">Proposal of Vote</div>
						<div className="text-sm">{title}</div>
					</div>
				</div>
				<Button
					size="icon"
					variant="ghost"
					className="h-6 w-6"
					onClick={handleDetailsClick}
					aria-label={`View ${title} details`}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
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

			{/* Percentage - Responsive font size */}
			<div className="text-xl sm:text-2xl font-semibold mb-1 sm:mb-2">
				{percentage}
			</div>

			{/* Change */}
			<div
				className={`inline-flex items-center gap-1 text-xs ${changeTextColorClass}`}
			>
				<span>{change}</span>
			</div>

			{/* Chart (placeholder) - Responsive height */}
			<div className="h-8 sm:h-10 mt-2 relative">
				<div
					className={`absolute bottom-0 left-0 w-full h-5 sm:h-6 ${chartBgClass} rounded`}
				></div>
				{/* Line representation */}
				<div
					className={`absolute bottom-0 left-0 right-0 h-[1px] ${chartLineClass}`}
				></div>
			</div>

			{/* Value */}
			<div className="text-xs text-slate-400 mt-1 sm:mt-2 text-right">
				{value}
			</div>
		</div>
	);
};

export default ProposalCard;
