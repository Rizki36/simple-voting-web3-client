import ProposalList from "../../dashboard/ProposalList";
import ProposalDetails from "../../dashboard/ProposalDetails";

const DashboardPage = () => {
	return (
		<div>
			<h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Dashboard</h1>
			<div className="space-y-4 sm:space-y-8">
				<ProposalList />
				<ProposalDetails />
			</div>
		</div>
	);
};

export default DashboardPage;
