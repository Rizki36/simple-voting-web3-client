import { useState, useEffect } from "react";
import { useMatch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
	Clock,
	Users,
	Calendar,
	ArrowLeft,
	Share2,
	AlertCircle,
	Loader2,
	CheckCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
	useAccount,
	useWriteContract,
	useWaitForTransactionReceipt,
} from "wagmi";
import { formatDistanceToNow } from "date-fns";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { fromUnixTimestamp } from "@/lib/date-utils";
import { truncateAddress } from "@/lib/utils";
import { PROPOSAL_STATUS } from "@/hooks/queries/useProposalListQuery";
import useProposalQuery from "@/hooks/queries/useProposalQuery";
import useMyProposalVoteQuery from "@/hooks/queries/useMyProposalVoteQuery";

const ProposalDetailPage = () => {
	const { params } = useMatch({
		from: "/proposals/$proposalId",
	});
	const proposalId = params.proposalId;
	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const { isConnected } = useAccount();

	const {
		proposal,
		isLoading: isLoadingProposal,
		error: proposalError
	} = useProposalQuery(proposalId)

	const { myProposalVote, isLoading: isLoadingVoterInfo, refetch:
		refetchVoterInfo,
	} = useMyProposalVoteQuery(proposalId)

	// Contract write hook for voting
	const {
		writeContract,
		isPending: isVoting,
		data: txHash,
	} = useWriteContract();

	// Transaction receipt hook
	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash: txHash,
	});

	// Track combined loading state
	const isSubmitting = isVoting || isConfirming;
	const isLoading =
		isLoadingProposal ||
		isLoadingVoterInfo;
	const error = proposalError



	// Calculate remaining time for active proposals
	const getRemainingTime = () => {
		if (!proposal) return "";
		if (PROPOSAL_STATUS[proposal.status] !== "active") return "Ended";

		const endDate = new Date(fromUnixTimestamp(proposal.endTime));
		const now = new Date();
		const diffTime = Math.max(0, endDate.getTime() - now.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(
			(diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
		);

		if (diffDays > 0) {
			return `${diffDays} days ${diffHours} hours remaining`;
		}
		return `${diffHours} hours remaining`;
	};

	// On successful vote
	useEffect(() => {
		if (isSuccess) {
			toast.success("Vote submitted successfully!");
			setSelectedOption(null);

			// Refetch voter info and results
			refetchVoterInfo();
		}
	}, [isSuccess]);

	// Copy proposal link to clipboard
	const shareProposal = () => {
		navigator.clipboard.writeText(window.location.href);
		toast.info("Link copied to clipboard!");
	};

	// Submit vote to the blockchain
	const handleVote = async () => {
		if (selectedOption === null) return;

		try {
			writeContract({
				address: smartContractAddress as `0x${string}`,
				abi: smartContractABI,
				functionName: "vote",
				args: [BigInt(proposalId), BigInt(selectedOption)],
			});
		} catch (err) {
			console.error("Error submitting vote:", err);
			toast.error("Failed to submit your vote. Please try again.");
		}
	};

	// Error state
	if (error) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error loading proposal</AlertTitle>
					<AlertDescription>
						{error instanceof Error
							? error.message
							: "Could not load proposal details"}
					</AlertDescription>
				</Alert>
				<Link to="/proposals">
					<Button className="mt-4" variant="outline">
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to Proposals
					</Button>
				</Link>
			</div>
		);
	}

	// Loading state
	if (isLoading || !proposal) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Link
					to="/proposals"
					className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4"
				>
					<ArrowLeft className="mr-1 h-4 w-4" />
					Back to Proposals
				</Link>

				<div className="bg-slate-800 rounded-lg p-6 mb-6">
					<Skeleton className="h-8 w-3/4 mb-4" />
					<Skeleton className="h-4 w-1/3 mb-2" />
					<Skeleton className="h-4 w-1/4 mb-4" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</div>

				<div className="flex justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-slate-400" />
				</div>
			</div>
		);
	}

	const isActive = PROPOSAL_STATUS[proposal.status] === "active";

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Back Navigation */}
			<Link
				to="/proposals"
				className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4"
			>
				<ArrowLeft className="mr-1 h-4 w-4" />
				Back to Proposals
			</Link>

			{/* Header */}
			<div className="bg-slate-800 rounded-lg p-6 mb-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<Badge variant={isActive ? "default" : "secondary"}>
								{isActive ? "Active" : "Closed"}
							</Badge>
							{isActive && (
								<div className="flex items-center text-xs text-slate-400">
									<Clock className="h-3 w-3 mr-1" />
									{getRemainingTime()}
								</div>
							)}
						</div>
						<h1 className="text-2xl font-bold">{proposal.title}</h1>
					</div>

					<div className="flex gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon" onClick={shareProposal}>
										<Share2 className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share proposal</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</div>

				<div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
					{isLoadingProposal ? (
						<div className="flex items-center">
							<Calendar className="mr-1 h-4 w-4" />
							<span className="flex items-center">
								Created <Loader2 className="ml-1 h-3 w-3 animate-spin" />
							</span>
						</div>
					) : proposal.createdAt ? (
						<div className="flex items-center">
							<Calendar className="mr-1 h-4 w-4" />
							Created{" "}
							{formatDistanceToNow(fromUnixTimestamp(proposal.createdAt), { addSuffix: true })}
						</div>
					) : null}

					<div className="flex items-center">
						<Users className="mr-1 h-4 w-4" />
						{proposal.totalVotes} votes
					</div>
					<div className="flex items-center">
						By {truncateAddress(proposal.creator)}
					</div>
				</div>

				{/* Description */}
				<div className="bg-slate-900 rounded-md p-4 mb-6">
					<div className="prose prose-invert max-w-none">
						{proposal.description.split("\n\n").map((paragraph, i) => (
							<p key={i} className="mb-4">
								{paragraph}
							</p>
						))}
					</div>
				</div>
			</div>

			<Card>
				<CardContent className="pt-6">
					<h2 className="text-xl font-semibold mb-4">Cast Your Vote</h2>

					{!isConnected ? (
						<Alert className="mb-6">
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Wallet not connected</AlertTitle>
							<AlertDescription>
								Connect your wallet to vote on this proposal
							</AlertDescription>
						</Alert>
					) : myProposalVote?.hasVoted ? (
						<div className="bg-blue-900/20 text-blue-400 p-4 rounded-md mb-6 flex items-center">
							<div className="mr-2 text-blue-400 rounded-full bg-blue-400/20 p-1">
								<CheckCircle className="h-4 w-4" />
							</div>
							<div>
								<div className="font-medium">
									You voted for:{" "}
									{proposal.options[Number(myProposalVote?.chosenOption) || 0]}
								</div>
								<div className="text-sm">
									Your vote has been recorded on the blockchain
								</div>
							</div>
						</div>
					) : PROPOSAL_STATUS[proposal.status] === "ended" ? (
						<div className="bg-slate-700/20 text-slate-400 p-4 rounded-md mb-6 flex items-center">
							<AlertCircle className="h-4 w-4 mr-2" />
							<div className="text-sm">This vote has ended</div>
						</div>
					) : (
						<div className="space-y-4 mb-6">
							<h3 className="text-lg font-medium">Cast your vote</h3>
							<div className="grid gap-2">
								{proposal.options.map((option, i) => (
									<div
										key={i}
										className={`p-4 rounded-md border cursor-pointer transition-all ${selectedOption === i
											? "border-blue-500 bg-blue-500/10"
											: "border-slate-700 hover:border-slate-600"
											}`}
										onClick={() => setSelectedOption(i)}
										// biome-ignore lint/a11y/useSemanticElements: <explanation>
										role="button"
										tabIndex={0}
										onKeyDown={(e) => {
											if (e.key === "Enter" || e.key === " ") {
												setSelectedOption(i);
											}
										}}
									>
										<div className="flex items-center">
											<div
												className={`w-4 h-4 rounded-full mr-2 border-2 flex items-center justify-center ${selectedOption === i
													? "border-blue-500"
													: "border-slate-600"
													}`}
											>
												{selectedOption === i && (
													<div className="w-2 h-2 rounded-full bg-blue-500"></div>
												)}
											</div>
											{option}
										</div>
									</div>
								))}
							</div>

							{PROPOSAL_STATUS[proposal.status] === "active" &&
								!myProposalVote?.hasVoted &&
								isConnected && (
									<Button
										className="w-full"
										onClick={handleVote}
										disabled={selectedOption === null || isSubmitting}
									>
										{isSubmitting ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Submitting...
											</>
										) : (
											"Submit Vote"
										)}
									</Button>
								)}
						</div>
					)}

					<h3 className="text-lg font-medium mb-4">Current Results</h3>
					<div className="space-y-4">
						{proposal.options.map((option, i) => {
							const results =
								proposal.totalVotes > 0
									? proposal.votes.map((vote) =>
										Number((vote * 100) / proposal.totalVotes),
									)
									: proposal.votes.map(() => 0);

							// Find leading option
							const maxVotes = Math.max(...results);
							const isLeading =
								results[i] === maxVotes && maxVotes > 0;

							return (
								<div key={i} className="space-y-2">
									<div className="flex justify-between text-sm">
										<span>
											{option}
											{isLeading && PROPOSAL_STATUS[proposal.status] === "ended" && (
												<Badge className="ml-2 bg-green-800">Winner</Badge>
											)}
											{isLeading && PROPOSAL_STATUS[proposal.status] === "active" && (
												<Badge className="ml-2 bg-blue-800">Leading</Badge>
											)}
										</span>
										<span className="font-medium">
											{results[i]}% ({Number(proposal.votes[i])} votes)
										</span>
									</div>

									<Progress
										value={results[i]}
										className={`h-2 ${isLeading ? "bg-slate-600" : ""}`}
									/>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProposalDetailPage;
