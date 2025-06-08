import { formatDistanceToNow } from "date-fns";
import { Vote } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { truncateText } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type ActiveVoteItemProps = {
	id: string;
	title: string;
	optionText: string;
	endTime: Date;
};

const ActiveVoteItem = ({
	id,
	title,
	optionText,
	endTime,
}: ActiveVoteItemProps) => {
	const endTimeText = formatDistanceToNow(endTime, { addSuffix: true });

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						to="/proposals/$proposalId"
						params={{ proposalId: id }}
						className="flex items-center gap-2 p-2 rounded-md hover:bg-slate-900 transition-colors"
					>
						<div className="bg-slate-800 p-1 rounded">
							<Vote className="h-3 w-3" />
						</div>
						<div className="flex-1 min-w-0">
							<div className="text-xs font-medium truncate">
								{truncateText(title, 18)}
							</div>
							<div className="text-xs text-slate-400 flex justify-between">
								<span className="truncate" style={{ maxWidth: "80px" }}>
									Voted: {truncateText(optionText, 10)}
								</span>
								<span>{endTimeText}</span>
							</div>
						</div>
					</Link>
				</TooltipTrigger>
				<TooltipContent>
					<p>{title}</p>
					<p className="text-xs text-slate-400">Your vote: {optionText}</p>
					<p className="text-xs text-slate-400">Ends {endTimeText}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default ActiveVoteItem;
