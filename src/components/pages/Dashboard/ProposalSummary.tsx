import { useReadContracts } from "wagmi";
import { formatDistanceToNow } from "date-fns";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fromUnixTimestamp } from "@/lib/date-utils";
import { useNavigate } from "@tanstack/react-router";

interface ProposalSummaryProps {
	proposalId: string | null;
}

const ProposalSummary = ({ proposalId }: ProposalSummaryProps) => {
	const navigate = useNavigate();

	const { data, isLoading } = useReadContracts({
		contracts: proposalId
			? [
					{
						address: smartContractAddress as `0x${string}`,
						abi: smartContractABI,
						functionName: "getProposal",
						args: [BigInt(proposalId)],
					},
					{
						address: smartContractAddress as `0x${string}`,
						abi: smartContractABI,
						functionName: "getProposalResults",
						args: [BigInt(proposalId)],
					},
				]
			: [],
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

	if (!data || !data[0] || !data[1]) {
		return (
			<div className="text-center py-6 text-slate-400">
				Could not load proposal details
			</div>
		);
	}

	const proposalData = data[0].result as [
		bigint,
		string,
		string,
		bigint,
		`0x${string}`,
		number,
		bigint,
	];
	const resultsData = data[1].result as [string[], bigint[], bigint, number];

	const [_id, title, description, endTime, _creator, status, _totalVotes] =
		proposalData;
	const [options, votes, totalVoteCount, _proposalStatus] = resultsData;

	const endTimeDate = fromUnixTimestamp(endTime);
	const isActive = status === 0;

	// Find the winning option
	let highestVotes = 0n;
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
						totalVoteCount > 0n
							? Number((votes[i] * 100n) / totalVoteCount)
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
