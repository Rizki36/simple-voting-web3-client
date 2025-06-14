import useProposalListQuery from "./useProposalListQuery";

const useProposalQuery = (proposalId: string) => {
	const { data: proposalList, ...rest } = useProposalListQuery({
		enabled: !!proposalId,
	});
	const proposal = proposalList?.find((p) => p.id.toString() === proposalId);
	return {
		proposal,
		...rest,
	};
};
export default useProposalQuery;
