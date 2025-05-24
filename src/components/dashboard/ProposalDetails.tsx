import { Button } from "@/components/ui/button";
import MetricCard from "./MetricCard";

const ProposalDetails = () => {
	const handleViewProfileClick = () => {
		console.log("View profile clicked");
	};

	const handleUnstakeClick = () => {
		console.log("Unstake clicked");
	};

	const handleMetricDetailsClick = (metricName: string) => {
		console.log(`${metricName} details clicked`);
	};

	return (
		<div className="mt-6 sm:mt-8 bg-slate-800 rounded-lg p-4 sm:p-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
				<div>
					<div className="text-sm text-slate-400">
						Last update - 46 minutes ago
					</div>
					<h3 className="text-xl font-medium flex items-center gap-2">
						Vote Proposal #1
						<span className="text-xs px-1 bg-red-600 rounded">4</span>
					</h3>
				</div>
				<div className="flex gap-2">
					<Button size="sm" variant="outline" onClick={handleViewProfileClick}>
						View Profile
					</Button>
					<Button size="sm" variant="default" onClick={handleUnstakeClick}>
						Unstake
					</Button>
				</div>
			</div>

			<div className="flex border-b border-slate-700 pb-4">
				<h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">31.39686</h2>
			</div>

			{/* Metrics Grid - Responsive */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
				<MetricCard
					title="Momentum"
					value="-0.82%"
					subtitle="7-day dynamics"
					onDetailsClick={() => handleMetricDetailsClick("Momentum")}
				/>

				<MetricCard
					title="Price"
					value="$41.99"
					change="-1.09%"
					changeColor="red"
					onDetailsClick={() => handleMetricDetailsClick("Price")}
				/>

				<MetricCard
					title="Voting Rate"
					value="60.6%"
					onDetailsClick={() => handleMetricDetailsClick("Voting Rate")}
				/>

				<MetricCard
					title="Reward Rate"
					value="2.23%"
					showProgressBar
					progressValue={20}
					minValue="1.45%"
					maxValue="3.12%"
					onDetailsClick={() => handleMetricDetailsClick("Reward Rate")}
				/>
			</div>
		</div>
	);
};

export default ProposalDetails;
