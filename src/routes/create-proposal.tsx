import { createFileRoute } from "@tanstack/react-router";
import CreateProposalPage from "../components/pages/CreateProposal/CreateProposalPage";

export const Route = createFileRoute("/create-proposal")({
	component: CreateProposalPage,
});
