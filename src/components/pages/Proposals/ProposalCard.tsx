import type { Proposal } from "./ProposalsPage";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from "date-fns";
import { Link, type LinkProps } from "@tanstack/react-router";

type ProposalCardProps = {
	proposal: Proposal;
	linkProps?: LinkProps;
};

const ProposalCard = (props: ProposalCardProps) => {
	const { proposal, linkProps } = props;
	const { title, description, status, endDate, votesCount, options, results } =
		proposal;

	// Format description by truncating
	const truncatedDescription =
		description.length > 100
			? `${description.substring(0, 100)}...`
			: description;

	// Calculate time remaining or time since ended
	const timeText =
		status === "active"
			? `Ends ${formatDistanceToNow(endDate, { addSuffix: true })}`
			: `Ended ${formatDistanceToNow(endDate, { addSuffix: true })}`;

	// Get leading option index
	const leadingOptionIndex = results.indexOf(Math.max(...results));

	return (
		<Card className="h-full flex flex-col hover:border-slate-700 transition-all">
			<CardHeader className="pb-2">
				<div className="flex justify-between items-start">
					<Badge
						className={status === "active" ? "bg-green-700" : "bg-slate-600"}
					>
						{status === "active" ? "Active" : "Ended"}
					</Badge>
					<div className="text-xs text-slate-400">{timeText}</div>
				</div>
				<CardTitle className="mt-2 leading-tight">
					<Link
						className="cursor-pointer hover:text-blue-400 transition-colors"
						{...linkProps}
					>
						{title}
					</Link>
				</CardTitle>
			</CardHeader>

			<CardContent className="pb-4 flex-grow">
				<p className="text-sm text-slate-300 mb-4">{truncatedDescription}</p>

				<div className="mt-4">
					<div className="flex justify-between text-xs text-slate-400 mb-1">
						<div>Top option: {options[leadingOptionIndex]}</div>
						<div>{results[leadingOptionIndex]}%</div>
					</div>
					<Progress value={results[leadingOptionIndex]} className="h-1" />
				</div>
			</CardContent>

			<CardFooter className="pt-2 border-t border-slate-800 flex justify-between">
				<div className="text-xs text-slate-400">{votesCount} votes</div>
				<Link {...linkProps}>
					<Button variant="outline" size="sm">
						View Details
					</Button>
				</Link>
			</CardFooter>
		</Card>
	);
};

export default ProposalCard;
