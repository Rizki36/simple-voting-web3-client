import { fetchProposals } from "@/lib/services";
import { useQuery } from "@tanstack/react-query";
import { useChainId, usePublicClient } from "wagmi";
const useProposalsQuery = () => {
    const chainId = useChainId()
    const publicClient = usePublicClient({ chainId });
    return useQuery({
        queryKey: ["proposals", publicClient?.uid],
        queryFn: () => fetchProposals({ publicClient }),
        enabled: !!publicClient?.uid,
    });
};

export default useProposalsQuery;