import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Vote } from "lucide-react";

const NoActiveVotes = () => {
	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-800/40 rounded-lg">
			<div className="bg-slate-700/50 p-4 rounded-full mb-4">
				<Vote className="h-8 w-8 text-slate-400" />
			</div>
			<h3 className="text-xl font-medium mb-2">No active votes found</h3>
			<p className="text-slate-400 mb-6 max-w-md">
				There are currently no active votes to display. Check back later or
				browse all proposals.
			</p>
			<div className="flex gap-4">
				<Link to="/proposals">
					<Button variant="outline">Browse Proposals</Button>
				</Link>
				<Link to="/create-proposal">
					<Button>Create Proposal</Button>
				</Link>
			</div>
		</div>
	);
};

export default NoActiveVotes;
