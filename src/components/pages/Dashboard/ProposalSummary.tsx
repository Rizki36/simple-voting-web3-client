import { useReadContract } from "wagmi";
import { formatDistanceToNow } from "date-fns";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fromUnixTimestamp } from "@/lib/date-utils";
import { useNavigate } from "@tanstack/react-router";
import { formatProposal, PROPOSAL_STATUS } from "@/hooks/queries/useProposalListQuery";

interface ProposalSummaryProps {
	proposalId: number | null;
}

const ProposalSummary = ({ proposalId }: ProposalSummaryProps) => {
	const navigate = useNavigate();

	const { data, isLoading } = useReadContract({
		address: smartContractAddress as `0x${string}`,
		abi: smartContractABI,
		functionName: "getFullProposal",
		args: [BigInt(proposalId || 0)],
		query: {
			enabled: !!proposalId,
		}
	});

	if (!proposalId) {
		return (
			<div className="text-center py-6 text-slate-400">
				Select a proposal to view details
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
				<Skeleton className="h-20 w-full" />
			</div>
		);
	}

	if (!data) {
		return (
			<div className="text-center py-6 text-slate-400">
				Could not load proposal details
			</div>
		);
	}

	const formattedProposal = formatProposal([...data])
	const { title, description, options, totalVotes, votes, endTime, status } = formattedProposal;

	const endTimeDate = fromUnixTimestamp(endTime);
	const isActive = PROPOSAL_STATUS[status] === "active";


	// Find the winning option
	let highestVotes = 0;
	let winningOptionIndex = 0;

	for (let i = 0; i < votes.length; i++) {
		if (votes[i] > highestVotes) {
			highestVotes = votes[i];
			winningOptionIndex = i;
		}
	}

	return (
		<div className="space-y-4">
			<div>
				<h3 className="font-semibold">{title}</h3>
				<p className="text-xs text-slate-400">
					{isActive
						? `Ends ${formatDistanceToNow(endTimeDate, { addSuffix: true })}`
						: `Ended ${formatDistanceToNow(endTimeDate, { addSuffix: true })}`}
				</p>
			</div>

			{description && (
				<p className="text-sm text-slate-300 line-clamp-3">{description}</p>
			)}

			<div className="space-y-2">
				<h4 className="text-sm font-medium">Current Results</h4>
				{options.map((option, i) => {
					const voteCount = Number(votes[i]);
					const percentage =
						totalVotes > 0
							? Number((votes[i] * 100) / totalVotes)
							: 0;

					return (
						<div key={i} className="space-y-1">
							<div className="flex justify-between text-xs">
								<span>{option}</span>
								<span>
									{voteCount} votes ({percentage}%)
								</span>
							</div>
							<Progress
								value={percentage}
								className={i === winningOptionIndex ? "bg-slate-700" : ""}
							/>
						</div>
					);
				})}
			</div>

			<Button
				onClick={() => navigate({ to: `/proposals/${proposalId}` })}
				className="w-full"
			>
				View Full Details
			</Button>
		</div>
	);
};

export default ProposalSummary;
