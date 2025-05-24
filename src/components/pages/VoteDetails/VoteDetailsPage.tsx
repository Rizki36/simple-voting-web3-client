import { useMatch } from "@tanstack/react-router";

const VoteDetailsPage = () => {
	const { params } = useMatch({
		from: "/vote/$voteId",
	});
	const voteId = params.voteId;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-6">Vote #{voteId} Details</h1>
			{/* Vote details content will go here */}
		</div>
	);
};

export default VoteDetailsPage;
