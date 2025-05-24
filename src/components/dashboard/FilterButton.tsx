import { Button } from "@/components/ui/button";

type FilterButtonProps = {
	label: string;
	active?: boolean;
	onClick?: () => void;
};

const FilterButton = ({
	label,
	active = false,
	onClick,
}: FilterButtonProps) => {
	return (
		<Button
			size="sm"
			variant="outline"
			className={`rounded-full text-xs h-8 px-3 ${active ? "border-blue-500 text-blue-500" : "border-slate-700"}`}
			onClick={onClick}
			aria-pressed={active}
		>
			{label}
		</Button>
	);
};

export default FilterButton;
