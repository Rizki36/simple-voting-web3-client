import { useState, useEffect } from "react";
import { useChainId, usePublicClient } from "wagmi";
import { formatDistanceToNow } from "date-fns";
import { Activity, Vote } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { smartContractAddress, smartContractABI } from "@/constants/abi";
import { truncateAddress } from "@/lib/utils";

interface ActivityItem {
	type: "vote" | "proposal";
	transactionHash: string;
	timestamp: Date;
	address: string;
	proposalId: number;
	optionIndex?: number;
}

const VotingActivity = () => {
	const [activities, setActivities] = useState<ActivityItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const chainId = useChainId();
	const publicClient = usePublicClient({ chainId: chainId });

	useEffect(() => {
		async function fetchRecentActivity() {
			try {
				if (!publicClient) {
					throw new Error("Public client not available");
				}
				setIsLoading(true);

				// Get recent events from the blockchain
				const votedEvents = await publicClient.getContractEvents({
					address: smartContractAddress as `0x${string}`,
					abi: smartContractABI,
					eventName: "Voted",
					fromBlock: "earliest",
					toBlock: "latest",
				});

				const proposalEvents = await publicClient.getContractEvents({
					address: smartContractAddress as `0x${string}`,
					abi: smartContractABI,
					eventName: "ProposalCreated",
					fromBlock: "earliest",
					toBlock: "latest",
				});

				// Process vote events
				const voteActivities: ActivityItem[] = await Promise.all(
					votedEvents.map(async (event) => {
						const block = await publicClient.getBlock({
							blockHash: event.blockHash,
						});

						const args = {
							voter: event.args.voter as `0x${string}`,
							proposalId: event.args.proposalId
								? Number(event.args.proposalId)
								: 0,
							option: event.args.option ? Number(event.args.option) : 0,
						};

						return {
							type: "vote",
							transactionHash: event.transactionHash,
							timestamp: new Date(Number(block.timestamp) * 1000),
							address: args.voter as string,
							proposalId: Number(args.proposalId),
							optionIndex: Number(args.option),
						};
					}),
				);

				// Process proposal creation events
				const proposalActivities: ActivityItem[] = await Promise.all(
					proposalEvents.map(async (event) => {
						const block = await publicClient.getBlock({
							blockHash: event.blockHash,
						});

						const args = {
							creator: event.args.creator as `0x${string}`,
							proposalId: Number(event.args.proposalId),
						};

						return {
							type: "proposal",
							transactionHash: event.transactionHash,
							timestamp: new Date(Number(block.timestamp) * 1000),
							address: args.creator,
							proposalId: args.proposalId,
						};
					}),
				);

				// Combine and sort by timestamp (newest first)
				const allActivities = [...voteActivities, ...proposalActivities]
					.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
					.slice(0, 10); // Limit to 10 most recent

				setActivities(allActivities);
			} catch (error) {
				console.error("Error fetching recent activity:", error);
			} finally {
				setIsLoading(false);
			}
		}

		fetchRecentActivity();
	}, [publicClient]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-32">
				<Activity className="h-4 w-4 animate-spin" />
				<span className="ml-2">Loading activity...</span>
			</div>
		);
	}

	if (activities.length === 0) {
		return (
			<div className="text-center py-6 text-slate-400">
				No recent activity found
			</div>
		);
	}

	return (
		<ScrollArea className="h-[240px]">
			<div className="space-y-4">
				{activities.map((activity, index) => (
					<div key={index} className="flex items-start gap-3">
						<div className="bg-slate-800 p-2 rounded-full">
							{activity.type === "vote" ? (
								<Vote className="h-3 w-3" />
							) : (
								<Activity className="h-3 w-3" />
							)}
						</div>
						<div>
							<p className="text-sm">
								{activity.type === "vote"
									? `Vote on proposal #${activity.proposalId}`
									: `Proposal #${activity.proposalId} created`}
							</p>
							<div className="flex text-xs text-slate-400 gap-2">
								<span>{truncateAddress(activity.address)}</span>
								<span>•</span>
								<span>
									{formatDistanceToNow(activity.timestamp, { addSuffix: true })}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</ScrollArea>
	);
};

export default VotingActivity;
