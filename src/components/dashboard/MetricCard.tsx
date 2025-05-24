import { Button } from "@/components/ui/button";

type ChangeColorType = "green" | "red";

type MetricCardProps = {
	title: string;
	value: string;
	subtitle?: string;
	change?: string;
	changeColor?: ChangeColorType;
	showProgressBar?: boolean;
	progressValue?: number;
	minValue?: string;
	maxValue?: string;
	onDetailsClick?: () => void;
};

const MetricCard = ({
	title,
	value,
	subtitle,
	change,
	changeColor = "red",
	showProgressBar = false,
	progressValue = 0,
	minValue,
	maxValue,
	onDetailsClick,
}: MetricCardProps) => {
	const handleDetailsClick = () => {
		onDetailsClick?.();
	};

	const changeTextColorClass =
		changeColor === "green" ? "text-green-500" : "text-red-500";

	return (
		<div className="p-2 sm:p-3">
			<div className="flex justify-between">
				<div className="text-sm text-slate-400">{title}</div>
				<Button
					size="sm"
					variant="ghost"
					className="h-6 w-6 p-0"
					onClick={handleDetailsClick}
					aria-label={`Show ${title} details`}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path
							d="M3.5 7.5L7.5 3.5L11.5 7.5M3.5 11.5L7.5 7.5L11.5 11.5"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						></path>
					</svg>
				</Button>
			</div>

			<div className="mt-3 sm:mt-4">
				<div className="text-lg sm:text-xl md:text-2xl font-semibold flex items-center">
					{value}
					{change && (
						<span className={`text-xs ${changeTextColorClass} ml-2`}>
							{change}
						</span>
					)}
				</div>
				{subtitle && <div className="text-sm text-slate-400">{subtitle}</div>}

				{showProgressBar && (
					<>
						<div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
							{/* biome-ignore lint/a11y/useFocusableInteractive: <explanation> */}
							<div
								className="h-full bg-blue-500"
								style={{ width: `${progressValue}%` }}
								role="progressbar"
								aria-valuenow={progressValue}
								aria-valuemin={0}
								aria-valuemax={100}
							></div>
						</div>
						{minValue && maxValue && (
							<div className="text-xs text-slate-400 mt-1 flex justify-between">
								<span>{minValue}</span>
								<span>{maxValue}</span>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default MetricCard;
