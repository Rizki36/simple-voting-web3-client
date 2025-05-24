import { useState } from "react";
import { useMatch } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
	Clock,
	Users,
	Calendar,
	ArrowLeft,
	Share2,
	AlertCircle,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

type ProposalStatus = "active" | "ended" | "all";

const ProposalDetailPage = () => {
	const { params } = useMatch({
		from: "/proposals/$proposalId",
	});
	const proposalId = params.proposalId;

	// Mock data for UI development
	const proposal = {
		id: proposalId,
		title: "Integrate Layer 2 Solutions",
		description:
			"This proposal aims to integrate layer 2 scaling solutions to reduce gas fees and improve transaction speeds across the protocol. By implementing optimistic rollups, we can achieve significant cost savings while maintaining security guarantees.\n\nThe integration would involve:\n\n1. Deploying smart contracts to supported L2 networks\n2. Creating bridges for asset transfers\n3. Updating the frontend to support L2 interactions\n4. Providing documentation for users on how to use L2 features",
		status: "active" as ProposalStatus,
		endDate: "2025-06-10T00:00:00Z",
		votesCount: 142,
		createdAt: "2025-05-15T00:00:00Z",
		createdBy: "0x1234...5678",
		options: ["Approve", "Reject", "Abstain"],
		results: [70, 25, 5], // Percentages
		hasVoted: false,
		discussions: [
			{
				id: "1",
				user: "0xabcd...1234",
				comment: "This is a great proposal that will help scaling.",
				timestamp: "2025-05-16T12:30:00Z",
			},
			{
				id: "2",
				user: "0x7890...4321",
				comment:
					"I'm concerned about the security implications. Has this been audited?",
				timestamp: "2025-05-17T08:45:00Z",
			},
		],
	};

	const [selectedOption, setSelectedOption] = useState<number | null>(null);
	const [voteSubmitting, setVoteSubmitting] = useState(false);
	const isActive = proposal.status === "active";

	// Calculate remaining time for active proposals
	const getRemainingTime = () => {
		if (!isActive) return "Ended";

		const endDate = new Date(proposal.endDate);
		const now = new Date();
		const diffTime = Math.max(0, endDate.getTime() - now.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		const diffHours = Math.floor(
			(diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
		);

		if (diffDays > 0) {
			return `${diffDays} days ${diffHours} hours remaining`;
		}
		return `${diffHours} hours remaining`;
	};

	// Format date to human-readable
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const handleVote = () => {
		if (selectedOption === null) return;

		setVoteSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setVoteSubmitting(false);
			// Here we would update the UI to show the user has voted
		}, 2000);
	};

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Back Navigation */}
			<Link
				to="/proposals"
				className="inline-flex items-center text-sm text-slate-400 hover:text-white mb-4"
			>
				<ArrowLeft className="mr-1 h-4 w-4" />
				Back to Proposals
			</Link>

			{/* Header */}
			<div className="bg-slate-800 rounded-lg p-6 mb-6">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
					<div>
						<div className="flex items-center gap-2 mb-2">
							<Badge variant={isActive ? "default" : "secondary"}>
								{isActive ? "Active" : "Closed"}
							</Badge>
							{isActive && (
								<div className="flex items-center text-xs text-slate-400">
									<Clock className="h-3 w-3 mr-1" />
									{getRemainingTime()}
								</div>
							)}
						</div>
						<h1 className="text-2xl font-bold">{proposal.title}</h1>
					</div>

					<div className="flex gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button variant="outline" size="icon">
										<Share2 className="h-4 w-4" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share proposal</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						{proposal.status === "active" && !proposal.hasVoted && (
							<Button
								onClick={handleVote}
								disabled={selectedOption === null || voteSubmitting}
							>
								{voteSubmitting ? (
									<>
										<Clock className="mr-2 h-4 w-4 animate-spin" />
										Submitting...
									</>
								) : (
									"Submit Vote"
								)}
							</Button>
						)}
					</div>
				</div>

				<div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
					<div className="flex items-center">
						<Calendar className="mr-1 h-4 w-4" />
						Created {formatDate(proposal.createdAt)}
					</div>
					<div className="flex items-center">
						<Users className="mr-1 h-4 w-4" />
						{proposal.votesCount} votes
					</div>
				</div>

				{/* Description */}
				<div className="bg-slate-900 rounded-md p-4 mb-6">
					<div className="prose prose-invert max-w-none">
						{proposal.description.split("\n\n").map((paragraph, i) => (
							<p key={i} className="mb-4">
								{paragraph}
							</p>
						))}
					</div>
				</div>
			</div>

			{/* Tabs for Voting and Discussion */}
			<Tabs defaultValue="vote" className="w-full">
				<TabsList className="grid w-full grid-cols-2 mb-6">
					<TabsTrigger value="vote">Vote</TabsTrigger>
					<TabsTrigger value="discussion">Discussion</TabsTrigger>
				</TabsList>

				<TabsContent value="vote">
					<Card>
						<CardContent className="pt-6">
							{proposal.hasVoted ? (
								<div className="bg-blue-900/20 text-blue-400 p-4 rounded-md mb-6 flex items-center">
									<div className="mr-2 text-blue-400 rounded-full bg-blue-400/20 p-1">
										<Clock className="h-4 w-4" />
									</div>
									<div className="text-sm">
										You have already voted on this proposal
									</div>
								</div>
							) : proposal.status === "ended" ? (
								<div className="bg-slate-700/20 text-slate-400 p-4 rounded-md mb-6 flex items-center">
									<AlertCircle className="h-4 w-4 mr-2" />
									<div className="text-sm">This vote has ended</div>
								</div>
							) : (
								<div className="space-y-4 mb-6">
									<h3 className="text-lg font-medium">Cast your vote</h3>
									<div className="grid gap-2">
										{proposal.options.map((option, i) => (
											// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
											<div
												key={i}
												className={`p-4 rounded-md border cursor-pointer transition-all ${
													selectedOption === i
														? "border-blue-500 bg-blue-500/10"
														: "border-slate-700 hover:border-slate-600"
												}`}
												onClick={() => setSelectedOption(i)}
											>
												<div className="flex items-center">
													<div
														className={`w-4 h-4 rounded-full mr-2 border-2 flex items-center justify-center ${
															selectedOption === i
																? "border-blue-500"
																: "border-slate-600"
														}`}
													>
														{selectedOption === i && (
															<div className="w-2 h-2 rounded-full bg-blue-500"></div>
														)}
													</div>
													{option}
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							<h3 className="text-lg font-medium mb-4">Current Results</h3>
							<div className="space-y-4">
								{proposal.options.map((option, i) => (
									<div key={i} className="space-y-2">
										<div className="flex justify-between text-sm">
											<span>{option}</span>
											<span className="font-medium">
												{proposal.results[i]}%
											</span>
										</div>
										<Progress value={proposal.results[i]} className="h-2" />
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="discussion">
					<Card>
						<CardContent className="pt-6">
							<h3 className="text-lg font-medium mb-4">Discussion</h3>

							<div className="space-y-4">
								{proposal.discussions.map((discussion) => (
									<div
										key={discussion.id}
										className="border-b border-slate-700 pb-4"
									>
										<div className="flex justify-between mb-2">
											<div className="font-medium text-sm">
												{discussion.user}
											</div>
											<div className="text-xs text-slate-400">
												{formatDate(discussion.timestamp)}
											</div>
										</div>
										<p className="text-sm">{discussion.comment}</p>
									</div>
								))}
							</div>

							{/* Simplified comment form - would be expanded in real implementation */}
							<div className="mt-6">
								<Button className="w-full">Connect Wallet to Comment</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default ProposalDetailPage;
