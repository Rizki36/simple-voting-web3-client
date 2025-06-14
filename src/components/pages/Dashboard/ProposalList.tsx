import { useState } from "react";
import { useAccount } from "wagmi";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import useProposalListQuery, { PROPOSAL_STATUS } from "@/hooks/queries/useProposalListQuery";

type ProposalListProps = {
	filter: "active" | "recent" | "voted";
	onSelectProposal: (id: number) => void;
};

const ProposalList = ({ filter, onSelectProposal }: ProposalListProps) => {
	const navigate = useNavigate();
	const { address } = useAccount();
	const [viewAll, setViewAll] = useState(false);

	const { data: proposals, isLoading } = useProposalListQuery({});

	// Apply filter to proposals
	const filteredProposals = proposals
		? proposals
			.filter((proposal) => {
				if (filter === "active") return PROPOSAL_STATUS[proposal.status] === "active";
				if (filter === "voted" && address) {
					// This would need a way to track user votes
					// For now, just show the most recent proposals
					return true;
				}
				return true; // "recent" shows all
			})
			// .sort((a, b) => {
			// 	// Most recent first
			// 	return b.createdAt.getTime() - a.createdAt.getTime();
			// })
			.slice(0, viewAll ? undefined : 5) // Limit unless viewAll is true
		: [];

	if (isLoading) {
		return (
			<div className="space-y-3">
				{[...Array(3)].map((_, i) => (
					<Skeleton key={i} className="h-16 w-full" />
				))}
			</div>
		);
	}

	if (!filteredProposals.length) {
		return (
			<div className="text-center py-6 text-slate-400">No proposals found</div>
		);
	}

	return (
		<div className="space-y-2">
			{filteredProposals.map((proposal) => (
				// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
				// biome-ignore lint/a11y/useFocusableInteractive: <explanation>
				<div
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="button"
					key={proposal.id}
					className="p-3 border border-slate-800 rounded-lg hover:bg-slate-900/50 transition-colors cursor-pointer block w-full text-left"
					onClick={() => onSelectProposal(proposal.id)}
				>
					<div className="flex justify-between items-start">
						<div>
							<h3 className="font-medium">{proposal.title}</h3>
							<p className="text-xs text-slate-400">
								{PROPOSAL_STATUS[proposal.status] === "active"
									? `Ends ${formatDistanceToNow(new Date(
										Number(proposal.endTime) * 1000
									), { addSuffix: true })}`
									: `Ended ${formatDistanceToNow(new Date(
										Number(proposal.endTime) * 1000
									), { addSuffix: true })}`}
							</p>
						</div>
						<Badge
							className={
								PROPOSAL_STATUS[proposal.status] === "active" ? "bg-green-700" : "bg-slate-600"
							}
						>
							{PROPOSAL_STATUS[proposal.status] === "active" ? "Active" : "Ended"}
						</Badge>
					</div>
					<div className="flex justify-between items-center mt-2 text-xs text-slate-400">
						<span>{proposal.totalVotes} votes</span>
						<Button
							variant="link"
							size="sm"
							onClick={(e) => {
								e.stopPropagation();
								navigate({ to: `/proposals/${proposal.id}` });
							}}
							className="p-0 h-auto"
						>
							View Details <ArrowRight className="ml-1 h-3 w-3" />
						</Button>
					</div>
				</div>
			))}

			{proposals && proposals.length > 5 && !viewAll && (
				<Button
					variant="ghost"
					size="sm"
					className="w-full mt-2"
					onClick={() => setViewAll(true)}
				>
					View All Proposals
				</Button>
			)}
		</div>
	);
};

export default ProposalList;
