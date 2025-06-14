import useProposalListQuery, {
	PROPOSAL_STATUS,
} from "./queries/useProposalListQuery";

export function useDashboardData() {
	// Fetch all proposals
	const {
		data: proposals,
		isLoading: isProposalsLoading,
		error: proposalsError,
	} = useProposalListQuery({});

	// Calculate dashboard statistics
	const stats = {
		totalProposals: proposals?.length || 0,
		activeProposals: proposals
			? proposals.filter((p) => PROPOSAL_STATUS[p.status] === "active").length
			: 0,
		totalVotes: proposals
			? proposals.reduce((sum, p) => sum + Number(p.totalVotes), 0)
			: 0,
		endingSoon: proposals
			? proposals
					.filter((p) => PROPOSAL_STATUS[p.status] === "active")
					.filter((p) => {
						const now = new Date();
						const endDate = new Date(Number(p.endTime) * 1000);
						const hoursRemaining =
							(endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
						return hoursRemaining < 24; // Less than 24 hours remaining
					}).length
			: 0,
	};

	return {
		stats,
		isLoading: isProposalsLoading,
		error: proposalsError,
	};
}
