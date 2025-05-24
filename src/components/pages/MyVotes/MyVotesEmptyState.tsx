import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Vote } from "lucide-react";

type EmptyStateProps = {
	status?: "active" | "ended" | "all";
};

const MyVotesEmptyState = ({ status = "all" }: EmptyStateProps) => {
	// Customize message based on filter
	const getMessage = () => {
		switch (status) {
			case "active":
				return "You haven't voted on any active proposals yet.";
			case "ended":
				return "You haven't voted on any ended proposals.";
			default:
				return "You haven't cast any votes yet.";
		}
	};

	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-800/40 rounded-lg">
			<div className="bg-slate-700/50 p-4 rounded-full mb-4">
				<Vote className="h-8 w-8 text-slate-400" />
			</div>
			<h3 className="text-xl font-medium mb-2">No votes found</h3>
			<p className="text-slate-400 mb-6 max-w-md">{getMessage()}</p>
			<Link to="/proposals">
				<Button>Browse Active Proposals</Button>
			</Link>
		</div>
	);
};

export default MyVotesEmptyState;
