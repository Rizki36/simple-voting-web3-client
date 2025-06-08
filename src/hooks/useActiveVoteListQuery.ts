import { useAccount, usePublicClient } from "wagmi";
import useProposalsQuery from "./useProposalListQuery";
import { useQuery } from "@tanstack/react-query";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { readContract } from "viem/actions";

type ActiveVote = {
    id: string;
    title: string;
    optionSelected: number;
    optionText: string;
    endTime: Date;
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
                    const [hasVoted, chosenOption] = await readContract(publicClient, {
                        address: smartContractAddress as `0x${string}`,
                        abi: smartContractABI,
                        functionName: "getVoterInfo",
                        args: [BigInt(proposal.id), address],
                    }) as [boolean, bigint];

                    if (!hasVoted) return null;

                    const optionIndex = Number(chosenOption);

                    return {
                        id: proposal.id,
                        title: proposal.title,
                        optionSelected: optionIndex,
                        optionText: proposal.options[optionIndex] || "Unknown",
                        endTime: proposal.endDate,
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

export default useActiveVoteListQuery;