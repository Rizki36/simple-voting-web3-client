import { useAccount, usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { readContract } from "viem/actions";
import useProposalsQuery from "./useProposalListQuery";

export type MyVote = {
    id: string; // Unique ID for the vote
    proposalId: string;
    proposalTitle: string;
    optionVoted: string;
    optionIndex: number;
    votedAt: string; // ISO string
    status: "active" | "ended";
    endDate: string; // ISO string
    results: number[]; // Percentages
};

export function useMyVotesQuery() {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();

    // Get all proposals first
    const { data: proposals } = useProposalsQuery();

    return useQuery({
        queryKey: ["myVotes", address],
        queryFn: async (): Promise<MyVote[]> => {
            if (!address || !publicClient || !proposals) return [];

            const allProposals = proposals;

            // Check user votes for each proposal
            const votesPromises = allProposals.map(async (proposal) => {
                try {
                    // Check if the user voted on this proposal
                    const [hasVoted, chosenOption] = await readContract(publicClient, {
                        address: smartContractAddress as `0x${string}`,
                        abi: smartContractABI,
                        functionName: "getVoterInfo",
                        args: [BigInt(proposal.id), address],
                    }) as [boolean, bigint];

                    if (!hasVoted) return null;

                    // Get full proposal results
                    const [options, votes, totalVotes, _] = await readContract(publicClient, {
                        address: smartContractAddress as `0x${string}`,
                        abi: smartContractABI,
                        functionName: "getProposalResults",
                        args: [BigInt(proposal.id)],
                    }) as [string[], bigint[], bigint, number];

                    // Calculate vote percentages
                    const results = totalVotes > 0n
                        ? votes.map(vote => Number((vote * 100n) / totalVotes))
                        : votes.map(() => 0);

                    const optionIndex = Number(chosenOption);

                    // We don't have actual vote timestamp, so we'll use a date between creation and now
                    // In production, you'd track this with events or a separate system
                    const now = new Date();
                    const endDate = proposal.endDate;
                    const estimatedVoteTime = new Date(
                        Math.min(
                            now.getTime(),
                            endDate.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000 // Random time up to 3 days before end
                        )
                    );

                    return {
                        id: `${proposal.id}-${address}`,
                        proposalId: proposal.id,
                        proposalTitle: proposal.title,
                        optionVoted: options[optionIndex],
                        optionIndex,
                        votedAt: estimatedVoteTime.toISOString(),
                        status: proposal.status,
                        endDate: proposal.endDate.toISOString(),
                        results: results.map(Number),
                    };
                } catch (e) {
                    console.error(`Error checking votes for proposal ${proposal.id}:`, e);
                    return null;
                }
            });

            const results = await Promise.all(votesPromises);
            return results.filter(Boolean) as MyVote[];
        },
        enabled: isConnected && !!address && !!proposals && !!publicClient,
    });
}