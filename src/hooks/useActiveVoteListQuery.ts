import { useAccount, usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { readContract } from "viem/actions";
import useProposalsQuery from "./useProposalListQuery";

export type ActiveVote = {
    id: string;
    title: string;
    description?: string;
    options?: string[];
    optionSelected: number;
    optionText: string;
    endTime: Date;
    createdAt?: Date;
};

const useActiveVoteListQuery = () => {
    const { address, isConnected } = useAccount();
    const publicClient = usePublicClient();

    // First fetch all proposals
    const {
        data: proposals,
    } = useProposalsQuery()

    // Then fetch user votes for these proposals
    return useQuery({
        queryKey: ["activeVotes", address],
        queryFn: async (): Promise<ActiveVote[]> => {
            if (!address || !proposals || !publicClient) return [];

            const activeProposals = proposals.filter(p => p.status === "active");

            // Check each active proposal to see if the user has voted
            const votedProposalsPromises = activeProposals.map(async (proposal) => {
                try {
                    // Check if the user has voted on this proposal
                    const [hasVoted, chosenOption] = await readContract(publicClient, {
                        address: smartContractAddress as `0x${string}`,
                        abi: smartContractABI,
                        functionName: "getVoterInfo",
                        args: [BigInt(proposal.id), address],
                    }) as [boolean, bigint];

                    if (!hasVoted) return null;

                    const optionIndex = Number(chosenOption);

                    // Get additional proposal details for the UI
                    const [, title, description, , , ,] = await readContract(publicClient, {
                        address: smartContractAddress as `0x${string}`,
                        abi: smartContractABI,
                        functionName: "getProposal",
                        args: [BigInt(proposal.id)],
                    }) as [bigint, string, string, bigint, `0x${string}`, number, bigint];

                    // Get option text and results
                    const [options, , ,] = await readContract(publicClient, {
                        address: smartContractAddress as `0x${string}`,
                        abi: smartContractABI,
                        functionName: "getProposalResults",
                        args: [BigInt(proposal.id)],
                    }) as [string[], bigint[], bigint, number];

                    return {
                        id: proposal.id,
                        title,
                        description,
                        options,
                        optionSelected: optionIndex,
                        optionText: options[optionIndex] || "Unknown",
                        endTime: proposal.endDate,
                        createdAt: proposal.createdAt,
                    };
                } catch (e) {
                    console.error(`Error checking voter info for proposal ${proposal.id}:`, e);
                    return null;
                }
            });

            const results = await Promise.all(votedProposalsPromises);
            return results.filter(Boolean) as ActiveVote[];
        },
        enabled: isConnected && !!address && !!proposals && !!publicClient,
    });
};

export default useActiveVoteListQuery