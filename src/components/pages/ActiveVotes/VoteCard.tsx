import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, Share2, Users, ExternalLink, Check } from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import {
	Tooltip as UITooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import ShareDialog from "./ShareDialog";
import type { MyProposalVoteQueryData } from "@/hooks/queries/useMyProposalsVoteQuery";
import { fromUnixTimestamp } from "@/lib/date-utils";

type VoteCardProps = {
	proposalVote: MyProposalVoteQueryData
	layout?: "card" | "list";
};

// Define custom type for chart data
type ChartDataItem = {
	name: string;
	value: number;
	fill: string;
	userVote: boolean;
};

// Define proper tooltip props based on Recharts types
type CustomTooltipProps = {
	active?: boolean;
	payload?: Array<{
		name: string;
		value: number;
		payload: ChartDataItem;
	}>;
	label?: string;
};

const VoteCard = ({ proposalVote, layout = "card" }: VoteCardProps) => {
	const [showShareDialog, setShowShareDialog] = useState(false);

	// Calculate remaining time for active votes
	const getRemainingTime = () => {
		const endDate = fromUnixTimestamp(proposalVote.endTime)
		const now = new Date();
		const diffTime = Math.max(0, endDate.getTime() - now.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(
			(diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
		);

		if (diffDays > 0) {
			return `${diffDays}d ${diffHours}h remaining`;
		}
		return `${diffHours}h remaining`;
	};

	const results =
		proposalVote.totalVotes > 0
			? proposalVote.votes.map((vote) =>
				Number((vote * 100) / proposalVote.totalVotes),
			)
			: proposalVote.votes.map(() => 0);

	// Format data for Recharts
	const chartData = proposalVote.options.map((option, i) => ({
		name: option,
		value: results[i],
		fill: getBarColor(i),
		userVote: i === Number(proposalVote.chosenOption),
	}));

	// Get color for chart bars
	function getBarColor(index: number): string {
		const colors = ["#3b82f6", "#ef4444", "#8b5cf6", "#10b981", "#f97316"];
		return index < colors.length ? colors[index] : colors[0];
	}

	// Custom tooltip for the chart with proper types
	const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-slate-900 p-2 border border-slate-700 rounded shadow-lg">
					<p className="text-xs">{`${payload[0].name}: ${payload[0].value}%`}</p>
					{payload[0].payload.userVote && (
						<p className="text-xs text-green-400 flex items-center">
							<Check className="h-3 w-3 mr-1" /> Your vote
						</p>
					)}
				</div>
			);
		}
		return null;
	};

	// Card style layout
	if (layout === "card") {
		return (
			<div className="bg-slate-800 rounded-lg p-5 flex flex-col h-full relative overflow-hidden">
				<div className="flex justify-between items-start mb-3">
					<div className="flex items-center text-sm text-blue-400">
						<Clock className="h-4 w-4 mr-1" />
						{getRemainingTime()}
					</div>
					<TooltipProvider>
						<UITooltip>
							<TooltipTrigger asChild>
								<Button
									size="icon"
									variant="outline"
									className="h-8 w-8"
									onClick={() => setShowShareDialog(true)}
								>
									<Share2 className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Share this vote</p>
							</TooltipContent>
						</UITooltip>
					</TooltipProvider>
				</div>

				<h3 className="text-lg font-medium mb-2">{proposalVote.title}</h3>

				<p className="text-sm text-slate-300 mb-4 line-clamp-2">
					{proposalVote.description}
				</p>

				{/* Votes chart */}
				<div className="h-48 w-full mb-4">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={chartData}
							layout="vertical"
							margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" horizontal={false} />
							<XAxis type="number" domain={[0, 100]} unit="%" />
							<YAxis
								dataKey="name"
								type="category"
								width={70}
								tick={{ fontSize: 12 }}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Bar
								dataKey="value"
								background={{ fill: "#1e293b" }}
								animationDuration={1000}
								label={{
									position: "right",
									formatter: (value: number) => `${value}%`,
									fontSize: 12,
								}}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>

				{/* User vote status */}
				{proposalVote.hasVoted && (
					<div className="bg-green-900/20 text-green-400 px-3 py-2 rounded-md mb-4 flex items-center text-sm">
						<Check className="h-4 w-4 mr-2" />
						You voted: {proposalVote.options[Number(proposalVote.chosenOption)]}
					</div>
				)}

				<div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-700 text-xs text-slate-400">
					<div className="flex items-center">
						<Users className="h-3 w-3 mr-1" />
						{proposalVote.totalVotes} participants
					</div>

					<Link
						to="/proposals/$proposalId"
						params={{ proposalId: Number(proposalVote.id).toString() }}
						className="flex items-center hover:text-blue-400"
					>
						View Details
						<ExternalLink className="h-3 w-3 ml-1" />
					</Link>
				</div>

				<ShareDialog
					open={showShareDialog}
					onOpenChange={setShowShareDialog}
					title={proposalVote.title}
					id={Number(proposalVote.id).toString()}
				/>
			</div>
		);
	}

	// List style layout
	return (
		<div className="bg-slate-800 rounded-lg p-5">
			<div className="flex flex-col md:flex-row gap-4">
				<div className="md:w-2/5">
					<div className="flex justify-between items-start mb-3">
						<div className="flex items-center text-sm text-blue-400">
							<Clock className="h-4 w-4 mr-1" />
							{getRemainingTime()}
						</div>
						<TooltipProvider>
							<UITooltip>
								<TooltipTrigger asChild>
									<Button
										size="icon"
										variant="outline"
										className="h-8 w-8"
										onClick={() => setShowShareDialog(true)}
									>
										<Share2 className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share this vote</p>
								</TooltipContent>
							</UITooltip>
						</TooltipProvider>
					</div>

					<h3 className="text-lg font-medium mb-2">{proposalVote.title}</h3>

					<p className="text-sm text-slate-300 mb-4">{proposalVote.description}</p>

					{/* User vote status */}
					{proposalVote.hasVoted && (
						<div className="bg-green-900/20 text-green-400 px-3 py-2 rounded-md mb-4 flex items-center text-sm">
							<Check className="h-4 w-4 mr-2" />
							You voted: {proposalVote.options[Number(proposalVote.chosenOption)]}
						</div>
					)}
				</div>

				<div className="md:w-3/5">
					{/* Progress bars for list view */}
					<div className="space-y-3">
						{proposalVote.options.map((option, i) => (
							<div key={i} className="space-y-1">
								<div className="flex justify-between text-sm">
									<span className="flex items-center">
										{option}
										{i === Number(proposalVote.chosenOption) && (
											<Check className="h-4 w-4 text-green-400 ml-1" />
										)}
									</span>
									<span>{results[i]}%</span>
								</div>
								<Progress
									value={results[i]}
									className="h-2"
									style={
										{
											"--progress-foreground": getBarColor(i),
										} as React.CSSProperties
									}
								/>
							</div>
						))}
					</div>

					<div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-700 text-xs text-slate-400">
						<div className="flex items-center">
							<Users className="h-3 w-3 mr-1" />
							{proposalVote.totalVotes} participants
						</div>

						<Link
							to="/proposals/$proposalId"
							params={{ proposalId: Number(proposalVote.id).toString() }}
							className="flex items-center hover:text-blue-400"
						>
							View Details
							<ExternalLink className="h-3 w-3 ml-1" />
						</Link>
					</div>
				</div>
			</div>

			<ShareDialog
				open={showShareDialog}
				onOpenChange={setShowShareDialog}
				title={proposalVote.title}
				id={Number(proposalVote.id).toString()}
			/>
		</div>
	);
};

export default VoteCard;
