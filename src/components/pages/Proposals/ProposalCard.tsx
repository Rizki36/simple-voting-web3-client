import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, ChevronRight } from "lucide-react";

type ProposalStatus = "active" | "ended" | "all";

type ProposalCardProps = {
	proposal: {
		id: string;
		title: string;
		description: string;
		status: ProposalStatus;
		endDate: string;
		votesCount: number;
		createdAt: string;
		options: string[];
		results: number[];
	};
};

const ProposalCard = ({ proposal }: ProposalCardProps) => {
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
			return `${diffDays}d ${diffHours}h remaining`;
		}
		return `${diffHours}h remaining`;
	};

	// Format date to human-readable
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Get the leading option
	const getLeadingOption = () => {
		if (!proposal.results.length) return null;

		const maxIndex = proposal.results.indexOf(Math.max(...proposal.results));
		return {
			label: proposal.options[maxIndex],
			value: proposal.results[maxIndex],
		};
	};

	const leadingOption = getLeadingOption();

	return (
		<Link
			to="/proposals/$proposalId"
			params={{ proposalId: String(proposal.id) }}
			className="bg-slate-800 rounded-lg p-5 hover:bg-slate-750 transition-colors flex flex-col h-full"
		>
			<div className="flex justify-between items-start mb-3">
				<Badge variant={isActive ? "default" : "secondary"} className="mb-2">
					{isActive ? "Active" : "Closed"}
				</Badge>
				<div className="flex items-center text-xs text-slate-400">
					<Clock className="h-3 w-3 mr-1" />
					{isActive ? getRemainingTime() : "Ended"}
				</div>
			</div>

			<h3 className="text-lg font-medium mb-2">{proposal.title}</h3>

			<p className="text-sm text-slate-300 mb-4 line-clamp-2 flex-grow">
				{proposal.description}
			</p>

			{/* Leading option with progress bar for visual representation */}
			<div className="mb-4">
				{leadingOption && (
					<>
						<div className="flex justify-between text-sm mb-1">
							<span className="font-medium">
								{leadingOption.label}
								<span className="text-blue-400"> {leadingOption.value}%</span>
							</span>
						</div>
						<Progress value={leadingOption.value} className="h-2" />
					</>
				)}
			</div>

			<div className="flex justify-between items-center text-xs text-slate-400">
				<div className="flex items-center">
					<Users className="h-3 w-3 mr-1" />
					{proposal.votesCount} votes
				</div>
				<div>Created {formatDate(proposal.createdAt)}</div>
			</div>

			<div className="flex justify-end mt-4">
				<ChevronRight className="h-5 w-5 text-slate-400" />
			</div>
		</Link>
	);
};

export default ProposalCard;
