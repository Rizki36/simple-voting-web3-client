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
import { Search, Calendar, Users, Clock } from "lucide-react";
import ProposalListSkeleton from "./ProposalListSkeleton";
import ProposalCard from "./ProposalCard";

type ProposalStatus = "active" | "ended" | "all";
type SortOption = "newest" | "oldest" | "endingSoon" | "mostVotes";

const ProposalsPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<ProposalStatus>("all");
	const [sortOption, setSortOption] = useState<SortOption>("newest");
	const [isLoading, setIsLoading] = useState(false);

	// Mock proposals for UI development
	const proposals = [
		{
			id: "1",
			title: "Integrate Layer 2 Solutions",
			description:
				"Proposal to integrate layer 2 scaling solutions to reduce gas fees and improve transaction speeds across the protocol.",
			status: "active" as ProposalStatus,
			endDate: "2025-06-10T00:00:00Z",
			votesCount: 142,
			createdAt: "2025-05-15T00:00:00Z",
			options: ["Approve", "Reject", "Abstain"],
			results: [70, 25, 5], // Percentages
		},
		{
			id: "2",
			title: "Treasury Diversification Plan",
			description:
				"Proposal to diversify the protocol's treasury by allocating funds to different assets to reduce risk.",
			status: "active" as ProposalStatus,
			endDate: "2025-06-05T00:00:00Z",
			votesCount: 256,
			createdAt: "2025-05-12T00:00:00Z",
			options: ["Approve", "Reject"],
			results: [65, 35], // Percentages
		},
		{
			id: "3",
			title: "Governance Parameter Updates",
			description:
				"Updates to key governance parameters including voting thresholds and proposal duration.",
			status: "ended" as ProposalStatus,
			endDate: "2025-05-20T00:00:00Z",
			votesCount: 189,
			createdAt: "2025-05-10T00:00:00Z",
			options: ["For", "Against"],
			results: [82, 18], // Percentages
		},
		{
			id: "4",
			title: "Community Fund Allocation",
			description:
				"Proposal to allocate funds from the community treasury for developer grants and community initiatives.",
			status: "ended" as ProposalStatus,
			endDate: "2025-05-15T00:00:00Z",
			votesCount: 320,
			createdAt: "2025-05-01T00:00:00Z",
			options: ["Approve", "Reject", "More Discussion"],
			results: [45, 30, 25], // Percentages
		},
	];

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Will implement actual search functionality later
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	};

	const filteredProposals = proposals.filter(
		(proposal) =>
			(statusFilter === "all" || proposal.status === statusFilter) &&
			(proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				proposal.description.toLowerCase().includes(searchQuery.toLowerCase())),
	);

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 sm:mb-0">Proposals</h1>
				<Button>Create Proposal</Button>
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

			{/* Results */}
			<div className="mb-4 text-sm text-slate-400">
				{filteredProposals.length} proposal
				{filteredProposals.length !== 1 ? "s" : ""} found
			</div>

			{/* Proposals List */}
			{isLoading ? (
				<ProposalListSkeleton count={4} />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredProposals.map((proposal) => (
						<ProposalCard key={proposal.id} proposal={proposal} />
					))}
				</div>
			)}

			{/* Pagination - Basic version */}
			<div className="flex justify-center mt-8">
				<div className="flex gap-2">
					<Button variant="outline" size="sm" disabled>
						Previous
					</Button>
					<Button variant="outline" size="sm" className="bg-slate-800">
						1
					</Button>
					<Button variant="outline" size="sm">
						2
					</Button>
					<Button variant="outline" size="sm">
						3
					</Button>
					<Button variant="outline" size="sm">
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ProposalsPage;
