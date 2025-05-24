import ProposalList from "../../dashboard/ProposalList";
import ProposalDetails from "../../dashboard/ProposalDetails";

const DashboardPage = () => {
	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Dashboard</h1>
			<div>
				<ProposalList />
				<ProposalDetails />
			</div>
		</div>
	);
};

export default DashboardPage;
