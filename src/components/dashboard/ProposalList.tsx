import { useState } from "react";
import ProposalCard from "./ProposalCard";
import FilterButton from "./FilterButton";

type ChangeColorType = "green" | "red";

type ProposalData = {
	title: string;
	percentage: string;
	change: string;
	changeColor: ChangeColorType;
	value: string;
};

type FilterType = "24H" | "Result of Vote" | "Date";

const proposalData: ProposalData[] = [
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
	const [activeFilter, setActiveFilter] = useState<FilterType>("24H");

	const handleFilterClick = (filterType: FilterType) => {
		setActiveFilter(filterType);
	};

	const handleProposalClick = (index: number) => {
		console.log(`Clicked proposal ${index}: ${proposalData[index].title}`);
	};

	return (
		<div>
			{/* Top section - Heading & Filters */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
				<div>
					<h2 className="text-xl sm:text-2xl font-medium">
						Top Active Proposals
					</h2>
				</div>
				<div className="flex flex-wrap gap-2">
					{["24H", "Result of Vote", "Date"].map((filterType) => (
						<FilterButton
							key={filterType}
							label={filterType}
							active={activeFilter === filterType}
							onClick={() => handleFilterClick(filterType as FilterType)}
						/>
					))}
				</div>
			</div>

			{/* Proposal Cards Grid - Responsive */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
				{proposalData.map((card, index) => (
					<ProposalCard
						key={index}
						{...card}
						index={index}
						onClick={() => handleProposalClick(index)}
					/>
				))}
			</div>
		</div>
	);
};

export default ProposalList;
