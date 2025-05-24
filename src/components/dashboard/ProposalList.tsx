import { Button } from "@/components/ui/button";
import ProposalCard from "./ProposalCard";

const proposalData = [
	{
		title: "Ethereum (ETH)",
		percentage: "13.62%",
		change: "+2.55%",
		changeColor: "green",
		value: "+$2,955",
	},
	{
		title: "BNB Chain",
		percentage: "12.72%",
		change: "+5.87%",
		changeColor: "green",
		value: "+$2,078",
	},
	{
		title: "Polygon (Matic)",
		percentage: "6.29%",
		change: "-1.89%",
		changeColor: "red",
		value: "+$1,187",
	},
];

const ProposalList = () => {
	return (
		<div>
			{/* Top section - Heading & Filters */}
			<div className="flex justify-between items-center mb-6">
				<div>
					<h2 className="text-2xl font-medium">Top Active Proposals</h2>
				</div>
				<div className="flex gap-2">
					<Button size="sm" variant="outline" className="rounded-full text-xs">
						24H
					</Button>
					<Button
						size="sm"
						variant="outline"
						className="rounded-full border-slate-700 text-xs"
					>
						Result of Vote
					</Button>
					<Button
						size="sm"
						variant="outline"
						className="rounded-full border-slate-700 text-xs"
					>
						Date
					</Button>
				</div>
			</div>

			{/* Proposal Cards Grid */}
			<div className="grid grid-cols-3 gap-4">
				{proposalData.map((card, index) => (
					<ProposalCard key={index} {...card} index={index} />
				))}
			</div>
		</div>
	);
};

export default ProposalList;
