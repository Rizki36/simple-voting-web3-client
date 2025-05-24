import { createFileRoute } from "@tanstack/react-router";
import VoteDetailsPage from "../components/pages/VoteDetails/VoteDetailsPage";

export const Route = createFileRoute("/vote/$voteId")({
	component: VoteDetailsPage,
});
