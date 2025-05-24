import { createFileRoute } from "@tanstack/react-router";
import ActiveVotesPage from "../components/pages/ActiveVotes/ActiveVotesPage";

export const Route = createFileRoute("/active-votes")({
	component: ActiveVotesPage,
});
