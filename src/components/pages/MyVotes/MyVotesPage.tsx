import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import MyVoteCard from "./MyVoteCard";
import MyVotesEmptyState from "./MyVotesEmptyState";

type ProposalStatus = "active" | "ended" | "all";

const MyVotesPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [filter, setFilter] = useState<ProposalStatus>("all");

	// Mock data for UI development
	const myVotes = [
		{
			id: "1",
			proposalId: "12",
			proposalTitle: "Integrate Layer 2 Solutions",
			optionVoted: "Approve",
			votedAt: "2025-05-18T14:32:00Z",
			status: "active" as ProposalStatus,
			endDate: "2025-06-10T00:00:00Z",
			results: [70, 25, 5], // Percentages
		},
		{
			id: "2",
			proposalId: "8",
			proposalTitle: "Treasury Diversification Plan",
			optionVoted: "Reject",
			votedAt: "2025-05-15T09:45:00Z",
			status: "active" as ProposalStatus,
			endDate: "2025-06-05T00:00:00Z",
			results: [65, 35], // Percentages
		},
		{
			id: "3",
			proposalId: "5",
			proposalTitle: "Governance Parameter Updates",
			optionVoted: "For",
			votedAt: "2025-05-02T16:21:00Z",
			status: "ended" as ProposalStatus,
			endDate: "2025-05-20T00:00:00Z",
			results: [82, 18], // Percentages
		},
	];

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
		}, 800);
	};

	const filteredVotes = myVotes.filter((vote) => {
		const matchesStatus = filter === "all" || vote.status === filter;
		const matchesSearch =
			vote.proposalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
			vote.proposalId.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 sm:mb-0">My Votes</h1>
			</div>

			{/* Filter Tabs */}
			<Tabs
				defaultValue="all"
				onValueChange={(value) => setFilter(value as ProposalStatus)}
			>
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
					<TabsList>
						<TabsTrigger value="all">All Votes</TabsTrigger>
						<TabsTrigger value="active">Active</TabsTrigger>
						<TabsTrigger value="ended">Ended</TabsTrigger>
					</TabsList>

					<form onSubmit={handleSearch} className="w-full sm:w-auto">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search proposals..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 w-full sm:w-[250px] bg-slate-800"
							/>
						</div>
					</form>
				</div>

				<TabsContent value="all" className="mt-0">
					{filteredVotes.length > 0 ? (
						<div className="space-y-4">
							{filteredVotes.map((vote) => (
								<MyVoteCard key={vote.id} vote={vote} />
							))}
						</div>
					) : (
						<MyVotesEmptyState />
					)}
				</TabsContent>

				<TabsContent value="active" className="mt-0">
					{filteredVotes.length > 0 ? (
						<div className="space-y-4">
							{filteredVotes.map((vote) => (
								<MyVoteCard key={vote.id} vote={vote} />
							))}
						</div>
					) : (
						<MyVotesEmptyState status="active" />
					)}
				</TabsContent>

				<TabsContent value="ended" className="mt-0">
					{filteredVotes.length > 0 ? (
						<div className="space-y-4">
							{filteredVotes.map((vote) => (
								<MyVoteCard key={vote.id} vote={vote} />
							))}
						</div>
					) : (
						<MyVotesEmptyState status="ended" />
					)}
				</TabsContent>
			</Tabs>

			{/* Pagination - Basic version */}
			{filteredVotes.length > 0 && (
				<div className="flex justify-center mt-8">
					<div className="flex gap-2">
						<Button variant="outline" size="sm" disabled>
							Previous
						</Button>
						<Button variant="outline" size="sm" className="bg-slate-800">
							1
						</Button>
						<Button variant="outline" size="sm">
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyVotesPage;
