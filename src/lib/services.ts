import type { Proposal } from "@/components/pages/Proposals/ProposalsPage";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { fromUnixTimestamp } from "./date-utils";
import type { PublicClient } from "viem";


/**
 * Fetches all proposals from the blockchain
 */
export async function fetchProposals({
    publicClient,
}: {
    publicClient?: PublicClient
}): Promise<Proposal[]> {
    try {
        if (!publicClient) {
            throw new Error("Public client is not initialized. Please check your configuration.");
        }

        // Step 1: Get all proposal IDs
        const proposalIds = await publicClient.readContract({
            address: smartContractAddress as `0x${string}`,
            abi: smartContractABI,
            functionName: "getAllProposalIds",
        }) as bigint[];

        if (!proposalIds.length) return [];

        // Step 2: Get basic info for all proposals in one call
        const basicInfo = await publicClient.readContract({
            address: smartContractAddress as `0x${string}`,
            abi: smartContractABI,
            functionName: "getProposalsBasicInfo",
            args: [proposalIds],
        }) as [bigint[], string[], number[], bigint[], bigint[]];

        const [ids, titles, statuses, endTimes, totalVotes] = basicInfo;

        // Step 3: Get detailed info for each proposal in parallel
        const detailedProposalsPromises = proposalIds.map(async (id, index) => {
            // Get proposal details
            const proposal = await publicClient.readContract({
                address: smartContractAddress as `0x${string}`,
                abi: smartContractABI,
                functionName: "getProposal",
                args: [id],
            }) as [bigint, string, string, bigint, `0x${string}`, number, bigint];

            // Get proposal results
            const results = await publicClient.readContract({
                address: smartContractAddress as `0x${string}`,
                abi: smartContractABI,
                functionName: "getProposalResults",
                args: [id],
            }) as [string[], bigint[], bigint, number];

            // Extract data
            const [, , description, endTime, creator, status, votesCount] = proposal;
            const [options, voteCounts, totalVoteCount] = results;

            // Calculate percentages for each option
            const votePercentages = totalVoteCount.toString() !== "0"
                ? voteCounts.map(count =>
                    Math.round(Number((count * 100n) / totalVoteCount))
                )
                : options.map(() => 0);

            // We estimate createdAt by using block timestamp or just set to a date a week before endTime
            const now = new Date();
            const endTimeDate = fromUnixTimestamp(endTime);
            // Estimated creation date (1 week before end time or current time if end time is far future)
            const createdAt = new Date(Math.min(
                now.getTime(),
                endTimeDate.getTime() - 7 * 24 * 60 * 60 * 1000
            ));

            const detailedProposal: Proposal = {
                id: id.toString(),
                title: titles[index],
                description,
                status: status === 0 ? "active" : "ended",
                endDate: endTimeDate,
                votesCount: Number(votesCount),
                createdAt,
                options,
                results: votePercentages,
                creator,
            }

            return detailedProposal;
        });

        return await Promise.all(detailedProposalsPromises);
    } catch (error) {
        console.error("Failed to fetch proposals:", error);
        throw new Error("Failed to load proposals. Please check your connection and try again.");
    }
}
