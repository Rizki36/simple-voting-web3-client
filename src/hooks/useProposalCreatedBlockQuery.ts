import { useQuery } from "@tanstack/react-query";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { useChainId, usePublicClient } from "wagmi";

/**
 *  TODO: Remove after adding creation time to proposal
 */
const useProposalCreatedBlockQuery = (
    proposalId: string,
) => {
    const chainId = useChainId()
    const publicClient = usePublicClient({ chainId });
    return useQuery({
        queryKey: ["ProposalCreatedEvent", proposalId, publicClient?.uid],
        queryFn: async () => {
            try {
                if (!proposalId || !publicClient) {
                    throw new Error("Proposal ID or public client is not available");
                }
                const events = await publicClient.getContractEvents({
                    address: smartContractAddress as `0x${string}`,
                    abi: smartContractABI,
                    eventName: "ProposalCreated",
                    args: {
                        proposalId: BigInt(proposalId),
                    },
                    fromBlock: "earliest",
                    toBlock: "latest",
                });

                if (events && events.length > 0) {
                    const block = await publicClient.getBlock({
                        blockHash: events[0].blockHash,
                    });

                    return block
                }

                return null;
            } catch (error) {
                console.error("Error fetching proposal creation time:", error);
                throw error;
            }
        },
        enabled: !!proposalId && !!publicClient?.uid,
        staleTime: Number.POSITIVE_INFINITY, // no need to refetch
    });
}

export default useProposalCreatedBlockQuery;