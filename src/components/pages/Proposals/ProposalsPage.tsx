import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Search,
	Calendar,
	Users,
	Clock,
	AlertCircle,
	Plus,
	Link,
} from "lucide-react";
import ProposalListSkeleton from "./ProposalListSkeleton";
import ProposalCard from "./ProposalCard";
import { useAccount } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useProposalListQuery, { PROPOSAL_STATUS } from "@/hooks/queries/useProposalListQuery";
import { fromUnixTimestamp } from "@/lib/date-utils";

type ProposalStatus = "active" | "ended" | "all";
type SortOption = "newest" | "oldest" | "endingSoon" | "mostVotes";

export type Proposal = {
	id: string;
	title: string;
	description: string;
	status: "active" | "ended";
	endDate: Date;
	votesCount: number;
	createdAt: Date;
	options: string[];
	results: number[]; // Percentages
	creator: string;
};

const useProposalList = ({
	statusFilter = "all",
	searchQuery = "",
	sortOption = "newest",
}: {
	statusFilter?: ProposalStatus;
	searchQuery?: string;
	sortOption?: SortOption;
}) => {
	const { data: proposals, isLoading, error } = useProposalListQuery({});

	// Apply filters and sorting to the proposals
	const filteredAndSortedProposals = proposals
		? proposals
			.filter((proposal) => {
				// Apply status filter
				if (statusFilter !== "all" && PROPOSAL_STATUS[proposal.status] !== statusFilter) {
					return false;
				}

				// Apply search filter (case insensitive)
				if (searchQuery) {
					const query = searchQuery.toLowerCase();
					return (
						proposal.title.toLowerCase().includes(query) ||
						proposal.description.toLowerCase().includes(query)
					);
				}

				return true;
			})
			.sort((a, b) => {
				// Apply sorting
				switch (sortOption) {
					// case "newest":
					// 	return b.createdAt.getTime() - a.createdAt.getTime();
					// case "oldest":
					// 	return a.createdAt.getTime() - b.createdAt.getTime();
					case "endingSoon":
						// Sort by time remaining (for active proposals first, then ended)
						if (PROPOSAL_STATUS[a.status] === "active" && PROPOSAL_STATUS[b.status] === "ended") return -1;
						if (PROPOSAL_STATUS[a.status] === "ended" && PROPOSAL_STATUS[b.status] === "active") return 1;
						if (PROPOSAL_STATUS[a.status] === "active" && PROPOSAL_STATUS[b.status] === "active") {
							return fromUnixTimestamp(a.endTime).getTime() - fromUnixTimestamp(b.endTime).getTime();
						}
						return 0;
					case "mostVotes":
						return Number(b.totalVotes) - Number(a.totalVotes);
					default:
						return 0;
				}
			})
		: [];

	return {
		proposals: filteredAndSortedProposals,
		isLoading,
		error,
	};
};

const ErrorAlert = ({ error }: { error: unknown }) => (
	<div className="container mx-auto px-4 py-6">
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>
				{error instanceof Error ? error.message : "Failed to load proposals"}
			</AlertDescription>
		</Alert>
		<Button
			variant="outline"
			onClick={() => window.location.reload()}
			className="mt-4"
		>
			Retry
		</Button>
	</div>
);

const ProposalsPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<ProposalStatus>("all");
	const [sortOption, setSortOption] = useState<SortOption>("newest");
	const { isConnected } = useAccount();

	const {
		proposals: filteredAndSortedProposals,
		isLoading,
		error,
	} = useProposalList({
		statusFilter,
		searchQuery,
		sortOption,
	});

	// Handle form submission for search
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
	};

	// Show error state
	if (error) return <ErrorAlert error={error} />;

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 sm:mb-0">Proposals</h1>
				<Link to="/proposals/create">
					<Button disabled={!isConnected}>
						<Plus className="h-4 w-4 mr-2" />
						Create Proposal
					</Button>
				</Link>
			</div>

			{/* Filters and Search */}
			<div className="bg-slate-800 rounded-lg p-4 mb-6">
				<div className="flex flex-col md:flex-row gap-4">
					<form onSubmit={handleSearch} className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search proposals..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 bg-slate-900"
							/>
						</div>
					</form>

					<div className="flex flex-col sm:flex-row gap-3">
						<Select
							value={statusFilter}
							onValueChange={(value) =>
								setStatusFilter(value as ProposalStatus)
							}
						>
							<SelectTrigger className="w-full sm:w-[150px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Proposals</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="ended">Ended</SelectItem>
							</SelectContent>
						</Select>

						<Select
							value={sortOption}
							onValueChange={(value) => setSortOption(value as SortOption)}
						>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Sort by" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4" />
										<span>Newest</span>
									</div>
								</SelectItem>
								<SelectItem value="oldest">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4" />
										<span>Oldest</span>
									</div>
								</SelectItem>
								<SelectItem value="endingSoon">
									<div className="flex items-center gap-2">
										<Clock className="h-4 w-4" />
										<span>Ending Soon</span>
									</div>
								</SelectItem>
								<SelectItem value="mostVotes">
									<div className="flex items-center gap-2">
										<Users className="h-4 w-4" />
										<span>Most Votes</span>
									</div>
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			{/* Results count */}
			<div className="mb-4 text-sm text-slate-400">
				{isLoading ? (
					"Loading proposals..."
				) : (
					<>
						{filteredAndSortedProposals.length} proposal
						{filteredAndSortedProposals.length !== 1 ? "s" : ""} found
					</>
				)}
			</div>

			{/* Proposals List */}
			{isLoading ? (
				<ProposalListSkeleton count={4} />
			) : filteredAndSortedProposals.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredAndSortedProposals.map((proposal) => (
						<ProposalCard
							key={proposal.id}
							proposal={proposal}
							linkProps={{
								to: "/proposals/$proposalId",
								params: { proposalId: Number(proposal.id).toString() },
							}}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<p className="text-slate-400">
						No proposals found matching your criteria
					</p>
					{!isConnected && (
						<Alert variant="default" className="mt-4 max-w-md mx-auto">
							<AlertTitle>Connect your wallet</AlertTitle>
							<AlertDescription>
								Connect your wallet to view and interact with proposals
							</AlertDescription>
						</Alert>
					)}
				</div>
			)}
		</div>
	);
};

export default ProposalsPage;
