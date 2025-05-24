import { createFileRoute } from "@tanstack/react-router";
import MyVotesPage from "../components/pages/MyVotes/MyVotesPage";

export const Route = createFileRoute("/my-votes")({
	component: MyVotesPage,
});
