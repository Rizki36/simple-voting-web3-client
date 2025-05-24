type VoteBackgroundColor = "bg-blue-600" | "bg-orange-600" | "bg-purple-600";

type ActiveVoteItemProps = {
	index: number;
	onClick?: () => void;
};

const getBackgroundColor = (index: number): VoteBackgroundColor => {
	switch (index % 3) {
		case 0:
			return "bg-blue-600";
		case 1:
			return "bg-orange-600";
		case 2:
			return "bg-purple-600";
		default:
			return "bg-blue-600";
	}
};

const ActiveVoteItem = ({ index, onClick }: ActiveVoteItemProps) => {
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onClick?.();
		}
	};

	const bgColorClass = getBackgroundColor(index - 1);

	return (
		<button
			type="button"
			className="flex items-center gap-3 w-full text-left"
			tabIndex={0}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			aria-label={`Vote #${index} details`}
		>
			<div
				className={`w-6 h-6 rounded-full ${bgColorClass} flex items-center justify-center text-xs`}
			>
				{index}
			</div>
			<div className="flex-1">
				<div className="text-sm">Vote #{index}</div>
				<div className="text-xs text-slate-400">Cast {index} day ago</div>
			</div>
		</button>
	);
};

export default ActiveVoteItem;
