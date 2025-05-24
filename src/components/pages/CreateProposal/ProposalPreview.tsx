import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PreviewProps = {
	data: {
		title: string;
		description: string;
		options: { label: string }[];
		endDate?: Date;
		votingSystem?: string;
		eligibility?: string;
		minTokens?: number;
	};
	onBack: () => void;
	onSubmit: () => void;
};

// Helper function to format voting system name for display
const formatVotingSystem = (system: string) => {
	switch (system) {
		case "simple":
			return "Simple Majority";
		case "weighted":
			return "Weighted Voting";
		case "quadratic":
			return "Quadratic Voting";
		default:
			return system;
	}
};

// Helper function to format eligibility for display
const formatEligibility = (eligibility: string, minTokens?: number) => {
	switch (eligibility) {
		case "all":
			return "All wallet addresses";
		case "token":
			return `Token holders (min. ${minTokens || 0} tokens)`;
		case "nft":
			return "NFT holders";
		default:
			return eligibility;
	}
};

const ProposalPreview = ({ data, onBack, onSubmit }: PreviewProps) => {
	return (
		<div>
			<Button variant="ghost" size="sm" onClick={onBack} className="mb-4">
				<ArrowLeft className="h-4 w-4 mr-2" />
				Back to Edit
			</Button>

			<Card className="mb-6">
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<Badge>Preview</Badge>
							<CardTitle className="mt-2 text-2xl">
								{data.title || "Untitled Proposal"}
							</CardTitle>
						</div>
						<Badge variant="outline">
							Active until{" "}
							{data.endDate ? format(data.endDate, "PPP") : "Not set"}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="prose prose-invert max-w-none">
						{data.description ? (
							data.description.split("\n\n").map((paragraph, i) => (
								<p key={i} className="mb-4">
									{paragraph}
								</p>
							))
						) : (
							<p className="text-muted-foreground">No description provided</p>
						)}
					</div>

					<div className="mt-8">
						<h3 className="text-lg font-medium mb-3">Voting Options</h3>
						{data.options.map((option, i) => (
							<div
								key={i}
								className="p-4 border border-slate-700 rounded-md mb-2 hover:border-slate-600 cursor-pointer"
							>
								<div className="flex items-center">
									<div className="w-4 h-4 rounded-full border-2 border-slate-600 mr-2"></div>
									{option.label || `Option ${i + 1}`}
								</div>
							</div>
						))}
					</div>

					<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<h3 className="text-sm font-medium text-slate-400 mb-1">
								Voting System
							</h3>
							<p>
								{data.votingSystem
									? formatVotingSystem(data.votingSystem)
									: "Not specified"}
							</p>
						</div>
						<div>
							<h3 className="text-sm font-medium text-slate-400 mb-1">
								Eligibility
							</h3>
							<p>
								{data.eligibility
									? formatEligibility(data.eligibility, data.minTokens)
									: "Not specified"}
							</p>
						</div>
					</div>
				</CardContent>
				<CardFooter className="flex justify-end">
					<Button onClick={onSubmit}>Submit Proposal</Button>
				</CardFooter>
			</Card>

			<Card className="bg-amber-950/20 border-amber-800">
				<CardHeader>
					<CardTitle className="text-amber-400">Preview Notice</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-amber-200">
						This is a preview of how your proposal will appear to voters. Please
						review all details carefully before submission. Once submitted,
						proposal details cannot be modified.
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default ProposalPreview;
