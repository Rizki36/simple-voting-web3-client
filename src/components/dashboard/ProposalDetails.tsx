import { Button } from "@/components/ui/button";
import MetricCard from "../dashboard/MetricCard";

const ProposalDetails = () => {
	return (
		<div className="mt-8 bg-slate-800 rounded-lg p-6">
			<div className="flex justify-between items-center mb-4">
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
					<Button size="sm" variant="outline">
						View Profile
					</Button>
					<Button size="sm" variant="default">
						Unstake
					</Button>
				</div>
			</div>

			<div className="flex border-b border-slate-700 pb-4">
				<h2 className="text-4xl font-bold">31.39686</h2>
			</div>

			{/* Metrics Grid */}
			<div className="grid grid-cols-4 gap-4 mt-6">
				<MetricCard title="Momentum" value="-0.82%" subtitle="7-day dynamics" />

				<MetricCard
					title="Price"
					value="$41.99"
					change="-1.09%"
					changeColor="red"
				/>

				<MetricCard title="Voting Rate" value="60.6%" />

				<MetricCard
					title="Reward Rate"
					value="2.23%"
					showProgressBar
					progressValue={20}
					minValue="1.45%"
					maxValue="3.12%"
				/>
			</div>
		</div>
	);
};

export default ProposalDetails;
