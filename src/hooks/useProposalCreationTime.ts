import useProposalCreatedBlockQuery from "./useProposalCreatedBlockQuery"

/**
 *  TODO: Remove after adding creation time to proposal
 */
const useProposalCreationTime = (proposalId: string) => {
    const { data: block, error, isLoading } = useProposalCreatedBlockQuery(proposalId)
    const timestamp = block?.timestamp ? new Date(Number(block.timestamp)
        * 1000
    ) : null;

    return {
        data: timestamp,
        error,
        isLoading,
    }
}

export default useProposalCreationTime;