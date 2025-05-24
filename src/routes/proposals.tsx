import { createFileRoute } from "@tanstack/react-router";
import ProposalsPage from "../components/pages/Proposals/ProposalsPage";

export const Route = createFileRoute("/proposals")({
	component: ProposalsPage,
});
