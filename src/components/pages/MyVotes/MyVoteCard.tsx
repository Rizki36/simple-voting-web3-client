import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "@tanstack/react-router";
import type { MyVote } from "@/hooks/useMyVotesQuery";

interface MyVoteCardProps {
	vote: MyVote;
}

const MyVoteCard = ({ vote }: MyVoteCardProps) => {
	const navigate = useNavigate();
	const {
		proposalId,
		proposalTitle,
		optionVoted,
		votedAt,
		status,
		endDate,
		results,
	} = vote;

	// Format dates for display
	const voteDateFormatted = formatDistanceToNow(new Date(votedAt), {
		addSuffix: true,
	});
	const endDateFormatted = formatDistanceToNow(new Date(endDate), {
		addSuffix: true,
	});

	// Find the top option by percentage
	const maxPercentage = Math.max(...results);
	const isWinning = results[vote.optionIndex] === maxPercentage;

	// View the proposal details
	const handleViewProposal = () => {
		navigate({ to: `/proposals/${proposalId}` });
	};

	return (
		<Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
			<CardContent className="p-4">
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-start justify-between">
							<div>
								<Badge
									variant="secondary"
									className={`mb-2 ${
										status === "active" ? "bg-green-900/30" : "bg-slate-800"
									}`}
								>
									Proposal #{proposalId} -{" "}
									{status === "active" ? "Active" : "Ended"}
								</Badge>
								<h3 className="text-lg font-semibold">{proposalTitle}</h3>
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 mt-4">
							<div>
								<p className="text-xs text-slate-400 mb-1">You voted</p>
								<p className="text-sm font-medium">
									{optionVoted}{" "}
									{isWinning && status === "ended" && (
										<Badge className="ml-1 bg-blue-900/30">
											Currently winning
										</Badge>
									)}
								</p>
							</div>
							<div>
								<p className="text-xs text-slate-400 mb-1">
									{status === "active" ? "Voting ends" : "Voting ended"}
								</p>
								<p className="text-sm">{endDateFormatted}</p>
							</div>
							<div>
								<p className="text-xs text-slate-400 mb-1">Your vote cast</p>
								<p className="text-sm">{voteDateFormatted}</p>
							</div>
							<div>
								<p className="text-xs text-slate-400 mb-1">
									{optionVoted} has{" "}
									<span className="font-medium">
										{results[vote.optionIndex]}%
									</span>{" "}
									of votes
								</p>
								<Progress
									value={results[vote.optionIndex]}
									className="h-1.5 mt-1"
								/>
							</div>
						</div>
					</div>

					<Button
						className="self-end md:self-center whitespace-nowrap"
						variant="outline"
						size="sm"
						onClick={handleViewProposal}
					>
						View Proposal <ArrowRight className="ml-1 h-3 w-3" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default MyVoteCard;
