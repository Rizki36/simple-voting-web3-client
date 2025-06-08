import { useReadContract } from "wagmi";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import useProposalsQuery from "./useProposalListQuery";

export function useDashboardData() {
    // Get total proposal count from contract
    const { data: proposalCount, isError: isCountError } = useReadContract({
        address: smartContractAddress as `0x${string}`,
        abi: smartContractABI,
        functionName: "getProposalCount",
    });

    // Fetch all proposals
    const {
        data: proposals,
        isLoading: isProposalsLoading,
        error: proposalsError
    } = useProposalsQuery()

    // Calculate dashboard statistics
    const stats = {
        totalProposals: proposalCount ? Number(proposalCount) : 0,
        activeProposals: proposals ? proposals.filter(p => p.status === "active").length : 0,
        totalVotes: proposals ? proposals.reduce((sum, p) => sum + p.votesCount, 0) : 0,
        endingSoon: proposals
            ? proposals
                .filter(p => p.status === "active")
                .filter(p => {
                    const now = new Date();
                    const hoursRemaining = (p.endDate.getTime() - now.getTime()) / (1000 * 60 * 60);
                    return hoursRemaining < 24; // Less than 24 hours remaining
                }).length
            : 0
    };

    return {
        stats,
        isLoading: isProposalsLoading,
        error: proposalsError || (isCountError ? new Error("Failed to fetch proposal count") : null)
    };
}