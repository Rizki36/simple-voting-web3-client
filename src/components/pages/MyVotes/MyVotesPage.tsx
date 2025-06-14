import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import MyProposalVoteCard from "./MyVoteCard";
import MyVotesEmptyState from "./MyVotesEmptyState";
import { useMyProposalsVoteQuery } from "@/hooks/queries/useMyProposalsVoteQuery";
import { PROPOSAL_STATUS } from "@/hooks/queries/useProposalListQuery";

type ProposalStatus = "active" | "ended" | "all";

const MyVotesPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [filter, setFilter] = useState<ProposalStatus>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const { isConnected } = useAccount();

	// Get user's votes from the blockchain
	const { data: myProposalsVote, isLoading, error } = useMyProposalsVoteQuery();
	console.log({
		myProposalsVote,
		isLoading,
		error,
	})

	const itemsPerPage = 5;

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setCurrentPage(1); // Reset to first page on new search
	};

	// Apply filters to the vote data
	const filteredVotes = myProposalsVote
		? myProposalsVote.filter((proposal) => {
			const matchesStatus = filter === "all" || PROPOSAL_STATUS[proposal.status] === filter;
			const matchesSearch =
				proposal.title
					.toLowerCase()
					.includes(searchQuery.toLowerCase()) ||
				String(proposal.id).toLowerCase().includes(searchQuery.toLowerCase());
			return matchesStatus && matchesSearch;
		})
		: [];

	// Paginate results
	const totalPages = Math.max(
		1,
		Math.ceil(filteredVotes.length / itemsPerPage),
	);
	const paginatedVotes = filteredVotes.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

	// Handle pagination
	const goToPage = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	if (!isConnected) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Alert className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Wallet not connected</AlertTitle>
					<AlertDescription>
						Connect your wallet to see your voting history.
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
				<h1 className="text-2xl font-bold mb-4 sm:mb-0">My Votes</h1>
			</div>

			{/* Filter Tabs */}
			<Tabs
				defaultValue="all"
				value={filter}
				onValueChange={(value) => {
					setFilter(value as ProposalStatus);
					setCurrentPage(1); // Reset to first page on filter change
				}}
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

				{isLoading ? (
					<div className="flex flex-col items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-slate-400 mb-4" />
						<p className="text-slate-400">Loading your votes...</p>
					</div>
				) : (
					<>
						<div className="mb-4 text-sm text-slate-400">
							{filteredVotes.length} vote{filteredVotes.length !== 1 ? "s" : ""}{" "}
							found
						</div>

						<TabsContent value="all" className="mt-0">
							{paginatedVotes.length > 0 ? (
								<div className="space-y-4">
									{paginatedVotes.map((proposalVote) => (
										<MyProposalVoteCard key={proposalVote.id} proposalVote={proposalVote} />
									))}
								</div>
							) : (
								<MyVotesEmptyState />
							)}
						</TabsContent>

						<TabsContent value="active" className="mt-0">
							{paginatedVotes.length > 0 ? (
								<div className="space-y-4">
									{paginatedVotes.map((vote) => (
										<MyProposalVoteCard key={vote.id} proposalVote={vote} />
									))}
								</div>
							) : (
								<MyVotesEmptyState status="active" />
							)}
						</TabsContent>

						<TabsContent value="ended" className="mt-0">
							{paginatedVotes.length > 0 ? (
								<div className="space-y-4">
									{paginatedVotes.map((proposalVote) => (
										<MyProposalVoteCard key={proposalVote.id} proposalVote={proposalVote} />
									))}
								</div>
							) : (
								<MyVotesEmptyState status="ended" />
							)}
						</TabsContent>
					</>
				)}
			</Tabs>

			{/* Pagination */}
			{!isLoading && filteredVotes.length > itemsPerPage && (
				<div className="flex justify-center mt-8">
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => goToPage(currentPage - 1)}
							disabled={currentPage === 1}
						>
							Previous
						</Button>

						{Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
							// Show at most 5 page buttons
							let pageNum = currentPage;

							if (totalPages <= 5) {
								// If 5 or fewer pages, show all pages
								pageNum = index + 1;
							} else if (currentPage <= 3) {
								// If near the start, show pages 1-5
								pageNum = index + 1;
							} else if (currentPage >= totalPages - 2) {
								// If near the end, show the last 5 pages
								pageNum = totalPages - 4 + index;
							} else {
								// Otherwise, show 2 before current and 2 after
								pageNum = currentPage - 2 + index;
							}

							return (
								<Button
									key={pageNum}
									variant="outline"
									size="sm"
									className={currentPage === pageNum ? "bg-slate-800" : ""}
									onClick={() => goToPage(pageNum)}
								>
									{pageNum}
								</Button>
							);
						})}

						<Button
							variant="outline"
							size="sm"
							onClick={() => goToPage(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};

export default MyVotesPage;
