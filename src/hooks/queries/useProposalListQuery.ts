import { smartContractABI, smartContractAddress } from "@/constants/abi";
import { useQuery } from "@tanstack/react-query";
import { useChainId, usePublicClient, useReadContract } from "wagmi";

export const PROPOSAL_STATUS = {
	0: "active",
	1: "ended",
};

export type RawProposal = [
	bigint, // id
	string, // title
	string, // description
	readonly string[], // options
	readonly bigint[], // votes
	bigint, // endTime
	bigint, // createdAt
	string, // creator
	number, // status
	bigint, // totalVotes
];

export type FormattedProposal = {
	id: number;
	title: string;
	description: string;
	status: keyof typeof PROPOSAL_STATUS;
	options: string[];
	votes: number[];
	endTime: number;
	createdAt: number;
	creator: string;
	totalVotes: number;
};

/**
 * Formats raw proposal data from the smart contract into a structured object
 */
export const formatProposal = (
	proposalData: RawProposal,
): FormattedProposal => {
	const [
		id,
		title,
		description,
		options,
		votes,
		endTime,
		createdAt,
		creator,
		status,
		totalVotes,
	] = proposalData;

	return {
		id: Number(id),
		title,
		description,
		status: status as keyof typeof PROPOSAL_STATUS,
		options: [...options],
		votes: votes.map((vote) => Number(vote)),
		endTime: Number(endTime),
		createdAt: Number(createdAt),
		creator,
		totalVotes: Number(totalVotes),
	};
};

type UseProposalListQueryProps = {
	enabled?: boolean;
};

const useProposalListQuery = (props: UseProposalListQueryProps) => {
	const { enabled = true } = props;
	const chainId = useChainId();
	const { data: proposalIds } = useReadContract({
		address: smartContractAddress,
		abi: smartContractABI,
		functionName: "getAllProposalIds",
	});
	const publicClient = usePublicClient({ chainId });
	const convertedProposalIds = (proposalIds || []).map((id) => Number(id));

	return useQuery({
		queryKey: ["proposals", publicClient?.uid, convertedProposalIds],
		queryFn: async () => {
			if (!convertedProposalIds.length || !publicClient?.uid) {
				return [];
			}

			const chunkArray = (array: number[], size: number): number[][] => {
				const result: number[][] = [];
				for (let i = 0; i < array.length; i += size) {
					result.push(array.slice(i, i + size));
				}
				return result;
			};

			// Split proposalIds into chunks of 50 to avoid exceeding RPC limits
			const chunks = chunkArray([...convertedProposalIds], 5);
			const proposals: FormattedProposal[] = [];

			for (const chunk of chunks) {
				const chunkProposals = await Promise.all(
					chunk.map(async (proposalId) => {
						const proposalData = await publicClient.readContract({
							address: smartContractAddress,
							abi: smartContractABI,
							functionName: "getFullProposal",
							args: [BigInt(proposalId)],
						});

						return formatProposal([...proposalData]);
					}),
				);

				proposals.push(...chunkProposals);
			}

			return proposals;
		},
		enabled: !!publicClient?.uid && !!proposalIds && enabled,
	});
};

export default useProposalListQuery;
