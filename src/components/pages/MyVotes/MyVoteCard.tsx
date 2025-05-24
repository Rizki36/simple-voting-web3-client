import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import { Calendar, Clock, ExternalLink, Check } from "lucide-react";

type ProposalStatus = "active" | "ended" | "all";

type MyVoteCardProps = {
	vote: {
		id: string;
		proposalId: string;
		proposalTitle: string;
		optionVoted: string;
		votedAt: string;
		status: ProposalStatus;
		endDate: string;
		results: number[];
	};
};

const MyVoteCard = ({ vote }: MyVoteCardProps) => {
	const isActive = vote.status === "active";

	// Format date to human-readable
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	// Calculate remaining time for active proposals
	const getRemainingTime = () => {
		if (!isActive) return "Ended";

		const endDate = new Date(vote.endDate);
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

	// Find the percentage for the user's voted option
	const getMyVotePercentage = () => {
		// Since we don't have a mapping of option names to indices in this mock,
		// we'll just use the first result for illustration
		return vote.results[0];
	};

	// Determine if the user's vote is currently the majority
	const isWinning = getMyVotePercentage() > 50;

	return (
		<div className="bg-slate-800 rounded-lg p-5">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
				<div>
					<div className="flex items-center gap-2 mb-1">
						<Badge
							variant={isActive ? "default" : "secondary"}
							className="uppercase text-xs"
						>
							{isActive ? "Active" : "Ended"}
						</Badge>
						{isActive && (
							<span className="text-xs flex items-center text-slate-400">
								<Clock className="h-3 w-3 mr-1" />
								{getRemainingTime()}
							</span>
						)}
					</div>

					<h3 className="text-lg font-medium">
						<Link
							to="/proposals/$proposalId"
							params={{ proposalId: vote.proposalId }}
							className="hover:text-blue-400 flex items-center gap-1"
						>
							{vote.proposalTitle}
							<ExternalLink className="h-3 w-3" />
						</Link>
					</h3>
				</div>

				<div className="text-right">
					<div className="text-xs text-slate-400">You voted</div>
					<div className="flex items-center gap-1 text-green-400 font-medium">
						{vote.optionVoted}
						<Check className="h-4 w-4" />
					</div>
				</div>
			</div>

			<div className="space-y-1 mb-4">
				<div className="flex justify-between text-sm">
					<span>{vote.optionVoted}</span>
					<span className="font-medium">{getMyVotePercentage()}%</span>
				</div>
				<Progress value={getMyVotePercentage()} className="h-2" />
			</div>

			<div className="flex flex-wrap justify-between text-xs text-slate-400">
				<div className="flex items-center gap-1">
					<Calendar className="h-3 w-3" />
					<span>You voted on {formatDate(vote.votedAt)}</span>
				</div>

				<div>
					{isActive ? (
						isWinning ? (
							<span className="text-green-400">Your choice is winning</span>
						) : (
							<span className="text-yellow-400">
								Your choice is not in majority
							</span>
						)
					) : isWinning ? (
						<span className="text-green-400">
							Your vote was in the majority
						</span>
					) : (
						<span className="text-slate-400">
							Your vote was not in the majority
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default MyVoteCard;
