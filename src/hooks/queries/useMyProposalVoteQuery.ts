import { useMyProposalsVoteQuery } from "./useMyProposalsVoteQuery";

const useMyProposalVoteQuery = (proposalId: string) => {
	const { data, ...rest } = useMyProposalsVoteQuery({
		enabled: !!proposalId,
	});
	const myProposalVote = data?.find(
		(proposalVote) => Number(proposalVote.id).toString() === proposalId,
	);

	return { myProposalVote, ...rest };
};
export default useMyProposalVoteQuery;
