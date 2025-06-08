import { FileText, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

interface MyVotesEmptyStateProps {
	status?: "active" | "ended";
}

const MyVotesEmptyState = ({ status }: MyVotesEmptyStateProps) => {
	const renderContent = () => {
		if (status === "active") {
			return {
				icon: <Vote className="h-12 w-12 text-slate-600" />,
				title: "No Active Votes",
				description:
					"You haven't voted on any active proposals yet. Explore current proposals and make your voice heard.",
				buttonText: "Browse Active Proposals",
				buttonLink: "/proposals?status=active",
			};
		}

		if (status === "ended") {
			return {
				icon: <FileText className="h-12 w-12 text-slate-600" />,
				title: "No Ended Votes",
				description:
					"You haven't participated in any proposals that have ended yet.",
				buttonText: "View All Proposals",
				buttonLink: "/proposals",
			};
		}

		return {
			icon: <Vote className="h-12 w-12 text-slate-600" />,
			title: "No Votes Found",
			description:
				"You haven't voted on any proposals yet. Cast your first vote to see your voting history here.",
			buttonText: "Explore Proposals",
			buttonLink: "/proposals",
		};
	};

	const content = renderContent();

	return (
		<div className="flex flex-col items-center justify-center py-12 px-4 text-center">
			<div className="rounded-full bg-slate-800 p-4 mb-4">{content.icon}</div>
			<h3 className="text-xl font-medium mb-2">{content.title}</h3>
			<p className="text-slate-400 mb-6 max-w-md">{content.description}</p>
			<Link to={content.buttonLink}>
				<Button>{content.buttonText}</Button>
			</Link>
		</div>
	);
};

export default MyVotesEmptyState;
