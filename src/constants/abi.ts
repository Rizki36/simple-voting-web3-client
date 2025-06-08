import type { Abi } from "viem";
import SimpleVotingWeb3 from './SimpleVotingWeb3.json'

export const smartContractAddress = import.meta.env.VITE_SMART_CONTRACT_ADDRESS
export const smartContractABI: Abi = SimpleVotingWeb3.abi as Abi;