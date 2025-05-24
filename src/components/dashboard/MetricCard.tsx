import { Button } from "@/components/ui/button";

type MetricCardProps = {
	title: string;
	value: string;
	subtitle?: string;
	change?: string;
	changeColor?: string;
	showProgressBar?: boolean;
	progressValue?: number;
	minValue?: string;
	maxValue?: string;
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
}: MetricCardProps) => {
	return (
		<div>
			<div className="flex justify-between">
				<div className="text-sm text-slate-400">{title}</div>
				<Button size="sm" variant="ghost" className="h-6 w-6 p-0">
					<span className="sr-only">Details</span>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
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

			<div className="mt-4">
				<div className="text-2xl font-semibold flex items-center">
					{value}
					{change && (
						<span className={`text-xs text-${changeColor}-500 ml-2`}>
							{change}
						</span>
					)}
				</div>
				{subtitle && <div className="text-sm text-slate-400">{subtitle}</div>}

				{showProgressBar && (
					<>
						<div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
							<div
								className="h-full bg-blue-500"
								style={{ width: `${progressValue}%` }}
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
