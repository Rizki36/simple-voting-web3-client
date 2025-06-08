import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Search,
	Calendar,
	TrendingUp,
	Clock,
	Loader2,
	AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import VoteCard from "./VoteCard";
import NoActiveVotes from "./NoActiveVotes";
import { useAccount } from "wagmi";
import useActiveVoteListQuery from "@/hooks/useActiveVoteListQuery";

type SortOption = "endingSoon" | "mostVotes" | "newest";

const ActiveVotesPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortOption, setSortOption] = useState<SortOption>("endingSoon");
	const { isConnected } = useAccount();

	// Get user's active votes from the contract
	const { data: activeVotes, isLoading, error } = useActiveVoteListQuery();

	// Filter votes based on search query
	const filteredVotes = activeVotes
		? activeVotes.filter(
				(vote) =>
					vote.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					vote.description?.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		: [];

	// Sort votes based on selected option
	const sortedVotes = [...filteredVotes].sort((a, b) => {
		switch (sortOption) {
			case "endingSoon":
				return a.endTime.getTime() - b.endTime.getTime();
			case "mostVotes":
				// If we don't have vote count directly, we could use other metrics or default to endpoint
				return 0; // Will be updated once we have proper data
			case "newest":
				return (
					new Date(b.createdAt || b.endTime).getTime() -
					new Date(a.createdAt || a.endTime).getTime()
				);
			default:
				return 0;
		}
	});

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		// Client-side search doesn't need a loading state
	};

	if (!isConnected) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Alert className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Wallet not connected</AlertTitle>
					<AlertDescription>
						Connect your wallet to see your active votes.
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	if (error) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error loading votes</AlertTitle>
					<AlertDescription>
						{error instanceof Error
							? error.message
							: "Failed to load your votes"}
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
	}

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
				{isLoading ? (
					"Loading votes..."
				) : (
					<>
						{filteredVotes.length} active vote
						{filteredVotes.length !== 1 ? "s" : ""} found
					</>
				)}
			</div>

			{/* Loading State */}
			{isLoading ? (
				<div className="flex flex-col items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-4" />
					<p className="text-slate-400">Loading your votes...</p>
				</div>
			) : (
				/* Tabs for different views */
				<Tabs defaultValue="cards">
					<TabsList className="mb-6">
						<TabsTrigger value="cards">Cards</TabsTrigger>
						<TabsTrigger value="list">List View</TabsTrigger>
					</TabsList>

					<TabsContent value="cards">
						{sortedVotes.length > 0 ? (
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{sortedVotes.map((vote) => (
									<VoteCard
										key={vote.id}
										vote={{
											id: vote.id,
											title: vote.title,
											description: vote.description || "",
											endDate: vote.endTime.toISOString(),
											votesCount: 0, // We don't have this information directly
											createdAt: (vote.createdAt || vote.endTime).toISOString(),
											options: vote.options || [],
											results: [], // We don't have this information directly
											userHasVoted: true, // By definition, these are votes the user has cast
											userVoteOption: vote.optionSelected,
										}}
									/>
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
									<VoteCard
										key={vote.id}
										vote={{
											id: vote.id,
											title: vote.title,
											description: vote.description || "",
											endDate: vote.endTime.toISOString(),
											votesCount: 0,
											createdAt: (vote.createdAt || vote.endTime).toISOString(),
											options: vote.options || [],
											results: [],
											userHasVoted: true,
											userVoteOption: vote.optionSelected,
										}}
										layout="list"
									/>
								))}
							</div>
						) : (
							<NoActiveVotes />
						)}
					</TabsContent>
				</Tabs>
			)}
		</div>
	);
};

export default ActiveVotesPage;
