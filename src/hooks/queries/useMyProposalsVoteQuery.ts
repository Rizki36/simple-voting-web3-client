import { useAccount, usePublicClient } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { readContract } from "viem/actions";
import useProposalListQuery, {
	type FormattedProposal,
} from "./useProposalListQuery";

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

export type RawMyVote = [
	boolean, // hasVoted
	bigint, // chosenOption
];
export type FormattedMyProposalVote = {
	hasVoted: boolean;
	chosenOption: bigint;
};

export type MyProposalVoteQueryData = FormattedMyProposalVote &
	FormattedProposal;

export function useMyProposalsVoteQuery({ enabled = true } = {}) {
	const { address } = useAccount();
	const publicClient = usePublicClient();

	const { data: proposalList } = useProposalListQuery({});

	return useQuery({
		queryKey: ["myVotes", address, proposalList],
		queryFn: async (): Promise<MyProposalVoteQueryData[]> => {
			if (!address || !publicClient || !proposalList?.length) return [];

			// Check user votes for each proposal
			const votesPromises = proposalList.map(async (proposal) => {
				try {
					// Check if the user voted on this proposal
					const voterInfo = await readContract(publicClient, {
						address: smartContractAddress,
						abi: smartContractABI,
						functionName: "getVoterInfo",
						args: [BigInt(proposal.id), address],
					});
					const [hasVoted, chosenOption] = voterInfo;
					console.log({
						proposalId: proposal.id,
						hasVoted,
						chosenOption,
					});

					if (!hasVoted) return null;

					const result: MyProposalVoteQueryData = {
						...proposal,
						hasVoted: Boolean(hasVoted),
						chosenOption: chosenOption,
					};

					return result;
				} catch (e) {
					console.error(`Error checking votes for proposal ${proposal.id}:`, e);
					return null;
				}
			});

			const results = await Promise.all(votesPromises);
			return results.filter(Boolean) as MyProposalVoteQueryData[];
		},
		enabled: !!address && !!proposalList && !!publicClient && enabled,
	});
}
