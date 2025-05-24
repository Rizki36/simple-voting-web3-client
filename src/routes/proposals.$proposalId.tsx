import { createFileRoute } from "@tanstack/react-router";
import ProposalDetailPage from "../components/pages/Proposals/ProposalDetailPage";

export const Route = createFileRoute("/proposals/$proposalId")({
	component: ProposalDetailPage,
});
