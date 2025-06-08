import { Button } from "@/components/ui/button";
import { Vote } from "lucide-react";
import { Link } from "@tanstack/react-router";

const NoActiveVotes = () => {
	return (
		<div className="py-12 text-center">
			<div className="bg-slate-800 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
				<Vote className="h-6 w-6 text-slate-400" />
			</div>
			<h3 className="text-xl font-medium mb-2">No Active Votes Found</h3>
			<p className="text-slate-400 mb-6 max-w-md mx-auto">
				You haven't voted on any active proposals yet. Browse available
				proposals and cast your vote to see them here.
			</p>
			<Link to="/proposals">
				<Button>Browse Proposals</Button>
			</Link>
		</div>
	);
};

export default NoActiveVotes;
