import { Link } from "@tanstack/react-router";

type ActiveVoteProps = {
	index: number;
};

const ActiveVoteItem = ({ index }: ActiveVoteProps) => {
	const getBackgroundColor = () => {
		switch (index % 3) {
			case 0:
				return "bg-blue-600";
			case 1:
				return "bg-orange-600";
			default:
				return "bg-purple-600";
		}
	};

	return (
		<Link
			// Replace with the correct path
			to="/my-votes"
			className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800/50 rounded-md"
			aria-label={`Vote #${index} details`}
		>
			<div
				className={`w-6 h-6 rounded-full ${getBackgroundColor()} flex items-center justify-center text-xs`}
			>
				{index}
			</div>
			<div className="flex-1 md:block sm:hidden xs:hidden">
				<div className="text-sm">Vote #{index}</div>
				<div className="text-xs text-slate-400">Cast {index} day ago</div>
			</div>
		</Link>
	);
};

export default ActiveVoteItem;
