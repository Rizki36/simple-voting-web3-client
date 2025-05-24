import { Button } from "@/components/ui/button";

type ProposalCardProps = {
	title: string;
	percentage: string;
	change: string;
	changeColor: string;
	value: string;
	index: number;
};

const ProposalCard = ({
	title,
	percentage,
	change,
	changeColor,
	value,
	index,
}: ProposalCardProps) => {
	return (
		<div className="bg-slate-800 rounded-lg p-4 relative overflow-hidden">
			{/* Top section */}
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<div
						className={`w-8 h-8 rounded-full bg-${index === 0 ? "blue" : index === 1 ? "yellow" : "purple"}-600 flex items-center justify-center`}
					>
						{index + 1}
					</div>
					<div>
						<div className="text-xs text-slate-400">Proposal of Vote</div>
						<div className="text-sm">{title}</div>
					</div>
				</div>
				<Button size="icon" variant="ghost" className="h-6 w-6">
					<span className="sr-only">Details</span>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<title>Arrow Icon</title>
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

			{/* Percentage */}
			<div className="text-2xl font-semibold mb-2">{percentage}</div>

			{/* Change */}
			<div
				className={`inline-flex items-center gap-1 text-xs text-${changeColor === "green" ? "green" : "red"}-500`}
			>
				<span>{change}</span>
			</div>

			{/* Chart (placeholder) */}
			<div className="h-10 mt-2 relative">
				<div
					className={`absolute bottom-0 left-0 w-full h-6 bg-${changeColor === "green" ? "green" : "red"}-500/10 rounded`}
				></div>
				{/* Line representation */}
				<div
					className={`absolute bottom-0 left-0 right-0 h-[1px] bg-${changeColor === "green" ? "green" : "red"}-500`}
				></div>
			</div>

			{/* Value */}
			<div className="text-xs text-slate-400 mt-2 text-right">{value}</div>
		</div>
	);
};

export default ProposalCard;
