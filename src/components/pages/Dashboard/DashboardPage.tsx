import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAccount } from "wagmi";
import { AlertCircle } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import ProposalList from "./ProposalList";
import ProposalSummary from "./ProposalSummary";
import VotingActivity from "./VotingActivity";
import StatCards from "./StatCards";

const DashboardPage = () => {
	const [selectedProposalId, setSelectedProposalId] = useState<string | null>(
		null,
	);
	const { isConnected } = useAccount();
	const { stats, isLoading, error } = useDashboardData();

	if (error) {
		return (
			<div className="container mx-auto px-4 py-6">
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error loading dashboard</AlertTitle>
					<AlertDescription>
						{error instanceof Error
							? error.message
							: "Failed to load dashboard data"}
					</AlertDescription>
				</Alert>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-6">
			<h1 className="text-xl sm:text-3xl font-bold mb-6">Dashboard</h1>

			{!isConnected && (
				<Alert className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Wallet not connected</AlertTitle>
					<AlertDescription>
						Connect your wallet to see personalized voting statistics and cast
						votes.
					</AlertDescription>
				</Alert>
			)}

			{/* Stats Overview */}
			<StatCards stats={stats} isLoading={isLoading} />

			{/* Main Dashboard Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				{/* Recent and Active Proposals */}
				<Card className="col-span-1 lg:col-span-2">
					<CardHeader>
						<CardTitle>Proposals</CardTitle>
						<CardDescription>
							Recent and active proposals on the platform
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="active">
							<TabsList className="mb-4">
								<TabsTrigger value="active">Active</TabsTrigger>
								<TabsTrigger value="recent">Recent</TabsTrigger>
								<TabsTrigger value="voted">Voted</TabsTrigger>
							</TabsList>

							<TabsContent value="active">
								<ProposalList
									filter="active"
									onSelectProposal={setSelectedProposalId}
								/>
							</TabsContent>

							<TabsContent value="recent">
								<ProposalList
									filter="recent"
									onSelectProposal={setSelectedProposalId}
								/>
							</TabsContent>

							<TabsContent value="voted">
								<ProposalList
									filter="voted"
									onSelectProposal={setSelectedProposalId}
								/>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Selected Proposal Summary */}
					<Card>
						<CardHeader>
							<CardTitle>Proposal Summary</CardTitle>
							<CardDescription>
								{selectedProposalId
									? `Details for proposal #${selectedProposalId}`
									: "Select a proposal to see details"}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ProposalSummary proposalId={selectedProposalId} />
						</CardContent>
					</Card>

					{/* Voting Activity */}
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>Latest votes and proposals</CardDescription>
						</CardHeader>
						<CardContent>
							<VotingActivity />
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default DashboardPage;
