import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, TrendingUp, Clock } from "lucide-react";
import VoteCard from "./VoteCard";
import NoActiveVotes from "./NoActiveVotes";

type SortOption = "endingSoon" | "mostVotes" | "newest";

const ActiveVotesPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOption, setSortOption] = useState<SortOption>("endingSoon");
	const [_isLoading, setIsLoading] = useState(false);

	// Mock active votes data for UI development
	const activeVotes = [
		{
			id: "1",
			title: "Integrate Layer 2 Solutions",
			description:
				"Proposal to integrate layer 2 scaling solutions to reduce gas fees and improve transaction speeds.",
			endDate: "2025-06-10T00:00:00Z",
			votesCount: 142,
			createdAt: "2025-05-15T00:00:00Z",
			options: ["Approve", "Reject", "Abstain"],
			results: [70, 25, 5], // Percentages
			userHasVoted: true,
			userVoteOption: 0,
		},
		{
			id: "2",
			title: "Treasury Diversification Plan",
			description:
				"Proposal to diversify the protocol's treasury by allocating funds to different assets to reduce risk.",
			endDate: "2025-06-05T00:00:00Z",
			votesCount: 256,
			createdAt: "2025-05-12T00:00:00Z",
			options: ["Approve", "Reject"],
			results: [65, 35], // Percentages
			userHasVoted: false,
			userVoteOption: null,
		},
		{
			id: "3",
			title: "Integration with External DeFi Protocols",
			description:
				"Proposal to integrate with major DeFi protocols to expand functionality and liquidity options.",
			endDate: "2025-06-15T00:00:00Z",
			votesCount: 98,
			createdAt: "2025-05-20T00:00:00Z",
			options: ["Yes", "No", "Abstain"],
			results: [45, 40, 15], // Percentages
			userHasVoted: true,
			userVoteOption: 0,
		},
	];

	// Filter votes based on search query
	const filteredVotes = activeVotes.filter(
		(vote) =>
			vote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			vote.description.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Sort votes based on selected option
	const sortedVotes = [...filteredVotes].sort((a, b) => {
		switch (sortOption) {
			case "endingSoon":
				return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
			case "mostVotes":
				return b.votesCount - a.votesCount;
			case "newest":
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			default:
				return 0;
		}
	});

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);
		}, 800);
	};

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
				<h1 className="text-2xl font-bold mb-4 sm:mb-0">Active Votes</h1>
			</div>

			{/* Search and Sort */}
			<div className="bg-slate-800 rounded-lg p-4 mb-6">
				<div className="flex flex-col md:flex-row gap-4">
					<form onSubmit={handleSearch} className="flex-1">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
							<Input
								placeholder="Search active votes..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 bg-slate-900"
							/>
						</div>
					</form>

					<div className="flex gap-2">
						<Button
							variant={sortOption === "endingSoon" ? "default" : "outline"}
							size="sm"
							onClick={() => setSortOption("endingSoon")}
							className="gap-2"
						>
							<Clock className="h-4 w-4" />
							<span className="hidden sm:inline">Ending Soon</span>
						</Button>
						<Button
							variant={sortOption === "mostVotes" ? "default" : "outline"}
							size="sm"
							onClick={() => setSortOption("mostVotes")}
							className="gap-2"
						>
							<TrendingUp className="h-4 w-4" />
							<span className="hidden sm:inline">Most Votes</span>
						</Button>
						<Button
							variant={sortOption === "newest" ? "default" : "outline"}
							size="sm"
							onClick={() => setSortOption("newest")}
							className="gap-2"
						>
							<Calendar className="h-4 w-4" />
							<span className="hidden sm:inline">Newest</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Results */}
			<div className="mb-4 text-sm text-slate-400">
				{filteredVotes.length} active vote
				{filteredVotes.length !== 1 ? "s" : ""} found
			</div>

			{/* Tabs for different views */}
			<Tabs defaultValue="cards">
				<TabsList className="mb-6">
					<TabsTrigger value="cards">Cards</TabsTrigger>
					<TabsTrigger value="list">List View</TabsTrigger>
				</TabsList>

				<TabsContent value="cards">
					{sortedVotes.length > 0 ? (
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{sortedVotes.map((vote) => (
								<VoteCard key={vote.id} vote={vote} />
							))}
						</div>
					) : (
						<NoActiveVotes />
					)}
				</TabsContent>

				<TabsContent value="list">
					{sortedVotes.length > 0 ? (
						<div className="space-y-4">
							{sortedVotes.map((vote) => (
								<VoteCard key={vote.id} vote={vote} layout="list" />
							))}
						</div>
					) : (
						<NoActiveVotes />
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ActiveVotesPage;
